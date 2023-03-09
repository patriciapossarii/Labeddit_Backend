import { BadRequestError } from "../erros/BadRequestError"
import { PostDB, PostWithUser, USER_ROLES } from "../types"
import moment, { Moment } from 'moment'
import { IdGenerator } from "../services/IdGenerator"
import { TokenManager } from "../services/TokenManager"
import { Post } from "../models/Post"
import { CreatePostInputDTO, DeletePostInputDTO, EditPostInputDTO, GetPostsInputDTO, LikeDislikeInputDTO, PostDTO } from "../dto/postDTO"
import { PostDatabase } from "../database/PostDatabase"

export class PostBusiness {
    constructor(
        private postDTO: PostDTO,
        private postDatabase: PostDatabase,
        private idGenerator: IdGenerator,
        private tokenManager: TokenManager
    ) { }

    public getPosts = async (input: GetPostsInputDTO) => {
        const { q, token } = input
        const payload = this.tokenManager.getPayload(token as string)
        if (payload === null) {
            throw new BadRequestError("'token' invalido")
        }
        const result: PostWithUser[] = []
        const posts = await this.postDatabase.postUser(q)
    
        for (let post of posts) {
           
            let postWithUser: PostWithUser = {
                id: post.id,
                content: post.content,
                likes: post.likes,
                dislikes: post.dislikes,
                comments: post.comments,
                createdAt: post.createdAt,
                updatedAt: post.updateAt,
                creator: {
                    id: post.uid,
                    nickname: post.nickname
                }
            }
            result.push(postWithUser)
        }
        const output = this.postDTO.getPostOutput(result)
        return output
    }


    public createPost = async (input: CreatePostInputDTO) => {
        const { content, token } = input
        const payload = this.tokenManager.getPayload(token as string)
        if (payload === null) {
            throw new BadRequestError("'token' invalido")
        }
        if (payload.role !== USER_ROLES.USER) {
            throw new BadRequestError("Acesso Negado! Somente usuários podem criar posts")
        }
        if (content.length < 2) {
            throw new BadRequestError("'content' do post inválido. Deve conter no mínimo 2 caracteres")
        }
        let myuuid = this.idGenerator.generate()

        const newPost = new Post(
            myuuid,
            payload?.id as string,
            content,
        )
        const newPostDB: PostDB = {
            id_post: newPost.getId(),
            id_creatorPost: newPost.getCreatorId(),
            content_post: newPost.getContent(),
            likes_post: newPost.getLikes(),
            dislikes_post: newPost.getDislikes(),
            comments_post: newPost.getCommentsPost(),
            updated_at: newPost.getUpdatedAt(),
            created_at: newPost.getCreatedAt()
        }
        await this.postDatabase.insertPost(newPostDB)
        const output = {
            message: "Post registrado com sucesso",
        }
        return output
    }


    public editPostById = async (input: EditPostInputDTO) => {
        const { token, idToEdit, newContent } = input

        const payload = this.tokenManager.getPayload(token as string)
        if (payload === null) {
            throw new BadRequestError("'token' invalido")
        }
        if (payload.role !== USER_ROLES.ADMIN && payload.role !== USER_ROLES.USER) {
            throw new BadRequestError("Acesso Negado! Seu acesso é de usuário")
        }
        const userId = payload?.id as string

        if (newContent.length < 2) {
            throw new BadRequestError("'content' do post inválido. Deve conter no mínimo 2 caracteres")
        }
        const postToEditDB = await this.postDatabase.findPostById(idToEdit)
        if (!postToEditDB) {
            throw new BadRequestError("'id' para editar não existe")
        }

        if (postToEditDB.id_creatorPost === userId) {
            var date = Date.now()
            let dateNow = (moment(date)).format('YYYY-MM-DD HH:mm:ss')
            const post = new Post(
                postToEditDB.id_post,
                postToEditDB.id_creatorPost,
                newContent  || postToEditDB.content_post,
                postToEditDB.likes_post,
                postToEditDB.dislikes_post,
                postToEditDB.comments_post,
                dateNow,
                postToEditDB.created_at
            )
            const updatePostDB: PostDB = {
                id_post: post.getId(),
                id_creatorPost: post.getCreatorId(),
                content_post: post.getContent(),
                likes_post: post.getLikes(),
                dislikes_post: post.getDislikes(),
                comments_post: post.getCommentsPost(),
                updated_at: post.getUpdatedAt(),
                created_at: post.getCreatedAt()
            }
            await this.postDatabase.updatePost(updatePostDB)
            const output = {
                message: "Post editado com sucesso",
            }
            return output
        } else {
            throw new BadRequestError("Somente o criador do post pode editá-lo")
        }
    }


    public deletPostById = async (input: DeletePostInputDTO) => {
        const { token, idToDelet } = input
        const payload = this.tokenManager.getPayload(token as string)
        if (payload === null) {
            throw new BadRequestError("'token' invalido")
        }
        const userId = payload?.id as string
        if (idToDelet === ":id") {
            throw new BadRequestError("'id' do post deve ser informado")
        }
        const postToDeletBD = await this.postDatabase.findPostById(idToDelet)
        if (!postToDeletBD) {
            throw new BadRequestError("'id' para deletar não existe")
        }
        if (postToDeletBD.id_creatorPost === userId || payload.role === USER_ROLES.ADMIN) {
            await this.postDatabase.deleteLikesInDeletePost(idToDelet)
            await this.postDatabase.deletePostById(postToDeletBD.id_post)
            const output = {
                message: "Post deletado com sucesso"
            }
            return output
        } else {
            throw new BadRequestError("Somente que criou o post ou o admin pode deletá-lo")
        }
    }


    public likeDislike = async (input: LikeDislikeInputDTO) => {
        const { postId, newLikeDislike, token } = input
        const payload = this.tokenManager.getPayload(token as string)
        if (payload === null) {
            throw new BadRequestError("'token' invalido")
        }
        if (payload.role !== USER_ROLES.USER) {
            throw new BadRequestError("Acesso Negado! Seu acesso é de usuário")
        }
        const userId = payload?.id as string
        const postExistDB = await this.postDatabase.findPostById(postId)
        if (!postExistDB) {
            throw new BadRequestError("'id' do post não existe")
        }
        if (typeof newLikeDislike !== "boolean") {
            throw new BadRequestError("'like' do post deve ser boolean (true ou false).")
        }
        let value = 0
        if (newLikeDislike === true) {
            value = 1
        }
        const checkLikeDislike = await this.postDatabase.checkPostWithLike(userId, postId)
        if (postExistDB.id_creatorPost === userId) {
            throw new BadRequestError("Você não pode curtir seu proprio post")
        }
        
        if (checkLikeDislike.length >= 1) {
            if (checkLikeDislike[0].like_post === value) {
                if (value === 1) {
                    postExistDB.likes_post = postExistDB.likes_post  - 1
                } else {
                    postExistDB.dislikes_post  = postExistDB.dislikes_post  - 1
                }
                await this.postDatabase.removeLikeDislike(userId, postId)
                await this.postDatabase.updatePost(postExistDB)
            } else {
                if (checkLikeDislike[0].like_post === 1) {
                    postExistDB.dislikes_post  = postExistDB.dislikes_post  + 1
                    postExistDB.likes_post  = postExistDB.likes_post  - 1

                } else {
                    if (postExistDB.dislikes_post  >= 1) {
                        postExistDB.dislikes_post  = postExistDB.dislikes_post  - 1
                        postExistDB.likes_post  = postExistDB.likes_post  + 1
                    }
                    await this.postDatabase.updatetLikeDislike(value, userId, postId)
                    await this.postDatabase.updatePost(postExistDB)

                }
                await this.postDatabase.updatetLikeDislike(value, userId, postId)
                await this.postDatabase.updatePost(postExistDB)
            }
        } else {
            await this.postDatabase.insertLikeDislike(userId, postId, value)
            if (value === 1) {
                postExistDB.likes_post  = postExistDB.likes_post  + 1
            } else {
                postExistDB.dislikes_post  = postExistDB.dislikes_post  + 1

            }
            await this.postDatabase.updatePost(postExistDB)

        }
        const output = {
            message: "Like / Dislike editado com sucesso",
        }
        return output
    }

}