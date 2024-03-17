const User = require('../models/userModel');
const Account = require('../models/accountModel');
const Transaction = require('../models/transactionModel')


exports.credit = async (req, res) => {
    try {

      const { amount, senderName, accountDetails, location } = req.body
      const queryAccount = accountDetails.accountNumber;
      const findAccount = await Account.findOne({ accountNumber: queryAccount });
      if (!findAccount) {
        return res.status(404).send({
          status: false,
          message: "Account query failed",
        });
      };

      findAccount.accountBalance = findAccount.accountBalance + amount;
      await findAccount.save();

      const user = req.user; // identify the user
      const userId = user._id;
      newUser = await User.findById(userId);

    let mailOptions = {
        from : process.env.HOST_EMAIL,
        to : newUser.email,
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

      let creditedUser = await User.findById(findAccount.userId)
      const creditTransaction = await Transaction.create({
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

      const { amount, accountDetails, receiverName, location, schedule } = req.body
      const findAccount = await Account.findOne({ userId: userID });
      if (!findAccount) {
        return res.status(404).send({
          status: false,
          message: "transaction failed",
        });
      };
     // let debitedUser = await User.findById(findAccount.userId)
       

      if (amount > findAccount.accountBalance) {
        return res.status(400).json({
          status: failed,
          message: "Insufficient funds"
        })
      }

      findAccount.accountBalance = findAccount.accountBalance - amount;
      await findAccount.save();


      const debitTransaction = await Transaction.create({
        amount,
        receiverName,
        accountDetails: { name: creditedUser.name },
        location,
        transactionType : "Inward",
        schedule
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
