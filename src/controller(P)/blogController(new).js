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
  
        //check Authorization
        
        //Validation Starts
        //1.validation for title
        if (!validation.isValidString(title)) {
          res.status(400).send({ status: false, msg: "title is required" });
          return;
        }
    
        //2.validation for body
        if (!validation.isValidString(body)) {
          res.status(400).send({ status: false, msg: "body is required" });
          return;
        }
    
        
    
        //3.validation for tags
        if (tags) {
          if (validation.isValidString(tags)) {
            let arrOfTags = tags.split(",").filter((x) => x.trim().length > 0);
            arrOfTags = [...new Set(arrOfTags)]
            if (arrOfTags.length == 0) {
              res.status(400).send({ status: false, msg: "Invalid tags" });
              return;
            }
            requestBody.tags = [...arrOfTags]
          }

          else if(validation.isValidArray(tags)){
            tags=tags.map(x=>[x.trim().split(",")]).flat(Infinity)
            requestBody.tags = [...tags]
          }
          else{
            res.status(400).send({status:false, msg:"Invalid tags"})
            return
          }
        }
    
        //4.validation for category
        if (!validation.isValidString(category)) {
          res.status(400).send({ status: false, msg: "category is invalid" });
          return;
        }
    
        //5.validation for subcategory
        if (subcategory) {
          if (validation.isValidString(subcategory)) {
            let arrOfsubcategory = subcategory.split(",").filter((x) => x.trim().length > 0);
            arrOfsubcategory = [...new Set(arrOfsubcategory)]
            if (arrOfsubcategory.length == 0) {
              res.status(400).send({ status: false, msg: "Invalid subcategory" });
              return;
            }
            requestBody.subcategory = [...arrOfsubcategory]
          }
          else if(validation.isValidArray(subcategory)){
            subcategory=subcategory.map(x=>[x.trim().split(",")]).flat(Infinity)
            requestBody.subcategory = [...subcategory]
          }
          else{
            res.status(400).send({status:false, msg:"Invalid subcategory"})
            return
          }
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




const getBlogs = async function (req, res) {
	try {
		const filterObj = req.modifiedQuery;
		filterObj.isDeleted = false;
		filterObj.isPublished = true;
		const allBlogs = await blogModel.find(filterObj);
		if (allBlogs.length === 0){
			return res.status(404).send({ status: false, msg: "Resource Not Found" })
    };
		 res.status(200).send({ status: true, data: allBlogs });
	} catch (error) {
		return res.status(500).send({ status: false, msg: error.message });
	}
};





const updateBlog = async function (req, res) {
  try {
    const blogId = req.params.blogId;
    const updateData = req.body;
  
    //destructuring
    let { title, body, tags, subcategory } = updateData;
    
    //Validaition starts
    //Validation for blogId
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
      if (validation.isValidString(tags)) {
        let arr = tags.split(",").filter((x) => x.trim().length > 0);
        //obj={$addToSet:{}}
        arr=[...new Set(arr)]
        obj["$addToSet"]["tags"] = [...arr];
        //  $each to add each element of array
        //  $addToSet to stop pushing duplicate elements
        
        }
      else if(validation.isValidArray(tags)){
        tags = tags.map(x=>x.trim().split(",")).flat(Infinity)
        obj["$addToSet"]['tags'] = [...tags]
      }
      else {
        res.status(400).send({ status: false, msg: "Invalid content in tags" });
        return;
      }   
     }

    if (subcategory) {
    //validation for subcategory
      if (validation.isValidString(subcategory)) {
        let arr = subcategory.split(",").filter((x) => x.trim().length > 0);
        //obj={$addToSet:{}}
        arr=[...new Set(arr)]
        obj["$addToSet"]["subcategory"] = {$each:[...arr]};
        }

      else if(validation.isValidArray(subcategory)){
        subcategory = subcategory.map(x=>[x.trim().split(",")]).flat(Infinity)
        obj["$addToSet"]['subcategory'] = {$each:[...subcategory]
      }}
      else {
        res.status(400).send({ status: false, msg: "Invalid content in tags" });
        return;
      }
    }

    //Updation
    const updatedBlog = await blogModel.findByIdAndUpdate(blogId, obj, {
      new: true,
    });
    res.status(200).send({ status: true, msg:"Successfully updated", data: updatedBlog });
  } catch (err) {
    res.status(500).send({ status: false, msg: err.message });
  }
};





const deleteBlogById = async function (req, res) {
	try {
		const blogId = req.params.blogId;
		const deletedBlog = await blogModel.findOneAndUpdate(
			{ _id: blogId, isDeleted: false },
			{ isDeleted: true, deletedAt: new Date() }
		);
		return deletedBlog
			? res.status(200).send()
			: res.status(404).send({ status: false, msg: "Resource Not Found" });
	} catch (error) {
		return res.status(500).send({ status: false, msg: error });
	}
};






const deleteBlogByParams = async function (req, res) {
  try {
    const data = req.query;
  
    //destructuring
    let { category, authorId, tag, subcategory, isPublished } = data;
    authorId=req.authorId

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






module.exports = { createBlog, getBlogs, updateBlog, deleteBlogById, deleteBlogByParams };
