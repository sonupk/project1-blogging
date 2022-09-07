const blogModel = require("../models/blogModel");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const authorModel = require("../models/authorModel");
const validation = require("../validators/validator")

// FIRST HANDLER
const createBlog = async function (req, res) {
    try {
        const requestBody = req.body;
        // Destructuring
        let { title, body, authorId, tags, category, subcategory, isPublished } = requestBody;
  
    
        //Validation Starts
        //1.validation for title
        if (!validation.isValidTitle(title)) {
          res.status(400).send({ status: false, msg: "title is required" });
          return;
        }
    
        //2.validation for body
        if (!validation.isValidString(body)) {
          res.status(400).send({ status: false, msg: "body is required" });
          return;
        }
    
        //3.validation for authorID
        const author = await authorModel.findById(authorId);
        if (!validation.isValidObjectId(authorId) || !author) {
          res.status(400).send({ status: false, msg: "authorId is invalid" });
          return;
        }
    
        //4.validation for tags
        if (tags) {
          if (!validation.isValidString(tags)) {
            res.status(400).send({ status: false, msg: "invalid tags" });
            return;
          }
          let arrOfTags = tags.split(",").filter((x) => x.trim().length > 0);
          arrOfTags = [...new Set(arrOfTags)]
          if (arrOfTags.length == 0) {
            res.status(400).send({ status: false, msg: "Invalid tags" });
            return;
          }
          
          requestBody.tags = [...arrOfTags];
          
        }
    
        //5.validation for category
        if (!validation.isValidString(category)) {
          res.status(400).send({ status: false, msg: "category is invalid" });
          return;
        }
    
        //6.validation for subcategory
        if (subcategory) {
          if (!validation.isValidString(subcategory)) {
            res.status(400).send({ status: false, msg: "invalid subcategory" });
            return;
          }
          let arrOfsubcategory = subcategory.split(",").filter((x) => x.trim().length > 0);
          arrOfsubcategory = [...new Set(arrOfsubcategory)]
          if (arrOfsubcategory.length == 0) {
            res.status(400).send({ status: false, msg: "Invalid subcategory" });
            return;
          } 
            requestBody.subcategory = [...arrOfsubcategory];
          
        }
        // Validation Ends
    
        if (isPublished==true) {
          requestBody.publishedAt = new Date();
        }
  
    
    const newBlog = await blogModel.create(requestBody);

    res.status(201).send({ status: true, data: newBlog });

  } catch (err) {
    res.status(500).send({ status: false, msg: err.message });
  }
};




const updateBlog = async function (req, res) {
  try {
    const blogId = req.params.blogId;
    const updateData = req.body;
  
    //destructuring
    const { title, body, tags, subcategory } = updateData;
    
    //Validaition starts
    //Validation for blogId
    if(!validation.isValidObjectId(blogId)){
        res.status(400).send({status:false, msg:"Invalid BlogId"})
        return
    }
    //finding blog
    const blog = await blogModel.find({ _id: blogId });
    if (blog.length == 0 || blog["isDeleted"] == true) {
      res.status(404).send({ status: false, msg: "No blog found" });
      return;
    }
  
    //adding data in obj which are needed to be update
    let obj = {};
    obj.isPublished = true;
    obj.publishedAt = new Date();
  
    if (title) {
        //validation for title
    if (!validation.isValidString(title)) {
        res
        .status(400)
        .send({ status: false, msg: "Invalid content in title" });
        return;
        }
        obj.title=title
    }

    if (body) {
    //validation for body
    if (!validation.isValidString(body)) {
        res.status(400).send({ status: false, msg: "Invalid content in body" });
        return;
        }
        obj.body = body;
    }

    obj["$addToSet"] = {};

    if (tags) {
    //validation for tags
    if (!validation.isValidString(tags)) {
        res.status(400).send({ status: false, msg: "Invalid content in tags" });
        return;
        }
    let arr = tags.split(",").filter((x) => x.trim().length > 0);
    //obj={$addToSet:{}}
    arr=[...new Set(arr)]
    obj["$addToSet"]["tags"] = [...arr];
    //  $each to add each element of array
    //  $addToSet to stop pushing duplicate elements    
    }

    if (subcategory) {
    //validation for subcategory
    if (!validation.isValidString(subcategory)) {
        res
         .status(400)
         .send({ status: false, msg: "Invalid content in subcategory" });
        return;
        }
    let arr = subcategory.split(",").filter((x) => x.trim().length > 0);
    arr=[...new Set(arr)]
    obj["$addToSet"]["subcategory"] = { $each: [...arr] };
    }

    //Updation
    const updatedBlog = await blogModel.findByIdAndUpdate(blogId, obj, {
      new: true,
    });
    res.status(200).send({ status: true, data: updatedBlog });
  } catch (err) {
    res.status(500).send({ status: false, msg: err.message });
  }
};





const deleteBlogByID = async function (req, res) {
  try {
    const blogId = req.params.blogId;

    //Validation for blogId
    if (!ObjectId.isValid(blogId)) {
      res.status(400).send({ status: false, msg: "blogId in not valid" });
      return;
    }
    // check
    const blog = await blogModel.find({_id:blogId, isDeleted:false});
    if ( !blog) {
        res.status(404).send({ status: false, msg: "Blog does not exist" });
        return;
      }

      const newBlog = await blogModel.findByIdAndUpdate(blogId,{isDeleted:true, deletedAt:new Date()}, {new: true});
      res.status(200).send()
    
  } catch (err) {
    res.status(500).send({ status: false, msg: err.message });
  }
};






const deleteBlogByParams = async function (req, res) {
  try {
    const data = req.query;
  
    //destructuring
    const { category, authorId, tag, subcategory, isPublished } = data;

    let obj = {};
    if (category) {
      if (!validation.isValidString(category)) {
        res
          .status(400)
          .send({ status: false, msg: "Invalid content in category" });
        return;
      }
      obj["category"] = category;
    }

    if (authorId) {
      if (!validation.isValidObjectId(authorId)) {
        res.status(400).send({ status: false, msg: "Invalid authorId" });
        return;
      }
      const author = await authorModel.findById(authorId);
      if (!author) {
        res.status(404).send({ status: false, msg: "No such author exist" });
        return;
      }
      obj.authorId = authorId;
    }

    if (tag) {
      if (!validation.isValidString(tag)) {
        res.status(400).send({ status: false, msg: "Invalid tag" });
        return;
      }
      let arr=tag.split(",").filter(x=>x.trim().length>0)
      arr=[...new Set(arr)]
      obj.tags = {$all:[...arr]};
      //$all - to match all elements in arr
    }

    if (subcategory) {
      if (!validation.isValidString(subcategory)) {
        res
          .status(400)
          .send({ status: false, msg: "Invalid content in subcategory" });
        return;
      }
      let arr=subcategory.split(",").filter(x=>x.trim().length>0)
      arr=[...new Set(arr)]
      obj.subcategory ={$all:[...arr]};
    }

    if (isPublished=="false") {
      obj.isPublished = (isPublished=="true")
    }
    
    const deletedBlog = await blogModel.updateMany(obj, {
      $set: { isDeleted: true, deletedAt: new Date() },
    });

    if (!deletedBlog) {
      res.status(404).send({ status: false, msg: "no such blog found" });
      return;
    }
    
    res
      .status(200)
      .send({ status: true, msg: "Deleted successfully", data: deletedBlog });
  } 
  catch (err) {
    res.status(500).send({ status: false, msg: err.message });
  }
};



module.exports = { createBlog, updateBlog, deleteBlogByID, deleteBlogByParams };
