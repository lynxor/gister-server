var server = require("./js/server.js"),
    restrictedserver = require("./js/restrictedserver");

var instance;
if (process.argv[2]) {
    instance = process.argv[2];
    console.log("Using instance '" + instance + '"');
} else {
    console.log("Using DEFAULT instance");
    instance = "default-instance.js";
}

console.log("Starting DEVELOPMENT system");

server(require("./" + instance), function(s){
    s.listen();
});
