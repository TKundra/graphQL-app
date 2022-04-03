import mongoose from "mongoose";

const Schema = new mongoose.Schema({
    body: {type: String},
    username: {type: String},
    createdAt: {type: String},
    comments: [
        {
            body: {type: String},
            username: {type: String},
            createdAt: {type: String},
        }
    ],
    likes: [
        {
            username: {type: String},
            createdAt: {type: String}
        }
    ],
    user: { // linking another data model - and save ObjectId
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }
});

export default mongoose.model('posts', Schema);