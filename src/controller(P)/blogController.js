const blogModel = require("../modelPR/BlogsModel")
const mongoose = require("mongoose")
const ObjectId = mongoose.Types.ObjectId;
const authorModel = require("../modelPR/AuthorModel")

// FIRST HANDLER
    const createBlog = async function(req,res){
        try{
            const requestBody = req.body
        // Destructuring
           let {title,body,authorId,tags,category,subcategory,isPublished}=requestBody

    //Validation Starts
    //1.validation for title
        if(!title||typeof(title)!="string"||title.trim().length==0){
            res.status(400).send({status:false, msg:"title is required"})
            return
        }


    //2.validation for body
        if(!body||typeof(body)!="string"||body.trim().length==0){
            res.status(400).send({status:false, msg:"body is required"})
            return
        }


    //3.validation for authorID
        const author = await authorModel.findById(authorId)
        if(!ObjectId.isValid(authorId)||!author){
            res.status(400).send({status:false, msg:"authorId is invalid"})
            return
        }


    //4.validation for tags
        if(tags){
            if(typeof tags !="string"||tags.trim().length==0){
                res.status(400).send({status:false, msg:"invalid tags"})
                return
            }
        let arrOfTags = tags.split(",").map(x=>x.trim()).filter(x=>x.length>0)
        console.log(arrOfTags)
        if(arrOfTags.length==0){
            res.status(400).send({status:false, msg:"Invalid tags"})
            return
            }
        else{
            requestBody.tags=[...arrOfTags]
            }
        }
        
        

        
    //5.validation for category
        if(!category||typeof(category)!="string"||category.length==0){
            res.status(400).send({status:false, msg:"category is invalid"})
            return
        }

    //6.validation for subcategory
        if(subcategory){
            if(typeof subcategory !="string"||subcategory.trim().length==0){
                res.status(400).send({status:false, msg:"invalid subcategory"})
                return
            }
        let arrOfsubcategory = subcategory.split(",").map(x=>x.trim()).filter(x=>x.length>0)
        console.log(arrOfsubcategory)
        if(arrOfsubcategory.length==0){
            res.status(400).send({status:false, msg:"Invalid subcategory"})
            return
            }
        else{
            requestBody.subcategory=[...arrOfsubcategory]
            }
        }

    // Validation Ends
        if(isPublished){
            requestBody.publishedAt=new Date()
        }
        const newBlog = await blogModel.create(requestBody)

        res.status(201).send({status:true,data:newBlog})
        }
        catch(err){
            res.status(500).send({status:false,msg:err.message})
        }
    
    }

    module.exports={createBlog}