var mongojs = require('mongojs'),
    UserProvider = require("./db/user_provider.js").UserProvider;


module.exports = function (options, callback) {
    var database = mongojs.connect(options.dbUrl, ["user"]);

    if (database) {
        var providers = {

            userProvider:new UserProvider(database)

        };
        callback(null, database, providers);
    } else {
        callback(new Error("Cannot connect to database"));
    }
};
