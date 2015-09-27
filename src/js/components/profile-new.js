/**
 * Created by Vladimir Kudryavtsev on 27.09.2015.
 * (c) V.K. ozver@live.ru
 */

Vue.component('profile-new', {
    template:`
    <div class="page cached no-swipeback" data-page="profile">
        <div class="page-content">
        Profile!
        </div>
    </div>
    `,

    ready: function(){
        app.f7.onPageBeforeAnimation('profile', function (page) {
            app.em.event('buttonAddHide');
        });
    }
});