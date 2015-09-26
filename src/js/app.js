/**
 * Created by Vladimir Kudryavtsev on 17.09.15.
 * Copyright © Academ Media, LLC
 * Copyright © Vladimir Kudryavtsev
 */

/**
 * npm modules
 */
import moment from 'moment'
import ChartJS from 'chart.js'

/**
 * Common app classes
 */
import translate from "./translate";
import notes from './notes';
import profile from './components/profile';
import EventManager from './eventManager.js'
import Goal from './goal.js'

/**
 * Web components (vuejs)
 */
import './components/button-note';
import "./components/goal-view";
import './components/diary-eat-next.js';
import './components/diary-view.js';
import './components/diary-datepicker.js'
import './components/charts-builder.js'
import './components/main-menu.js'



/**
 * warn == console.warn
 */
var warn = function () {
    console.warn.apply(console, arguments);
};

var app = {
    config: {
        f7_enable: true,
        f7_config: {
            swipePanel:'left'
        },
        dom7_enable: true,
        JSAPI_enable: true,
        debug: false
    },
    platform: 'iOS',
    free: true,
    isProd: false, /*is production?*/
    /**
     * Framework7
     */
    f7: null,
    /**
     * Framework7 main view
     */
    view: null,
    /**
     * Framework7 DOM library
     */
    dom7: null,
    adTime: null,
    /**
     * iOS/Android native functions bridge library
     */
    JSAPI: null,
    loadingDisabled: false,
    loadingFakeTime: 500,
    loadingAnimationTime: 300,
    settings: {
        notFirstLaunch: false
    },
    settingsDefault: {
        notFirstLaunch: false
    },
    meta: {
        title: 'Calorie Diary',
        hashtag: "#app",
        languageDefault: 'en',
        languageCurrent: 'ru'
    },

    em: new EventManager,

    /**
     * Инициализация приложения
     */
    init: function () {

        app.isProd = app.indexOfVal(document.getElementsByTagName('body')[0].classList, "app-prod") >= 0;

        app.loadingDisabled = !app.isProd;

        /**
         * определяем язык
         **/

        var lang = document.getElementsByTagName('html')[0].getAttribute('lang') || app.meta.languageDefault;
        app.meta.languageCurrent = lang;
        document.getElementsByTagName('body')[0].classList.add('lang-' + lang);

        /**
         * moment.js - library for date formatting
         */
        if(moment){
            app.moment = moment;
            app.moment.locale(app.meta.languageCurrent||app.meta.languageDefault);
        }

        /**
         * определяем платформу
         */
        app.platform = ( app.isiOS() ? 'iOS' : 'android' );

        String.prototype.translate = function (translateTo) {
            if (typeof translate == "undefined") {
                warn("Cannot find translate object! Check that js/translate.js is exist and included.");
                return this;
            }
            var lang;
            if (typeof translateTo == "undefined") {
                lang = app.meta.languageCurrent;
            } else {
                lang = translateTo;
            }
            var translateStr, need_str = '';
            for (var translateObject in translate) {

                if (!translate.hasOwnProperty(translateObject)) continue;

                for (translateStr in translate[translateObject]) {

                    if (!translate[translateObject].hasOwnProperty(translateStr)) continue;

                    if (translate[translateObject][translateStr] == this) {
                        need_str = translate[translateObject][lang];

                        //если слова на этом языке нет - отдаем слово на дефолтном
                        if (need_str == '' || typeof need_str == "undefined") {
                            warn("No translated string [<" + this + ">, translate." + translateObject + "] for language " + lang + "!");
                            var lang_default = app.meta.languageDefault;
                            var need_str_def = translate[translateObject][lang_default];
                            //если слова нет и на дефолтном - отдаем само слово
                            //TODO: translate: return false ??
                            if (need_str_def == '' || need_str_def == "undefined") {
                                warn("No default translated string [<" + this + ">, translate." + translateObject + "] for language " + lang_default + "!");
                                return this;
                            }
                            return translate[translateObject][lang_default];
                        } else {
                            return need_str;
                        }
                    }
                }
            }

            return this;
        };

        app.chartjs = ChartJS;




        if (app.config.f7_enable) {
            app.f7 = new Framework7(app.config.f7_config);
            app.view = app.f7.addView('.view-main', {
                dynamicNavbar: true
            });
        }
        if (app.config.dom7_enable) {
            app.dom7 = Dom7;
        }

        /**
         * переводит число в радианы
         */
        if (typeof(Number.prototype.toRadians) === "undefined") {
            Number.prototype.toRadians = function () {
                return this * Math.PI / 180;
            }
        }

        /**
         * Библиотека для работы с нативными функциями iOS и Android
         */
        if (app.config.JSAPI_enable) {
            app.JSAPI = JSAPI;
            app.log = function (log) {
                if (app.JSAPI.log) {
                    app.JSAPI.log(log);
                } else {
                    console.log.apply(console, arguments);
                }
            };
            app.JSAPI.keepScreenOn();
        }

        if (app.isiPad()) {
            app.dom7('body').addClass('ipad');
        }
        app.free = app.dom7('body').hasClass('app-free');


        app.f7.onPageInit('*', function (page) {
            app.ad();
        });

        app.f7.onPageInit('diary', function (page) {
            app.pageInitDiary(page);
        });

        app.f7.onPageInit('results', function (page) {
            app.pageInitResults(page);
        });

        app.f7.onPageInit('settings', function (page) {
            app.pageInitSettings(page);
        });

        app.f7.onPageBeforeAnimation('*', function (page) {
            if (page.name == 'index') {
                app.pageIndexReinit(page);
                app.ad();
            }
            if (page.name == 'speed') {
                app.speedPageSettingsUpdate();
            }
        });

        window.addEventListener('appCloseEvent', app.onhide);
        window.addEventListener('appMaximizeEvent', app.onrestore);



        app.loadingStart();


    },

    /**
     * метод вызывается при закрытии приложения
     */
    //TODO no JSAPI method
    ondestroy: function () {
    },

    /**
     * вызывается при сворачивании приложения
     * (при переходе в фоновый режим)
     */
    onhide: function () {
    },
    /**
     * - вызывается при восстановлении приложения
     * (если было скрыто)
     * - вызывается при запуске приложения
     */
    onrestore: function () {
    },

    log: null,
    warn: warn,
    /**
     * функция показа банера (в фри версии)
     * вызывается при инициализации каждой страницы TODO:!ПРОПИСАТЬ РЕКЛАМУ!
     * только для iOS
     */
    ad: function () {
        if (app.free && app.platform != 'android' && app.isProd) {
            if (app.adTime) {
                var now = new Date();
                if (now.getTime() > app.adTime.getTime() + 2 * 60 * 1000) {
                    app.JSAPI.showAd();
                    app.adTime = new Date();
                }
            } else {
                app.adTime = new Date();
            }
        }
    },

    translate: function () {
        var toTranslate = app.dom7('[data-translate]');
        var obj = null;
        for (var i = 0; i < toTranslate.length; i++) {
            obj = app.dom7(toTranslate[i]);
            obj.html(app.getStr(obj.dataset().translate));
        }
    },

    resizeNavbar: function () {
        app.f7.sizeNavbars('.view-main');
    },

    getLocalDB: function () {
        var db = localStorage.getItem("db");
        if (db == null) {
            db = "{}";
        }
        return JSON.parse(db);
    },

    setLocalDB: function (db) {
        localStorage.setItem("db", JSON.stringify(db));
    },

    openAnyPage: function () {
        app.ad();
    },

    pageIndexInit: function () {
        Vue.config.debug = true;
        //app.view.router.loadPage("settings.html");

       // var goal = new Goal(10, 80).save();

        app.vue = new Vue({
            el: 'body',
            data:{
                title:'Calorie Diary'
            }
        });
    },

    pageIndexReinit: function (page) {
    },

    pageInitDiary: function(){
        app.diary = new Vue({
            data:{
                date:'123',
                title:''
            },
            el: 'body',
            methods:{
                openDatePicker: function(){
                    this.$.diaryView.openDatePicker();
                }
            }
        });
    },

    loadingStart: function () {

        app.settingsLoad();
        app.settingsApply();

        if (!app.loadingDisabled) {
            /**
             * TODO: make real loading
             **/
            setTimeout(app.loadingFinish, app.loadingFakeTime);//fake loading
        } else {
            app.loadingFinish();
        }
    },

    loadingFinish: function () {

        if (app.loadingDisabled) {
            app.dom7(".loading-overlay").remove();
            app.pageIndexInit();
            return;
        }

        var overlay = app.dom7('.loading-overlay');
        overlay.css('transition-duration', app.loadingAnimationTime / 1000 + 's');
        overlay.css('opacity', 0);
        overlay.css('top', '-1000px');
        setTimeout(function () {
            app.dom7(".loading-overlay").remove();
        }, app.loadingAnimationTime);
        app.pageIndexInit();
    },

    GPSInit: function () {
        if (app.platform == 'android') {
            app.JSAPI.listenLocation(500, 0, 'network');
        } else {
            app.JSAPI.listenLocation(500, 0, 'gps');
        }
        window.addEventListener('locationChangedEvent', app.GPSListener);
        /*
         navigator.geolocation.watchPosition(function(position){
         app.GPSWatch(position.coords);
         });
         */

    },
    GPSListener: function () {
        app.GPSWatch(getBufferEventVar());
    },
    GPSWatch: function (position) {
    },
    GPSOn: function () {
        app.GPSInit();
    },
    GPSOff: function () {
        app.JSAPI.stopListenLocation();
        window.removeEventListener('locationChangedEvent', app.GPSListener);
    },
    /**
     * Вычисляет расстояние между двумя точками (в метрах)
     * @param coord1 - координаты 1 точки {longitude:0, latitude:0}
     * @param coord2 - координаты 2 точки {longitude:0, latitude:0}
     * @returns {number}
     * @constructor
     */
    GPSDistance: function (coord1, coord2) {

        if (coord1 == undefined && coord2 == undefined) return -1;

        var lat1 = coord1.latitude;
        var lat2 = coord2.latitude;
        var lon1 = coord1.longitude;
        var lon2 = coord2.longitude;

        var R = 6371000; // Earth radius in metres
        var f1 = lat1.toRadians();
        var f2 = lat2.toRadians();
        var df = (lat2 - lat1).toRadians();
        var dl = (lon2 - lon1).toRadians();

        var a = Math.sin(df / 2) * Math.sin(df / 2) +
            Math.cos(f1) * Math.cos(f2) *
            Math.sin(dl / 2) * Math.sin(dl / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c;
    },

    deviceMotionInit: function () {
        window.addEventListener('devicemotion', function (e) {
            app.calcDistanceByAcceleration(e.acceleration);
        }, true);
    },

    calcDistanceByAcceleration: function (acc1) {
        var dX, dY, dZ;
        var acc0 = app.motionAccelerationOld;
        var dist;

        dX = Math.abs(acc0.x - acc1.x);
        dY = Math.abs(acc0.y - acc1.y);
        dZ = Math.abs(acc0.z - acc1.z);

        dist = Math.sqrt(dX * dX + dY * dY + dZ * dZ);

        app.motionAccelerationOld = acc1;

        if (dist < 1) return;

        app.distanceAcc += dist;
        app.updateSensors();
        app.increaseTotalCount(dist);
    },

    accelerometerInit: function () {
        if (window.DeviceOrientationEvent) {
            window.addEventListener('deviceorientation', app.accelerometerWatch, false);
        }
    },
    accelerometerWatch: function (rotation) {
    },
    /**
     * функция вызывается при первом запуске приложения на устройстве
     **/
    firstLaunch: function () {

    },

    settingsLoad: function () {
        var db = app.getLocalDB();
        var settings = db.settings || app.settingsDefault;
        if (!settings.notFirstLaunch || settings.notFirstLaunch == undefined) {
            app.firstLaunch();
            settings.notFirstLaunch = true;
        }
        app.settings = settings;
        app.settingsSave();
    },
    settingsSave: function () {
        var db = app.getLocalDB();
        db.settings = app.settings;
        app.setLocalDB(db);
    },
    settingsSet: function (param, value) {
        app.settings[param] = value;
        app.settingsSave();
    },
    settingsApply: function () {

    },

    indexOfKey: function (arr, search) {
        var i = 0;
        for (var key in arr) {
            if (key == search)
                return i;
            i++;
        }
        return -1;
    },
    indexOfVal: function (arr, search) {
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] == search)
                return i;
        }
        return -1;
    },

    isiPad: function () {
        return navigator.userAgent.match(/(iPad).*OS\s([\d_]+)/) != null;
    },

    isiOS: function () {
        return navigator.userAgent.match(/(iP).*OS\s([\d_]+)/) != null;
    },

    alert: function (text) {
        app.f7.alert(text, app.meta.title);
    }
};

document.addEventListener('DOMContentLoaded', app.init);

window.app = app;

app.profile = profile;
app.profile.load();
app.notes = notes;
app.notes.Load();