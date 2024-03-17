const mongoose = require("mongoose")
const loanSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "userId is required"],
        ref: "user"
    },
    accountBalance : {
        type: Number,
    },
    minAverageBalance : {
        type: Number
    },
    principal : {
        type: Number
    },
    interestRate : {
        type: Number
    },
    tenor : {
        type: String,
    },
    repaymentDate: {
        type: String,
    }
},
    { timestamps: true }
);


const Loan = mongoose.model("Loan", loanSchema);

module.exports = Loan;