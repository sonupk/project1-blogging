const BlogsModel = require('../modelPR/BlogsModel')




const deleteFromQuery = async function (req, res) {
    
 try {


     let data = req.query 
     let find =await BlogsModel.findOne(data)
     data.isDeleted = false
     if(!find){
      return  res.status(404).send({msg:"blog not found"})
     }
    let update = await BlogsModel.findOneAndUpdate(data,{$set:{isDeleted:true,deletedAt:Date.now()}},{new:true}) 
    res.status(200).send({msg:update})


}catch(err){
     res.status(500).send({msg:"server down"})
}

}

module.exports.deleteFromQuery = deleteFromQuery