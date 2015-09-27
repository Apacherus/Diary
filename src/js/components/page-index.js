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
            <a href="#diary">Diary</a>
            <charts-builder id="indexChart"></charts-builder>
            <diary-eat-next v-ref="eatNext"></diary-eat-next>
        </div>
    </div>
   `,
    ready: function(){
        app.f7.onPageBeforeAnimation('index', function(page){
            app.em.event('buttonAddShow');
        });
    }
});