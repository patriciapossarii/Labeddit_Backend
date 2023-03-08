import express from "express"
import { CommentBusiness } from "../business/CommentBusiness"
import { PostBusiness } from "../business/PostBusiness"
import { PostContoller } from "../contoller/PostController"
import { CommentDatabase } from "../database/CommentDatabase"
import { PostDatabase } from "../database/PostDatabase"
import { UserDatabase } from "../database/UserDatabase"
import { CommentDTO } from "../dto/commentDTO"
import { PostDTO } from "../dto/PostDTO"
import { IdGenerator } from "../services/IdGenerator"
import { TokenManager } from "../services/TokenManager"

export const postRouter = express.Router()

const postController = new PostContoller(
    new PostDTO(),
    new CommentDTO(),
    new CommentBusiness(
        new CommentDatabase(),
        new PostDatabase(),
        new IdGenerator(),
        new TokenManager()
    ),
    new PostBusiness(
        new PostDTO(),
        new PostDatabase(),
        new IdGenerator(),
        new TokenManager()

    )
)

postRouter.get("/", postController.getPosts)
postRouter.post("/", postController.createPost)
postRouter.put("/:id", postController.editPostById)
postRouter.delete("/:id", postController.deletPostById)
postRouter.put("/:id/like", postController.likeDislike)
postRouter.post("/:id/comment", postController.createComment)
//postRouter.get("/:id/comment", postController.getComment)


postRouter.post("/:id/comment/:idComment/like", postController.likeDislikeComment)
