-- Active: 1677861616139@@127.0.0.1@3306
CREATE TABLE users(
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    nickname TEXT NOT NULL,
    email TEXT NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT "user" NOT NULL,
    created_at TEXT DEFAULT (DATETIME()) NOT NULL
);
CREATE TABLE posts(
    id_post TEXT PRIMARY KEY UNIQUE NOT NULL,
    id_creatorPost TEXT NOT NULL,
    content_post TEXT NOT NULL,
    likes_post INTEGER DEFAULT (0) NOT NULL,
    dislikes_post INTEGER DEFAULT (0) NOT NULL,
    comments_post INTEGER DEFAULT (0) NOT NULL,
    updated_at TEXT DEFAULT (DATETIME()) NOT NULL,
    created_at TEXT DEFAULT (DATETIME()) NOT NULL,
    FOREIGN KEY (id_creatorPost) REFERENCES users(id)
);
CREATE TABLE likes_dislikes_post(
    id_user TEXT NOT NULL,
    id_post TEXT NOT NULL,
    like_post INTEGER DEFAULT (0) NOT NULL,
    FOREIGN KEY (id_user) REFERENCES users(id),
    FOREIGN KEY (id_post) REFERENCES posts(id_post)
);
CREATE TABLE comments(
    id_comment TEXT PRIMARY KEY UNIQUE NOT NULL,
    id_creatorComment TEXT NOT NULL,
    id_postComment TEXT NOT NULL,
    content_comment TEXT NOT NULL,
    likes_comment INTEGER DEFAULT (0) NOT NULL,
    dislikes_comment INTEGER DEFAULT (0) NOT NULL,
    updated_at TEXT DEFAULT (DATETIME()) NOT NULL,
    created_at TEXT DEFAULT (DATETIME()) NOT NULL,
    FOREIGN KEY (id_creatorComment) REFERENCES users(id),
    FOREIGN KEY (id_postComment) REFERENCES posts(id_post)
);
CREATE TABLE likes_dislikes_comment(
    id_user TEXT NOT NULL,
    id_comment TEXT NOT NULL,
    like_comment INTEGER DEFAULT (0) NOT NULL,
    FOREIGN KEY (id_user) REFERENCES users(id),
    FOREIGN KEY (id_comment) REFERENCES comments(id_comment)
);
INSERT INTO users (id, nikname, email, password)
VALUES (
        "f001",
        "Fulano",
        "fulano@email.com",
        "fulano123"
    ),
    (
        "f002",
        "Beltrana",
        "beltrana@email.com",
        "beltrana00"
    );
SELECT *
FROM users;
SELECT *
from likes_dislikes_post;
UPDATE users
SET role = "ADMIN"
WHERE id = "a3aba438-90cf-4720-9905-ce09a54e531a";
UPDATE posts
SET likes_post = 0
WHERE id_post = "f742de23-fd87-486a-8397-b95cdc778f90";
--   DROP Table posts;
--drop table comments;
SELECT *
FROM comments;
SELECT *
FROM posts;
SELECT *
FROM likes_dislikes_comment;
SELECT *
FROM likes_dislikes_post;
SELECT p.id_post as idPost,
    p.content_post as contentPost,
    p.likes_post as likesPost,
    p.dislikes_post as dislikesPost,
    p.comments_post as commentsPost,
    u.id as idUserPost,
    u.nickname as nicknameUserPost, 
    c.id_comment as idComment,
    c.content_comment as contentComment,
    c.likes_comment as likesComment,
    c.dislikes_comment as dislikesComment,
    u2.nickname as nicknamecomment
FROM posts as p
    LEFT JOIN users as u ON p.id_creatorPost = u.id
    LEFT JOIN comments as c ON p.id_post = c.id_postComment
   LEFT JOIN users as u2 on u2.id = c.id_creatorComment;
