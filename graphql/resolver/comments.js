import { Posts } from "../../schema"
import { authenticate } from "../../util/authenticate";
import { AuthenticationError, UserInputError } from "apollo-server-express";

import { PubSub } from 'graphql-subscriptions';
const pubsub = new PubSub();

const commentsResolvers = {
    Mutation: {
        createComment: async(parent, {postId, body}, context, info) => {
            const user = authenticate(context);
            if (body.trim() === '') {
                throw new UserInputError('empty comment', {
                    errors: {
                        body: 'comment must not be empty'
                    }
                });
            }
            const post = await Posts.findById(postId);
            if (post) {
                post.comments.unshift({ // unshift means to add comments before last one
                    body,
                    username: user.username,
                    createdAt: new Date().toISOString()
                });
                await post.save();
                pubsub.publish("NEW_COMMENT", {
                    newComment: {comment: body, username: user.username, post: post.body}
                });
                return post;
            } else throw UserInputError('post not found');
        },
        deleteComment: async(parent, {postId, commentId}, context, info) => {
            const user = authenticate(context);
            const post = await Posts.findById(postId);
            if (post) {
                const commentIndex = post.comments.findIndex(i => i.id === commentId);
                if (post.comments[commentIndex].username === user.username) {
                    post.comments.splice(commentIndex, 1);
                    await post.save();
                    return post;
                } else {
                    throw new AuthenticationError('action not allowed');
                }
            } else {
                throw new UserInputError('post not found')
            }
        }
    },
    Subscription: {
        newComment: {
            subscribe: (parent, agrs, context, info) => pubsub.asyncIterator(["NEW_COMMENT"])
        }
    }
}

export default commentsResolvers;