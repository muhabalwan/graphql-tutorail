let users = [
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

let posts = [
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

let comments = [
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
        author: "1",
        post: "33"
    },
]

const db = {
    users,
    comments,
    posts
}

export default db