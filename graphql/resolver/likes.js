import { UserInputError } from "apollo-server-express";
import { Posts } from "../../schema";
import { authenticate } from "../../util/authenticate";

import { PubSub } from 'graphql-subscriptions';
const pubsub = new PubSub();

const likesResolver = {
    Mutation: {
        likePost: async(parent, {postId}, context, info)  => {
            const user = authenticate(context);
            const post = await Posts.findById(postId);
            if (post) {
                if (post.likes.find(like => like.username === user.username)) { // if liked -> unliked
                    post.likes = post.likes.filter(like => like.username !== user.username); // save data of all except liked one
                } else { // like it
                    post.likes.push({username: user.username, createdAt: new Date().toISOString()})
                    pubsub.publish("NEW_LIKE", {
                        liked: {username: user.username, post: post.body}
                    });
                }
                await post.save();
                return post;
            } else {
                throw new UserInputError('post not found')
            }
        }
    },
    Subscription: {
        liked: {
            subscribe: (parent, agrs, context, info) => pubsub.asyncIterator(["NEW_LIKE"])
        }
    }
}

export default likesResolver;