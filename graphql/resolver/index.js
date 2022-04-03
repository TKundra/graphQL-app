import postsResolvers from './posts';
import usersResolvers from './users';
import commentsResolvers from './comments';
import likesResolver from './likes';

export const resolvers = {
    Post: { // parent - return value of the resolver for this field's parent
        likeCount: (parent) => parent.likes.length,
        commentCount: (parent) => parent.comments.length,
    }, // whenever you query & mutate that contains Post has to go through this modifier and add this property...
    Query: {
        ...postsResolvers.Query
    },
    Mutation: {
        ...usersResolvers.Mutation,
        ...postsResolvers.Mutation,
        ...commentsResolvers.Mutation,
        ...likesResolver.Mutation
    },
    Subscription: {
        ...postsResolvers.Subscription,
        ...likesResolver.Subscription,
        ...commentsResolvers.Subscription,
    }
}