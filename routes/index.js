var express = require('express');
var router = express.Router();
const passport = require("passport")
const localStrategy = require("passport-local");
const userModel = require("./users")
const contact = require("./contact");
const {maincourseModel,StarterModel,dessertModel} = require("./food")
const multer = require("multer");
const sendMail = require("./nodemailer")
const mycartModel = require("./mycart")

const Razorpay = require("razorpay")
var instance = new Razorpay({
  key_id: 'rzp_test_3Fh6w7NAj2Tfzj',
  key_secret: 'mOv4uU32YhNq0h6M3gnfiqP8',
});

let tempotp=28364;

// nodemailer
const nodemailer = require("nodemailer");
const googleApis = require("googleapis");
const { use } = require('../app');

const REDIRECT_URL = `https://developers.google.com/oauthplayground`;
const CLIENT_ID = `944587520626-iqno53pt4h8l1mfq1h5d9i6gemhu5164.apps.googleusercontent.com`;
const CLIENT_SECRET =`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`;
const REFRESH_TOKEN =`1//04qTZq4EGo5IeCgYIARAAGAQSNwF-L9Irz-FavX6oXew857QoWcbhVAlsx8WYCh7eCczchCCGhiNwE3JcZBwD_jqpTmNVocJc98w`;

const authClient = new googleApis.google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET,REDIRECT_URL);
  authClient.setCredentials({refresh_token: REFRESH_TOKEN});
  


// multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/images/uploads");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now()  + Math.round(Math.random() * 1E9)+".jpg"
    cb(null, file.fieldname + '-' + uniqueSuffix)
  }
})

const upload = multer({ storage: storage })

passport.use(new localStrategy(userModel.authenticate()))

// check username while registering
router.get("/check/:username",async function(req,res){
  let userData =await userModel.findOne({username:req.params.username})
  res.json({userData})
  // console.log(userData);
});

/* GET home page. */
// const login={};
router.get('/',function(req,res) {
  const loginUser =null;
  res.render('index',{user:loginUser}); 
});

// profile
router.get('/profile',isLoggedIn,async function(req,res) {

  const loginUser =await userModel.findOne({username:req.session.passport.user})

  // console.log(loginUser);
 
  res.render('index',{user:loginUser});  
});

// register post
router.post("/register",function(req,res){
  const userData = new userModel({
    username:req.body.username,
    name:req.body.name,
    gender:req.body.gender,
    phone:req.body.phone,
    email:req.body.email,
  })
  
  const user =userModel.register(userData,req.body.password)
  .then(function(registeredUser){
    console.log(registeredUser);
    passport.authenticate("local")(req,res,function(){ 
      res.redirect("/profile"); 
    })
  })
})
// register get
router.get("/register",function(req,res){
  res.render("register")
})


// login post
router.post("/login",passport.authenticate("local",{
  successRedirect:"/profile",
  failureRedirect:"/login",
}),function(req,res){})

// login get
router.get("/login",function(req,res){
  res.render("login")
})
// logout
router.get("/logout",function(req,res){
  req.logout(function(err){
    if (err) throw err;
    res.redirect('/login')
  })
})
// admin logout
router.get("/logout",isAdmin,function(req,res){
  req.logout(function(err){
    if (err) throw err;
    res.redirect('/adminlogin')
  })
})
// dashboard
router.get("/dashboard",isLoggedIn,async function(req,res){
  // let logginInUser = await userModel.findOne({username:req.session.passport.user})
  // .populate({
  //   path:"products",
  //   populate:{
  //     path:"userId"
  //   }
  // })
  let user = await userModel.findOne({username:req.session.passport.user})
 
  res.render("dashboard-profile",{user:user})
})
// /dashboard-order
router.get("/dashboard-order",isLoggedIn,async function(req,res){
  // let logginInUser = await userModel.findOne({username:req.session.passport.user}).
  let logginInUser = await userModel.findOne({username:req.session.passport.user})
  .populate({
    path:"products",
    populate:{
      path:"userId"
    }
  })
  console.log(logginInUser.products);
  res.render("dashboard-order",{product:logginInUser.products})
})
// contact page
router.get("/contact",function(req,res){
  res.render("contact")
})
// menu 
router.get("/menu",async function(req,res){
  // const maincourseDish =await maincourseModel.find()
  // console.log(maincourseDish);
  // res.render("menu",{dish:maincourseDish})

  const Viewfood =await StarterModel.find();
  const Viewmaincourse =await maincourseModel.find();
  const Viewdessert =await dessertModel.find();
  res.render("menu",{viewfood:Viewfood,viewmaincourse:Viewmaincourse,viewdessert:Viewdessert}); 
})
// about
router.get("/about",function(req,res){
  res.render("about")
})


// /form - contact
router.post("/form",async function(req,res){
  const query =await contact.create({
    name:req.body.name,
    email:req.body.email,
    phone:req.body.phone,
    subject:req.body.subject,
    message:req.body.message
  })
  // alert("send successfully")
  res.redirect("/contact")
})
// admin profile
router.get("/adminProfile",isAdmin,function(req,res){
  res.render("admin");
})

// adminLogin
router.post("/adminlogin",isAdmin,passport.authenticate("local",{
  successRedirect:"/adminProfile",
  failureRedirect:"/adminlogin",
}),function(req,res){})

router.get("/adminlogin",function(req,res){

   res.render("adminLogin")
})

// food add
router.post("/addfood",upload.single("image"),async function(req,res){

  if(req.body.type==="maincourse")
  {
    const main_course =await maincourseModel.create({
      type:req.body.type,
      name:req.body.name,
      details:req.body.details,
      price:req.body.price,
      addfoodPic:`${req.file.filename}`
    })
  }
  else if(req.body.type==="starter"){
    const Starter =await StarterModel.create({
      type:req.body.type,
      name:req.body.name,
      details:req.body.details,
      price:req.body.price,
      addfoodPic:`${req.file.filename}`
    })
  }
  else if(req.body.type==="dessert"){
    const dessert =await dessertModel.create({
      type:"dessert",
      name:req.body.name,
      details:req.body.details,
      price:req.body.price,
      addfoodPic:`${req.file.filename}`
    })
  }
   
  // console.log(food);
  res.redirect("/addfood")
})


router.get("/addfood",function(req,res){
  res.render("admin");

})

// isLogged function
function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
    return next();
  }
  else{

    res.redirect("/login")
  }
}

router.post("/photo",upload.single("image"),async function(req,res,next){
  const user =await userModel.findOne({username:req.session.passport.user});
  // console.log(user);
  console.log(req.file.filename);
  user.profilePic=`${req.file.filename}`
  await user.save();
  
  res.redirect("/dashboard");
 
})



// forget
router.get("/forget",function(req,res){
  res.render("forget")
})

// otp
router.get("/otp",function(req,res){
  res.render("otp")
})

router.post("/otp",async function(req,res){
  let user = await userModel.findOne({email:req.body.email})
  
  console.log(user);
  if(user===null){
    res.send("user not found email")
  }
  let otp=Math.floor(Math.random()*100000);
  console.log(otp);
  user.otp=`${otp}`;
  user.save();
  tempotp=`${otp}`;
  expireAt = Date.now()+24*60*60*1000;
  // console.log(expireAt);
  // console.log(tempotp);
  let message = "Your otp is "
  sendMail(user.email,user.otp,user.name,message)
  .then(function(res){
    console.log(res);
    console.log("send mail");
  })
 
res.redirect("/otp") 
})

// verify otp

router.post("/verifyotp",async function(req,res){
  // console.log(req.body.otp);
  let user = await userModel.findOne({otp:req.body.otp})
  // console.log(user);
  if(user===null){
    // res.send("wrong otp")
    // alert("user not found")
    res.send("Wrong otp")
    // res.redirect("/register")
  }
  else{
    
    // console.log("sahi otp");
    res.redirect(`/changepassword/${req.body.otp}`)
  }
})

// change password
router.get("/changepassword/:otp",function(req,res){

  res.render("changepassword",{otp:req.params.otp})
})

// new password
router.post("/newpassword/:otp",async function(req,res){
  // console.log("hey");
  // console.log(`${tempotp}`);
  console.log(req.params.otp);
  let user = await userModel.findOne({otp:req.params.otp})
  // console.log();
  console.log(user);
  await user.setPassword(req.body.newpassword, function(err, user){
        if (err) {
          console.log(err);
            // res.send(err);
        } else {
          user.save();
          console.log("successfully change password");
         res.redirect("/login")

            // res.send('successfully change password')
        }
    });
  // res.redirect("back")
  res.redirect("/login")
})

// add to cart post
router.get("/cart/:product", async function(req,res){
  let loginUser = await userModel.findOne({username:req.session.passport.user});
  let t =req.params.product
  let pro =t.split("@");
  console.log(pro);
  if(pro[1] == "starter"){
    var food = await StarterModel.findById({"_id" :pro[0]});
    const myCartData = await mycartModel.create({
      type:food.type,
      name:food.name,
      details:food.details,
      price:food.price,
      addfoodPic:food.addfoodPic
    })

    await loginUser.cart.push(myCartData._id);
    await loginUser.products.push(myCartData._id);
    loginUser.save();
    console.log(myCartData);
  }
  if(pro[1] == "maincourse"){
    var food = await maincourseModel.findById({"_id" :pro[0]});
    const myCartData = await mycartModel.create({
      type:food.type,
      name:food.name,
      details:food.details,
      price:food.price,
      addfoodPic:food.addfoodPic
    })

    await loginUser.cart.push(myCartData._id);
    await loginUser.products.push(myCartData._id);
    loginUser.save();
    console.log(myCartData);
    console.log(food);
  }
  if(pro[1] == "dessert"){
    var food = await dessertModel.findById({"_id" :pro[0]});
    const myCartData = await mycartModel.create({
      type:food.type,
      name:food.name,
      details:food.details,
      price:food.price,
      addfoodPic:food.addfoodPic
    })

    await loginUser.cart.push(myCartData._id);
    await loginUser.products.push(myCartData._id);

    loginUser.save();
    console.log(myCartData);
    console.log(food);
  }
  // res.render("cart",{prod:food});
  res.redirect("back")

})
// router get cart
router.get("/cart",isLoggedIn,async function(req,res){

  // let loginUser = await userModel.findOne({username:req.session.passport.user})
  let mycart = await userModel.findOne({username:req.session.passport.user})
  .populate({
    path:"cart",
    populate:{
      path:"userId"
    }
  })

  // console.log(loginUser.cart);
  console.log(mycart.cart);
  let totalPrice=0;
  for(let i =0;i<mycart.cart.length;i++){
    totalPrice+=mycart.cart[i].price;
  }
  let discount = totalPrice*0.05;
  let total = totalPrice-discount;
  console.log(mycart.cart.length);
  let length=mycart.cart.length;
  res.render("cart",{product:mycart.cart,totalPrice:totalPrice,discount: discount,total:total,length:length})
})

// delete product from cart
router.get("/delete/product/:id",async function(req,res){
    let mycart = await mycartModel.findOneAndDelete({_id:req.params.id});
    let logginInUser = await userModel.findOne({username:req.session.passport.user});
    let index = await logginInUser.cart.indexOf(req.params.id)
    //  index = await logginInUser.products.indexOf(req.params.id)
    await logginInUser.cart.splice(index.id,1);
    await logginInUser.products.splice(index,1);
    logginInUser.save();

    // console.log(logginInUser.cart);
    console.log(logginInUser.products);
    res.redirect("back")
})

// confirm order
router.get("/confirmOrder",isLoggedIn,async function(req,res){
  let logginInUser = await userModel.findOne({username:req.session.passport.user});
  let orderId =await Math.floor(Math.random()*10000000)
  // console.log(orderId);
  logginInUser.orderId=`${orderId}`;
  logginInUser.orderDate=Date.now();

  

  let food = logginInUser.cart;

  while(food.length > 0) {
    food.pop();
}
  console.log(logginInUser.cart);
  console.log(logginInUser.products);
  logginInUser.save();
  let mesaage = "your order is successfully placed and your order id is ";
  sendMail(logginInUser.email,orderId,logginInUser.name,mesaage)
  res.render("orderconfirmation",{orderId:orderId})
})

// edit profile
router.post("/editProfile/:id",async function(req,res){
  let user = await userModel.findOne({username:req.session.passport.user});

  let updatedUser = await user.update({name: req.body.name,email: req.body.email,phone: req.body.phone,gender:req.body.gender})
  
  console.log(updatedUser);
    res.redirect("back");
})

function isAdmin(req,res,next){
  if(req.isAuthenticated() && req.user.key==1){
    return next();
  }
  res.redirect("/addfood")
}

// razorpay
router.post("/create/orderId",function(req,res){
  console.log("created order request ",req.body);
  var options = {
    amount: req.body.amount,  // amount in the smallest currency unit
    currency: "INR",
    receipt: "order_rcptid_11"
  };
  instance.orders.create(options, function(err, order) {
    // console.log(order);
    // res.send({orderId:order.id})
    // res.redirect("/confirmOrder")
  });
})


router.post("/api/payment/verify",(req,res)=>{
  console.log("verify");
  let body=req.body.response.razorpay_order_id + "|" + req.body.response.razorpay_payment_id;
 
   var crypto = require("crypto");
   var expectedSignature = crypto.createHmac('sha256', 'mOv4uU32YhNq0h6M3gnfiqP8')
                                   .update(body.toString())
                                   .digest('hex');
                                   console.log("sig received " ,req.body.response.razorpay_signature);
                                   console.log("sig generated " ,expectedSignature);
   var response = {"signatureIsValid":"false"}
   if(expectedSignature === req.body.response.razorpay_signature)
    response={"signatureIsValid":"true"}
       res.send(response);
      res.redirect("/confirmOrder") 
   });


// universal route
router.get("*",function(req,res){
  res.render("404");
})


module.exports = router;
