var storage = {
    getDB: function () {
        var db = localStorage.getItem("db");
        if (db == null) {
            db = "{}";
        }
        return JSON.parse(db);
    },

    setDB: function (db) {
        localStorage.setItem("db", JSON.stringify(db));
    }
};

module.exports = storage;