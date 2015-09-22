/**
 * Created by Vladimir Kudryavtsev on 22.09.15.
 * Copyright © Academ Media, LLC
 * Copyright © Vladimir Kudryavtsev
 */

Vue.component('note-add-water', {

    template:`
    <div class="navbar">
            <div class="navbar-inner">
                <div class="left">
                    <a href="#" class="close-popup" data-popup=".popup-note-add-water">
                        <i class="icon icon-settings">x</i>
                    </a>
                </div>
                <div class="center sliding">Water</div>
                <div class="right">
                    <a href="#" class="list-open" v-on="click: submit()">
                        <i class="icon icon-results">v</i>
                    </a>
                </div>
            </div>
     </div>
     Add water
     <input type="text" v-model="amount"/>
     <div class="item-input products-count-input-range">
        <div class="range-slider">
          <input type="range" min="0" value="{{amount}}" max="{{20}}" step="1" v-model="amount">
        </div>
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
            app.f7.closeModal('.popup-note-add-water');
        }
    }

});