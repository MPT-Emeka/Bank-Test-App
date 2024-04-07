const Account = require ("../models/accountModel");
const User = require ("../model/userModel")

exports.createAccount = async (req, res) => {
    try {
      const {accountClass, accountBalance, accountNumber, branch} = req.body;
      const user = req.user; // identify the user
      const userID = user._id
      if (!userID) {
        return res
          .status(401)
          .json({ success: false, message: "unauthorized user" });
      }
      //Assignment 1/4/2024:
//Check if an account already exists.
//Complete the account controller by saving all the fields in the account model to the Database. Hint: set from req body. 
//SOLUTION
      // Create a variable that holds the account we want to check.
      // We have to check if the user on line 10 has an existing account.
      
      let accountChecker = await Account.findOne({ userId : userID })
      if (accountChecker && accountChecker.accountClass === accountClass){
         return res.status(401).json ({message : "account already exist"})
      }
      const phoneNum = (tempNum) => {
        if (tempNum.length === 14){
          tempNum.slice(4)
          return tempNum
        }
        if (tempNum.length === 11){
          tempNum.slice(0)
          return tempNum
        }
      }
      const accountToSave = phoneNum(User.phoneNumber)
      const accountCreation = await Account.Create({accountClass, accountBalance, accountNumber: accountToSave, branch})
    return res.status(201).json ({message: "account created", noteTwo: accountCreation.accountNumber })
  } catch (err) {
    const error = ErrorHandler.handleErrors(err);
    res.status(400).json({ error });
  }
  }
  