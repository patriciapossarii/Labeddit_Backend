import { CommentDatabase } from "../database/CommentDatabase"
import { PostDatabase } from "../database/PostDatabase"
import { CommentDTO, CreateCommentInputDTO, GetCommentPostInputDTO, LikeDislikeCommentInputDTO } from "../dto/commentDTO"
import { BadRequestError } from "../erros/BadRequestError"
import { IdGenerator } from "../services/IdGenerator"
import { TokenManager } from "../services/TokenManager"
import { CommentDB, PostComments, TCommentPost, USER_ROLES } from "../types"
import { Comment } from "../models/Comment"

export class CommentBusiness {
    constructor(
        private commentDTO: CommentDTO,
        private commentDatabase: CommentDatabase,
        private postDatabase: PostDatabase,
        private idGenerator: IdGenerator,
        private tokenManager: TokenManager
    ) { }


    public getCommentsPosts = async (input: GetCommentPostInputDTO) => {
        const { postId, token } = input
        const payload = this.tokenManager.getPayload(token as string)
        if (payload === null) {
            throw new BadRequestError("'token' invalido")
        }
        const result: TCommentPost[] = []
        const post = await this.postDatabase.findPostById(postId)
        const nickNamePost = await this.postDatabase.postNickName(postId)
        const comments = await this.commentDatabase.nickNamePostComments(postId)

        
        for (let comment of comments) {
            let comments = {
                idComment: comment.idComment,
                nickname: comment.nicknamecomment,
                contentComment: comment.contentComment,
                likesDislikes: comment.likesComment - comment.dislikesComment
            }
            result.push(comments)
        }

        let postWithComment: PostComments = {
            idPost: post.id_post,
            nickname: nickNamePost.nickname,
            content: post.content_post,
            likesDislikes: post.likes_post - post.dislikes_post,
            qtdComments: post.comments_post,
            comments: result
        }

        const output = this.commentDTO.getPostWithCommentsOutput(postWithComment)
        return output
    }


    public createComment = async (input: CreateCommentInputDTO) => {
        const { postId, contentComment, token } = input
        const payload = this.tokenManager.getPayload(token as string)
        if (payload === null) {
            throw new BadRequestError("'token' invalido")
        }
        if (payload.role !== USER_ROLES.USER) {
            throw new BadRequestError("Acesso Negado! Somente usuários podem criar comentários")
        }
        if (contentComment.length < 1) {
            throw new BadRequestError("'content' do post inválido. Deve conter no mínimo 1 caracteres")
        }
        const userId = payload?.id as string
        const postExistDB = await this.postDatabase.findPostById(postId)
        if (!postExistDB) {
            throw new BadRequestError("'id' do post não existe")
        }

        let idComment = this.idGenerator.generate()


        const newComment = new Comment(
            idComment,
            userId,
            postId,
            contentComment
        )

        const newCommentDB: CommentDB = {
            id_comment: newComment.getIdComment(),
            id_creatorComment: newComment.getIdCreatorComment(),
            id_postComment: newComment.getIdPostComment(),
            content_comment: newComment.getContentComment(),
            likes_comment: newComment.getLikes(),
            dislikes_comment: newComment.getDislikes(),
            updated_at: newComment.getUpdatedAt(),
            created_at: newComment.getCreatedAt(),
        }

        postExistDB.comments_post = postExistDB.comments_post + 1
        await this.commentDatabase.insertCommentInComments(newCommentDB)

        await this.postDatabase.updatePost(postExistDB)
        const output = {
            message: "Comentário registrado com sucesso",
        }
        return output
    }



    public likeDislikeComment = async (input: LikeDislikeCommentInputDTO) => {
        const { commentId, newLikeDislike, token } = input
        const payload = this.tokenManager.getPayload(token as string)
        if (payload === null) {
            throw new BadRequestError("'token' invalido")
        }
        if (payload.role !== USER_ROLES.USER) {
            throw new BadRequestError("Acesso Negado! Seu acesso é de usuário")
        }
        const userId = payload?.id as string
        console.log("AQUIIIIIIIIIIIIIIIIIII",commentId)
        const commentExistDB = await this.commentDatabase.findCommentById(commentId)
        console.log("AQUIIIIIIIIIIIIIIIIIII",commentExistDB)
        if (!commentExistDB) {
            throw new BadRequestError("'id' do comentário não existe")
        }
        if (typeof newLikeDislike !== "boolean") {
            throw new BadRequestError("'like' do comentário deve ser boolean (true ou false).")
        }
        let value = 0
        if (newLikeDislike === true) {
            value = 1
        }
        const checkLikeDislikeComment = await this.commentDatabase.checkCommentWithLike(userId, commentId)
        
        if (commentExistDB.id_creatorComment === userId) {
            throw new BadRequestError("Você não pode curtir seu proprio post")
        }

        if (checkLikeDislikeComment.length >= 1) {
            if (checkLikeDislikeComment[0].like_comment === value) {
                if (value === 1) {
                    commentExistDB.likes_comment = commentExistDB.likes_comment - 1
                } else {
                    commentExistDB.dislikes_comment = commentExistDB.dislikes_comment - 1
                }
                await this.commentDatabase.removeLikeDislike(userId, commentId)
                await this.commentDatabase.updateComment(commentExistDB)
            } else {
                if (checkLikeDislikeComment[0].like_comment === 1) {
                    commentExistDB.dislikes_comment = commentExistDB.dislikes_comment + 1
                    commentExistDB.likes_comment = commentExistDB.likes_comment - 1

                } else {

                    commentExistDB.dislikes_comment = commentExistDB.dislikes_comment - 1
                    commentExistDB.likes_comment = commentExistDB.likes_comment + 1

                    await this.commentDatabase.updatetLikeDislike(value, userId, commentId)
                    await this.commentDatabase.updateComment(commentExistDB)

                }
                await this.commentDatabase.updatetLikeDislike(value, userId, commentId)
                await this.commentDatabase.updateComment(commentExistDB)
            }
        } else {
            await this.commentDatabase.insertLikeDislike(userId, commentId, value)
            if (value === 1) {
                commentExistDB.likes_comment = commentExistDB.likes_comment + 1
            } else {
                commentExistDB.dislikes_comment = commentExistDB.dislikes_comment + 1

            }
            await this.commentDatabase.updateComment(commentExistDB)

            
        }

        
        const output = {
            message: "Like / Dislike editado com sucesso",
        }
        return output
    }

}