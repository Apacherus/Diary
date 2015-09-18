import storage from './storage';

var settings = {
    load: function () {
        var db = storage.get();
        var settings = db.settings || app.settingsDefault;
        if (!settings.notFirstLaunch || settings.notFirstLaunch == undefined) {
            app.firstLaunch();
            settings.notFirstLaunch = true;
        }
        app.settings = settings;
        //settings.settingsSave();
    },
    save: function () {
        var db = storage.get();
        db.settings = app.settings;
        storage.set(db);
    },
    set: function (param, value) {
        app.settings[param] = value;
        settings.settingsSave();
    }
};

export default settings;