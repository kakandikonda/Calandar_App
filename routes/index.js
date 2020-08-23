var express = require("express");
var router = express.Router();
var passport = require("passport");

var User = require("../models/user.js");
var Events = require("../models/events");
const {
	all
} = require("./events.js");


router.get("/", isLoggedIn, function (req, res) {
	Events.find({}, function (err, allEvents) {
		if (err) {
			console.log("SOMETHING WENT WRONG");
			res.render("404.ejs")
		} else {
			res.render("events/index", {
				events: allEvents
			});
		}
	});
});

// SIGN UP
router.get("/signUp", function (req, res) {
	res.render("signUp");
});

router.post("/signUp", function (req, res) {
	var newUser = new User({
		username: req.body.username
	});
	User.register(newUser, req.body.password, function (err, user) {
		if (err) {
			console.log(err);
			return res.render("signUp");
		} else {
			passport.authenticate("local")(req, res, function () {
				res.redirect("/");
			});
		}

	});
});

// LOGIN
router.get("/login", function (req, res) {
	res.render("login");
});

// handling login logic
router.post("/login", passport.authenticate("local", {
	successRedirect: "/",
	failureRedirect: "/login"
}), function (req, res) {

});

// logout rout
router.get("/logout", function (req, res) {
	req.logout();
	res.redirect("/");
});

// middleware
function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	} else {
		res.redirect("/login");
	}
}

function isUpToDate() {
	var today = new Date();
	var currentMonth = today.getMonth() + 1;
	var currentYear = today.getFullYear();

	var date = currentYear + "-" + (currentMonth + 1) + "-" + today.getDate();

	Events.find({}, function (err, allEvents) {
		if (err) {
			console.log(err);
		} else {
			allEvents.forEach(function (event) {
				// var test = event.edate.substring(5, 7) + "-" +  event.edate.substring(8, 10) + "-" + event.edate.substring(0, 4);
				// console.log(test);
				// var test = event.stime;
				// console.log(test);
				// console.log(typeof test);
				var time = event.stime.substring(0, 2) + event.stime.substring(3, 5);
				console.log(time);
				console.log(typeof time);
				time = parseInt(time, 10);
				console.log(typeof time);

				var newTime;
				if (time == 1200) {
					newTime = "12:00 PM"
				} else if (time == 2400) {
					newTime = "12:00 AM"
				} else if (time > 1200) {
					time = time - 1200;
					if (time >= 1000) {
						time = time.toString();
						console.log(time);
						console.log(typeof time);
						time = time.substring(0, 2) + ":" + time.substring(2, 5);
						newTime = time + " PM"
					} else {
						time = time.toString();
						console.log(time);
						console.log(typeof time);
						time = time.substring(0, 1) + ":" + time.substring(1, 5);
						newTime = time + " PM"
					}

				} else if (time >= 1000) {
					time = time.toString();
					console.log(time);
					console.log(typeof time);
					time = time.substring(0, 2) + ":" + time.substring(2, 5);
					newTime = time + " AM"
				} else {
					time = time.toString();
					console.log(time);
					console.log(typeof time);
					time = time.substring(0, 1) + ":" + time.substring(1, 5);
					newTime = time + " AM"
				}
				console.log(newTime);
				console.log("");
				// if(event.edate > date){
				// 	console.log("works");
				// }
				// else{
				// 	console.log(typeof event.edate);
				// 	console.log(typeof date);
				// }
			});
		}

	});
}

function convertTime(time) {
	var newTime;

	time = parseInt(time, 10);

	if (time == 1200) {
		newTime = "12:00 PM"
	} else if (time == 2400) {
		newTime = "12:00 AM"
	} else if (time > 1200) {
		time = time - 1200;
		if (time >= 1000) {
			time = time.toString();
			time = time.substring(0, 2) + ":" + time.substring(2, 5);
			newTime = time + " PM"
		} else {
			time = time.toString();

			time = time.substring(0, 1) + ":" + time.substring(1, 5);
			newTime = time + " PM"
		}

	} else if (time >= 1000) {
		time = time.toString();
		time = time.substring(0, 2) + ":" + time.substring(2, 5);
		newTime = time + " AM"
	} else {
		time = time.toString();
		time = time.substring(0, 1) + ":" + time.substring(1, 5);
		newTime = time + " AM"
	}
	return newTime;
}


module.exports = router