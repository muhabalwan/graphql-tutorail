import { GraphQLServer } from 'graphql-yoga'

// Scalar types = String, Boolean, Int, Float, ID
// Scalar types is a type that stores a single value


const users = [
    {
        id: "1",
        name: 'abc',
        email: '123',
        agent: "123",
        comments: ["1000", "2000"]
    },
    {
        id: "2",
        name: 'defc',
        email: '345',
        agent: "345",
        comments: ["3000", "4000"]
    },
    {
        id: "3",
        name: 'hij',
        email: '567',
        agent: "567",
        comments: []
    }
]

const posts = [
    {
        id: "11",
        title: "post one",
        body: "post one content",
        author: "1",
        published: true

    },
    {
        id: "22",
        title: "post Two",
        body: "post Two content",
        author: "2",
        published: true
    },
    {
        id: "222",
        title: "post Two Two",
        body: "post Two Two content",
        author: "2",
        published: false
    },
    {
        id: "33",
        title: "post Three",
        body: "post Three content",
        author: "3",
        published: false
    },
]

const comments = [
    {
        id: "1000",
        text: "comment 1",
        author: "1",
        post: "11"
    },
    {
        id: "2000",
        text: "comment 2",
        author: "1",
        post: "22"
    },
    {
        id: "3000",
        text: "comment 3",
        author: "2",
        post: "33"
    },
    {
        id: "4000",
        text: "comment 4",
        author: "2",
        post: "33"
    },
]
// Type defintions (schema)
const typeDefs = `
    type Query {
        users(query: String): [User!]!
        posts(query: String): [Post!]!
        user(id: String): User!
        comments: [Comment!]!
    }
    type User {
        id: ID!
        name: String!
        email: String!
        agent: Int
        posts: [Post!]!
        comments: [Comment]!
    }

    type Post {
        id: ID!
        title: String!
        body: String!
        author: User!
        published: Boolean!
    }
    type Comment {
        id: ID!
        text: String!
        author: User!
        post: Post!
    }
`
// Resolver is a collection of functions that generate response for a GraphQL query. In simple terms, a resolver acts as a GraphQL query handler. 
// Every resolver function in a GraphQL schema accepts four positional arguments as given below − fieldName:(root, args, context, info) => { result }
const resolvers = {
    Query: {
        // parent if user has many posts user=> posts, args: operation, ctx: context --> user id, info: actual information sent to server
        users(parent, args, ctx, info) {
            if (args.query) {
                return users.filter((user) => {
                    return user.name.toLocaleLowerCase().includes(args.query)
                })
            }
            return users

        },
        posts(parents, args, ctx, info) {
            if (args.query) {
                return posts.filter((post) => {
                    return post.postName.toLocaleLowerCase().includes(args.query)
                })
            }
            return posts
        },
        user(parent, args, ctx, info) {
            return users.find(user => user.id === args.id)
        },
        comments(parent, args, ctx, info) {
            return comments;
        }
    },

    // Those are called Custom Resolver Function
    Post: {
        author(parent, args, ctx, info) {
            return users.find(user =>
                user.id === parent.author)
        }
    },
    User: {
        posts(parent, args, ctx, info) {
            return posts.filter((post) => {
                return post.author === parent.id
            })
        },
        comments(parent, args, ctx, info) {
            console.log('parent', parent);
            return comments.filter(comment => {
                return parent.comments.includes(comment.id)
            })
        }
    },
    Comment: {
        author(parent, args, ctx, info) {
            return users.find(user => {
                return user.id === parent.author
            })
        },
        post(parent, args, ctx, info) {
            return posts.find(post => {
                return post.id === parent.post
            })
        }
    }
}


const server = new GraphQLServer({ typeDefs, resolvers });

server.start(() => {
    console.log('Server is up !!')
})