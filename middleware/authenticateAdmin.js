const jwt=require('jsonwebtoken');
const Admin=require('../model/AdminSchema');
const nodemailer = require('nodemailer');

const Authenticates= async (req, res, next)=>{
    try{
        let token = req.headers.authorization;
        console.log("this is about page1"+JSON.stringify(token))
        const verifyToken=jwt.verify(token,process.env.SECRET_KEY);
        const rootAdmin=await Admin.findOne({_id:verifyToken._id,"tokens.token":token});
        if(!rootAdmin){
            throw new Error('Admin not found')
        }
        req.token=token;
        req.rootAdmin=rootAdmin;
        req.AdminID=rootAdmin._id;
        next();
    }
    catch(err){
        res.status(401).send('unauthorized:no token provided');
        console.log(err);
    }
}


module.exports=Authenticates;