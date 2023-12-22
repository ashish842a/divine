const mongoose = require("mongoose");
// mongoose.connect("mongodb://localhost/addfood");

const maincourseSchema = mongoose.Schema({
    type:String,
    name:String,
    details:String,
    price:Number,
    addfoodPic:{
      type:String
    }
  });

  const staterSchema = mongoose.Schema({
    type:String,
    name:String,
    details:String,
    price:Number,
    addfoodPic:{
      type:String
    }
  });


  const dessertSchema = mongoose.Schema({
    type:String,
    name:String,
    details:String,
    price:Number,
    addfoodPic:{
      type:String
    }
  });


  const maincourseModel = mongoose.model("maincourse",maincourseSchema)
  const StarterModel = mongoose.model("starter",staterSchema)
  const dessertModel = mongoose.model("dessert",dessertSchema)


  module.exports = {maincourseModel,StarterModel,dessertModel}
