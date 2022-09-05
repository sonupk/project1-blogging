const authorModel = require("../models(P)/authorModel");

const createAuthor = async function (req, res) {
  const Data = req.body;
  // Destructuring
  const { fname, lname, title, email, password } = Data;

  //Validation starts
  //1.validation on fname
  if (fname.trim().length == 0 || typeof fname != string) {
    res.status(400).send({ status: false, msg: "fname is required" });
    return;
  }
  //2.validation on lname
  if (lname.trim().length == 0 || typeof lname != string) {
    res.status(400).send({ status: false, msg: "lname is required" });
    return;
  }
  //3.validation on title
  if (title.trim().length == 0 || typeof title != string) {
    res.status(400).send({ status: false, msg: "title is required" });
    return;
  }
  let arr = ["Mr", "Mrs", "Miss"]
  if(!arr.includes(title)){
    res.status(400).send({status:false, msg:"Invalid title"})
  }


  //4.validation on email
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (!emailRegex.test(email) || !email) {
    res.status(400).send({ status: false, msg: "email must be valid" });
    return;
  }
  const repeatEmail = await authorModel.find({email:email})
  if(!repeatEmail){
    res.status(400).send({status:false, msg:"email ID already exist"})
    return
  }
  //5.validation on password
  const passwordRegex =
    /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
  if (!passwordRegex.test(password)) {
    res.status(400).send({
      status: false,
      msg: "password must contain alteast one number and one special character.",
    });
    return;
  }
//   const repeatPass = await authorModel.find({password:password})
//   if(!repeatPass){
//     res.status(400).send({status:false, msg:"Invalid password"})
//   }
  // Validation Ends

  const newAuthor = await authorModel.create(Data);
  res.status(201).send({ status: true, data: newAuthor });
};

module.exports={createAuthor}
