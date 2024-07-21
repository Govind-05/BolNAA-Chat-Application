import Invite from "../database/models/invitesSchema.js";
import User from "../database/models/userSchema.js";
import jwt from "jsonwebtoken";

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
        const authToken = await jwt.sign({ userName:response.userName }, process.env.JWT_SECRET, { expiresIn: '1h' });
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
    console.log(req.user);
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
    const response = await User.findOne({ userName: req.body.inviteUsername });
    if (response) {
      res.send({
        error: false,
        searchResult: true,
      });
      await Invite.create({
        inviteSender: req.user.userName,
        inviteReceiver: req.body.inviteUsername,
      });
    } else {
      res.send({
        error: false,
        searchResult: false,
      });
    }
  } catch (err) {
    console.log(err);
    res.status(400).send({
      error: true,
      searchResult: false,
    });
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