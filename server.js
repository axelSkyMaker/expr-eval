var express = require('express');
var app = express();


app.get("/bundle.js", function(req,res){
    console.log(req);
    res.sendfile(__dirname + "/dist/bundle.js");
});
app.use("/node_modules", express.static(__dirname + "/node_modules"));
app.use("/test" , express.static(__dirname + "/visual_tests"));
var port = 3000;
app.listen(port, function(){
    console.log("listening on port " + port);
});