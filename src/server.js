const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');

const app = express();

// Sample data
const users = [
    { id: "1", name: "John Doe", email: "john@example.com" },
    { id: "2", name: "Jane Smith", email: "jane@example.com" }
];

// Define GraphQL schema
const typeDefs = gql\`
    type User {
        id: ID!
        name: String!
        email: String!
    }

    type Query {
        users: [User]
        user(id: ID!): User
    }

    type Mutation {
        addUser(name: String!, email: String!): User
    }
\`;

// Define resolvers
const resolvers = {
    Query: {
        users: () => users,
        user: (_, { id }) => users.find(user => user.id === id)
    },
    Mutation: {
        addUser: (_, { name, email }) => {
            const newUser = { id: String(users.length + 1), name, email };
            users.push(newUser);
            return newUser;
        }
    }
};

// Create Apollo Server instance
const server = new ApolloServer({ typeDefs, resolvers });

// Apply middleware
server.start().then(() => {
    server.applyMiddleware({ app });

    app.listen(4000, () => {
        console.log(\`🚀 Server ready at http://localhost:4000\${server.graphqlPath}\`);
    });
});
