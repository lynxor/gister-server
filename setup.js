var _ = require("underscore"),
    mongojs = require("mongojs"),
    UserProvider = require("./js/db/user_provider.js").UserProvider,
    dbCollections = ["user"],
    moment = require("moment"),
    async = require("async"),
    options = {
        dbUrl:"localhost:27017/gister",
        dbCollections:dbCollections,
        roles:["supervisor", "admin"]
    },
    db = mongojs.connect(options.dbUrl, options.dbCollections),
    userProvider = new UserProvider(db),
    synchelper = require("./js/synchelper.js");


synchelper.waitForAll(
    function (callback) {
        console.log("dropping db..");
        db.dropDatabase(callback);
    },
    function (callback) {
        console.log("starting with users ... ");
        userProvider.insertBulk([
            {email:"admin", role:{name:"admin"}, password:"p"},
            {email:"client", role:{name:"client"}, password:"p", firstname:"Client", lastname:"Man"}
        ], callback);
    }

)(function () {
    console.log("Done");
    process.exit(0);
});

