const jwt=require('jsonwebtoken');
const User=require('../model/UserSchema');
const nodemailer = require('nodemailer');

const Authenticate= async (req, res, next)=>{
    try{
        // const token=req.cookies.jwtoken;
        // const token='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NDMwZWRjZDZhOWFhOTViMTQxM2RiZGEiLCJpYXQiOjE2ODA5ODA0MjF9.4U2AA4f0NZ5WpWGdeP9RFEmnJ2xL_ch-_8LKtcMhPkc';
        let token = req.headers.authorization;
        console.log("this is about page1"+JSON.stringify(token))
        const verifyToken=jwt.verify(token,process.env.SECRET_KEY);
        const rootUser=await User.findOne({_id:verifyToken._id,"tokens.token":token});
        if(!rootUser){
            throw new Error('user not found')
        }
        req.token=token;
        req.rootUser=rootUser;
        req.userID=rootUser._id;
        next();
    }
    catch(err){
        res.status(401).send('unauthorized:no token provided');
        console.log(err);
    }
}

function sendConfirmation(userEmail,orderingId){
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        host: "gsmtp.gmail.com",
        port: 587,
        requireTLS: true,
        secure: false,
        auth: {
                    // user: 'inevitableapptest@gmail.com',
      
                    user: 'zaydsheikh360@gmail.com',
                    // pass: 'fiddtnvwktcucugh'
                    pass: 'fwrkdbtyobxkivdx'
      
        }
      
      });
      
      
    const mailOptions = {
        from: 'zaydsheikh360@gmail.com', // Sender's email address
        to: userEmail, // Recipient's email address
        subject: "ordered confirmed successfully",
        text: "ordered confirmed successfully , your order id is- "+orderingId+"    thankyou",
      };
    
      // Send the email
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Error sending email:', error);
          res.status(500).json({ error: 'Failed to send email.' });
        } else {
          console.log('Email sent:', info.response);
          res.status(200).json({ message: 'Email sent successfully.' });
        }
      });
     

}
module.exports={Authenticate,sendConfirmation};