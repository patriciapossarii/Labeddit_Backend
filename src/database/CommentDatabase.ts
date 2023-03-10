import { CommentDB, PostDB } from "../types"
import { BaseDatabase } from "./BaseDatabase"
import { PostDatabase } from "./PostDatabase"

export class CommentDatabase extends BaseDatabase {
    public static TABLE_COMMENTS = "comments"
    public static TABLE_LIKES_DISLIKES_COMMENT = "likes_dislikes_comment"
    public static TABLE_POSTS = "posts"





    public async insertCommentInComments(newComment: CommentDB) {
        await BaseDatabase
            .connection(CommentDatabase.TABLE_COMMENTS)
            .insert(newComment)
    }


    public async checkCommentWithLike(userId: string, commentId: string) {
        const result = await BaseDatabase.connection(CommentDatabase.TABLE_LIKES_DISLIKES_COMMENT)
            .where({ id_user: userId, id_comment: commentId })
        return result
    }



    public async findCommentById(id: string | undefined): Promise<CommentDB> {
        const [result]: CommentDB[] = await BaseDatabase.connection(CommentDatabase.TABLE_COMMENTS)
            .where({ id_comment: id })
        return result
    }

    public async removeLikeDislike(userId: string, commentId: string) {
        const result = await BaseDatabase.connection(CommentDatabase.TABLE_LIKES_DISLIKES_COMMENT)
            .delete().where({ id_user: userId, id_comment: commentId })
        return result
    }

    public async updateComment(updateCommentDB: CommentDB) {
        await BaseDatabase
            .connection(CommentDatabase.TABLE_COMMENTS)
            .update(updateCommentDB)
            .where({ id_comment: updateCommentDB.id_comment })
    }

    public async insertLikeDislike(userId: string, commentId: any, value: any) {
        const result = await BaseDatabase.connection(CommentDatabase.TABLE_LIKES_DISLIKES_COMMENT)
            .insert({ id_user: userId, id_comment: commentId, like_comment: value })
        return result
    }

    public async updatetLikeDislike(value: number, userId: string, commentId: string) {
        const result = await BaseDatabase.connection(CommentDatabase.TABLE_LIKES_DISLIKES_COMMENT)
            .update({ like_comment: value }).where({ id_user: userId, id_comment: commentId })
        return result
    }


    public async postComments(idP: string | undefined) {
                   const result = await BaseDatabase.connection(`${PostDatabase.TABLE_POSTS} as p`)
                .leftJoin("users as u", "p.id_creatorPost", "=", "u.id")
                .select(
                    "p.id_post as idPost",
                    "p.content_post as contentPost",
                    "p.likes_post as likesPost",
                    "p.dislikes_post as dislikesPost",
                    "p.comments_post as qtdcommentsPost",
                    "u.id as idUserPost",
                    "u.nickname as nicknameUserPost")
                .leftJoin("comments as c", "p.id_post", "=", "c.id_postComment")
                .select(
                    "c.id_comment as idComment",
                    "c.content_comment as contentComment",
                    "c.likes_comment as likesComment",
                    "c.dislikes_comment as dislikesComment",
                )
                .leftJoin("users as u2", "u2.id", "=", "c.id_creatorComment")
                .select(
                    " u2.nickname as nicknamecomment"
                  
                ).where({id_post:idP})
                return result
        }
    


}



