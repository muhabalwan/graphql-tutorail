const Subscription = {
    count: {
        subscribe(parent, args, { pubSub }, info) {
            let count = 0;
            setInterval(() => {
                count++
                pubSub.publish('count', {
                    count: count
                })
            }, 1000)

            return pubSub.asyncIterator('count')

        }
    },
    comment: {
        subscribe(parent, args, ctx, info) {
            const { postId } = args;
            const { db, pubSub } = ctx;
            const post = db.posts.find(post => post.id === postId && post.published)
            if(!post) {
                throw new Error("Post not found!")
            }
            return pubSub.asyncIterator(`comment ${postId}`)
        }
    }

}


export default Subscription