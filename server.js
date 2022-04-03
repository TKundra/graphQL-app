import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import typeDefs from './graphql/typedefs';
import { resolvers } from './graphql/resolver/index';

import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';
import { createServer } from 'http';

import connect from './db/connect';
import { PORT } from './config';

// db
connect();

// Create the schema, which will be used separately by ApolloServer and the WebSocket server.
const schema = makeExecutableSchema({ typeDefs, resolvers });

// Create an Express app and HTTP server; we will attach both the WebSocket server and the ApolloServer to this HTTP server.
const app = express();
const cors = require('cors');

// app.use(cors({
//   origin: 'http://localhost:3000'
// }));
const httpServer = createServer(app);

// Create our WebSocket server using the HTTP server we just set up.
const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/graphql',
});
  
// Save the returned server's info so we can shutdown this server later
const serverCleanup = useServer({ schema }, wsServer);

// Set up ApolloServer.
let server = null;

const startServer = async()=> {
    server = new ApolloServer({
        schema,
        context: ({req}) => ({req}),
        plugins: [
          // Proper shutdown for the HTTP server.
          ApolloServerPluginDrainHttpServer({ httpServer }),
      
          // Proper shutdown for the WebSocket server.
          {
            async serverWillStart() {
              return {
                async drainServer() {
                  await serverCleanup.dispose();
                },
              };
            },
          },
        ],
    });
    await server.start();
    server.applyMiddleware({ app });
}
startServer();

// Now that our HTTP server is fully set up, we can listen to it.
httpServer.listen(PORT, () => {
  console.log(
    `Server is now running on http://localhost:${PORT}${server.graphqlPath}`,
  );
});

// server - not compatible with subscription
// let apolloServer = null;
// const startServer = async() => {
//     apolloServer = new ApolloServer({
//         typeDefs, resolvers, context: ({req}) => ({req, pubsub})
//     });
//     await apolloServer.start();
//     apolloServer.applyMiddleware({ app });
// }
// startServer();

// app.listen(PORT, ()=>{
//     console.log(`🚀 listening at port: ${PORT}`);
// });