import { BadRequestError } from "../erros/BadRequestError"
import { PostComments } from "../types"

export interface CreateCommentInputDTO {
    postId: string,
    contentComment: string,
    token: string | undefined
}

export interface LikeDislikeCommentInputDTO {
    commentId: string,
    newLikeDislike: string,
    token: string | undefined
}

export interface GetCommentPostInputDTO {
    postId: string,
    token: string | undefined
}




export interface GetCommentPostOutputDTO {
    idPost: string,
    nickname: string,
    content: string,
    likesDislikes: number,
    qtdComments: number,
    comments: {
        idComment: string,
        nickname: string,
        contentComment: string,
        likesDislikes: number,
    }
}

export class CommentDTO {

    public getCommentPostInput(
       postId: string,
        token: string

    ): GetCommentPostInputDTO {
    
        const dto: GetCommentPostInputDTO = {
            postId,
            token
        }
        return dto
    }




    public createPostInput(
        postId: string,
        contentComment: string,
        token: string | undefined): CreateCommentInputDTO {
        if (contentComment !== undefined) {
            if (typeof contentComment !== "string") {
                throw new BadRequestError("'content' do comentario deve ser string.")
            }
        } else {
            throw new BadRequestError("'content' do comentario deve ser informado.")
        }
        const dto: CreateCommentInputDTO = {
            postId,
            contentComment,
            token
        }
        return dto
    }



    public getPostWithCommentsOutput(postWithComment:PostComments[]): GetCommentPostOutputDTO[] {
        return postWithComment.map((post:any) => ({
            idPost: post.idPost,
            nickname: post.nicknameUserPost,
            content:post.contentPost,
            likesDislikes: post.likesPost - post.dislikesPost,
            qtdComments:  post.qtdcommentsPost,
            comments: {
                idComment: post.idComment,
                nickname: post.nicknamecomment,
                contentComment: post.contentComment,
                likesDislikes: post.likesComment - post.dislikesComment,
            }
        }))
    }


}
