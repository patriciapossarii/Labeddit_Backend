import express, { Request, Response } from 'express'
import {
    TCommenttRequest,
    TPostRequest,
} from "../types"
import { CreatePostInputDTO, DeletePostInputDTO, EditPostInputDTO, GetPostsInputDTO, LikeDislikeInputDTO, PostDTO } from "../dto/postDTO";
import { PostBusiness } from "../business/PostBusiness";
import { BaseError } from '../erros/BaseError';
import { CommentDTO, CreateCommentInputDTO, GetCommentPostInputDTO, LikeDislikeCommentInputDTO } from '../dto/commentDTO';
import { CommentBusiness } from '../business/CommentBusiness';

export class PostContoller {
    constructor(
        private postDTO: PostDTO,
        private commentDTO: CommentDTO,
        private commentBusiness:CommentBusiness,
        private postBusiness: PostBusiness
        
    ) { }


    public getPosts = async (req: Request, res: Response) => {
        try {
            const request: GetPostsInputDTO = {
                q: req.query.q as string,
                token: req.headers.authorization
            }
            const input = this.postDTO.getPostInput(request.q, request.token as string)
            const output = await this.postBusiness.getPosts(input)
            res.status(200).send(output)
        } catch (error) {
            console.log(error)
            if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message)
            } else {
                res.send("Erro inesperado")
            }
        }
    }


    public createPost = async (req: Request, res: Response) => {
        try {
            const request = req.body as TPostRequest
            const input: CreatePostInputDTO = this.postDTO.createPostInput(
                request.content,
                req.headers.authorization as string)
            const output = await this.postBusiness.createPost(input)
            res.status(201).send(output)
        } catch (error) {
            console.log(error)
            if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message)
            } else {
                res.send("Erro inesperado")
            }
        }
    }


    public editPostById = async (req: Request, res: Response) => {
        try {
            const input: EditPostInputDTO = this.postDTO.editPostInput(
                req.headers.authorization as string,
                req.params['id'],
                req.body.content
            )
            const output = await this.postBusiness.editPostById(input)
            res.status(200).send(output)
        } catch (error) {
            console.log(error)
            if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message)
            } else {
                res.send("Erro inesperado")
            }
        }
    }

    public deletPostById = async (req: Request, res: Response) => {
        try {
            const input: DeletePostInputDTO = this.postDTO.deletePostInput(
                req.headers.authorization as string,
                req.params['id']
            )
            const output = await this.postBusiness.deletPostById(input)
            res.status(200).send(output)
        } catch (error) {
            console.log(error)
            if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message)
            } else {
                res.send("Erro inesperado")
            }
        }
    }


    public likeDislike = async (req: Request, res: Response) => {
        try {
            const input: LikeDislikeInputDTO = {
                postId: req.params.id,
                newLikeDislike: req.body.like,
                token: req.headers.authorization
            }
            const output = await this.postBusiness.likeDislike(input)
            res.status(200).send(output)
        } catch (error) {
            console.log(error)
            if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message)
            } else {
                res.send("Erro inesperado")
            }
        }
    }


    public createComment = async (req: Request, res: Response) => {
        try {
            const request = req.body as TCommenttRequest
            const input: CreateCommentInputDTO = this.commentDTO.createPostInput(
                req.params.id,
                request.content,
                req.headers.authorization as string)
            const output = await this.commentBusiness.createComment(input)
            res.status(201).send(output)
        } catch (error) {
            console.log(error)
            if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message)
            } else {
                res.send("Erro inesperado")
            }
        }
    }


    public likeDislikeComment = async (req: Request, res: Response) => {
        try {
            const input: LikeDislikeCommentInputDTO= {
               commentId: req.params.id,
                newLikeDislike: req.body.like,
                token: req.headers.authorization
            }
            
            const output = await this.commentBusiness.likeDislikeComment(input)
            res.status(200).send(output)
        } catch (error) {
            console.log(error)
            if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message)
            } else {
                res.send("Erro inesperado")
            }
        }
    }


    public getCommentsPosts = async (req: Request, res: Response) => {
        try {
            const request: GetCommentPostInputDTO = {
                postId: req.params.id,
                token: req.headers.authorization
            }
            console.log("========================",request)
            const input = this.commentDTO.getCommentPostInput(request.postId, request.token as string)
            const output = await this.commentBusiness.getCommentsPosts(input)
            res.status(200).send(output)
        } catch (error) {
            console.log(error)
            if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message)
            } else {
                res.send("Erro inesperado")
            }
        }
    }

}