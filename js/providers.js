var mongojs = require('mongojs'),
    UserProvider = require("./db/user_provider.js").UserProvider,
    ScriptProvider = require("./db/script_provider.js").ScriptProvider;


module.exports = function (options, callback) {
    var database = mongojs.connect(options.dbUrl, ["user", "script"]);

    if (database) {
        var providers = {

            userProvider:new UserProvider(database),
            scriptProvider: new ScriptProvider(database)

        };
        callback(null, database, providers);
    } else {
        callback(new Error("Cannot connect to database"));
    }
};
