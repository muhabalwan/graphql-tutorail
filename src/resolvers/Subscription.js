const Subscription = {
    comment: {
        subscribe(parent, args, ctx, info) {
            const { postId } = args;
            const { db, pubSub } = ctx;
            const post = db.posts.find(post => post.id === postId && post.published)
            if (!post) {
                throw new Error("Post not found!")
            }
            return pubSub.asyncIterator(`comment ${postId}`)
        }
    },
    post: {
        subscribe(parnet, args, ctx, info) {
            const { pubSub } = ctx
            return pubSub.asyncIterator("post")
        }
    }

}


export default Subscription