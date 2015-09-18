/**
 * Created by Vladimir Kudryavtsev on 17.09.15.
 * Copyright © Academ Media, LTD
 * Copyright © Vladimir Kudryavtsev
 */

import storage from '../storage';
import settings from '../settings';


//get current profile
var db = storage.getDB();

var dbPath = "dbProfile_"+(db.currentProfile || '0');

var _profile = {
    notes:null,
    db:null,
    create: function(_db = {}){
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
                date:new Date(),
                days:0,
                weight:0
            };
        } else {
            _db.goal.date = new Date(_db.goal.date);
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

        dbActual.currentProfile = _db.id;

        dbPath = "dbProfile_"+_db.id;

        this.db = _db;

        this.save();

        /**
         * TODO: merge db and dbActual
         */
        storage.setDB(dbActual);
        db = dbActual;

        return _db;
    },

    load: function(id = null){
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
    }
};

_profile.load();

export default _profile;