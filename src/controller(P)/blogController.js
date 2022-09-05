const blogModel = require("../models(P)/blogModel")

const createBlog = async function(req,res){
    try{
        const requestBody = req.body
    // Destructuring
    const {title,body,tags,category,subcategory}=requestBody

//Validation Starts
//1.validation for title
    if(title.trim().length==0||typeof(title)!=string){
        res.status(400).send({status:false, msg:"title is required"})
        return
    }

//2.validation for body
    if(body.trim().length==0||typeof(body)!=string){
        res.status(400).send({status:false, msg:"body is required"})
        return
    }
//2.validation for tags
    if(tags.length==0||typeof(tags)!=object){
        res.status(400).send({status:false, msg:"tags is invalid"})
        return
    }
//3.validation for category
    if(category.length==0||typeof(category)!=object){
        res.status(400).send({status:false, msg:"category is invalid"})
        return
    }
    const newBlog = await blogModel.create(requestBody)

    res.status(201).send({status:true,data:newBlog})
    }
    catch(err){
        res.status(500).send({status:false,msg:err.message})
    }
    
}