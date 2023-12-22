const mongoose = require("mongoose")

const ContactInfo = mongoose.Schema({
    // userId:{
    //     type:mongoose.Schema.Types.ObjectId,
    //     ref:"customers"
    // },
    name:String,
    email:String,
    phone:Number,
    subject:String,
    message:String
})

module.exports = mongoose.model("contact",ContactInfo)