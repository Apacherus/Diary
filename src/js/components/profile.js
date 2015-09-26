/**
 * Created by Vladimir Kudryavtsev on 17.09.15.
 * Copyright © Academ Media, LTD
 * Copyright © Vladimir Kudryavtsev
 */

import storage from '../storage';
import settings from '../settings';


//get current profile
var db = null;//storage.getDB();

var dbPath = null;//"dbProfile_"+(db.currentProfile || '0');

var _profile = {
    notes:null,
    db:null,
    create: function(_db = {}, justReturn = false){
        //update db for get last changes (e.g. delete profiles and etc.)
        var dbActual = storage.getDB();

        /**
         * Fill default fields
         **/
        if(!_db.settings) {
            _db.settings = {};
        }

        if(!_db.notes) {
            _db.notes = [];
        }

        if(!_db.lastMeasure){
            _db.lastMeasure = {
                weight:null,
                height:null,
                weightDiff:null
            };
        }

        if(!_db.diet){
            _db.diet = null;
        }

        if(!_db.goal){
            _db.goal = {
                date:new Date,
                days:0,
                weight:0,
                startWeight:0
            };
        } else {
            _db.goal.date = new Date(_db.goal.date);
        }

        if(!_db.img){
            _db.img = 'userpic.png';
        }

        if(!_db.name){
            _db.name = '';
        }


        /**
         * Just return profile object, not save to localStorage
         */
        if(justReturn){
            return _db;
        }

        /**
         * I save profile ID in main DB as array of ID's (also i save currentProfile)
         */
        if(typeof _db.id == "undefined"){
            _db.id = 0;
            if(dbActual.profiles && dbActual.profiles.length){
                _db.id = dbActual.profiles.length;
                dbActual.profiles.push(_db.id);
            } else {
                dbActual.profiles = [0];
            }
        }

        if("currentProfile" in dbActual && dbActual.currentProfile != _db.id){
            dbActual.currentProfile = _db.id;
            storage.setDB(dbActual);
        }

        dbPath = "dbProfile_"+_db.id;

        this.db = _db;


        this.save();


        db = dbActual;

        return _db;
    },

    load: function(id = null){

        db = storage.getDB();

        dbPath = "dbProfile_"+(db.currentProfile || '0');

        if(id !== null){
            dbPath = "dbProfile_"+id;
        }
        this.create(storage.getDB(dbPath));
    },
    save: function(){
        storage.setDB(this.db || {}, dbPath);
    },
    remove: function(id = null){
        if(id === null){
            id = this.db.id;
        }

        db = storage.getDB();
        if(!db.profiles) db.profiles = [];
        for(var i = 0; i < db.profiles.length; i++){
            if(db.profiles[i] == id){
                db.profiles.splice(i, 1);
            }
        }

        if(db.currentProfile == id){
            db.currentProfile = db.profiles[0];
        }

        storage.setDB(db);

        localStorage.removeItem("dbProfile_"+id);

        if(id == this.db.id){
            this.load(db.currentProfile);
        }

    },
    /**
     * Set profile settings param
     * @param param
     * @param value
     */
    set: function (param, value) {
        this.db.settings[param] = value;
        this.save();
    },

    getAll: function(){
        var profiles = [];
        var current = this.getActive();
        for(var i = 0; i < db.profiles.length; i++){
            profiles[i] = this.create(storage.getDB("dbProfile_"+db.profiles[i]), true);
            if(!("id" in profiles[i])){
                profiles[i].id = -1;
            }
            if(!("active" in profiles[i])){
                profiles[i].active = false;
            }
            if(profiles[i].id == current){
                profiles[i].active = true;
            }
        }
        return profiles;
    },

    getActive: function(){
        return db.currentProfile || 0;
    },

    setActive: function(id){
        db = storage.getDB();
        db.currentProfile = id;
        storage.setDB(db);
        app.em.event('profileActiveChanged');
    }
};

//_profile.load();

export default _profile;