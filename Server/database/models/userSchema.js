import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema({
    yourName: String,
    userName: { type: String, unique: true, required: true, dropDups: true },
    imageUrl: String,
    password: String,
    contacts: [{
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    }]
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

export default User;