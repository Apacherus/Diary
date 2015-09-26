/**
 * Created by Vladimir Kudryavtsev on 23.09.15.
 * Copyright © Academ Media, LLC
 * Copyright © Vladimir Kudryavtsev
 */


Vue.component('charts-builder', {

    template:`
    <canvas id="{{id}}" height="{{height}}" class="charts"></canvas>
    `,

    props:{
        context:{
            type:Object,
            default:function(){
                return null;
            }
        },

        chart:{
            type:Object,
            default: function(){
                return null;
            }
        },

        id:{
            type:String,
            default:""
        },

        width:{
            type:String,
            default:"100%"
        },

        height:{
            type:String,
            default:"300"
        },

        data:{
            type:Object,
            default:function(){
                return {
                    labels: [28, 48, 40, 19, 86, 27, 90],
                    datasets: [//0 - goal, 1 - real
                        {
                            label: "Goal",
                            fillColor: "rgba(189,216,0,0.3)",
                            strokeColor: "rgba(189,216,0,0.5)",
                            pointColor: "rgba(189,216,0,0.5)",
                            pointStrokeColor: "#fff",
                            pointHighlightFill: "#fff",
                            pointHighlightStroke: "rgba(151,187,205,1)",
                            data: [28, 48, 40, 19, 86, 27, 90]
                        },
                        {
                            label: "Real",
                            fillColor: "rgba(255,204,1,0.3)",
                            strokeColor: "rgba(255,204,1,0.5)",
                            pointColor: "rgba(255,204,1,0.5)",
                            pointStrokeColor: "#fff",
                            pointHighlightFill: "#fff",
                            pointHighlightStroke: "rgba(220,220,220,1)",
                            data: [null, null, null, 19, 86, 27, 90]
                        }
                    ]
                };
            }
        },

        options:{
            type:Object,
            default:function(){
                return {};
            }
        }
    },

    compiled: function(){
        this.calcChart();
    },

    attached: function(){

        this.drawChart();

        app.em.listen('notesStoreChanged', this.storeChanged);
    },
    methods: {
        storeChanged: function(){
            this.calcChart();
            this.drawChart();
        },
        calcChart: function(){
            console.time('test');
            /**
             * == Хотим подготовить точки дли отрисовки графика
             */

            /**
             * на графике будем строить точки для 7 дней TODO
             * сразу же получим данные на каждый день
             */
            var dates = [];
            var dataReal = [];
            var dateStart = app.moment().add(3, 'd');
            for(var i = 0; i < 7; i++){
                dates[i] = app.moment(dateStart).subtract(i, 'd');
                if(dates[i] > app.moment()) {
                    dataReal[i] = [];
                } else {
                    dataReal[i] = app.notes.forDate(dates[i], 'measure');
                }
                /**
                 * посчитаем среднее для конкретного дня (каждого)
                 */
                var sum = 0;
                for(var j = 0; j < dataReal[i].length; j++){
                    sum += parseFloat(dataReal[i][j].weight);
                }
                if(sum > 0) {
                    dataReal[i] = Math.round(sum / dataReal[i].length);
                } else {
                    dataReal[i] = null;
                }
            }

            dates.reverse();
            dataReal.reverse();

            /**
             * теперь сделаем массив с таким же количеством точек, но только не для реальных показаний, а для цели
             */
            var dataGoal = [];

            var goal = app.profile.db.goal;
            var goalD = (goal.startWeight - goal.weight)/goal.days;
            //разница между стартовой точкой графика (день 0 на графике) и датой постановки цели
            var daysDiff = Math.floor((dates[0] - app.moment(goal.date))/(1000*60*60*24));

            if(goal.days > 0) {
                for (var i = daysDiff; i <= goal.days; i++) {
                    if (i < 0) {
                        dataGoal.push(null);
                        continue;
                    }
                    dataGoal.push(goal.startWeight - goalD * (i));
                }
            }

            /**
             *
             * Remove white spaces before graph start (no data)
             *
             *       ----      ----
             *           -    -
             *             -
             * --------------------------------------
             * 19    20    21    22    23    24    25
             *                   ^
             *
             * ----      ----
             *     -    -
             *       -
             * --------------------------------------
             * 20    21    22    23    24    25    26
             *                   ^
             */


            for(var i = 0; i < dataReal.length; i++){
                if(dataReal[i] != null){
                    break;
                } else {
                    if(i == dataReal.length-1){
                        dataReal = [];
                    }
                }
            }

            for(var i = 0; i < dataGoal.length; i++){
                if(dataGoal[i] != null){
                    break;
                } else {
                    if(i == dataGoal.length-1){
                        dataGoal = [];
                    }
                }
            }

            if(dataGoal.length > 0 || dataReal.length > 0) {

                var length = dates.length;
                for (var i = 0; i <= length / 2; i++) {//length/2 - т.к. length/2 это "сегодня"
                    if (dataReal[0] == null && dataGoal[0] == null) {
                        dates.splice(0, 1);
                        dataGoal.splice(0, 1);
                        dataReal.splice(0, 1);
                        dates.push(app.moment(dates[dates.length - 1]).add(1, 'd'));
                    } else {
                        break;
                    }
                }
            }

            /**
             * Calc min, max value
             */
            var minWeightValue = null;
            var maxWeightValue = null;
            for(var i = 0; i < dataGoal.length; i++){
                if((minWeightValue > dataGoal[i] || minWeightValue == null) && dataGoal[i] !== null){
                    minWeightValue = dataGoal[i];
                }
                if((maxWeightValue < dataGoal[i] || maxWeightValue == null) && dataGoal[i] !== null){
                    maxWeightValue = dataGoal[i];
                }
            }

            for(var i = 0; i < dataReal.length; i++){
                if((minWeightValue > dataReal[i] || minWeightValue == null) && dataReal[i] !== null){
                    minWeightValue = dataReal[i];
                }
                if((maxWeightValue < dataReal[i] || maxWeightValue == null) && dataReal[i] !== null){
                    maxWeightValue = dataReal[i];
                }
            }

            /**
             * =====
             */
            for(var i = 0; i< dates.length; i++){
                this.data.labels[i] = dates[i].date();
            }

            this.data.datasets[0].data = dataGoal;
            this.data.datasets[1].data = dataReal;

            console.log((minWeightValue == null || maxWeightValue == null)?0:5, minWeightValue, maxWeightValue)


            this.options.showTooltips = false;
            this.options.pointDot = true;
            this.options.scaleShowVerticalLines = false;
            this.options.scaleOverride = true;
            this.options.scaleSteps = (minWeightValue == null || maxWeightValue == null)?0:5;
            this.options.scaleStepWidth = parseInt(((maxWeightValue * 1.2) - (minWeightValue * 0.8))/this.options.scaleSteps) || 0;
            this.options.scaleStartValue = (minWeightValue * 0.8) || 0;

            console.timeEnd('test');
        },

        drawChart: function(){
            this.context = document.getElementById(this.id).getContext("2d");
            var Chart = app.chartjs;
            this.chart = new Chart(this.context).Line(this.data, this.options);
        }
    }

});