import mongoose from "mongoose";

const { Schema } = mongoose;

const invitesSchema = new Schema({
    inviteSender:String,
    inviteReceiver:String
},{ timestamps: true });

const Invite=mongoose.model("Invite",invitesSchema);

export default Invite;