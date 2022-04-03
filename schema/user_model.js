import mongoose from "mongoose";

const Schema = new mongoose.Schema({
    username: {type: String, min: 4, max: 20, unique: true},
    email: {type: String, unique: true},
    password: {type: String},
}, {timestamps: true});

export default mongoose.model('users', Schema);