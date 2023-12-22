const mongoose = require("mongoose")
const plm = require("passport-local-mongoose");
mongoose.connect("mongodb://localhost/divine")

const userSchema = mongoose.Schema({
  key:{
    type:Number,
    default:0
  },
  name:String,
  username:String,
  phone:String,
  email:String,
  password:String,
  gender:String,
  profilePic:{
    type:String,
    default:"img.png"
  },
  otp:String,
  expireAt:String,
  orderId:String,
  cart:[
    {
    type: mongoose.Schema.Types.ObjectId,
    ref:"mycart"
    
  }],
  products:[
    {
    type:  mongoose.Schema.Types.ObjectId,
    ref:"mycart"
    }],
  orderDate:{
    type:Date,
  }
})

userSchema.plugin(plm)
module.exports = mongoose.model("customers",userSchema)