import { BadRequestError } from "../erros/BadRequestError"

export interface  CreateCommentInputDTO {
    postId:string,
    contentComment: string,
    token: string | undefined
}

export interface LikeDislikeCommentInputDTO {
    commentId: string,
    newLikeDislike: string,
    token: string | undefined
}

export class CommentDTO {
    public createPostInput(
        postId:string,
        contentComment: string,
        token: string | undefined):  CreateCommentInputDTO {
        if (contentComment !== undefined) {
            if (typeof contentComment !== "string") {
                throw new BadRequestError("'content' do comentario deve ser string.")
            }
        } else {
            throw new BadRequestError("'content' do comentario deve ser informado.")
        }
        const dto:CreateCommentInputDTO = {
            postId,
            contentComment,
            token
        }
        return dto
    }


   
}
