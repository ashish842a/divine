const mongoose = require("mongoose")

const myCart = mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    },
    type:String,
    name:String,
    details:String,
    price:Number,
    addfoodPic:{
      type:String
    }

})

module.exports = mongoose.model("mycart",myCart)