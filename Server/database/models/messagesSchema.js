import mongoose from "mongoose";

const { Schema } = mongoose;

const messagesSchema = new Schema({
    sender:String,
    receiver:String,
    message:String,
    time:String
},{timestamps:true});

const Message=mongoose.model("Message",messagesSchema);

export default Message;