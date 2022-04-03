import React from 'react';
import App from './App';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
  split,
  HttpLink
} from "@apollo/client";
import {
  getMainDefinition
} from '@apollo/client/utilities';
import {
  GraphQLWsLink
} from '@apollo/client/link/subscriptions';
import {
  createClient
} from 'graphql-ws';
import { setContext } from '@apollo/client/link/context';

const httpLink = new HttpLink({
  uri: 'http://localhost:5000/graphql',
});

const wsLink = new GraphQLWsLink(createClient({
  url: 'ws://localhost:5000/graphql'
}));

const splitLink = split(({query})=>{
  const definition =  getMainDefinition(query);
  return (
    definition.kind === 'OperationDefinition' && definition.operation === 'subscription' 
  );
}, wsLink, httpLink);

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('jwtToken');
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  }
});

const client = new ApolloClient({
  link: authLink.concat(splitLink),
  cache: new InMemoryCache()
});

export default (
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);