var mongoose = require("mongoose");

var eventSchema = new mongoose.Schema({
    title: String,
    description: String,
    stime: String,
    etime: String,
    sdate: String,
    edate: String,
    author: {
        id: {
           type: mongoose.Schema.Types.ObjectId,
           ref: "User"
        },
        username: String
     }
});

module.exports = mongoose.model("Event", eventSchema);