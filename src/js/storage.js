var storage = {
    getDB: function (path = "db") {
        var db = localStorage.getItem(path);
        if (db == null) {
            db = "{}";
        }
        return JSON.parse(db);
    },

    setDB: function (db, path = "db") {
        localStorage.setItem(path, JSON.stringify(db));
        app.em.event('storageChanged');
    }
};

export default storage;