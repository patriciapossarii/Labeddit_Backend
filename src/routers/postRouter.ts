import express from "express"
import { PostBusiness } from "../business/PostBusiness"
import { PostContoller } from "../contoller/PostController"
import { PostDatabase } from "../database/PostDatabase"
import { UserDatabase } from "../database/UserDatabase"
import { PostDTO } from "../dto/PostDTO"
import { IdGenerator } from "../services/IdGenerator"
import { TokenManager } from "../services/TokenManager"

export const postRouter = express.Router()

const postController = new PostContoller(
    new PostDTO(),
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
