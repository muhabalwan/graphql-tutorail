import { GraphQLServer } from 'graphql-yoga'
import db from './db'
import Query from './resolvers/Query'
import Mutations from './resolvers/Mutation';
import Post from './resolvers/Post';
import User from './resolvers/User';
import Comment from './resolvers/Comment';
// Scalar types = String, Boolean, Int, Float, ID
// Scalar types is a type that stores a single value

// Type defintions (schema)
// Resolver is a collection of functions that generate response for a GraphQL query. In simple terms, a resolver acts as a GraphQL query handler. 
// Every resolver function in a GraphQL schema accepts four positional arguments as given below − fieldName:(root, args, context, info) => { result }

const server = new GraphQLServer({
    typeDefs: "./src/schema.graphql",
    resolvers: {
        Query: Query,
        Mutation: Mutations,
        // Those are called Custom Resolver Function
        Post: Post,
        User: User,
        Comment: Comment
    },
    context: {
        db
    }
});

server.start(() => {
    console.log('Server is up !!')
})