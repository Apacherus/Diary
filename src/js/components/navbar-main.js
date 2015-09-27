/**
 * Created by Vladimir Kudryavtsev on 27.09.2015.
 * (c) V.K. ozver@live.ru
 */

Vue.component('navbar-main', {
    props:{
        title:{
            type:Object,
            default:function(){
                return{
                    index:'',
                    diary:'Diary',
                    profile:'Profile'
                };
            }
        }
    },
    template:`
    <div class="navbar">
        <div class="navbar-inner" v-el="index" data-page="index">
            <div class="left">
                <a href="#" v-on="click : $parent.$.mainMenu.toggle()" v-el="left">
                    <i class="icon icon-menu"></i>
                </a>
            </div>
            <div class="center sliding" v-el="center">{{title.index}}</div>
            <div class="right">
                <a href="#" v-el="right">
                    <i class="icon icon-share"></i>
                </a>
            </div>
        </div>

        <div class="navbar-inner cached" data-page="diary" v-el="diary">
            <div class="left">
                <a href="#" v-on="click : loadPage('index')">
                    <i class="icon icon-back"></i>
                </a>
            </div>
            <div class="center sliding">{{title.diary}}</div>
            <div class="right">
                <a href="#" v-on="click:$parent.$.diaryView.calendarOpened = !$parent.$.diaryView.calendarOpened">
                    <i class="icon icon-calendar"></i>
                </a>
            </div>
        </div>

        <div class="navbar-inner cached" data-page="profile" v-el="profile">
            <div class="left">
                <a href="#" v-on="click : loadPage('index')">
                    <i class="icon icon-back"></i>
                </a>
            </div>
            <div class="center sliding">{{title.profile}}</div>
            <div class="right">
                <a href="#">
                    <i class="icon icon-calendar"></i>
                </a>
            </div>
        </div>

    </div>
    `,
    methods: {
        loadPage: function(page = 'index'){
            app.view.router.load({pageName: page});
        }
    }
});