/**
 * Created by Vladimir Kudryavtsev on 19.09.2015.
 * (c) V.K. ozver@live.ru
 */
import {categories, products} from '../products.js';

/**
 * *** Product select component ***
 * Display categories and products
 * ===
 * Parent has accept productSelected(product, product_id) method
 */

Vue.component('products-list', {

    props: {
        cats:Object,
        showCount:{
            type:Boolean,
            default:false
        },
        productSelected:{
            type:Object,
            default:function(){
                return {
                    amount:100
                };
            }
        },
        inputAmount:{
            type:Number,
            default:null
        }
    },
    template: `
    <div class="popup tablet-fullscreen popup-products-list">
    <div class="navbar">
        <div class="navbar-inner">
            <div class="left">
                <a href="#" class="close-popup" data-popup=".popup-products-list">
                    <i class="icon icon-settings">x</i>
                </a>
            </div>
            <div class="center sliding" data-translate="title">Products list</div>
            <div class="right">
                <a href="#" class="list-open">
                    <i class="icon icon-results">V</i>
                </a>
            </div>
        </div>
    </div>
    <div class="content-block products-list" v-show="!showCount">
        <ul>
            <li v-repeat="cats">
                <a href="#" v-on="click: show = !show">{{title}}</a>
                <ul v-show="show">
                    <li class="product" v-repeat="products" v-on="click: openCount(products[$index], id)">{{title}}</li>
                </ul>
            </li>
        </ul>
    </div>
    <div class="content-block products-count" v-show="showCount">
        <div class="products-count-input-text">
            <span>
                <input type="text" v-model="inputAmount"/>
                <span class="products-count-units">gr.</span>
            </span>
        </div>
        <div class="item-input products-count-input-range">
            <div class="range-slider">
              <input type="range" min="{{productSelected.amount}}" value="{{productSelected.amount}}" max="{{productSelected.amount*5}}" step="1" v-model="inputAmount">
            </div>
        </div>
        <div class="products-count-btn-submit" v-on="click: productSubmit()">Submit</div>
    </div>
    </div>
    `,

    created: function () {
        this.cats = {};
        for (var i = 0; i < categories.length; i++) {
            this.cats[i] = (categories[i]);
            if (this.cats[i].hasOwnProperty('products')) {
                for (var j = 0; j < this.cats[i].products.length; j++) {
                    var product_id = this.cats[i].products[j];
                    this.cats[i].products[j] = products[this.cats[i].products[j]];
                    this.cats[i].products[j].id = product_id;

                }

                this.cats[i].show = false;
            }
        }

    },

    methods: {
        openCount: function (product, id)  {
            //this.$parent.productSelected(product, id);
            //app.f7.closeModal('.popup-products-list');
            this.productSelected = JSON.parse(JSON.stringify(product));//clone object
            this.showCount = true;
            this.inputAmount = product.amount;
        },

        productSubmit: function(){
            this.showCount = false;
            this.productSelected.amount = this.inputAmount;
            this.$parent.productSelected(this.productSelected, this.productSubmit.id);
            app.f7.closeModal('.popup-products-list');
        }
    }

});
