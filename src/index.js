import { GraphQLServer } from 'graphql-yoga'
import { v4 as uuidv4 } from 'uuid';
import db from './db'
// Scalar types = String, Boolean, Int, Float, ID
// Scalar types is a type that stores a single value

// Type defintions (schema)
// Resolver is a collection of functions that generate response for a GraphQL query. In simple terms, a resolver acts as a GraphQL query handler. 
// Every resolver function in a GraphQL schema accepts four positional arguments as given below − fieldName:(root, args, context, info) => { result }
const resolvers = {
    Query: {
        // parent if user has many posts user=> posts, args: operation, ctx: context --> user id, info: actual information sent to server
        users(parent, args, { db }, info) {
            if (args.query) {
                return db.users.filter((user) => {
                    return user.name.toLocaleLowerCase().includes(args.query)
                })
            }
            return db.users

        },
        posts(parents, args, { db }, info) {
            if (args.query) {
                return db.posts.filter((post) => {
                    return post.postName.toLocaleLowerCase().includes(args.query)
                })
            }
            return db.posts
        },
        user(parent, args, { db }, info) {
            return db.users.find(user => user.id === args.id)
        },
        comments(parent, args, { db }, info) {
            return db.comments;
        }


    },
    Mutation: {
        createUser(parent, args, { db }, info) {
            // CRUD
            const emailTaken = db.users.some(user => {
                return user.email === args.user.email
            })
            if (emailTaken) {
                throw new Error('User email is already in use!')
            }
            const user = {
                id: uuidv4(),
                ...args.user

            }
            db.users.push(user)
            return user
        },
        deleteUser(parent, args, { db }, info) {
            const userIndex = db.users.findIndex(user => user.id === args.id);
            if (userIndex === -1) {
                throw new Error("User not found!")
            }
            const deletedUsers = db.users.splice(userIndex, 1);

            db.posts = db.posts.filter(post => {
                const match = post.author === args.id
                if (match) {
                    db.comments = db.comments.filter(comment => comment.post !== post.id)
                }
                return !match
            })
            db.comments = db.comments.filter((comment) => comment.author !== args.id)
            return deletedUsers[0];
        },
        createPost(parent, args, { db }, info) {
            const userExist = db.users.some(user => user.id === args.post.author)
            if (!userExist) {
                throw new Error('User not found!')
            }
            const post = {
                id: uuidv4(),
                ...args.post
            }
            db.posts.push(post)
            return post
        },
        deletePost(parents, args, { db }, info) {
            const postIndex = db.posts.findIndex((post,) => {
                return post.id === args.id
            })

            if (postIndex === -1) {
                throw new Error("Post does not exist!")
            }
            const matchedPost = db.posts[postIndex];
            db.posts = db.posts.filter(post => post.id !== args.id)
            db.comments = db.comments.filter(comment => comment.post !== args.id)
            return matchedPost;
        },
        createComment(parent, args, { db }, info) {
            // author & post 
            const userExist = db.users.some(user => user.id === args.comment.author)
            const postExist = db.posts.some(post => post.id === args.comment.post)
            // we only need to assert if user owns the post 
            if (!postExist) {
                throw new Error("Post Ids does not exist!")
            }
            if (!userExist) {
                throw new Error("User Ids does not exist!")
            }
            const comment = {
                id: uuidv4(),
                ...args.comment
            }
            db.comments.push(comment)
            return comment
        },
        deleteComment(parent, args, { db }, info) {
            const commentIndex = db.comments.findIndex(comment => comment.id === args.id)
            if (commentIndex === -1) {
                throw new Error("Comment does not exist!")
            }
            const matchComment = db.comments[commentIndex];
            db.comments = db.comments.filter(comment => comment.id !== args.id)
            return matchComment
        }
    },

    // Those are called Custom Resolver Function
    Post: {
        author(parent, args, { db }, info) {
            return db.users.find(user =>
                user.id === parent.author)
        }
    },
    User: {
        posts(parent, args, { db }, info) {
            return db.posts.filter((post) => {
                return post.author === parent.id
            })
        },
        comments(parent, args, { db }, info) {
            if (db.comments && parent.comments) {
                return db.comments.filter(comment => {
                    return parent.comments.includes(comment.id)
                })
            }
            return []
        }
    },
    Comment: {
        author(parent, args, { db }, info) {
            return db.users.find(user => {
                return user.id === parent.author
            })
        },
        post(parent, args, { db }, info) {
            return db.posts.find(post => {
                return post.id === parent.post
            })
        }
    }
}


const server = new GraphQLServer({
    typeDefs: "./src/schema.graphql", resolvers, context: {
        db
    }
});

server.start(() => {
    console.log('Server is up !!')
})