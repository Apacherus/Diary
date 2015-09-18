/**
 * Created by Vladimir Kudryavtsev on 18.09.15.
 * Copyright © Academ Media, LTD
 * Copyright © Vladimir Kudryavtsev
 */

import '../filters/time.js'

var diaryEatNext = Vue.component('diary-eat-next', {
    props:{
        nextNote:Object,
        time:Object
    },
    template:`
    <div class="diary-eat-next">
        <div v-if="nextNote">
            <a href="#">{{nextNote.title || "Eat"}}</a>: {{time|time}}
        </div>
    </div>
    `,
    compiled: function(){
        this.nextNote = app.notes.afterDate()[0];
        if(this.nextNote){
            this.time = this.nextNote.date;
        }
    }

});

export default diaryEatNext;