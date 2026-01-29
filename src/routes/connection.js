const mongoose = require("mongoose");
const { Authicatemiddleware } = require("../middleware/auth");

const express = require("express");
const connectionRounter = express.Router();

// connectionRounter.post("/sentconnectionRequest" ,Authicatemiddleware, async (req,res)=>{
//     res.send("Sent Connection Request!!")
// })

let { ConnectionRequestModel } = require("../models/connectionReqest");
const UserModel = require("../models/user");

connectionRounter.post(
  "/request/send/:status/:toUserId",
  Authicatemiddleware,
  async (req, res) => {
    try {
      let fromUserId = req.user._id;
      let toUserId = req.params.toUserId;
      let status = req.params.status;

      let AllowedStatus = ["Interested", "Ignore"];
      if (!AllowedStatus.includes(status)) {
        return res.status(400).send(`Invalid Sttaus Type: ${status}`);
      }

      if (!mongoose.Types.ObjectId.isValid(toUserId)) {
        return res.status(400).send({ message: "Invalid UserId" });
      }

      let validatetouserfromuser = await ConnectionRequestModel.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (validatetouserfromuser) {
        return res.status(400).send("Invalid Request Sent");
      }

      let SentConnectionRequest = new ConnectionRequestModel({
        fromUserId,
        toUserId,
        status,
      });

      let data = await SentConnectionRequest.save();

      res.json({
        message: "User Sent Connection Request",
        data,
      });
    } catch (error) {
      res.status(400).send("User Invalid Request");
    }
  },
);

connectionRounter.post(
  "/request/review/:status/:requestId",
  Authicatemiddleware,
  async (req, res) => {
    try {
      const loggedUser = req.user;
      const { requestId, status } = req.params;

      let AllowedStatusByFromUser = ["Accept", "Reject"];

      if (!AllowedStatusByFromUser.includes(status)) {
        throw new Error("Stataus Inlvaid!!!!!!!");
      }

      if (!mongoose.Types.ObjectId.isValid(requestId)) {
        throw new Error("Reqest Id Invalid");
      }
      let toUser = await ConnectionRequestModel.findOne({
        _id: requestId, //Presnt In DB
        toUserId: loggedUser._id, // Touser Id
        status: "Interested", // Intesred
      });

      if (!toUser) {
        throw new Error("Sending User Invalid");
      }

      toUser.status = status;

      let data = await toUser.save();

      res.status(200).json({
        message: "Request updated successfully",
        status,
        data,
      });
    } catch (error) {
      res.status(400).send(error.message);
    }
  },
);

module.exports = { connectionRounter };