const mongoose = require("mongoose");

const billerSchema = new mongoose.Schema({
    billerId: {
        type: String,
        required: true,
    },
    billerName: {
        type: String,
        required: true,
    },
    billerType: {
        type: String,
    },
});

module.exports = mongoose.model("Biller", billerSchema);