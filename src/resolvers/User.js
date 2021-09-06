const User = {
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
}

export default User;