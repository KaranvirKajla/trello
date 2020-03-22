const mongoose = require("mongoose");
const PrivateBoard = require("./privateBoard")
const PublicBoard = require("./publicBoard")
let commentSchema = new mongoose.Schema({
    creator:{
        type:String
    },
    date:{
        type:String,
        default: new Date().toLocaleTimeString()+"  "+new Date().toLocaleDateString()
    },
    desc:{
        type:String
    }
})

module.exports= mongoose.model("Comment",commentSchema);

