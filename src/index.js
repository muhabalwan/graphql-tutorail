import { GraphQLServer } from 'graphql-yoga'
import { v4 as uuidv4 } from 'uuid';

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

    type Mutation {
        createUser(name: String!, email: String!, age: Int): User!
        createPost(title: String!, body: String!, author: ID!, published: Boolean!): Post!
        createComment(text: String!, author: ID!, post: ID!): Comment!
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
    Mutation: {
        createUser(parent, args, ctx, info) {
            // CRUD
            const emailTaken = users.some(user => {
                return user.email === args.email
            })
            if(emailTaken) {
                throw new Error('User email is already in use!')
            }
            const user = {
                id: uuidv4(),
                ...args

            }
            users.push(user)
            return user
        },
        createPost(parent, args, ctx, info) {
            const userExist = users.some(user => user.id === args.author)
            if(!userExist) {
                throw new Error('User not found!')
            }
            const post = {
                id: uuidv4(),
                ...args
            }
            posts.push(post)
            return post
        },

        createComment(parent, args, ctx, info) {
            // author & post 
            const userExist = users.some(user => user.id === args.author)
            const postExist = posts.some(post => post.id === args.post)
            // we only need to assert if user owns the post 
            if(!postExist) {
                throw new Error("Post Ids does not exist!")
            }
            if(!userExist) {
                throw new Error("User Ids does not exist!")
            }
            const comment = {
                id: uuidv4(),
                ...args
            }
            comments.push(comment)
            return comment
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
            if(comments && parent.comments) {
                return comments.filter(comment => {
                    return parent.comments.includes(comment.id)
                })
            }
            return []
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