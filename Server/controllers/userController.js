import Invite from "../database/models/invitesSchema.js";
import User from "../database/models/userSchema.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose"

export const registerUser = async (req, res) => {
  const userData = new User({
    yourName: req.body.yourName,
    userName: req.body.userName,
    password: req.body.password
})
try {
    await userData.save();
    res.send({
        error: false
    })
} catch (error) {
    res.send({
        error: true
    })
}
};

export const loginUser = async (req, res) => {
  try {
    const response = await User.findOne({ userName: req.body.userName });
    if (response == null) {
        res.send({
            error: true
        })
    }
    else if (response.password === req.body.password) {
        const authToken = await jwt.sign({ userName:response.userName, userId:response._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.send({
            error: false,
            profile:{
                userName:response.userName,
                yourName:response.yourName,
                contacts:response.contacts
            },
            authToken:authToken
        })
    } else {
        res.send({
            error: true
        })
    }

} catch (error) {
    console.log(error);
    res.send({
        error: error
    })
}

};

export const getUserProfile = async (req, res) => {
  try {
    const response = await User.findOne({ userName: req.user.userName });
    res.send({
      error: false,
      profile: {
        userName: response.userName,
        yourName: response.yourName,
        contacts: response.contacts,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(401).send({
      error: true,
    });
  }
};

export const searchUser = async (req, res) => {
  try {
    if(req.body.inviteUsername===req.user.userName){
      res.send({
        error: false,
        searchResult: true,
        contactExists:true
      });
      return;
    }
    const response = await User.findOne({ userName: req.body.inviteUsername });
    if (response) {
      let contactExists = response.contacts.some(obj => obj.userId === req.user.userId);
      if(contactExists){

        res.send({
          error: false,
          searchResult: true,
          contactExists:true
        });
        return;

      }else{
        const inviteResponse = await Invite.create({
          inviteSender: req.user.userName,
          inviteReceiver: req.body.inviteUsername,
        });

        res.send({
          error: false,
          searchResult: true,
          invite: inviteResponse,
        });
        return;
      }

    } else {

        res.send({
          error: false,
          searchResult: false,
        });
        return;
    }
  } catch (err) {
    console.log(err);
      res.status(400).send({
        error: true,
        searchResult: false,
      });
      return;
  }
};

export const getUserInvites = async (req, res) => {
  try {
    const response = await Invite.find({ inviteSender: req.user.userName });
    res.send({
      error: false,
      userInviteList:response
    });
  } catch (err) {
    console.log(err);
    res.status(400).send({
      error: true,
    });
  }
};

export const getUserRequests = async (req, res) => {
  try {
    const response = await Invite.find({ inviteReceiver: req.user.userName });
    res.send({
      error: false,
      userRequestList:response
    });
  } catch (err) {
    console.log(err);
    res.status(400).send({
      error: true,
    });
  }
};

export const deleteInvite = async (req, res) => {
  try {
    const response = await Invite.findByIdAndDelete(req.body.inviteId)
    res.send({
      error: false,
    });
  } catch (err) {
    console.log(err);
    res.status(400).send({
      error: true,
    });
  }
};

export const deleteRequest = async (req, res) => {
  try {
    const response = await Invite.findByIdAndDelete(req.body.requestId)
    res.send({
      error: false,
    });
  } catch (err) {
    console.log(err);
    res.status(400).send({
      error: true,
    });
  }
};

export const acceptRequest = async (req, res) => {
  try {
    const response = await Invite.findByIdAndDelete(req.body.requestId)
    res.send({
      error: false,
    });

    const userId=req.user.userId;
    const contact = await User.findOne({ userName: req.body.inviteSender });
    const contactId = contact._id.toString();

    await User.findByIdAndUpdate(
      userId,
      { $push: {contacts:{userId:contactId}} }
    );

    await User.findByIdAndUpdate(
      contactId,
      { $push: { contacts: {userId:userId} } }
    );

  } catch (err) {
    console.log("catch error",err);
    res.status(400).send({
      error: true,
    });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const {yourName, userName} = req.body

    if(!(req.user.userName===userName)){

      const check = await User.findOne({userName:userName})
      if(check){
        res.send({
          error: true,
        });
        return
      }
      
    }
    

    const response = await User.findOneAndUpdate({userName:req.user.userName},{userName:userName,yourName:yourName})

    res.send({
      error: false,
    });
  } catch (err) {
    console.log(err);
    res.status(400).send({
      error: true,
    });
  }
};