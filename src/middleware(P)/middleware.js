const jwt=require("jsonwebtoken")
const blogModel = require("../models/blogModel")
const authorModel = require("../models/authorModel")
const secretkey = "plutoniumFunctionup$%(())()*)+/"
const validation = require("../validators/validator")

const  decodeFun = async function(req,res,next){
    try{
        const token = req.headers['x-api-key']

        if (!token)
			{return res
				.status(401)
				.send({ status: false, msg: "Token is not present" })}

        const decode = await jwt.verify(
            token,
            secretkey,
            function(err,decodedToken){
                if(err) return res.status(401).send({status:false,msg:err.message})

                req["decodedToken"]=decodedToken
                next();
            }
        )  
    }
    catch(err){
        res.status(500).send({status:false, msg:err.message})
    }
    
}



const authorAuthorization1 = async function(req,res,next){
    try{
        const authorId = req.body.authorId
        const decodedToken = req['decodedToken']
        const authorId0=decodedToken.authorId

        //.validation for authorID
        if(!authorId){
            res.status(400).send({status:false,msg:"authorId required"})
            return
        }

        if (!validation.isValidObjectId(authorId)) {
          res.status(400).send({ status: false, msg: "authorId is invalid" });
          return;
        }
        const author = await authorModel.findById(authorId);
        if(!author){
            res.status(400).send({ status: false, msg: "no such author" });
          return;
        }

        if(authorId!=authorId0){
            res.status(403).send({data:false,msg:"Unauthorise"})
            return
        }
        next()
    }
    catch(err){
        res.status(500).send({status:false, msg:err.message})
    }
}

const authorAuthorization2 = async function(req,res,next){
    try{
        let authorId = req.query.authorId
        const decodedToken = req['decodedToken']

        if (authorId) {
			if (!validation.isValidObjectId(authorId)) {
				return res
					.status(400)
					.send({ status: false, msg: "Invalid author Id" });
			}
            const authorId0 = decodedToken.authorId

            if(authorId!=authorId0){
                res.status(403).send({data:false,msg:"Unauthorise"})
                return
            }
        }    

        if(!authorId){
            req.authorId=decodedToken.authorId
        }

       
        next()
    }
    catch(err){
        res.status(500).send({status:false, msg:err.message})
    }
}

const authorAuthorization3 = async function(req,res,next){
    try{
        const blogId = req.params.blogId
        const decodedToken = req['decodedToken']

        if(!validation.isValidObjectId(blogId)){
            res.status(400).send({status:false,msg:"Invalid blogId"})
            return
        }
        
        const blog = await blogModel.findById(blogId) 
        if(!blog){
            res.status(404).send({status:false,msg:"Blog not found"})
            return
        }
        const authorId = blog.authorId
        
        const authorId0 = decodedToken.authorId
        if(authorId!=authorId0){
            res.status(403).send({data:false,msg:"Unauthorise"})
            return
        }
        next()

    }
    catch(err){
        return res.status(500).send({status:false, msg:err.message})
    }
}


const authorAuthorization4 = async function(req,res,next){
    try{
        const authorId = req.query.authorId
        const decodedToken = req['decodedToken']
        const authorId0 = decodedToken.authorId


        if(authorId){
            if(authorId!=authorId0){
                res.status(403).send({data:false,msg:"Unauthorise/Invalid authorId"})
                return
            }
        }

        // if(!authorId){
        //     req.authorId=decodedToken.authorId
        // }

        req.authorId=decodedToken.authorId

        next()
    }
    catch(err){
        res.status(500).send({status:false, msg:err.message})
    }
}





module.exports={
    decodeFun,
    authorAuthorization1,
    authorAuthorization2,
    authorAuthorization3,
    authorAuthorization4
}