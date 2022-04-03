import React, { useEffect, useState } from 'react';
import { Menu } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/authSlice';

import { Message, Container, Icon, Divider } from 'semantic-ui-react';

import { COMMENT_SUBSCRIBE, LIKE_SUBSCRIBE } from '../util/graphql';
import { useSubscription } from '@apollo/client';

function MenuBar() {
  const dispatch = useDispatch();

  const { user } = useSelector(state => state.auth);
  const pathname = window.location.pathname;

  const path = pathname === '/' ? 'home' : pathname.substring(1);
  const [activeItem, setActiveItem] = useState(path);

  const handleItemClick = (e, { name }) => setActiveItem(name);

  const { data: newComment } = useSubscription(COMMENT_SUBSCRIBE);
  const { data: newLike } = useSubscription(LIKE_SUBSCRIBE);
  const [active, setActive] = useState(false);

  let commentData = {}
  let likeData = {}

  if (newComment) {
    Object.values(newComment).map((data) => {
      Object.assign(commentData, {
        comment: data.comment,
        post: data.post,
        username: data.username
      })
    })
  }

  if (newLike) {
    Object.values(newLike).map((data) => {
      Object.assign(likeData, {
        post: data.post,
        username: data.username
      })
    })
  }

  const { comment, post: commentedPost, username: commentedUsername } = commentData;
  const { post: likedPost, username: likedUsername } = likeData;

  useEffect(() => {
    if (
      user?.username !== commentedUsername &&
      commentedUsername !== undefined ||
      user?.username !== likedUsername &&
      likedUsername !== undefined
    ) {
      setActive(true);
    }
  }, [newComment, newLike])

  function handleDismiss() {
    setActive(false);
  }

  return (
    <>
      {user ?
        <Menu pointing secondary size="massive" color="teal">
          <Menu.Item name={user.username} active as={Link} to="/" />
          <Menu.Menu position="right">
            <Menu.Item name="logout" onClick={() => { dispatch(logout()) }} />
          </Menu.Menu>
        </Menu>
        :
        <Menu pointing secondary size="massive" color="teal">
          <Menu.Item
            name="home"
            active={activeItem === 'home'}
            onClick={handleItemClick}
            as={Link}
            to="/" />

          <Menu.Menu position="right">
            <Menu.Item
              name="login"
              active={activeItem === 'login'}
              onClick={handleItemClick}
              as={Link}
              to="/login" />
            <Menu.Item
              name="register"
              active={activeItem === 'register'}
              onClick={handleItemClick}
              as={Link}
              to="/register" />
          </Menu.Menu>

        </Menu>
      }

      {active && (
        <Container>
          <Message icon color='teal' onDismiss={handleDismiss}>
            <Icon size='mini' name={comment !== undefined ? "comments" : "heart"} />
            <Message.Header content={comment !== undefined ? `${commentedUsername} :)` : `${likedUsername} :)` } />
            <Message.Item content='' />
            <Message.Content content={comment !== undefined ? `° ${comment} ° on post - ${commentedPost}` : `liked the post - ${likedPost}`}/>
          </Message>
        </Container>
      )}

      {active && <Divider />}

    </>
  );

}

export default MenuBar;
