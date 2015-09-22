/**
 * Created by Vladimir Kudryavtsev on 18.09.15.
 * Copyright © Academ Media, LLC
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
        app.em.listen('notesStoreChanged', this.update);
        this.update();
    },

    methods: {
        update: function(){
            this.nextNote = app.notes.afterDate().sort(function(a, b){
                if(a.date < b.date)
                {
                    return -1;
                }
                if(a.date > b.date)
                {
                    return 1;
                }
                return 0;
            })[0];
            if(this.nextNote){
                this.time = this.nextNote.date;
            }
        }
    }

});

export default diaryEatNext;