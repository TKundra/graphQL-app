import React from 'react';
import { Grid, Transition } from 'semantic-ui-react';
import PostCard from '../components/PostCard';
import PostForm from '../components/PostForm';

import { FETCH_POSTS_QUERY } from '../util/graphql';
import { useQuery } from '@apollo/client';

import { useSelector } from 'react-redux';

const Home = () => {

  const { loading, data } = useQuery(FETCH_POSTS_QUERY, {
    pollInterval: 60000, // real-time synchronization
  });
  const { user } = useSelector(state => state.auth);

  return (
    <>
      <Grid columns={3}>
        <Grid.Row className="page-title">
          <h1>Recent Posts</h1>
        </Grid.Row>
        <Grid.Row>

          {user && <Grid.Column>
            <PostForm />
          </Grid.Column>}

          {loading ? (
            <h1>Loading posts..</h1>
          ) : (
            <Transition.Group>
              {data.getPosts &&
                data.getPosts.map((post) => (
                  <Grid.Column key={post.id} style={{ marginBottom: 20 }}>
                    <PostCard post={post} />
                  </Grid.Column>
                ))}
            </Transition.Group>
          )}
        </Grid.Row>
      </Grid>
    </>
  )
}

export default Home;
