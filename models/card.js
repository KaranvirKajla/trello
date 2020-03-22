const mongoose = require("mongoose");
const PrivateBoard = require("./privateBoard")
const PublicBoard = require("./publicBoard")
let cardSchema = new mongoose.Schema({
    title: {
        type: String
    },
})

module.exports= mongoose.model("Card",cardSchema);

