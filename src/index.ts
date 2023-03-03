import express, { Request, Response } from 'express'
import cors from 'cors'
import { db } from './database/knex'
import dotenv from 'dotenv'
import { userRouter } from './routers/userRouter'

dotenv.config()
const app = express()

app.use(cors())
app.use(express.json())

app.listen(Number(process.env.PORT), () => {
    console.log(`Servidor rodando na porta ${Number(process.env.PORT)}`)
})

app.get("/ping", async (req: Request, res: Response) => {
    try {
				const result = await db("users")
        res.status(200).send({ message: "Pong!", result })
    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})

app.use("/users",userRouter)