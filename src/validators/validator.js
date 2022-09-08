const mongoose = require("mongoose")
const ObjectId = mongoose.Types.ObjectId
const jwt = require("jsonwebtoken")
let arr = ["Mr", "Mrs", "Miss"]
const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;


const isValidRequestBody = function(data){
    if(Object.keys(data).length==0) return false
    return true
}

const isValidString = function(data){
    if(typeof(data) !="string"||data.trim().length==0){
        return false
    }
    return true
}

const isValidObjectId = function(data){
    return ObjectId.isValid(data)  
}

const isValidTitle = function(data){
    return arr.includes(data)  
}

const isValidEmail = function(data){
    return emailRegex.test(data)
}

const isValidPassword = function(data){
    return passwordRegex.test(data)
}

// const isValid = function (value) {
//     if (typeof value === "undefined" || value === null) return false;
//     if (typeof value === "string" && value.trim().length === 0) return false;
//     return true;
//   };

const isValidArray = function(data){
    if(!Array.isArray(data)||data.length==0||data.includes(undefined)||data.filter(x=>x.trim().length>0).length==0){
        return false
    }
    return true
}


  module.exports={
    isValidEmail,
    isValidObjectId,
    isValidPassword,
    isValidRequestBody,
    isValidString,
    isValidTitle,
    isValidArray
}


