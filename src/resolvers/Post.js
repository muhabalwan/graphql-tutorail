const Post = {
    author(parent, args, { db }, info) {
        return db.users.find(user =>
            user.id === parent.author)
    }
}

export default Post;