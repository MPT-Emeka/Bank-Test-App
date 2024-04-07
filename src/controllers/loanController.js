const Loan = require("../models/loanModel");
const Account = require("../models/accountModel");
const Transaction = require("../models/transactionModel");
const Stat = require("simple-statistics");
// the higher the Cash reserve ratio, this also affects the LOAN rates.
// 

exports.apply = async (req, res) => {
    try {
        const user = req.user; // identify the user
        const userID = user._id
        if (!userID) {
        return res
            .status(403)
            .json({ success: false, message: "Forbidden" });
        }

        const loanCheck = await Loan.findOne({ userId: userID })
        res.json({
            message: "Outstanding Loans",
            runningLoan: loanCheck
        });

        const loanAccount = await Account.findOne({ userId: userID })
        const { principal, tenor } = req.body;

        // Fetching the most recent 10 transactions for the User applying for a loan. 
        let loanTransaction = await Transaction.find({accountId: loanAccount._id}).limit(10).exec();
        let avgAmount = loanTransaction.amount // please check during testing. 
        
        // for (i = 0; i <= array.length; i++) {

        // }
    //    let avgTurnover = loanTransaction.amount / loanTransaction.length;

        let avgTurnover = Stat.average(avgAmount)
            let eligibilityConstant = 5 * principal;
            if (avgTurnover < eligibilityConstant) {
                return res.status(400).json({
                    status: "Failed",
                    message: "Ineligible"
                })
            }     
        const interestRate = (tenorParameter) => {
            // higher the tenor, the lower the interest rate. rate starts from 30%.
            if (+tenorParameter <= 1){
                return 30
            }
            if (+tenorParameter > 1 && +tenorParameter <= 12){
                return 15
            }
            if (+tenorParameter > 12) {
                return 10
            }
        };


        let interestRateToReturn = interestRate(tenor)
        const loanCreate = await Loan.create({
            principal,
            interestRate : interestRateToReturn,
            tenor,
            repaymentDate : Date.getMonth() + tenor
        })
        return res.status(201).json({message: "loan created successfully", note: loanCreate})

    } catch (err) {
        const error = ErrorHandler.handleErrors(err);
      res.status(400).json({ error });
    }
}

