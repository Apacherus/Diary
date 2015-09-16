import storage from './storage';
var notes = {
    /**
     *
     * @param options = {type, isGone, created, date, type, title, text, notify, products, weight, height, water};
     * @returns {*}
     * @constructor
     */
    Note : function (options) {
        if (typeof options != "object") {
            options = {};
        }

        options.date = typeof options.date == "string" ? new Date(options.date) : ( !options.date ? new Date() : options.date );

        if (options.date == "Invalid Date") {
            options.date = new Date();
        }

        var toString = function () {
            return this.getTime();
        };

        /**
         * I store date in Unix Timestamp format
         */
        //options.date.toString = toString;

        options.date.toJSON = toString;

        if (!('created' in options)) {
            options.created = new Date();
        }

        /**
         * I store date in Unix Timestamp format
         */
        //options.created.toString = toString;

        options.created.toJSON = toString;

        for (var key in options) {
            this[key] = options[key];
        }

        if (!('isGone' in options)) {
            this.isGone = false;
        }

        if (!('type' in options)) {
            this.type = 'note';
        }

        if (!('title' in options) && this.type in {eat: 0, note: 0}) {
            this.title = '';
        }

        if (!('text' in options) && this.type == 'note') {
            this.text = '';
        }

        if (!('notify' in options)) {
            this.notify = true;
        }

        if (!('products' in options) && this.type == 'eat') {
            this.products = [];
        }

        if (!('weight' in options) && this.type == 'measure') {
            this.weight = -1;
        }

        if (!('height' in options) && this.type == 'measure') {
            this.height = -1;
        }

        if (!('water' in options) && this.type == 'water') {
            this.water = 0;
        }

        this.setGone = function (gone) {
            this.isGone = gone;
        };

        this.gone = function () {
            this.setGone(true);
        };

        this.toggleGone = function () {
            this.isGone = !this.isGone;
        };

        this.save = function(){
            var json = JSON.stringify(this);
            var db = storage.getDB();
            if(!db.notes) {
                db.notes = [];
            }

            db.notes.push(json);
            storage.setDB(db);
        };

    },

    EatNote : function (products, title, date) {
        if (typeof products == "undefined") products = [];
        if (!title) title = '';
        var options = {};
        options.type = 'eat';
        options.date = typeof date == "undefined" ? '' : date;
        options.isGone = false;
        options.notify = true;
        options.created = new Date();
        options.title = title;
        options.products = products;
        return new notes.Note(options);
    },

     WaterNote : function (volume, date) {
        if (!volume) volume = 0;
        var options = {};
        options.date = typeof date == "undefined" ? '' : date;
        options.type = 'water';
        options.volume = volume;

        return new notes.Note(options);
    },

     MeasureNote : function (weight, height, date) {
        if (!weight) weight = -1;
        if (!height) height = -1;
        var options = {};
        options.date = typeof date == "undefined" ? '' : date;
        options.height = height;
        options.weight = weight;

        return new notes.Note(options);
    },

    Load : function(){

        var toString = function () {
            return this.getTime();
        };

        var db = storage.getDB();
        if(db.notes){
            db.notes = db.notes.map(function(n){return JSON.parse(n);});
        } else {
            db.notes = [];
        }
        for(var i = 0; i < db.notes.length; i++){
            db.notes[i].date = new Date(db.notes[i].date);
            //db.notes[i].date.toString = toString;
            db.notes[i].date.toJSON = toString;
            db.notes[i].created = new Date(db.notes[i].created);
            //db.notes[i].created.toString = toString;
            db.notes[i].created.toJSON = toString;
        }
        return db.notes;
    }

};

export default notes;