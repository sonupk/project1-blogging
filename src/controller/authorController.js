const AuthorModel = require('../model/AuthorModel')

const CreateAuthor = async function(req,res){
    try{
    let authorBody = req.body
    let authorData = await AuthorModel.create(authorBody)
    res.send({status:true, data :authorData})
    
    }
    catch(err){
        return  res.send({msg:"err.message"})
    }

}  

module.exports.CreateAuthor = CreateAuthor  