var express = require("express");
var router = express.Router();
var Events = require("../models/events");

// new event
router.post("/new", isLoggedIn, function(req, res){
    var title = req.body.title;
    var description = req.body.description;
    var startDate = req.body.sdate; // yyyy-mm-dd
    var sdate = startDate.substring(5, 7) + "/" +  startDate.substring(8, 10) + "/" + startDate.substring(0, 4); // mm/dd/yyyy
    var endDate = req.body.edate;
    var edate = endDate.substring(5, 7) + "/" +  endDate.substring(8, 10) + "/" + endDate.substring(0, 4);
    
    var stime =  convertTime(req.body.stime);    
    var etime = convertTime(req.body.etime);
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newEvent = {title: title, description: description, sdate: sdate, edate: edate, stime: stime, etime: etime, author: author};
    Events.create(newEvent, function(err, newevent){
        if(err){
            res.render("404.ejs");
        }else{
            res.redirect("/");
        }
    });
});

// view a specific event
router.get("/:id", isLoggedIn, function(req, res){
    Events.findById(req.params.id).exec(function(err, foundEvent){
        if(err){
            console.log(err);
            res.render("404.ejs");
        }
        else{
            res.render("events/view", {event: foundEvent});
        }
    });
});

// update an event
router.post("/:id", isLoggedIn, function(req, res){
    var title = req.body.title;
    var description = req.body.description;

    var startDate = req.body.sdate; // yyyy-mm-dd
    var sdate = startDate.substring(5, 7) + "/" +  startDate.substring(8, 10) + "/" + startDate.substring(0, 4); // mm/dd/yyyy
    var endDate = req.body.edate;
    var edate = endDate.substring(5, 7) + "/" +  endDate.substring(8, 10) + "/" + endDate.substring(0, 4);

    var stime =  convertTime(req.body.stime);    
    var etime = convertTime(req.body.etime);
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var edit = {title: title, description: description, sdate: sdate, edate: edate, stime: stime, etime: etime, author: author};
    Events.findByIdAndUpdate(req.params.id, edit, function(err, editedEvent){
        if(err){
            console.log(err);
            res.render("404.ejs");
        }else{
            res.redirect("/event/" + req.params.id);
        }
    });
});

// delete an event
router.delete("/:id", isLoggedIn, function(req, res){
    // delete
    Events.findByIdAndDelete(req.params.id, function(err){
        if(err){
            console.log(err);
            res.render("404.ejs");
        }else{
            res.redirect("/")
        }
    });
});

function convertTime(time) {
	var newTime;
    time = time.substring(0, 2) + time.substring(3, 5);
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
// middleware
function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	else{
		res.redirect("/login");
	}
}

module.exports = router;