const Query = {
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
}

export default Query;