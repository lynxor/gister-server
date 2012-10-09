var _ = require("underscore");

exports.on = function (db, providers) {
    function fixTags(tagString) {
        if(!tagString){
            return [];
        }
        else if(_.isArray(tagString)){
            return tagString;
        }
        return _.map(tagString.split(","), function (tag) {
            return tag.trim();
        });
    }

    var scriptProvider = providers.scriptProvider,
        showAll = function (req, res) {
            db.script.find({}, function (err, docs) {
                res.render("scripts/list.jade", {scripts:docs});
            });
        },
        jsonList = function (req, res) {
            db.script.find({}, function (err, docs) {
                res.json({scripts:docs});
            });
        },
        search = function (req, res) {
            scriptProvider.search(req.params.keyword, function (err, docs) {
                res.render("scripts/list.jade", {scripts: docs})
            });
        },
        searchJson = function (req, res) {
            scriptProvider.search(req.params.keyword, function (err, docs) {
                res.json({scripts:docs});
            });
        },
        view = function (req, res) {
            scriptProvider.retrieveById(req.params.scriptId, function (err, script) {
                res.render("scripts/view.jade", {script:script});
            });
        },
        jsonScript = function (req, res) {
            scriptProvider.retrieveById(req.params.scriptId, function (err, script) {
                res.json({script:script});
            });
        },
        add = function (req, res) {
            res.render("scripts/add.jade", {script:scriptProvider.emptyscript()});
        },
        save = function (req, res) {
            var script = req.body.script;
            script.tags = fixTags(script.tags);
            scriptProvider.update(req.params.scriptId, script, function (err, docs) {
                if (!err) {
                    req.flash("info", "Success");
                } else {
                    req.flash("error", "Could not save");
                }
                view(req, res);
            });
        },
        saveNew = function (req, res) {
            var script = req.body.script;
            script.tags = fixTags(script.tags);
            scriptProvider.insert(script, function (err, docs) {
                if (!err) {
                    req.flash("info", "Success");
                    req.params.scriptId = docs[0]._id.toString();
                    view(req, res);
                } else {
                    req.flash("error", "Could not save - " + err);
                    res.redirect('/scripts/all');
                }
            });
        };

    return function (router) {
        router.get("/", function (req, res) {
            res.redirect("/scripts/all");
        });
        router.get("/scripts/all", showAll);
        router.get("/scripts/search/:keyword", search);
        router.get("/scripts/search/json/:keyword", searchJson);
        router.get("/scripts/json", jsonList);
        router.get("/script/new", add);
        router.get("/script/:scriptId", view);
        router.get("/script/json/:scriptId", jsonScript);
        router.post("/script/new", saveNew);
        router.post("/script/save/:scriptId", save);
    };
};
