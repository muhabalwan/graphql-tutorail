import { GraphQLServer, PubSub } from 'graphql-yoga'
import db from './db'
import Query from './resolvers/Query'
import Mutation from './resolvers/Mutation';
import Subscription from './resolvers/Subscription';
import Post from './resolvers/Post';
import User from './resolvers/User';
import Comment from './resolvers/Comment';
// Scalar types = String, Boolean, Int, Float, ID
// Scalar types is a type that stores a single value

// Type defintions (schema)
// Resolver is a collection of functions that generate response for a GraphQL query. In simple terms, a resolver acts as a GraphQL query handler. 
// Every resolver function in a GraphQL schema accepts four positional arguments as given below − fieldName:(root, args, context, info) => { result }

const pubSub = new PubSub()

const server = new GraphQLServer({
    typeDefs: "./src/schema.graphql",
    resolvers: {
        Query,
        Mutation,
        Subscription,
        // Custom Resolver Function
        Post,
        User,
        Comment
    },
    context: {
        db,
        pubSub
    }
});

server.start(() => {
    console.log('Server is up !!')
})