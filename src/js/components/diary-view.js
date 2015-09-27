/**
 * Created by Vladimir Kudryavtsev on 21.09.15.
 * Copyright © Academ Media, LLC
 * Copyright © Vladimir Kudryavtsev
 */

import '../filters/caloric.js'
import '../filters/time.js'

Vue.component('diary-view', {

    props:{
        notes:{
            type:Array,
            default:function(){
                return [];
            }
        },
        calendarOpened:{
            type:Boolean,
            default:false
        },
        currentDate:{
            type:Object,
            default:function(){
                return new Date;
            }
        }
    },
    template:`
    <div class="page cached" data-page="diary">
        <div class="page-content">
            <div class="diary-view-datepicker" v-class="shifted:!calendarOpened">
                <div id="calendar-inline-container"></div>
            </div>
            <div class="diary-view-wrapper">
                <div class="list-block accordion-list diary-view">
                    <ul v-show="notes.length">
                        <li class="swipeout accordion-item" v-repeat="notes" track-by="$index">
                            <div class="swipeout-content">
                                <div class="item-content accordion-item-toggle">
                                    <div class="item-media">
                                        <i class="icon note-{{type}}" v-class="gone:date<new Date || isGone"></i>
                                    </div>
                                    <div class="item-inner">
                                        <div class="item-title" v-show="type != 'water'">
                                            {{title}}/{{date|time}}
                                        </div>
                                        <div class="item-title" v-show="type == 'water'">
                                            Water/{{date|time}}
                                        </div>
                                        <div class="item-after" v-if="type == 'eat'">
                                            {{products|caloric}}cal
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="accordion-item-content">
                                <div class="content-block">
                                  <template v-if="type=='eat'">
                                    <ul>
                                        <li v-repeat="products">
                                        {{title}}:{{cal}}
                                        </li>
                                    </ul>
                                  </template>
                                  <template v-if="type=='note'">
                                  <p>{{text}}</p>
                                  </template>
                                </div>
                            </div>
                            <div class="swipeout-actions-right">
                                <a href="#" class="action1 bg-red swipeout-close" v-on="click:alert($index)">Delete</a>
                            </div>
                         </li>
                    </ul>
                    <div v-show="!notes.length">No notes for selected date</div>
                </div>
            </div>
        </div>
    </div>
    `,
    ready:function(){

        this.notesLoad();

        var self = this;

        var monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August' , 'September' , 'October', 'November', 'December'];

        var calendarInline = app.f7.calendar({
            container: '#calendar-inline-container',
            value: [self.currentDate],
            weekHeader: false,
            toolbarTemplate:
            '<div class="toolbar calendar-custom-toolbar">' +
            '<div class="toolbar-inner">' +
            '<div class="left">' +
            '<a href="#" class="link icon-only"><i class="icon icon-back"></i></a>' +
            '</div>' +
            '<div class="center"></div>' +
            '<div class="right">' +
            '<a href="#" class="link icon-only"><i class="icon icon-forward"></i></a>' +
            '</div>' +
            '</div>' +
            '</div>',
            onOpen: function (p) {
                app.dom7('.calendar-custom-toolbar .center').text(monthNames[p.currentMonth] +', ' + p.currentYear);
                app.dom7('.calendar-custom-toolbar .left .link').on('click', function () {
                    calendarInline.prevMonth();
                });
                app.dom7('.calendar-custom-toolbar .right .link').on('click', function () {
                    calendarInline.nextMonth();
                });
            },
            onMonthYearChangeStart: function (p) {
                app.dom7('.calendar-custom-toolbar .center').text(monthNames[p.currentMonth] +', ' + p.currentYear);
            },
            onDayClick: function(p, dayContainer, year, month, day){
                self.currentDate = new Date(year, month, day);
                self.notesLoad();
            }
        });

        app.em.listen('notesStoreChanged', this.notesLoad);

    },
    methods: {

        notesLoad: function(){
            this.notes = app.notes.forDate(this.currentDate).sort(function(a, b){
                if(a.date > b.date){
                    return 1;
                }
                if(a.date < b.date){
                    return -1;
                }
                return 0;
            });
            this.$parent.title = this.currentDate;
        },

        openDatePicker: function(){
            this.calendarOpened = !this.calendarOpened;
        }
    }

});