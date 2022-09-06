const authorModel = require('../model/AuthorModel')


// Author body data verification 
const  AuthorBody = (req,res,next)=>{
 try{

    let body = req.body
    if(!body){
        res.send({msg:"body data is not available"})
    }else if(!body.fname){
        res.send({msg:"first name is not enter"})
    }else if(!body.lname){
        res.send({msg:"last name not entered"})
    }else if(!body.title){
        res.send({msg:"title not enter "})
    }else if(!body.email){
        res.send({msg:"email not enter"})
    }else if(body.email){
        
        if( /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.) +([a-zA-Z0-9]{2,4})+$/){
            res.send({msg:"you enter invaild email id"})
        }
    
    }else if(body.email){
        emailExist()
        
    }else if (!body.password){
        res.send({msg:"password is not enter"})
    }
    next()

}catch(err){
    res.status(500).send({msg:err.message})
    }
}

async function emailExist(){
let emailVerification = await authorModel.find({email:body.email})
if (emailVerification){
    res.send({msg:"email id already exist"})
}
}


module.exports.AuthorBody = AuthorBody