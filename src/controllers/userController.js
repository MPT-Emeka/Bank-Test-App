const User = require("../models/userModel");
const ErrorHandler = require("../helpers/userErrorHandler");
const QueryMethod = require("../helpers/query")

exports.updateUser = async (req, res) => {
  try {  

    const user = req.user; // identify the user
    const userId = user._id
    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "unauthorized user" });
    }

    const findUser = await User.findById(userId);
    findUser.address = req.body.address;
    findUser.nin = req.body.nin;

    await findUser.save();
    return res.status(200).json({
      status: true,
      message: "Account has been updated successfully",
      updatedUser: findUser,
    });
  } catch (err) {
    const error = ErrorHandler.handleErrors(err);
    res.status(400).json({ error });
  }
};

exports.getUser = async (req, res) => {
  try {

    const user = req.user; // identify the user
    const userId = user._id
    if (!userId) {   
      return res
        .status(401)
        .json({ success: false, message: "unauthorized user" });
    }

    const findOneUser = await User.findById(userId);
    if (!findOneUser) {
      return res.status(404).json({
        status: false,
        message: "User not found",
      });
    } else {
      return res.status(200).json({
        status: true,
        message: "User found",
        User: findOneUser,
      });
    }
  } catch (err) {  // refactor to remove if statement
    if (err.path === "_id") {
      return res.status(401).json({
        status: false,
        message: "Invalid ID",
      });
    } else {
      return res.status(500).json({
        status: false,
        message: "Server Error",
      });
    }
  }
};


exports.deleteUser = async (request, response) => {  // will remove later
  try {
    const user = request.user
    const userId = user._id
    if (!userId) {  
      return response
      .status(403)
      .json({ success: false, message: "unauthorized user" });
    }  

    const { id } = request.query;
    const findUser = await User.findByIdAndDelete(id);
    if (findUser) {
      return response.status(204).json({
        status: true,
        message: "User deleted successfully",
        deletedUser: findUser,
      });
    } else {
      return response.status(404).json({
        status: false,
        message: "User not found",
      });
    }
  } catch (error) {
    return response.status(400).json( error.message )
  };
};
