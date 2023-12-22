const nodemailer = require("nodemailer");
const googleApis = require("googleapis");
const REDIRECT_URI = `https://developers.google.com/oauthplayground`;
const CLIENT_ID = `944587520626-iqno53pt4h8l1mfq1h5d9i6gemhu5164.apps.googleusercontent.com`;
const CLIENT_SECRET = `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`;
const REFRESH_TOKEN = `1//04lvZ13QMr3VuCgYIARAAGAQSNwF-L9IrZeB9CEc9K1yqYLChsDqayQEUtzgKFN1Jf-wa6FoMljvc4SawvNNe__5vcfbntGwMKJY`;
const authClient = new googleApis.google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET,
REDIRECT_URI);
authClient.setCredentials({refresh_token: REFRESH_TOKEN});

async function mailer(receiver,otp,name,message){
 try{
 const ACCESS_TOKEN = await authClient.getAccessToken();
 const transport = nodemailer.createTransport({
 service: "gmail",
 auth: {
 type: "OAuth2",
 user: "ashishkumar0842a@gmail.com",
 clientId: CLIENT_ID,
 clientSecret: CLIENT_SECRET,
 refreshToken: REFRESH_TOKEN,
 accessToken: ACCESS_TOKEN
 }
 })
 const details = {
 from: "ashishkumar0842a@gmail.com",
 to:"ak9661496125@gmail.com",
 subject: `${message}`,
 text: "message text",
 html: `<h2> Hello ${name} ${message} ${otp}</h2>`
 }
 const result = await transport.sendMail(details);
 return result;
 }
 catch(err){
 return err;
 }
}
// mailer().then(res => {
//  console.log("sent mail !", res);
// })

module.exports = mailer;