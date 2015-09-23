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
                    labels: ["January", "February", "March", "April", "May", "June", "July"],
                    datasets: [//0 - goal, 1 - real
                        {
                            label: "Goal",
                            fillColor: "rgba(220,220,220,0.2)",
                            strokeColor: "rgba(220,220,220,1)",
                            pointColor: "rgba(220,220,220,1)",
                            pointStrokeColor: "#fff",
                            pointHighlightFill: "#fff",
                            pointHighlightStroke: "rgba(220,220,220,1)",
                            data: [65, 59, 80, 81, 56, 55, 40]
                        },
                        {
                            label: "Real",
                            fillColor: "rgba(151,187,205,0.2)",
                            strokeColor: "rgba(151,187,205,1)",
                            pointColor: "rgba(151,187,205,1)",
                            pointStrokeColor: "#fff",
                            pointHighlightFill: "#fff",
                            pointHighlightStroke: "rgba(151,187,205,1)",
                            data: [28, 48, 40, 19, 86, 27, 90]
                        }
                    ]
                };
            }
        },

        options:{
            type:Object,
            default:function(){
                return null;
            }
        }
    },

    compiled: function(){
        var dataReal = [];
        app.notes.betweenDates(app.moment().subtract(3, 'd'), app.moment().add(3, 'd'), 'measure').map(function(v){
            console.log(v.weight);
            v.weight?dataReal.push(parseFloat(v.weight)):0;
        });

        this.data.datasets[1].data = dataReal;
    },

    attached: function(){
        console.log(this.data);
        this.context = document.getElementById(this.id).getContext("2d");
        var Chart = app.chartjs;
        this.chart = new Chart(this.context).Line(this.data, this.options);
    }

});