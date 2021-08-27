import { GraphQLServer } from 'graphql-yoga'

// Scalar types = String, Boolean, Int, Float, ID
// Scalar types is a type that stores a single value

// Type defintions (schema)
const typeDefs = `
    type Query {
        post: Post!
        me: User!
    }
    type User {
        id: ID!
        name: String!
        email: String!
        agent: Int
    }

    type Post {
        id: ID!
        postName: String!
        postDate: String!
        postContent: String!
    }
`
// Resolver is a collection of functions that generate response for a GraphQL query. In simple terms, a resolver acts as a GraphQL query handler. 
// Every resolver function in a GraphQL schema accepts four positional arguments as given below − fieldName:(root, args, context, info) => { result }
const resolvers = {
    Query: {
        post() {
            return {
                id: "123x",
                postName: "Habibi post",
                postDate: "2021 we made it!",
                postContent: "My life in shorts"
            }
        },
        me() {
            return {
                id: '123xyz',
                name: "Muhab",
                email: "alwanmuhab@gmail.com",
                agent: 28
            }
        },  
    }
}


const server = new GraphQLServer({typeDefs, resolvers});

server.start(() => {
    console.log('Server is up !!')
})