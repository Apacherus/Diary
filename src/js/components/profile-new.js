/**
 * Created by Vladimir Kudryavtsev on 27.09.2015.
 * (c) V.K. ozver@live.ru
 */

import Goal from "../goal.js"

Vue.component('profile-new', {
    props:{
        sex:{
            type:String,
            default:'F'
        },

        name:{
            type:String,
            default:''
        },

        birthday:{
            type:Object,
            default:function(){
                return null;
            }
        },

        calendarOpened:{
            type:Boolean,
            default:false
        },

        swiper:Object,

        weight:{
            type:String,
            default:''
        },

        height:{
            type:String,
            default:''
        },

        disableSwitchCheckState:{
            type:Boolean,
            default:false
        },

        bodyType:{
            type:Number,
            default:0
        },
        activityTypes:{
            type:Array,
            default:function(){
                return [
                    {
                        activity:"awdawawdadw",
                        sub:"zzzzzzzz",
                        active:false
                    },
                    {
                        activity:"awdawawdadw",
                        sub:"zzzzzzzz",
                        active:true
                    },
                    {
                        activity:"awdawawdadw",
                        sub:"zzzzzzzz",
                        active:false
                    },
                    {
                        activity:"awdawawdadw",
                        sub:"zzzzzzzz",
                        active:false
                    }
                ];
            }
        },

        activityTypeIndex:Number,

        programType:{
            type:Number,//0 - diet, 1 - goal
            default:0
        },

        diets: {
            type:Array,
            default: function(){
                return [
                    {
                        id:0,
                        title:'Test diet 1',
                        text: 'Diet diet',
                        days: 10,
                        weight: -20,
                        cal: 2000,
                        category: 'sport'
                    },
                    {
                        id:1,
                        title:'Test diet 2',
                        text: 'Diet diet',
                        days: 5,
                        weight: -10,
                        cal: 1800,
                        category: 'office'
                    },
                    {
                        id:2,
                        title:'Test diet 3',
                        text: 'Diet diet',
                        days: 15,
                        weight: -30,
                        cal: 2800,
                        category: 'hard'
                    }
                ]
            }
        },

        activeDiet: {
            type:Number,
            default:0
        },

        dietPreview: {
            type:Number,
            default:0
        },

        goalTotalDays: {
            type:Number,
            default:0
        },

        goalWeight:{
            type:Number,
            default:0
        },
        picker:Object,

        firstRunX:{
            type:Boolean,
            default:false
        },
        swiperFirstRunSlide:{
            type:String,
            default:`<div class="swiper-slide first-run__swiper-slide">
                        <div class="profile-first-run__wrapper">
                            <div class="title">Welcome!</div>
                            <div class="first-run__image"></div>
                            <div class="text">
                                Calorie Diary is easy way<br/>to start proper nutrition!
                            </div>
                            <div class="text">
                                First we need specify<br/>some information about you.
                            </div>
                            <div class="text profile-first-run__swipe">
                                Just swipe to start.
                            </div>
                            <div class="profile-first-run-arrow__wrapper">
                                <div class="profile-first-run__arrow"></div>
                            </div>
                        </div>
                    </div>`
        }
    },
    template:`
    <div class="page cached no-swipeback" data-page="profile">

        <div class="page-content">
            <div class="swiper-container">
                <div class="swiper-wrapper">

                    <div class="swiper-slide">
                        <div class="switcher">
                            <div class="left" v-class="active:sex=='F'" v-on="click:sex='F'">Female</div>
                            <div class="right" v-class="active:sex=='M'" v-on="click:sex='M'">Male</div>
                        </div>

                        <div class="name">
                            <input type="text" v-model="name" placeholder="Name" v-el="indexName"/>
                        </div>

                        <div class="birthday" v-on="click:calendarOpened = !calendarOpened">
                            <input type="text" v-model="birthday|birthday" placeholder="Birthday" v-el="inputBirthday" />
                            <i class="icon icon-calendar" v-class="opened:calendarOpened" v-on="click:!calendarOpened?$$.inputBirthday.focus():false"></i>
                        </div>

                        <div class="button-continue" v-class="btn-disabled:!name.length" v-on="click:next()">Continue</div>

                        <div class="profile-calendar" v-class="opened:calendarOpened">
                            <div class="calendar-inline-container-profile"></div>
                        </div>
                    </div>

                    <div class="swiper-slide">
                        <div class="input-field">
                            <input type="text" placeholder="Weight" v-el="secondWeight" v-model="weight"/>
                            <div class="units">KG</div>
                            <div class="sub">Weight</div>
                        </div>
                        <div class="input-field">
                            <input type="text" placeholder="Height" v-model="height"/>
                            <div class="units">cm</div>
                            <div class="sub">Height</div>
                        </div>
                        <div class="button-continue" v-class="btn-disabled:!parseInt(weight) || !parseInt(height)" v-on="click:next()">Continue</div>
                    </div>
                    `+`

                    <div class="swiper-slide">
                        <div class="switcher">
                            <div class="left" v-class="active:bodyType == 0" v-on="click:changeBodyType(0)">Slim</div>
                            <div class="center" v-class="active:bodyType == 1" v-on="click:changeBodyType(1)">Average</div>
                            <div class="right" v-class="active:bodyType == 2" v-on="click:changeBodyType(2)">Large</div>
                        </div>
                        <div class="input-field">
                            Your activity
                        </div>
                        <div class="activity-list">
                            <div class="item" v-repeat="activityTypes" v-class="active:active" v-on="click:setActivity($index)">
                                {{activity}}
                                <div class="sub">{{sub}}</div>
                            </div>
                        </div>
                    </div>
                    `+`
                    <div class="swiper-slide">
                        <div class="switcher">
                            <div class="left" v-class="active:programType == 0" v-on="click:programType = 0">Diet</div>
                            <div class="right" v-class="active:programType == 1" v-on="click:programType = 1">Goal</div>
                        </div>
                        <div class="custom-tabs">
                            <div class="tab diet" v-class="active:programType == 0">
                                <div class="list-block">
                                    <ul>
                                        <li v-repeat="diets" v-on="click:selectDiet($index)">
                                            <div class="item-content diet-item">
                                                <div class="diet-item-text">
                                                    <div class="diet-item-title">{{title}}</div>
                                                    <div class="diet-item-subtitle">{{category}}<span v-if="activeDiet == id">(active)</span></div>
                                                </div>
                                                <div class="diet-item-info">
                                                    <div class="diet-item-weight"><span>{{days}} days /</span> {{weight}} kg</div>
                                                    <div class="diet-item-calories">{{cal}} kcal</div>
                                                </div>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div class="tab goal" v-class="active:programType == 1">
                                <div class="goal-weight">
                                    <div class="goal-weight-minus" v-on="click:goalWeight--"></div>
                                    <div class="goal-weight-numeric">
                                        <div class="goal-weight-numeric-weight">{{goalWeight}}</div>
                                        <div class="goal-weight-numeric-units">KG</div>
                                    </div>
                                    <div class="goal-weight-plus" v-on="click:goalWeight++"></div>
                                </div>
                                <div class="goal-total">
                                    <div class="goal-total-total">Total</div>
                                    <div class="goal-total-weight-in-day"> {{-Math.round10((weight - goalWeight)/goalTotalDays, -2)}} kg / day</div>
                                    <div class="goal-total-totalWeight">{{-(weight - goalWeight)}} kg</div>
                                </div>
                                <input type="text" readonly class="picker-profile-goal">
                                <div class="goal-picker-container"></div>
                                <div class="goal-submit" v-on="click:startGoal()">Start</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="swiper-pagination"></div>
            </div>
        </div>

    </div>
    `+`
    <div class="popup tablet-fullscreen popup-profile-diet-select">
        <div class="navbar-custom">
            <div class="left">
                <div class="inner"><a href="#" v-on="click:dietPopupClose()"><i class="icon icon-arrow-left"></i></a></div>
            </div>
            <div class="center">
                <div class="inner">{{diets[dietPreview].title}}</div>
            </div>
            <div class="right">
                <div class="inner"></div>
            </div>
        </div>
        <div class="popup-custom-page">
            <div class="diet-image">
                <img v-attr="src:'data/diets/'+diets[dietPreview].id+'.jpg'"/>
            </div>
            <div class="diet-text">
                <div class="diet-info">
                    <div class="diet-category">{{diets[dietPreview].category}}</div>
                    <div class="diet-states">
                        {{diets[dietPreview].days}} days / {{diets[dietPreview].weight}} kg
                        <div class="diet-states-calories">
                            {{diets[dietPreview].cal}} kcal
                        </div>
                    </div>
                </div>
            {{diets[dietPreview].text}}
            </div>
            <div class="diet-submit">Start</div>
        </div>
    </div>
    `,

    ready: function(){
        var self = this;

        if(app.profile.db.firstRun){
            this.firstRunX = true;
            app.dom7('.navbar-profile__icon_back').addClass('hidden');
            //app.dom7('.navbar-profile__icon_skip').removeClass('hidden');
            app.dom7('.navbar-profile__icon_skip').click(function(){
                self.skip();
            });
        }

        this.sex = app.profile.db.sex || 'F';
        this.name = app.profile.db.name || '';
        if(app.profile.db.firstRun) {
            this.birthday = null;
        } else {
            this.birthday = app.profile.db.birthday || null;
        }


        var lastMeasure = app.notes.last('measure');
        this.weight = lastMeasure?lastMeasure.weight:0;
        this.height = app.profile.db.height || 0;

        this.bodyType = app.profile.db.bodyType || 0;
        var activity = app.profile.db.activityType || 0;
        this.setActivity(activity);

        this.activeDiet = "diet" in app.profile.db ? app.profile.db.diet : -1;
        if(!app.profile.db.goal.days || app.profile.db.goal.days <= 0){
           this.goalTotalDays = 1; 
        } else {
           this.goalTotalDays = app.profile.db.goal.days;
        }
        if(app.profile.db.goal.weight && app.profile.db.goal.weight > 0) {
            this.goalWeight = app.profile.db.goal.weight;
        } else {
            this.goalWeight = this.weight;
        }

        app.f7.onPageBeforeAnimation('profile', function (page) {

            self.firstRunX = app.profile.db.firstRun;

            app.em.event('buttonAddHide');

            if(app.profile.db.firstRun) {
                app.dom7('[data-page="profile"] .swiper-wrapper').prepend(self.swiperFirstRunSlide);
                app.dom7('.navbar-profile__icon_back').addClass('hidden');
                app.dom7('.navbar-profile__icon_skip').click(function(){
                    self.skip();
                });
            } else {
                app.dom7('.navbar-profile__icon_back').removeClass('hidden');
                app.dom7('.navbar-profile__icon_skip').addClass('hidden');
                app.dom7('.first-run__swiper-slide').remove();

            }

            if(!self.swiper) {
                self.swiper = app.f7.swiper('[data-page="profile"] .swiper-container', {
                    pagination: '[data-page="profile"] .swiper-pagination'
                });

                self.swiper.on('slideChangeEnd', function (swiper) {
                    app.vue.$.pageProfile.pageChange(swiper)
                });
            } else {
                self.swiper.destroy(true, true);

                self.swiper = app.f7.swiper('[data-page="profile"] .swiper-container', {
                    pagination: '[data-page="profile"] .swiper-pagination'
                });

                self.swiper.on('slideChangeEnd', function (swiper) {
                    app.vue.$.pageProfile.pageChange(swiper)
                });
            }

            //setTimeout(function(){self.$$.indexName.focus()}, 500);

        });

        app.f7.onPageAfterAnimation('profile', function(){
            if(app.profile.db.firstRun) {
                app.dom7('.first-run__overlay').css('opacity', '0');
                setTimeout(function(){app.dom7('.first-run__overlay').remove();}, 300);
                app.dom7('body').css('opacity', '1');
            }

            self.swiper.slideTo(1);
            self.swiper.slideTo(0);
            app.em.event('buttonAddHide');
        });

        var monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August' , 'September' , 'October', 'November', 'December'];

        var calendarInline = app.f7.calendar({
            container: '.calendar-inline-container-profile',
            value: [self.birthday],
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
                self.birthday = new Date(year, month, day);
            }
        });


    },

    methods: {
        next: function(){
            this.swiper.slideNext();
        },

        savePageData0: function(){

            app.profile.db.name = this.name;
            app.profile.db.birthday = this.birthday;
            app.profile.db.sex = this.sex;
            app.profile.save();

        },

        savePageData1: function(){

            var lastMeasure = app.notes.last('measure');
            if((lastMeasure && lastMeasure.weight != this.weight) || !lastMeasure){
                var note = new app.notes.MeasureNote(this.weight);
                note.save();
            }

            app.profile.db.height = this.height;
            app.profile.save();
        },

        savePageData2: function(){
            app.profile.db.bodyType = this.bodyType;
            app.profile.db.activityType = this.activityTypeIndex;

            app.profile.save();
        },

        pageChange: function(swiper){

            var self = this;



            var firstRun = this.firstRunX?1:0;

            if(firstRun && swiper.activeIndex == 0){
                app.dom7('.navbar-profile__icon_skip').addClass('hidden');
                app.vue.$.navbar.title.profile = '';
            } else if(firstRun){
                app.dom7('.navbar-profile__icon_skip').removeClass('hidden');
            }

            if(!firstRun) {
                app.dom7('.navbar-profile__icon_skip').addClass('hidden');
            }



            if(app.profile.db.goal.weight && app.profile.db.goal.weight > 0) {
                this.goalWeight = app.profile.db.goal.weight;
            } else {
                this.goalWeight = this.weight;
            }

            if(!this.picker){
                        this.picker = app.f7.picker({
                            input: '.picker-profile-goal',
                            container: '.goal-picker-container',
                            rotateEffect: true,
                            toolbar:false,
                            value: [self.goalTotalDays || 1, 'Days'],
                            cols: [
                                {
                                    values: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30]
                                },
                                {
                                    values: ['Years', 'Months', 'Days']
                                }
                            ],

                            onChange: function(p, values, displayValues){
                                var timeTypes = ['Years', 'Months', 'Days'];
                                var timeType = timeTypes.indexOf(values[1]);
                                var days = values[0];
                                if(timeType == 0){
                                    timeType = 365;
                                } else if(timeType == 1){
                                    timeType = 30;
                                } else {
                                    timeType = 1;
                                }

                                app.vue.$.pageProfile.goalTotalDays = days * timeType;

                            }
                        });
                    }

            //здесь делаем инициализацию при переходе по слайдам
            switch(swiper.activeIndex){
                case firstRun:
                    this.$$.indexName.focus();
                    break;
                case 1+firstRun:
                    this.$$.secondWeight.focus();
                    break;

                case 3+firstRun:
                    
                    break;
            }

            if(this.disableSwitchCheckState){
                this.disableSwitchCheckState = false;
                return;
            }

            //check slide 0 (name and birthday)
            if(!this.name.length || this.name.length == 0 || this.name.trim().length == 0){
                //this.disableSwitchCheckState = true;
                this.swiper.slideTo(firstRun);
                return;
            }


            if(swiper.previousIndex == 1+firstRun){
                    //check slide 1 (weight and height)
                    var weight = parseInt(this.weight);
                    var height = parseInt(this.height);
                    if(!weight || !height){
                        //this.disableSwitchCheckState = true;
                        this.swiper.slideTo(1+firstRun);
                        return;
                    }
                    this.weight = weight;
                    this.height = height;
            }


            if(app.profile.db.firstRun){
                app.profile.db.firstRun = false;
                app.profile.save();
            }

            //здесь делаем проверку на валидность полей и сохранение данных
            switch(swiper.previousIndex){
                case firstRun:
                    this.savePageData0();
                    break;
                case 1+firstRun:
                    this.savePageData1();
                    break;

                case 2+firstRun:
                    this.savePageData2();
                    break;
            }

        },

        setActivity: function(index, nosave = false){
            for(var i = 0; i<this.activityTypes.length; i++){
                this.activityTypes[i].active = false;
            }

            this.activityTypes[index].active = true;
            this.activityTypeIndex = index;
            if(!nosave){
                this.savePageData2();
            }
        },

        selectDiet: function(index){
            this.dietPreview = index;
            app.f7.popup('.popup-profile-diet-select');
        },

        dietPopupClose: function(){
            app.f7.closeModal('.popup-profile-diet-select');
        },

        changeBodyType: function(type){
            this.bodyType = type;
            this.savePageData2();
        },

        startGoal: function(){
            var goal = new Goal(this.goalTotalDays, this.goalWeight, this.weight);
            goal.save();
            app.em.event('notesStoreChanged');
            this.skip();
        },

        skip: function(){
            app.profile.db.firstRun = false;
            app.profile.save();
            app.vue.$.navbar.loadPage('index');
        },

        newProfile: function(){
            app.profile.create();
            app.vue.$.navbar.loadPage('profile')
        }
    }
});