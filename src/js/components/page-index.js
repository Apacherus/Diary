/**
 * Created by Vladimir Kudryavtsev on 27.09.2015.
 * (c) V.K. ozver@live.ru
 */

Vue.component('page-index', {
   template:`
   <div data-page="index" class="page no-swipeback">
        <div class="page-content">
            <div class="goal">
                <goal-view v-ref="goal" testattr="test"></goal-view>
            </div>
            <charts-builder id="indexChart"></charts-builder>
            <div class="body-mass-index">
                <div class="title">Body mass index</div>
                <div class="circle">
                    <div class="count">30</div>
                </div>
            </div>
            <div class="index-widget">
                <div class="item water-cups">
                    <div class="count">15</div>
                    <div class="sub">cups</div>
                </div>
                <div class="item calories">
                    <div class="count">{{calories}}</div>
                    <div class="sub">{{caloriesLeft}} kcal</div>
                </div>
                <div class="item water-time">
                    <div class="count">15</div>
                    <div class="sub">minutes left</div>
                </div>
            </div>
            <diary-eat-next v-ref="eatNext"></diary-eat-next>
        </div>
    </div>
   `,

    props: {
        calories:{
            type:Number,
            default:0
        },
        caloriesLeft:{
            type:Number,
            default:0
        }
    },

    ready: function(){
        app.f7.onPageBeforeAnimation('index', function(page){
            app.em.event('buttonAddShow');
        });

        this.updateCalories();

        app.em.listen('notesStoreChanged', this.updateCalories);
    },

    methods: {
        updateCalories: function(){
            var notes = app.notes.forDate(new Date, 'eat');
            var today = new Date;
            this.calories = 0;
            this.caloriesLeft = 0;
            for(var i = 0; i<notes.length; i++){
                
                    for(var j = 0; j<notes[i].products.length; j++){
                        if(notes[i].products[j].units == 'ml' || notes[i].products[j].units == 'gr') {
                            if(notes[i].date < today) {
                                this.calories += notes[i].products[j].amount / 100 * notes[i].products[j].cal;
                            } else {
                                this.caloriesLeft += notes[i].products[j].amount / 100 * notes[i].products[j].cal;
                            }
                        } else {
                            if(notes[i].date < today) {
                                this.calories += notes[i].products[j].amount * notes[i].products[j].cal;
                            } else {
                                this.caloriesLeft += notes[i].products[j].amount * notes[i].products[j].cal;
                            }
                        }
                    
                }
            }
        }
    }
});