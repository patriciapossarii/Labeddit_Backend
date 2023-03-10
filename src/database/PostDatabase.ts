import { PostDB } from "../types"
import { BaseDatabase } from "./BaseDatabase"

export class PostDatabase extends BaseDatabase {
    public static TABLE_POSTS = "posts"
    public static TABLE_LIKES_DISLIKES_POST = "likes_dislikes_post"


    public async findPosts(q: string | undefined) {
        let postsDB
        if (q) {
            const result: PostDB[] = await BaseDatabase
                .connection(PostDatabase.TABLE_POSTS)
                .where("name", "LIKE", `%${q}%`)
            postsDB = result
        } else {
            const result: PostDB[] = await BaseDatabase
                .connection(PostDatabase.TABLE_POSTS)
            postsDB = result
        }
        return postsDB
    }

    public async postUser(q: string | undefined) {
        if (q) {
            const result = await BaseDatabase.connection(`${PostDatabase.TABLE_POSTS} as p`)
                .innerJoin("users as u", "p.id_creatorPost", "=", "u.id").select(
                    "p.id_post as id",
                    "p.content_post as content",
                    "p.likes_post as likes",
                    "p.dislikes_post as dislikes",
                    "p.comments_post as comments",
                    "p.updated_at as updateAt",
                    "p.created_at as createdAt",
                    "u.id as uid",
                    "u.nickname as nickname"
                ).where("content_post", "LIKE", `%${q}%`)
            return result
        } else {
            const result = await BaseDatabase.connection(`${PostDatabase.TABLE_POSTS} as p`)
                .innerJoin("users as u", "p.id_creatorPost", "=", "u.id").select(
                    "p.id_post as id",
                    "p.content_post as content",
                    "p.likes_post as likes",
                    "p.dislikes_post as dislikes",
                    "p.comments_post as comments",
                    "p.updated_at as updateAt",
                    "p.created_at as createdAt",
                    "u.id as uid",
                    "u.nickname as nickname"
                )
            return result
        }
    }

    public async postNickName(postId: string | undefined) {
        const[ result] = await BaseDatabase.connection(`${PostDatabase.TABLE_POSTS} as p`)
            .innerJoin("users as u", "p.id_creatorPost", "=", "u.id").select(
                "u.nickname as nickname"
            ).where({id_post:postId})
        return result
    }


    public async insertPost(newPostDB: PostDB) {
        await BaseDatabase
            .connection(PostDatabase.TABLE_POSTS)
            .insert(newPostDB)
    }


    public async findPostById(id: string | undefined): Promise<PostDB> {
        const [result]: PostDB[] = await BaseDatabase.connection(PostDatabase.TABLE_POSTS)
            .where({ id_post: id })
        return result
    }


    public async updatePost(updatePostDB: PostDB) {
        await BaseDatabase
            .connection(PostDatabase.TABLE_POSTS)
            .update(updatePostDB)
            .where({ id_post: updatePostDB.id_post })
    }


    public async deletePostById(id: string) {
        await BaseDatabase
            .connection(PostDatabase.TABLE_POSTS)
            .delete()
            .where({ id_post: id })
    }


    public async deleteLikesInDeletePost(postId: string) {
        const result = await BaseDatabase.connection(PostDatabase.TABLE_LIKES_DISLIKES_POST)
            .delete().where({ id_post: postId })
        return result
    }


    public async checkPostWithLike(userId: string, postId: string) {
        const result = await BaseDatabase.connection(PostDatabase.TABLE_LIKES_DISLIKES_POST)
            .where({ id_user: userId, id_post: postId })
        return result
    }

    public async insertLikeDislike(userId: string, postId: any, value: any) {
        const result = await BaseDatabase.connection(PostDatabase.TABLE_LIKES_DISLIKES_POST)
            .insert({ id_user: userId, id_post: postId, like_post: value })
        return result
    }

    public async updatetLikeDislike(value: number, userId: string, postId: string) {
        const result = await BaseDatabase.connection(PostDatabase.TABLE_LIKES_DISLIKES_POST)
            .update({ like_post: value }).where({ id_user: userId, id_post: postId })
        return result
    }

    public async removeLikeDislike(userId: string, postId: string) {
        const result = await BaseDatabase.connection(PostDatabase.TABLE_LIKES_DISLIKES_POST)
            .delete().where({ id_user: userId, id_post: postId })
        return result
    }


}