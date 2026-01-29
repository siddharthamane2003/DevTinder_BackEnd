let mongoose = require("mongoose");

let ConnectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref:"User"
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref:"User"
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["Accept", "Reject", "Ignore", "Interested"],
        message: "{VALUE} is an incorrect status type",
      },
    },
  },
  { timestamps: true },
);

ConnectionRequestSchema.index({fromUserId:1,toUserId:1})


// ConnectionRequestSchema.pre("save", function (next) {
//   let SentConnectionRequest = this;

//   if (SentConnectionRequest.fromUserId.equals(SentConnectionRequest.toUserId)) {
//      throw new Error("User Cannot Send Request to Yourself!");
//   }

//   next();
// });





let ConnectionRequestModel = mongoose.model(
  "ConnectionRequestSchema",
  ConnectionRequestSchema,
);

module.exports = { ConnectionRequestModel };
