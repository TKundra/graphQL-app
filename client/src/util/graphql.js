import { gql } from '@apollo/client';

const FETCH_POSTS_QUERY = gql`
  query getPosts {
    getPosts {
      id
      body
      createdAt
      username
      likeCount
      likes {
        username
      }
      commentCount
      comments {
        id
        username
        createdAt
        body
      }
    }
  }
`;

const LIKE_POST_MUTATION = gql`
  mutation likePost($postId: ID!) {
    likePost(postId: $postId) {
      id
      likes {
        id
        username
      }
      likeCount
    }
  }
`;

const REGISTER_USER_MUTATION = gql`
  mutation register(
    $username: String!,
    $email: String!,
    $password: String!,
    $confirmPassword: String!
  ) {
    register(
      registerInput: {
        username: $username,
        email: $email,
        password: $password,
        confirmPassword: $confirmPassword
      }
    ) {
      id
      email
      username
      createdAt
      token
    }
  }
`;

const LOGIN_USER_MUTATION = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      id
      email
      username
      createdAt
      token
    }
  }
`;

const CREATE_POST_MUTATION = gql`
  mutation createPost($body: String!) {
    createPost(body: $body) {
      id
      body
      createdAt
      username
      likes {
        id
        username
        createdAt
      }
      likeCount
      comments {
        id
        body
        username
        createdAt
      }
      commentCount
    }
  }
`;

const DELETE_COMMENT_MUTATION = gql`
  mutation deleteComment($postId: ID!, $commentId: ID!) {
    deleteComment(postId: $postId, commentId: $commentId) {
      id
      comments {
        id
        username
        createdAt
        body
      }
      commentCount
    }
  }
`;

const DELETE_POST_MUTATION = gql`
  mutation deletePost($postId: ID!) {
    deletePost(postId: $postId)
  }
`;

const SUBMIT_COMMENT_MUTATION = gql`
  mutation($postId: String!, $body: String!) {
    createComment(postId: $postId, body: $body) {
      id
      comments {
        id
        body
        createdAt
        username
      }
      commentCount
    }
  }
`;

const FETCH_POST_QUERY = gql`
  query($postId: ID!) {
    getPost(postId: $postId) {
      id
      body
      createdAt
      username
      likeCount
      likes {
        username
      }
      commentCount
      comments {
        id
        username
        createdAt
        body
      }
    }
  }
`;

const COMMENT_SUBSCRIBE = gql`
  subscription subscribe {
    newComment {
      comment
      username
      post
    }
  }
`;

const LIKE_SUBSCRIBE = gql`
  subscription subscribe {
    liked {
      username
      post
    }
  }
`;

export {
  CREATE_POST_MUTATION,
  FETCH_POSTS_QUERY,
  LIKE_POST_MUTATION,
  LOGIN_USER_MUTATION,
  REGISTER_USER_MUTATION,
  DELETE_COMMENT_MUTATION,
  DELETE_POST_MUTATION,
  SUBMIT_COMMENT_MUTATION,
  FETCH_POST_QUERY,
  COMMENT_SUBSCRIBE,
  LIKE_SUBSCRIBE
}