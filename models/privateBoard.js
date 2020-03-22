const mongoose = require("mongoose");
const List = require("./list")
let privateBoardSchema = new mongoose.Schema({
    creator:{
        type:String,      
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

