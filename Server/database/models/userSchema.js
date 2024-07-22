import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema({
    yourName:String,
    userName:{ type : String , unique : true, required : true, dropDups: true },
    password:String,
    contacts:[{
        userId : String
    }]
},{ timestamps: true });

const User=mongoose.model("User",userSchema);

export default User;