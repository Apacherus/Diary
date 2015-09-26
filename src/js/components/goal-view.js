import {rgb2hex} from '../lib/common.js'
import ProgressBar from 'progressbar.js'


var goalView = Vue.component('goal-view', {
    props:{
        goalWeight:{
            type:Number,
            default:0
        },
        goalDate:{ //when goal started
            type:Object,
            default:function(){
                return new Date();
            }
        },
        goalDays:{
            type:Number,
            default:0
        },
        weight:{
            type:Number,
            default:0
        },
        weightDiff:{
            type:Number,
            default:0
        },
        completed:{
            type:Number,
            default:0
        },
        circle:{
            type:Object,
            default:function(){
                return {};
            }
        },
        goalWeightDiff:{
            type:Number,
            default:0
        }
    },

    template:`
    <div class="goal-view">
        <div class="goal-left">
            <div class="goal-diff-title-up" v-class="hide : weightDiff <= 0 "></div>
            <div>{{weightDiff>0?"+ "+weightDiff:weightDiff==0?0:"- " + weightDiff.toString().substr(1)}} kg</div>
            <div>real</div>
            <div class="goal-diff-title-down" v-class="hide : weightDiff >= 0"></div>
        </div>
        <div class="goal-middle">
            <div class="goal-round"></div>
            <div class="goal-round-inner">
                <div class="goal-current-weight">
                    <div class="goal-text">{{weight}}</div>
                    <div class="goal-title">you weight</div>
                </div>
                <div class="goal-weight">
                    <div class="goal-text">{{goalWeight}}</div>
                    <div class="goal-title">goal</div>
                </div>
            </div>
        </div>
        <div class="goal-right">
            <div class="goal-diff-title-up green" v-class="hide : goalWeightDiff <= 0 "></div>
            <div>{{goalWeightDiff>0?"+ "+goalWeightDiff:goalWeightDiff==0?0:"- " + goalWeightDiff.toString().substr(1)}} kg</div>
            <div>goal</div>
            <div class="goal-diff-title-down green" v-class="hide : goalWeightDiff >= 0"></div>
        </div>
    </div>
    `,

    compiled: function(){

    },

    ready:function(){

        this.goalWeight = app.profile.db.goal.weight || 0;
        this.goalDate = app.profile.db.goal.date || new Date;
        this.goalDays = app.profile.db.goal.days || 0;
        this.weight = app.profile.db.lastMeasure.weight || 0;
        this.weightDiff = app.profile.db.lastMeasure.weightDiff || 0;
        this.calc();

        this.update();

        app.em.listen('notesStoreChanged', this.storeUpdate);
    },

    methods:{
        calc: function(){

            this.storeDataGet();

            var today = new Date();
            var dif =  (today - this.goalDate);
            var dif_in_days = Math.round(dif/(1000*60*60*24));//дней прошло
            this.completed = dif_in_days/this.goalDays || 0;//завершено (0..1)
            var daysLeft = this.goalDays - dif_in_days;//дней осталось
            var weightLeft = this.weight - this.goalWeight;//сколько кг до цели

            //Math.round10 - MDN function
            this.goalWeightDiff = - Math.round10(weightLeft / daysLeft, -2) || 0;
        },
        storeDataGet: function(){
            this.goalWeight = app.profile.db.goal.weight || 0;
            this.goalDate = app.profile.db.goal.date || new Date;
            this.goalDays = app.profile.db.goal.days || 0;
            this.weight = app.profile.db.lastMeasure.weight || 0;
            this.weightDiff = Math.round10(app.profile.db.lastMeasure.weightDiff, -2) || 0;
        },
        update: function(){
            var start = [166, 187, 22];//#A6BB16
            var end = [255, 133, 0];//#FF8500

            var color = [
                - (start[0] - end[0]),
                - (start[1] - end[1]),
                - (start[2] - end[2])
            ];

            /**
             * Calculate stroke width for smaller screens
             * @type {number}
             */
            var baseScreenWidth = 375;
            var ratio = baseScreenWidth/100;
            var stroke = 1.5;
            var strokeRatio = stroke/100 + 0.01;
            var screenWidth = window.screen.width;
            var screensRatio = - ( ( screenWidth - baseScreenWidth ) / ratio );
            var strokeD = stroke + screensRatio * strokeRatio;
            if(strokeD < stroke) strokeD = stroke;

            if("destroy" in this.circle){
                this.circle.destroy();
            }

            this.circle = new ProgressBar.Circle('.goal-round', {
                color: start,
                strokeWidth: strokeD,
                duration:600,
                step: function(state, circle) {
                    var V = circle.value();
                    var color_0, color_1, color_2;

                    color_0 = color[0] / 100 * (V*100);
                    color_1 = color[1] / 100 * (V*100);
                    color_2 = color[2] / 100 * (V*100);

                    var _color = [
                        Math.round(start[0] + color_0),
                        Math.round(start[1] + color_1),
                        Math.round(start[2] + color_2)
                    ];
                    circle.path.setAttribute('stroke', rgb2hex(_color[0], _color[1], _color[2]));
                }
            });

            this.circle.animate(this.completed);
        },

        storeUpdate: function(){
            this.calc();
            this.update();
        }
    }
});


export default goalView;