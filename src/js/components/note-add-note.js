/**
 * Created by Vladimir Kudryavtsev on 22.09.15.
 * Copyright © Academ Media, LLC
 * Copyright © Vladimir Kudryavtsev
 */

Vue.component('note-add-note', {

    template:`
    <div class="navbar">
        <div class="navbar-inner">
            <div class="left">
                <a href="#" class="close-popup" data-popup=".popup-note-add-note">
                    <i class="icon icon-settings">x</i>
                </a>
            </div>
            <div class="center sliding">Note</div>
            <div class="right">
                <a href="#" class="list-open" v-on="click: submit()">
                    <i class="icon icon-results">v</i>
                </a>
            </div>
        </div>
    </div>
    Input your weight:
    <div class="item-input">
        <textarea v-model="text"></textarea>
    </div>
    `,

    props:{
        text:String
    },

    methods:{
        submit:function(){
            var note = new app.notes.WriteNote(this.text);
            note.save();
            app.f7.closeModal('.popup-note-add-note');
        }
    }

});