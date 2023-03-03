import { UserDatabase } from "../database/UserDatabase"
import { GetUserInputDTO, LoginUserInputDTO, SignupUsertInputDTO, UserDTO } from "../dto/userDTO"
import { BadRequestError } from "../erros/BadRequestError"
import { NotFoundError } from "../erros/NotFoundError"
import { User } from "../models/User"
import { HashManager } from "../services/HashManager"
import { IdGenerator } from "../services/IdGenerator"
import { TokenManager, TokenPayload } from "../services/TokenManager"
import { UserDB, USER_ROLES } from "../types"


export class UserBusiness {
    constructor(
        private userDTO: UserDTO,
        private userDatabase: UserDatabase,
        private idGenerator: IdGenerator,
        private tokenManager: TokenManager,
        private hashManager: HashManager
    ) { }

    public getUsers = async (input:GetUserInputDTO) => {
        const { q, token } = input
        const payload = this.tokenManager.getPayload(token as string)
        if (payload === null) {
            throw new BadRequestError("'token' invalido")
        }
        if (payload.role !== USER_ROLES.ADMIN) {
            throw new BadRequestError("Acesso Negado! Seu acesso é de usuário")
        }
        const teste = await this.userDatabase.findUsers(q)
        const users: User[] = teste.map((userDB) => new User(
            userDB.id,
            userDB.nickname,
            userDB.email,
            "",
            userDB.role,
            userDB.created_at
        ))
        const output = this.userDTO.getUserOutput(users)
        return output
    }

    public signUp = async (input: SignupUsertInputDTO) => {
        if (input.nickname.length < 2) {
            throw new BadRequestError("'nickname' do usuário inválido. Deve conter no mínimo 2 caracteres")
        }
        const expression: RegExp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i
        if (expression.test(input.email) != true) {
            throw new BadRequestError("'email'do usuário em formato inválido. Ex.: 'exemplo@exemplo.com'.")
        }
        console.log("===========================",input.email)
        const emailExists = await this.userDatabase.checkEmailUserExist(input.email)
        if (emailExists.length >= 1) {
            throw new BadRequestError("'email' do usuário já existente.")
        }
        
        if (!input.password.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{4,12}$/g)) {
            throw new BadRequestError("'password' do usuário em formato inválido. Deve conter entre 4 a 12 caracteres, com 1 letra maiuscula, 1 letra minúscula, 1 número.")
        }
        const passwordHash = await this.hashManager.hash(input.password)
        let myuuid = this.idGenerator.generate()
        const newUser = new User(
            myuuid,
            input.nickname,
            input.email,
            passwordHash,
            USER_ROLES.USER
        )
        const newUserDB: UserDB = {
            id: newUser.getId(),
            nickname: newUser.getNickname(),
            email: newUser.getEmail(),
            password: newUser.getPassword(),
            role: newUser.getRole(),
            created_at: newUser.getCreatedAt()
        }
        await this.userDatabase.insertUser(newUserDB)
        const tokenPayLoad: TokenPayload = {
            id: newUser.getId(),
            nickname: newUser.getNickname(),
            role: newUser.getRole()
        }
        const token = this.tokenManager.createToken(tokenPayLoad)
        const output = this.userDTO.signupUserOutout(token)
        return output
    }


    public login = async (request: LoginUserInputDTO) => {
        const expression: RegExp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i
        if (expression.test(request.email) != true) {
            throw new BadRequestError("'email'do usuário em formato inválido. Ex.: 'exemplo@exemplo.com'.")
        }
        const email = request.email
        const userDB: UserDB | undefined = await this.userDatabase.findEmail(email)
        if (!userDB) {
            throw new NotFoundError("'email ou senha incorreto")
        }

        const passwordHash = await this.hashManager.compare(request.password, userDB.password)
            
        if (!passwordHash) {
            throw new NotFoundError("'email ou senha incorreto")
        }

        const tokenPayLoad: TokenPayload = {
            id: userDB.id,
            nickname: userDB.nickname,
            role: userDB.role
        }
        const token = this.tokenManager.createToken(tokenPayLoad)
        const output = this.userDTO.loginUserOutput(token)
        return output

    }
}