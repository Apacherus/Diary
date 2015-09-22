/**
 * Created by Vladimir Kudryavtsev on 19.09.2015.
 * (c) V.K. ozver@live.ru
 */

import './products-list.js';
import './date-picker.js';

Vue.component('note-add-eat', {

    template: `
    <div class="navbar">
            <div class="navbar-inner">
                <div class="left">
                    <a href="#" class="close-popup" data-popup=".popup-note-add-eat">
                        <i class="icon icon-settings">x</i>
                    </a>
                </div>
                <div class="center sliding" data-translate="title"></div>
                <div class="right">
                    <a href="#" class="list-open" v-on="click: submit()">
                        <i class="icon icon-results">v</i>
                    </a>
                </div>
            </div>
     </div>

    <div class="">
        <div class="note-add-eat-title">
            <input type="text" v-model="title">
        </div>
        <date-picker v-ref="datePicker"></date-picker>
    </div>
    <div class="list-block note-add-eat-list">
            <ul>
                <li class="swipeout" v-repeat="productsList" track-by="$index">
                    <div class="swipeout-content">
                        <div class="item-content">
                            <div class="item-media">
                                <i class="icon my-icon"></i>
                            </div>
                            <div class="item-inner">
                                <div class="item-title">
                                    {{title}}
                                </div>
                                <div class="item-after">
                                    {{amount}}{{units}}/{{Math.round(amount/100*cal)}}kcal
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="swipeout-actions-right">
                        <a href="#" class="action1 bg-red swipeout-close" v-on="click:productDelete($index)">Delete</a>
                    </div>
                 </li>
            </ul>
        <div>Sum: {{caloricSummary||0}}kcal</div>
        <a href="#" class="open-popup products-list-plus" data-popup=".popup-products-list">Add product</a>
    </div>
    <products-list></products-list>
    `,

    props: {
        productsList: {
            type: Array,
            default: function () {
                return [];
            }
        },
        caloricSummary: Number,
        title:{
            type:String,
            default:"Eat"
        }
    },
    methods: {
        productSelected: function (product, product_id) {
            this.productsList.push(product);
            this.caloricRecalc();
        },

        caloricRecalc: function () {
            this.caloricSummary = 0;
            for (var i = 0; i < this.productsList.length; i++) {
                if (this.productsList[i].hasOwnProperty('cal')) {
                    this.caloricSummary += this.productsList[i].amount / 100 * this.productsList[i].cal;
                }
            }
        },

        productDelete: function (index) {
            this.productsList.splice(index, 1);
            this.caloricRecalc();
        },

        submit: function(){
            var note = new app.notes.EatNote(this.productsList, this.title, this.$.datePicker.getDateTime());
            note.save();
            app.f7.closeModal('.popup-note-add-eat');
            //app.vue.$.eatNext.update();
        }
    }
});