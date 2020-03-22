const mongoose = require("mongoose");
const PrivateBoard = require("./privateBoard");
const PublicBoard = require("./publicBoard");
const Comment = require("./comment");
let cardSchema = new mongoose.Schema({
    title: {
        type: String
    },
    description:{
        type:String,
        default:""
    },
    comments:[{
        type:mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    }]
})

module.exports= mongoose.model("Card",cardSchema);

