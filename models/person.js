const mongoose = require("mongoose");
const Board = require("./board")
const Team = require("./team")
let personSchema = new mongoose.Schema({
    login:{
        type:Boolean
    },
    email:{
        unique:true,
        type:String
    },
    name:{
        type: String,
        default:""
    },
    password:{
        type:String,
        default:""
    },
    boards:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Board"
    }],
    teams:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Team"
    }]
})

module.exports= mongoose.model("Person",personSchema);

