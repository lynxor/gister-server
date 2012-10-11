var ObjectID = require('mongodb').ObjectID,
    _ = require("underscore"),
    async = require("async");

var ScriptProvider = function (db) {

    db.script.createIndex({url: 1, command: 1}, {unique: true, dropDups: true}, function(err, docs){
        if (err) {
            console.log("Could not create indexes - " + err);
        } else {
            console.log("Created index on url successfully");
        }
    });

//    db.script.createIndex({command: 1}, {unique: true, dropDups: true}, function(err, docs){
//        if (err) {
//            console.log("Could not create index for command - " + err);
//        } else {
//            console.log("Created index on command successfully");
//        }
//    });

    return {
        retrieveAll:function (callback) {
            db.script.find(callback);
        },
        retrieveById:function (id, callback) {
            db.script.findOne({_id:new ObjectID(id)}, callback);
        },
        retrieveByCommand: function(command, callback){
          db.script.findOne({command: command}, callback);
        },
        insert:function (script, callback) {
            db.script.insert(script, callback);
        },
        update:function (scriptId, script, callback) {
            db.script.update({_id: new ObjectID(scriptId)}, {$set:script}, callback);
        },
        search : function(keyword, callback){
          var regex = new RegExp(".*"+keyword.split(/\s/).join(".*") + ".*", "i"),
              query = {$or: [{title: regex}, {description: regex}, {tags: regex}]};

            db.script.find(query, callback);
        },
        remove:function (query, callback) {
            db.script.remove(query, callback);
        },
        emptyscript:function () {
            return {url:"", command: "", title:"", description:"", exec: "bash $SCRIPT $@", tags: []};
        }
    };
};

exports.ScriptProvider = ScriptProvider;