/**
 * Created by Vladimir Kudryavtsev on 19.09.2015.
 * (c) V.K. ozver@live.ru
 */

import './products-list.js';

Vue.component('note-add-eat', {

    props:{
        productsList:{
            type:Array,
            default:function(){
                return [];
            }
        },
        caloricSummary:Number
    },

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
                    <a href="results.html" class="list-open">
                        <i class="icon icon-results"></i>
                    </a>
                </div>
            </div>
     </div>
    <div class="list-block">
        <div class="note-add-eat-list">
            <ul>
                <li v-repeat="productsList" track-by="$index">
                    <div class="item-content">
                        <div class="item-media">
                            <i class="icon my-icon"></i>
                        </div>
                        <div class="item-inner">
                            <div class="item-title">
                                {{title}}
                            </div>
                            <div class="item-after">
                                {{amount}}{{units}}/{{cal}}kcal
                            </div>
                        </div>
                    </div>
                 </li>
            </ul>
        </div>
        <hr/>
        <div>Sum: {{caloricSummary||0}}kcal</div>
        <a href="#" class="open-popup" data-popup=".popup-products-list">Add product +</a>
    </div>
    <products-list></products-list>
    `,
    methods:{
        productSelected: function(product, product_id){
            this.productsList.push(product);
            this.caloricSummary = 0;
            for(var i = 0; i<this.productsList.length; i++){
                if(this.productsList[i].hasOwnProperty('cal')){
                    this.caloricSummary += this.productsList[i].cal;
                }
            }
        }
    }
});