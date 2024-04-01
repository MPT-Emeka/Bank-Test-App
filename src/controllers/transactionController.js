const User = require('../models/userModel');
const Account = require('../models/accountModel');
const Transaction = require('../models/transactionModel')
const nodemailer = require('nodemailer');

exports.credit = async (req, res) => {
    try {

      const { amount, senderName, accountDetails, location } = req.body
      const queryAccountNo = accountDetails.accountNumber;
      const findAccount = await Account.findOne({ accountNumber: queryAccountNo });
      if (!findAccount) {
        return res.status(404).send({
          status: false,
          message: "Account query failed",
        });
      };

      findAccount.accountBalance = findAccount.accountBalance + amount;
      await findAccount.save();

      let creditedUser = await User.findById(findAccount.userId)

        let mail = nodemailer.createTransport({
          service : 'gmail',
          auth : {
              user : process.env.HOST_EMAIL,
              pass : process.env.EMAIL_PASS
          }
      });

        let mailOptions = {
          from : process.env.HOST_EMAIL,
          to : creditedUser.email,
          subject : `credit alert inward`,
          text : `CR. ${amount} from ${senderName}`
      };
    
      mail.sendMail(mailOptions, function(error, info) {
          if (error) {
              console.log(error);
          } else {
              console.log('Email sent : ' + info.response);
          }
      });

      const creditTransaction = await Transaction.create({
        accountId: findAccount._id,
        amount,
        senderName,
        accountDetails: { name: creditedUser.name },
        location,
        transactionType : "Inward"
      });
      return res.status(201).json({
        status: "success",
        data: {
          creditTransaction
        },
      });
    } catch (err) {
      const error = ErrorHandler.handleErrors(err);
      res.status(400).json({ error });
    }
  };



  exports.debit = async (req, res) => {
    try {
    const user = req.user; // identify the user
    const userID = user._id
    if (!userID) {
      return res
        .status(403)
        .json({ success: false, message: "Forbidden" });
    }

    const { amount, accountDetails, senderName, location, schedule } = req.body
    const findDebitAccount = await Account.findOne({ userId: userID });
      if (!findDebitAccount) {
        return res.status(404).send({
          status: false,
          message: "transaction failed",
        });
      };
     // let debitedUser = await User.findById(findAccount.userId)
       
      if (amount > findDebitAccount.accountBalance) {
        return res.status(400).json({
          status: failed,
          message: "Insufficient funds"
        })
      };

      findDebitAccount.accountBalance = findDebitAccount.accountBalance - amount;
      await findDebitAccount.save();

      let debitedUser = await User.findById(findDebitAccount.userId)
      let mail = nodemailer.createTransport({
        service : 'gmail',
        auth : {
            user : process.env.HOST_EMAIL,
            pass : process.env.EMAIL_PASS
        }  // 012, 3456, 789
      });
      let mailOptions = {
        from : process.env.HOST_EMAIL,
        to : debitedUser.email,
        subject : `Debit alert outward`,
        text : `DR. ${amount} to ${accountDetails.name}, account number ${accountDetails.accountNumber.slice(0,-3)}`
      };
  
      mail.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent : ' + info.response);
        }
      });

      const debitTransaction = await Transaction.create({
        amount,
        senderName,
        accountDetails,
        location,
        transactionType : "Outward",
        schedule
      });
      return res.status(201).json({
        status: "success",
        data: {
          debitTransaction
        },
      });
    } catch (err) {
      const error = ErrorHandler.handleErrors(err);
      res.status(400).json({ error });
    }
  };
