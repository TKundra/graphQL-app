import {Posts} from '../../schema/index';
import { authenticate } from '../../util/authenticate';

import { PubSub } from 'graphql-subscriptions';
const pubsub = new PubSub();

const postsResolvers = {
    // resolver corresponding to each query, mutation
    Query: {
        getPosts: async()=>{
            try {
                const posts = await Posts.find().sort({createdAt: -1});
                return posts;
            } catch (error) {
                console.log(error);
            }
        },
        getPost: async(parent, {postId}, context, info) => {
            try {
                const post = await Posts.findById(postId);
                if (post)
                    return post;
                else {
                    throw new Error('post not found');
                }
            } catch (error) {
                console.log(error);
            }
        }
    },
    Mutation: {
        createPost: async(parent, {body}, context, info) => {
            const user = authenticate(context);
            if (body.trim() === '')
                throw new Error('post must not be empty!')
            const newPost = new Posts({
                body,
                user: user.id,
                username: user.username,
                createdAt: new Date().toISOString()
            });
            const post = await newPost.save();
            pubsub.publish("NEW_POST", {
                newPost: post
            }); // ping, whenever new post created
            return post;
        },
        deletePost: async(parent, {postId}, context, info) => {
            const user = authenticate(context);
            try {
                const post = await Posts.findById(postId);
                if (post.user.valueOf().toString() === user.id) { // valuOf returns id from new ObjectId("---")
                    const deletePost = await post.delete();
                    return `'${deletePost.body}' deleted successfully!`
                } else {
                    return new Error('Action not allowed').message;
                }
            } catch (error) {
                console.log(error);
            }
        },
    },
    Subscription: {
        newPost: {
            subscribe: (parent, agrs, context, info) => pubsub.asyncIterator(["NEW_POST"])
        }
    }
}

export default postsResolvers;