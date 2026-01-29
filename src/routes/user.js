const { ConnectionRequestModel } = require("../models/connectionReqest");
const express = require("express");
const { Authicatemiddleware } = require("../middleware/auth");
const UserModel = require("../models/user");
const UserRounter = express.Router();
let USER_SAFE_DATA="firstName lastName age gender photoURL about";

UserRounter.get("/get/rquests/revieced", Authicatemiddleware, async (req, res) => {
    try {
        let loggedUser = req.user;

        let ConnectionRequestMo = await ConnectionRequestModel.find({
            toUserId: loggedUser._id,
            status: "Interested"
        }).populate("fromUserId", ["firstName", "lastName"])

        let data = await ConnectionRequestMo
        await loggedUser.save()
        res.send({ message: "Data Sent Suceffly!!", data })

    } catch (error) {
        res.status(400).send(error.message)
    }

})


UserRounter.get("/user/connections", Authicatemiddleware, async (req, res) => {
    try {
        let loggedUser = req.user;

        let connections = await ConnectionRequestModel.find({

            $or: [
                { fromUserId: loggedUser._id, status: "Accept", },
                { toUserId: loggedUser._id, status: "Accept", }
            ]
        }).populate('fromUserId', 'firstName lastName')
          .populate('toUserId', 'firstName lastName');

        // let data = connections.map(row => row.fromUserId)
        // res.send(data);

        let data=connections.map(row=>{
            if(row.fromUserId._id.toString()===loggedUser._id.toString()){
                    return row.toUserId
            }
            return row.fromUserId;
        })
       await loggedUser.save()
        res.send(data)

    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});


UserRounter.get("/feed",Authicatemiddleware,async (req,res)=>{
  let loogedUser=req.user;
  let page=parseInt(req.query.page) ||1;
  let limit=parseInt(req.query.limit) ||10;
  limit=limit>50?50:limit;

  let skip=(page-1)*limit


  let connections=await ConnectionRequestModel.find({
    $or:[
      {fromUserId:loogedUser._id},
      {toUserId:loogedUser._id}
    ]
  }).select("fromUserId toUserId")
   


  const hideUserFromFide=new Set(); // Object

  connections.forEach((req)=>{
      hideUserFromFide.add(req.fromUserId.toString()),
      hideUserFromFide.add(req.toUserId.toString())
  })



// $nin → value should not be inside the given list
// $ne → value should not be equal to this one value
// select -> select fields

  let Users=await UserModel.find({
    $and:[
      {_id:{$nin:Array.from(hideUserFromFide)}}, // Array
      {_id:{$ne:loogedUser._id},} // value
    ]
  }).select(USER_SAFE_DATA)
  .skip(skip)
  .limit(limit)
  
  console.log(Users);
  res.send(Users)
})

module.exports = { UserRounter }