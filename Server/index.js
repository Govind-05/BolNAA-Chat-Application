import 'dotenv/config';
import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import User from "./database/models/userSchema.js";
import Message from "./database/models/messagesSchema.js";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js"
import chatRoutes from "./routes/chatRoutes.js"
import imageUploadRoutes from "./routes/imageUploadRoutes.js"
import { createServer } from "http";
import { Server } from "socket.io";
import connectDB from "./utils/connectDB.js";
import { Redis } from "ioredis"

const app = express();
app.use(cors({
    origin: true
}));
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

connectDB();

const sub = new Redis();
const pub = new Redis();

app.use('/api/users', userRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/uploadImage', imageUploadRoutes);

app.get("/hello",(req,res)=>{
    res.send("Hello there")
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
    console.log("New Connection");

    const id = socket.handshake.query.id;
    socket.join(id)

    sub.subscribe("MessageChannel", (err) => {
        if (err) {
            console.error("Failed to subscribe: %s", err.message);
        } else {
            console.log(
                `Subscribed successfully! This client ${id} is Subscribed.`
            );
        }
    });

    socket.on("send-message", async (socketData) => {
        console.log(socketData);


        console.log("receiver online");
        const currentTime = new Date()
        // socket.to(socketData.receiver).emit("message-receive", { sender: socketData.sender, message: socketData.message, time: `${currentTime.getHours()}:${currentTime.getMinutes().toString().padStart(2, '0')}` });

        await pub.publish("MessageChannel", JSON.stringify({
            sender: socketData.sender,
            message: socketData.message,
            receiver: socketData.receiver,
            time: `${currentTime.getHours()}:${currentTime.getMinutes().toString().padStart(2, '0')}`
        }
        ));

        await Message.create({
            sender: socketData.sender,
            receiver: socketData.receiver,
            message: socketData.message,
            time: `${currentTime.getHours()}:${currentTime.getMinutes().toString().padStart(2, '0')}`
        })

    });

    socket.on("disconnect", (reason) => {
        console.log("Client Disconnected");
        
      });

});

// Socket Server Ends here

sub.on("message",(channel,message)=>{
    console.log(`Received ${message} from ${channel}`);
    const msgObj=JSON.parse(message)

    const roomExists = io.sockets.adapter.rooms.has(msgObj.receiver);
    const currentTime = new Date()

    if (roomExists) {
        console.log(`Room ${msgObj.receiver} exist`);
        io.to(msgObj.receiver).emit("message-receive",{ sender: msgObj.sender, message: msgObj.message, time: msgObj.time});
    } else {
        console.log(`Room ${msgObj.receiver} does not exist`);
        // Optionally handle the case where the room doesn't exist
    }

})

const SERVER_PORT=process.env.SERVER_PORT || 3000

httpServer.listen(SERVER_PORT,()=>{
    console.log("Server Listening On Port",SERVER_PORT);
    
});

// const PORT=process.env.PORT || 3000;

// app.listen(PORT, () => {
//     console.log(`Server is listening on port ${PORT}.`);
// });