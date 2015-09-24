import storage from './storage';
import profile from './components/profile';

var notes = {
    data:[],
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
            //var json = JSON.stringify(this);



            var db = profile.db;
            if(!db.notes) {
                db.notes = [];
            }
            db.notes.push(this);



            switch(this.type){
                case 'measure':

                    var lastMeasure =
                        profile.db.lastMeasure && profile.db.lastMeasure.weight>0?
                        {
                            weight:profile.db.lastMeasure.weight,
                            height:profile.db.lastMeasure.height,
                            weightDiff:profile.db.lastMeasure.weightDiff
                        }
                            :
                        {
                            weight:0,
                            height:0,
                            weightDiff:0
                        };

                    profile.db.lastMeasure = {
                        weight: this.weight,
                        height: this.height,
                        weightDiff: lastMeasure.weight || 0 - this.weight || 0 //TODO weight different
                    };
                    break;
            }


            profile.save();

            app.em.event("notesStoreChanged");
        };

    },

    WriteNote : function(text, date){
        if(!text || !text.length) return false;
        var options = {};
        options.type = 'note';
        options.date = typeof date == "undefined" ? '' : date;
        options.isGone = false;
        options.notify = true;
        options.created = new Date();
        options.text = text;
        return new notes.Note(options);
    },

    EatNote : function (products, title = null, date = undefined) {
        if (typeof products == "undefined" || !products) products = [];
        if (!title) title = '';
        var options = {};
        options.type = 'eat';
        options.date = (typeof date == "undefined" || !date) ? '' : date;
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
        options.type = 'measure';

        return new notes.Note(options);
    },

    Load : function(){

        var toString = function () {
            return this.getTime();
        };

        var db = profile.db;
        if(!db.notes){
            db.notes = [];
        }
        for(var i = 0; i < db.notes.length; i++){
            db.notes[i].date = new Date(db.notes[i].date);
            db.notes[i].date.toJSON = toString;
            db.notes[i].created = new Date(db.notes[i].created);
            db.notes[i].created.toJSON = toString;
        }

        this.data = db.notes;

        return db.notes;
    },

    last: function(type = 'eat'){
        for(var i = this.data.length-1; i>=0; i--){
            if(this.data[i].type == type){
                return this.data[i];
            }
        }

        return null;
    },

    /**
     * возвращает записи соответствующие дате date
     * по умолчанию date = today
     * @param date
     * @param type
     */
    forDate: function(date = new Date, type = null){
        var n = [];

        if(arguments[0]){
            date = new Date(date);
        }
        for (var i = 0; i < this.data.length; i++) {
            var noteDate = this.data[i].date;
            if (
                noteDate.getDate() == date.getDate() &&
                noteDate.getMonth() == date.getMonth() &&
                noteDate.getFullYear() == date.getFullYear() &&
                (type != null?this.data[i].type == type:true)
            ) {
                n.push(this.data[i]);
            }
        }
        return n;
    },

    /**
     * возвращает записи после даты date с типом 'eat'
     * @param date
     * @param type
     * @returns {Array}
     */
    afterDate: function (date = new Date, type = 'eat') {
        var n = [];
        for (var i = 0; i < this.data.length; i++) {
            if (this.data[i].date > date && this.data[i].type == 'eat') {
                n.push(this.data[i]);
            }
        }
        return n;
    },

    betweenDates: function(date0 = new Date, date1 = new Date, type = 'eat'){
        var n = [];

        for(var i = 0; i < this.data.length; i++){
            var date = this.data[i].date;
            if(date >= date0 && date <= date1 && this.data[i].type == type){
                n.push(this.data[i]);
            }
        }

        return n;
    }

};

export default notes;