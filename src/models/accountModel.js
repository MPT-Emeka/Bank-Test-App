const mongoose = require("mongoose")
const accountSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "user",
    },
    accountBalance : {
        type : Number,
    },
    accountNumber : {
        type : String,
    },
    branch : {
        type : String,
        required : [true, "Branch name is required"],
        minlength : [3, "Branch name is less than 3 characters"],
        maxlength : [30, "Branch name is more than 30 characters"],
    }
},
    { timestamps: true }
);


const Account = mongoose.model("Account", accountSchema);

module.exports = Account;