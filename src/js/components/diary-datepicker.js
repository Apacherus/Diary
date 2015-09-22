/**
 * Created by Vladimir Kudryavtsev on 21.09.15.
 * Copyright © Academ Media, LLC
 * Copyright © Vladimir Kudryavtsev
 */

Vue.component('diary-datepicker', {
    template:`
    <div class="popup tablet-fullscreen popup-diary-date-picker">
    <div class="content-block">
        Diary Date Picker
    </div>
    </div>
    `,
    methods: {
        open: function(){
            app.f7.popup('.popup-diary-date-picker');
        }
    }
});