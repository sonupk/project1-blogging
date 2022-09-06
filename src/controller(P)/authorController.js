const authorModel = require("../models/authorModel")

const createAuthor = async function (req, res) {
  try {
    const Data = req.body;
    // Destructuring
    const { fname, lname, title, email, password } = Data;

    //Validation starts
    //1.validation on fname
    if (!fname || typeof (fname) != "string" || fname.trim().length == 0 ) {
      res.status(400).send({ status: false, msg: "fname is required" });
      return;
    }

    //2.validation on lname
    if (!lname || typeof (lname) != "string" || lname.trim().length == 0 ) {
      res.status(400).send({ status: false, msg: "lname is required" });
      return;
    }

    //3.validation on title
    let arr = ["Mr", "Mrs", "Miss"];
    if (!arr.includes(title)) {
      res.status(400).send({ status: false, msg: "Title must be one of these-'Mr','Mrs','Miss'" });
      return
    }

    //4.validation on email
    if (!email) {
      res.status(400).send({ status: false, msg: "email must be present" });
      return;
    }
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      res.status(400).send({ status: false, msg: "Invalid emailID" });
      return;
    }
    const repeatEmail = await authorModel.find({ email: email }); 
    if (repeatEmail.length !== 0) {
      res.status(400).send({ status: false, msg: "email ID already exist" });
      return;
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
    // Validation Ends

    const newAuthor = await authorModel.create(Data);
    res.status(201).send({ status: true, data: newAuthor });
  } catch (err) {
    res.status(500).send({ status: false, msg: err.message });
  }
};

module.exports = { createAuthor };
