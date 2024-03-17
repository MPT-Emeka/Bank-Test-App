const mongoose = require("mongoose")
const transactionSchema = mongoose.Schema({
    amount: {
        type: Number,
        required: true,
    },
    senderName: {
        type: String,
        required: [true, "sender name is required"],
        minlength : [6, "sender name should have more than 6 characters"],
        maxlength : [30, "sender name should be less than 30 characters"]
    },
    receiverName: {
        type: String,
        required: [true, "receiver name is required"],
        minlength : [6, "receiver name should have more than 6 characters"],
        maxlength : [30, "receiver name should be less than 30 characters"]
    },
    accountDetails : {
        name : {
            type: String,
        },
        accountNumber : {
            type: String
        }
    }, //nested Object.
    location : {
        bankName : {
            type: String,
        },
        branch : {
            type: String
        }
    },
    transactionType: {
        type: String,
        enum: ["Inward", "Outward"]
    },
    schedule : {
        type: String,
        default: "instant",
        enum: ["recurring", "instant"]
    }
},
    { timestamps: true }
);


const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = Transaction;