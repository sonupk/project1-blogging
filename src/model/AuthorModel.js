const mongoose = require('mongoose')



const AuthorModel = new mongoose.Schema({
    
 "fname": {type:String,
           required:true},

"lname": {type:String,
          required:true},

"title": {type:String,
         required:true,
         enum:["Mr", "Mrs", "Miss"]},

"email": {type: mongoose.SchemaTypes.Email,
          unique:true,
          required:true}, 
"password":  mongoose.Schema.Types.Mixed

})

module.export = mongoose.model("authorModel",AuthorModel)