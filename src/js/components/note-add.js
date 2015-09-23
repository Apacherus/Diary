/**
 * Created by Vladimir Kudryavtsev on 18.09.15.
 * Copyright © Academ Media, LLC
 * Copyright © Vladimir Kudryavtsev
 */

import './note-add-eat.js'
import './note-add-water.js'
import './note-add-measure.js'
import './note-add-note.js'

var noteAdd = Vue.component('note-add', {

    template:`
        <div class="popup tablet-fullscreen popup-note-add-water">
        <note-add-water></note-add-water>
        </div>
        <div class="popup tablet-fullscreen popup-note-add-eat">
        <note-add-eat></note-add-eat>
        </div>
        <div class="popup tablet-fullscreen popup-note-add-note">
        <note-add-note></note-add-note>
        </div>
        <div class="popup tablet-fullscreen popup-note-add-weight">
        <note-add-measure></note-add-measure>
        </div>
        `,
    created: function(){

    },
    methods: {
        newNote: function(type){
            app.f7.popup('.popup-note-add-'+type);
        }
    }

});

export default noteAdd;