const mongoose = require("mongoose");
const PrivateBoard = require("./privateBoard")
const PublicBoard = require("./publicBoard")
const Card = require("./card")
let listSchema = new mongoose.Schema({
    title: {
        type: String
    },
    cards:[{
        type:mongoose.Schema.Types.ObjectId,
        ref: "Card",
    }]
})

module.exports= mongoose.model("List",listSchema);

