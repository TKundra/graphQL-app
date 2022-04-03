import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { Button, Confirm, Icon } from 'semantic-ui-react';

import { FETCH_POSTS_QUERY, DELETE_COMMENT_MUTATION, DELETE_POST_MUTATION } from '../util/graphql';
import MyPopup from '../util/Popup';

function DeleteButton({ postId, commentId, callback }) {
  console.log(postId, commentId)
  const [confirmOpen, setConfirmOpen] = useState(false);

  const mutation = commentId ? DELETE_COMMENT_MUTATION : DELETE_POST_MUTATION;

  const [deletePostOrMutation] = useMutation(mutation, {
    update(cache) {
      setConfirmOpen(false);
      if (!commentId) {
        const data = cache.readQuery({
          query: FETCH_POSTS_QUERY
        });
        cache.writeQuery({ 
          query: FETCH_POSTS_QUERY,
          data: {
            getPosts: data.getPosts.filter((p) => p.id !== postId)
          }
        });
      }
      if (callback) callback();
    },
    variables: {
      postId,
      commentId
    }
  });
  return (
    <>
      <MyPopup content={commentId ? 'Delete comment' : 'Delete post'}>
        <Button
          as="div"
          color="red"
          floated="right"
          onClick={() => setConfirmOpen(true)}>
          <Icon name="trash" style={{ margin: 0 }} />
        </Button>

      </MyPopup>
      
      <Confirm
        open={confirmOpen}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={deletePostOrMutation} />
    </>
  );
}

export default DeleteButton;