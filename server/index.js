const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@apollo/server/express4");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");

async function startServer() {
  const app = express();
  const server = new ApolloServer({
    typeDefs: `
    type User {
        id: ID!
        name: String!
        username: String!
        email: String!
        zipcode: String!
        phone: String!
        website: String!
    }
    type Todo {
        id: ID!
        title: String!
        completed: Boolean
        userId: ID!
        user: User
    }
    type Query {
         getTodos: [Todo]
         getUsers: [User]  
         getTodo(id: ID!): Todo
         getUser(id: ID!): User
    }
    `,
    resolvers: {
      Todo: {
        user: async (todo) => {
          const response = await axios.get(
            `https://jsonplaceholder.typicode.com/users/${todo.userId}`
          );
          return response.data;
        },
      },
      Query: {
        getTodos: async () => {
          const response = await axios.get(
            "https://jsonplaceholder.typicode.com/todos"
          );
          return response.data;
        },
        getUsers: async () => {
          const response = await axios.get(
            "https://jsonplaceholder.typicode.com/users"
          );
          return response.data;
        },
        getTodo: async (_, { id }) => {
          const response = await axios.get(
            `https://jsonplaceholder.typicode.com/todos/${id}`
          );
          return response.data;
        },
        getUser: async (_, { id }) => {
          const response = await axios.get(
            `https://jsonplaceholder.typicode.com/users/${id}`
          );
          return response.data;
        },
      },
    },
  });

  await server.start();

  app.use(cors());
  app.use(bodyParser.json());
  app.use("/graphql", expressMiddleware(server));

  app.listen({ port: 4000 }, () => {
    console.log(`🚀 Server ready at http://localhost:4000/graphql`);
  });
}

startServer();
