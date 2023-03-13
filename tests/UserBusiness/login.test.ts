import { mock } from "node:test"
import { UserBusiness } from "../../src/business/UserBusiness"
import { UserDTO } from "../../src/dto/userDTO"
import { TLoginRequest, TSignupRequest, USER_ROLES } from "../../src/types"
import { HashManagerMock } from "../mocks/HashManagerMock"
import { IdGeneratorMock } from "../mocks/IdGeneratorMock"
import { TokenManagerMock } from "../mocks/TokenManagerMock"
import { UserDatabaseMock } from "../mocks/UserDatabaseMock"
import moment, { Moment } from 'moment'
import { BadRequestError } from "../../src/erros/BadRequestError"
import { NotFoundError } from "../../src/erros/NotFoundError"

describe("login", () => {
    const userBusiness = new UserBusiness(
        new UserDTO(),
        new UserDatabaseMock(),
        new IdGeneratorMock(),
        new TokenManagerMock(),
        new HashManagerMock()
    )

    test("login bem-sucedido em conta normal retorna token", async () => {
        const input: TLoginRequest= {
            email: "normal@email.com",
            password: "bananinha"
        }

        const response = await userBusiness.login(input)
        expect(response.token).toBe("token-mock-normal")
    })

    test("login bem-sucedido em conta admin retorna token", async () => {
        const input: TLoginRequest= {
            email: "admin@email.com",
            password: "bananinha"
        }

        const response = await userBusiness.login(input)
        expect(response.token).toBe("token-mock-admin")
    })

    test("deve disparar um erro caso email fornecido não seja encontrado", async () => {
        const input: TLoginRequest= {
            email: "nnormal@email.com",
            password: "bananinha"
        }
        expect(async () => {
            await userBusiness.login(input)
        }).rejects.toThrow("'email ou senha incorreto")

        expect(async () => {
            await userBusiness.login(input)
        }).rejects.toBeInstanceOf(NotFoundError)
    })

   


})