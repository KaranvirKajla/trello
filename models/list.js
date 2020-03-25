const mongoose = require("mongoose");
const Board = require("./board")
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

