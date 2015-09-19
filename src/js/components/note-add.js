/**
 * Created by Vladimir Kudryavtsev on 18.09.15.
 * Copyright © Academ Media, LTD
 * Copyright © Vladimir Kudryavtsev
 */

import './note-add-eat.js'


var noteAdd = Vue.component('note-add', {

    template:`
        <div class="popup tablet-fullscreen popup-note-add-water">
        <div class="content-block">
            test water
            <a href="#" class="close-popup">Close</a>
        </div>
        </div>
        <div class="popup tablet-fullscreen popup-note-add-eat">
        <note-add-eat></note-add-eat>
        </div>
        <div class="popup tablet-fullscreen popup-note-add-note">
        <div class="content-block">
            test note
            <a href="#" class="close-popup">Close</a>
        </div>
        </div>
        <div class="popup tablet-fullscreen popup-note-add-weight">
        <div class="content-block">
            test weight
            <a href="#" class="close-popup">Close</a>
        </div>
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