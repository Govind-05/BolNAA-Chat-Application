import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema({
    yourName:String,
    userName:{ type : String , unique : true, required : true, dropDups: true },
    password:String,
    contacts:[{
        userName : String
    }]
});

const User=mongoose.model("User",userSchema);

export default User;