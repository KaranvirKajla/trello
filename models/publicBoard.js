const mongoose = require("mongoose");
let publicBoardSchema = new mongoose.Schema({
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

module.exports= mongoose.model("PublicBoard",publicBoardSchema);

