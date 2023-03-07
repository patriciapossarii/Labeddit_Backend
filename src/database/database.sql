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
    comments_post TEXT NOT NULL,
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
     FOREIGN KEY ( id_creatorComment) REFERENCES users(id),
     FOREIGN KEY ( id_postComment) REFERENCES posts(id_post)
);

CREATE TABLE likes_dislikes_comment(
    id_user TEXT NOT NULL,
    id_comment TEXT NOT NULL,
    like_comment INTEGER DEFAULT (0) NOT NULL,
    FOREIGN KEY (id_user) REFERENCES users(id),
    FOREIGN KEY (id_comment) REFERENCES comments(id_comment)
);


INSERT INTO users (id, nikname, email, password)
VALUES
	("f001", "Fulano", "fulano@email.com", "fulano123"),
	("f002", "Beltrana", "beltrana@email.com", "beltrana00");

    SELECT * FROM posts;
    SELECT * from likes_dislikes_post;


       UPDATE users
     SET role = "ADMIN"
     WHERE id ="a3aba438-90cf-4720-9905-ce09a54e531a";


      UPDATE posts
     SET likes_post = 0
     WHERE id_post ="350845b4-79c5-45d8-a4c6-e8431c37433e";


     --DROP Table users;

