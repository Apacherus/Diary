/**
 * Created by Vladimir Kudryavtsev on 22.09.15.
 * Copyright © Academ Media, LLC
 * Copyright © Vladimir Kudryavtsev
 */

Vue.component('note-add-measure', {

    template:`
    <div class="navbar">
        <div class="navbar-inner">
            <div class="left">
                <a href="#" class="close-popup" data-popup=".popup-note-add-weight">
                    <i class="icon icon-settings">x</i>
                </a>
            </div>
            <div class="center sliding">Measure</div>
            <div class="right">
                <a href="#" class="list-open" v-on="click: submit()">
                    <i class="icon icon-results">v</i>
                </a>
            </div>
        </div>
    </div>
    Input your weight:
    <div class="item-input">
        <input type="text" v-model="amount" >
    </div>
    `,

    props:{
        amount:{
            type:Number,
            default:1
        }
    },

    methods:{
        submit:function(){
            var note = new app.notes.MeasureNote(Math.round10(this.amount, -1));
            note.save();
            app.f7.closeModal('.popup-note-add-weight');
        }
    }

});