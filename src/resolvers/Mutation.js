import { v4 as uuidv4 } from 'uuid';
const Mutations = {
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
    updateUser(parent, args, { db }, info) {
        const { id, updateUserInput } = args;
        const { users } = db;
        // args id , updateUserInput
        let user = users.find(user => user.id === id);
        console.log('user', user)
        if (!user) {
            throw new Error("User not found!")
        }
        if (typeof updateUserInput.email === "string") {
            const isEmailTaken = users.some(user => user.email === updateUserInput.email)
            if (isEmailTaken) {
                throw new Error("Email is already in use")
            }
            user.email = updateUserInput.email
        }
        if (typeof updateUserInput.name === "string") {
            user.name = updateUserInput.name
        }
        if (typeof updateUserInput.age === "string") {
            user.age = updateUserInput.age;

        }
        return user;
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
    updatePost(parent, args, { db }, info) {
        // check if post ID exist
        // extract post author exist 
        // 
        const { id, updatePostInput } = args;
        let post = db.posts.find(post => post.id === id)
        if (!post) {
            throw new Error("Post does not exist")
        }
        if (updatePostInput.published !== "undefined")
            post.published = updatePostInput.published
        if (updatePostInput.title !== "undefined")
            post.tile = updatePostInput.title;
        if (updatePostInput.body !== "undefined")
            post.body = updatePostInput.body;
        if (updatePostInput.author && updatePostInput.author !== "undefined") {
            const authorExist = users.some(user => user.id === updatePostInput.author)
            if (!authorExist) {
                throw new Error("User does not exist")
            }
            post.author = updatePostInput.author
        }
        return post
    },
    createComment(parent, args, { db, pubSub }, info) {
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
        console.log('args.comment.post -->', args.comment.post)
        pubSub.publish(`comment ${args.comment.post}`, { comment: comment })
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
    },
    updateComment(parent, args, { db }, info) {
        const { id, updateCommentInput } = args
        let comment = db.comments.find(comment => comment.id === id)
        if (!comment) {
            throw new Error("comment not found!")
        }
        comment.text = updateCommentInput.text;
        return comment;
    }
}

export default Mutations
