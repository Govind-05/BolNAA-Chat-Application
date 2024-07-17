import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import User from "./database/models/userSchema.js";
import Message from "./database/models/messagesSchema.js";
import cors from "cors";
import * as dotenv from 'dotenv';
dotenv.config();

import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
      origin: true,
      methods: ["GET", "POST"]
    }
});



// mongoose.set('strictQuery', true);
await mongoose.connect(process.env.MONGODB_URL);

//REGISTERING THE USER
app.post("/post/register", async (req, res) => {

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
});

app.get("/hello",(req,res)=>{
    res.send("Hello there")
});

//LOGGING IN THE USER
app.post("/post/login", async (req, res) => {

    try {
        const response = await User.findOne({ userName: req.body.userName });
        if (response == null) {
            res.send({
                error: true
            })
        }
        else if (response.password === req.body.password) {
            res.send({
                error: false,
                profile:{
                    userName:response.userName,
                    yourName:response.yourName
                }
            })
        } else {
            res.send({
                error: true
            })
        }

    } catch (error) {
        res.send({
            error: "Server Error"
        })
    }


});

//Checking if the user exist through the modal

app.post("/post/checkUser", async (req, res) => {
    try {
        const response = await User.findOne({ userName: req.body.userName });
        if (response != null) {
            res.send({
                error: false
            })
        } else {
            res.send({
                error: true
            })
        }
    } catch (error) {
        console.log("Error in the server-/post/checkuser");
    }

});

app.post("/post/saveContacts",async (req,res)=>{
    const contactData={
        userName:req.body.userName
    }
    await User.findOneAndUpdate({userName:req.body.user},{ "$push": { "contacts": contactData } })
    res.send({
        save:"Done"
    })
});

app.post("/post/fetchContacts",async (req,res)=>{
    if(req.body.userName!==""){
        const data=await User.findOne({userName:req.body.userName}).exec();
        res.send({
            contacts:data.contacts
        })
    }
    
});

app.post("/post/addMessages", async (req, res) => {
    const messageData = new Message({
        sender: req.body.sender,
        receiver: req.body.receiver,
        message: req.body.message
    })
    try {
        await messageData.save();
        res.send({
            error: false
        })
    } catch (error) {
        res.send({
            error: true
        })
    }
});

app.post("/post/fetchMessages", async (req, res) => {

    const messages=await Message.find({ $or: [{ sender: req.body.sender }, { sender: req.body.receiver }],$or: [{ receiver: req.body.receiver }, { receiver: req.body.sender }] }).exec();
    // const receivedMessages=await Message.find({ sender:req.body.receiver,receiver:req.body.sender }).exec();

    // const messages=sendMessages.concat(receivedMessages);


    res.send({messages:messages})
});

app.post("/post/deleteContact",async (req,res) => {
    try {
        
        const response=await User.findOne({userName:req.body.sender});
        
        const prevContacts=response.contacts;
        let newContacts=[];
        newContacts=prevContacts.filter(user=>{
                if(user.userName!==req.body.userName){
                    return user;
                }
            
        });

        const delResponse=await User.findOneAndUpdate({userName:req.body.sender},{contacts:newContacts});
        await Message.deleteMany({ $or: [{ sender: req.body.sender }, { sender: req.body.userName }],$or: [{ receiver: req.body.userName }, { receiver: req.body.sender }] })
        
        // res.send({msg:"messages deleted"});
        
        res.send({msg:"Contact Deleted"})


    } catch (error) {
        console.log(error);
    }
})

//Socket Server Starts here
io.on("connection", (socket) => {
    const id = socket.handshake.query.id;
    socket.join(id)
    socket.on("send-message", (receiver) => {
        socket.to(receiver.userName).emit("received-message", receiver.userName, receiver.sendMes, receiver.sender);
    });

});

// Socket Server Ends here

const SERVER_PORT=process.env.SERVER_PORT || 3000

httpServer.listen(SERVER_PORT);

// const PORT=process.env.PORT || 3000;

// app.listen(PORT, () => {
//     console.log(`Server is listening on port ${PORT}.`);
// });