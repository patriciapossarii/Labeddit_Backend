import { BadRequestError } from "../erros/BadRequestError"


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
    comments: [{
        idComment: string,
        nickname: string,
        contentComment: string,
        likesDislikes: number
    }]
}



export type TCommentPost = {
    idComment: string,
    nickname:string,
    contentComment: string,
    likesDislikes: number,

}

export interface PostComments {
    idPost: string,
    nickname:string,
    content: string,
    likesDislikes: number,
    qtdComments: number,
    comments: TCommentPost[]
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



    public getPostWithCommentsOutput(
        postComments: PostComments): PostComments {
        const dto: PostComments = {
            idPost: postComments.idPost,
            nickname: postComments.nickname,
            content: postComments.content,
            likesDislikes: postComments.likesDislikes,
            qtdComments: postComments.qtdComments,
            comments: postComments.comments.map((comment) => ({
                idComment: comment.idComment,
                nickname: comment.nickname,
                contentComment: comment.contentComment,
                likesDislikes: comment.likesDislikes

            }))
        }
        return dto
    }


}

