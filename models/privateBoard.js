const mongoose = require("mongoose");
const List = require("./list")
let privateBoardSchema = new mongoose.Schema({
    creator:{
        type:String,      
    },
    background:{
        type:String,
        default:"https://www.elsetge.cat/myimg/f/40-407067_solid-colour-wallpapers.jpg"
    },
    description:{
        type:String,
        default:"Board Description"
    },
    name:{
        type: String,
        default:""
    },
    lists:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:"List"
    }]
})

module.exports= mongoose.model("PrivateBoard",privateBoardSchema);

