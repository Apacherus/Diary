/**
 * Created by Vladimir Kudryavtsev on 25.09.15.
 * Copyright © Academ Media, LLC
 * Copyright © Vladimir Kudryavtsev
 */

Vue.component('main-menu', {

    props:{
        profiles:{
            type:Array,
            default:function(){
                return [];
            }
        },
        active:{
            type:Number,
            default:2
        },
        profilesExpanded:{
            type:Boolean,
            default:false
        },
        profilesListHeight:{
            type:Number,
            default:0
        },

        isOpen:{
            type:Boolean,
            default:false
        },

        disableAddButtonShow: {
            type:Boolean,
            default:false
        }
    },

    methods:{
        expandProfiles: function(){
            this.profilesExpanded = !this.profilesExpanded;
            if(this.profilesExpanded){
                this.profilesListHeight = 0;
            } else {
                this.profilesListHeight = this.$$.profilesList.offsetHeight+3;
            }
        },

        updateProfilesListHeight: function(){
            this.profilesListHeight = this.$$.profilesList.offsetHeight+3;
            if(!this.isOpen) app.dom7('.panel').css('display', 'none');
        },

        profileSelect: function(index){
            for(var i = 0; i<this.profiles.length; i++){
                this.profiles[i].active = false;
            }
            this.profiles[index].active = true;
            this.active = index;

            app.profile.setActive(this.profiles[index].id);
        },

        updateProfileInfo: function(){
            this.active = app.profile.getActive();
            this.profiles = app.profile.getAll();

            if(!this.isOpen) app.dom7('.panel').css('display', 'block');
            setTimeout(this.updateProfilesListHeight, 500);
        },

        open: function(){
            app.f7.openPanel('left');
            this.isOpen = true;
            app.em.event('buttonAddHide');
        },

        close: function(){
            app.f7.closePanel();
            this.isOpen = false;
            if(!this.disableAddButtonShow) {
                app.em.event('buttonAddShow');
            } else {
                this.disableAddButtonShow = false;
            }
            if(this.profilesExpanded){
                this.expandProfiles();
            }
        },

        toggle: function(){
            if(this.isOpen){
                this.close();
            } else {
                this.open();
            }
        },

        newProfile(){
            this.disableAddButtonShow = true;
            app.vue.$.pageProfile.newProfile();
        }
    },

    ready:function(){

        this.updateProfileInfo();
        app.dom7('.panel-left').on('close', this.close);
        app.dom7('.panel-left').on('open', this.open);

        app.em.listen('appProfileSaved', this.updateProfileInfo);

    },

    template:`
<div class="panel-overlay"></div>

<div class="menu-main panel panel-left panel-reveal">
        <div class="menu-profiles">
            <div class="profile-selected" v-on="click : expandProfiles">
                <div class="profile">
                    <div class="profile-image">
                        <img v-attr="src:'./img/'+profiles[active].img"/>
                    </div>
                    <div class="profile-text">
                        {{profiles[active].name}}
                        <div class="profile-diet">My favorite diet</div>
                    </div>
                    <div class="profile-triangle" v-class="expanded : profilesExpanded">

                    </div>
                </div>
            </div>

            <div class="profiles-list" v-el="profilesList" v-class="expanded : profilesExpanded">
                <div class="profile" v-repeat="profiles" v-show="!active" v-on="click: profileSelect($index)">
                    <div class="profile-image">
                        <img v-attr="src:'./img/'+img"/>
                    </div>
                    <div class="profile-text">
                        {{name}}{{id}}
                        <div class="profile-diet">My favorite diet</div>
                    </div>
                </div>
                <div>
                    <a href="#" class="close-panel" v-on="click:newProfile()">Add new profile</a>
                </div>
            </div>

        </div>

    `+`
    <div class="list-block menu-main" v-class="expanded : !profilesExpanded" >
                <ul style="transform: translateY(-{{profilesListHeight}}px);" >
                    <li>
                        <a href="#index" class="item-link item-content close-panel">
                            <div class="item-inner">
                                <div class="item-title">Home</div>
                                <div class="item-after"></div>
                            </div>
                        </a>
                    </li>
                    <li>
                        <a href="#diary" class="item-link item-content close-panel">
                            <div class="item-inner">
                                <div class="item-title">Diary</div>
                                <div class="item-after"></div>
                            </div>
                        </a>
                    </li>
                    <li>
                        <a href="#" class="item-link item-content close-panel">
                            <div class="item-inner">
                                <div class="item-title">Statistics</div>
                                <div class="item-after"></div>
                            </div>
                        </a>
                    </li>
                    <li>
                        <a href="#" class="item-link item-content close-panel">
                            <div class="item-inner">
                                <div class="item-title">Diets</div>
                                <div class="item-after"></div>
                            </div>
                        </a>
                    </li>
                    <li>
                        <a href="#" class="item-link item-content close-panel">
                            <div class="item-inner">
                                <div class="item-title">Products List</div>
                                <div class="item-after"></div>
                            </div>
                        </a>
                    </li>
                    <li>
                        <a href="#" class="item-link item-content close-panel">
                            <div class="item-inner">
                                <div class="item-title">Personal Data</div>
                                <div class="item-after"></div>
                            </div>
                        </a>
                    </li>
                    <li>
                        <a href="#" class="item-link item-content close-panel">
                            <div class="item-inner">
                                <div class="item-title">Settings</div>
                                <div class="item-after"></div>
                            </div>
                        </a>
                    </li>
                </ul>
        </div>
    </div>
    `

});