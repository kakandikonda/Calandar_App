var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var passport = require("passport");
var LocalStrategy = require("passport-local");

// MODELS
var Events = require("./models/events.js");
var User = require("./models/user.js");

// ROUTES
var indexRoutes = require("./routes/index.js");
var eventRoutes = require("./routes/events");

mongoose.connect("mongodb://localhost/calender_app");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/assets"));

// PASSPORT CONFIGURATION
app.use(require("express-session")({
	secret: "this is the secret",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	next();
});

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());




app.use(indexRoutes);
app.use("/event", eventRoutes);



var port = 3000;

app.listen(port, function(){
    console.log("SERVER IS RNNING ON PORT: " + port);
});