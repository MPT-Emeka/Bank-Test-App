const mongoose = require("mongoose")
const { isEmail } = require("validator")
const { isDate } = require("validator")
const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "name is required"],
        minlength : [6, "name should have more than 6 characters"],
        maxlength : [30, "name should be less than 30 characters"]
    },
    address: {
        type: String,
        required: [true, "address is required"],
        minlength : [6, "address should have more than 6 characters"],
        maxlength : [50, "address should be less than 30 characters"]
    },
    email : {
        type : String,
        required : [true, "Please enter an email"],
        unique : true,
        lowercase : true,
        validate : [isEmail, "Please enter a valid email"]
    },
    password : {
        type : String,
        required : [true, "Password field is required"],
        minlength : [12, "Password is less than 12 characters"],
        select: false
    },
    confirmPassword : {
        type : String,
        required : [true, "Make sure input is the same as password"],
        minlength : [12, "Password is less than 12 characters"],
        select: false
    },
    phoneNumber : {
        type : String,
        required : [true, "phone number is required"],
        minlength : [11, "minimum length of phone number is 11 characters"],
        maxlength : [14, "maximum length of phone number is 14 characters"]
    },
    dateOfBirth : {
        type : String,
        required : [true, "date of birth is required"],
        validate : [isDate, "Please enter a valid date of birth"]
    },
    bvn : {
        type : Number,
        required : [true, "BVN is required"],
        minlength : [11, "BVN is less than 11 digits"],
        maxlength : [11, "BVN is more than 11 digits"],
    },
    nin : {
        type : Number,
        required : [true, "NIN is required"],
        minlength : [11, "NIN is less than 11 digits"],
        maxlength : [11, "NIN is more than 11 digits"],
    },
    role: {
        type: String,
        default: "user",
        enum: ["user", "admin"],
    }
},
    { timestamps: true }
);


const User = mongoose.model("User", userSchema);

module.exports = User;