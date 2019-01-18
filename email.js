"use strict";
const nodemailer = require("nodemailer");
const host = process.env.SMTP_HOST;
const port = process.env.SMTP_PORT;
let user = process.env.SMTP_USER;
let pass = process.env.SMTP_PASS;
const secure = process.env.SMTP_SECURE;
const local = process.env.LOCAL;

// async..await is not allowed in global scope, must use a wrapper
const send = async (event, context) => {

    //console.log("event :",event);
    //console.log('context',context);
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  let account;
  
  if(local){
    account = await nodemailer.createTestAccount();
    user = account.user;
    pass = account.pass;
  }

  

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host,
    port,
    secure: JSON.parse(secure), // true for 465, false for other ports
    auth: {
      user, // generated ethereal user
      pass // generated ethereal password
    }
  });


  const emailDetails = JSON.parse(event.body);
  console.log("email details",emailDetails);
  //console.log("secure",secure);

  // setup email data with unicode symbols
  let mailOptions = {
    from: emailDetails.from, // sender address
    to: emailDetails.to, // list of receivers
    subject: emailDetails.subject, // Subject line
    text: emailDetails.message, // plain text body
    html: "<b>"+emailDetails.message+"</b>" // html body
  };

  //console.log(mailOptions);

  // send mail with defined transport object
  let info = await transporter.sendMail(mailOptions)

  console.log("Message sent: %s", info.messageId);
  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

  //return  nodemailer.getTestMessageUrl(info);

  return {
      statusCode: 200,
      body: JSON.stringify(nodemailer.getTestMessageUrl(info)),
      headers: {
          "Content-Type": "application/json"
      }
  };

};

module.exports = {
    send
};

