import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        minlength: 3
    },
    bio: {
        type: String,
        default: ""
    },
    phone: {
        type: String,
        trim: true
    },
    idProof: {
        type: String, // URL to uploaded ID proof image
    },
    isHost: {
        type: Boolean,
        default: false
    },
    verificationStatus: {
        type: String,
        enum: ['pending', 'verified', 'rejected'],
        default: 'pending'
    },
    avatar: {
        type: String,
    },
    role: {
  type: String,
  enum: ["user", "host"],
  default: "user"
}
}, {timestamps: true});

const User = mongoose.model('User', userSchema);

export default User;