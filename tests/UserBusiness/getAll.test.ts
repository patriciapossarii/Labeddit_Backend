import { mock } from "node:test"
import { UserBusiness } from "../../src/business/UserBusiness"
import { UserDTO } from "../../src/dto/userDTO"
import { USER_ROLES } from "../../src/types"
import { HashManagerMock } from "../mocks/HashManagerMock"
import { IdGeneratorMock } from "../mocks/IdGeneratorMock"
import { TokenManagerMock } from "../mocks/TokenManagerMock"
import { UserDatabaseMock } from "../mocks/UserDatabaseMock"
import moment, { Moment } from 'moment'
import { BadRequestError } from "../../src/erros/BadRequestError"

describe("login", () => {
    const userBusiness = new UserBusiness(
        new UserDTO(),
        new UserDatabaseMock(),
        new IdGeneratorMock(),
        new TokenManagerMock(),
        new HashManagerMock()
    )


    test("Dado que o administrador do sistema deseja pesquisar um usuário, quando informar o nome `Normal Mock`, então é trazido os dados do usuário pesquisado", async () => {
        const input = {
            q: "Normal Mock",
            token: "token-mock-admin"
        }
        const response = await userBusiness.getUsers(input)
        var date = Date.now()
        let dateNow = (moment(date)).format('YYYY-MM-DD HH:mm:ss')
        expect(response).toEqual(
            [{
                id: "id-mock",
                nickname: "Normal Mock",
                email: "normal@email.com",
                role: USER_ROLES.USER,
                createdAt: dateNow,
            }]
        )
    })
    test("Dado que o token inválido do administrador do sistema deseja pesquisar um usuário, quando informar o nome `Normal Mock`, então é trazido mensagem de erro", async () => {
        expect.assertions(2)
        try {
            const input = {
                q: "Normal Mock",
                token: "token-mock-inválido"
            }
            const response = await userBusiness.getUsers(input)
            var date = Date.now()
            let dateNow = (moment(date)).format('YYYY-MM-DD HH:mm:ss')
            expect(response).toEqual(
                [{
                    id: "id-mock",
                    nickname: "Normal Mock",
                    email: "normal@email.com",
                    role: USER_ROLES.USER,
                    createdAt: dateNow,
                }]
            )
        } catch (error) {
            if (error instanceof BadRequestError) {
                expect(error.message).toBe("'token' invalido")
                expect(error.statusCode).toBe(400)
            }
        }
    })

    test("Dado que o um usuário sistema deseja pesquisar um usuário, quando informar o nome `Normal Mock`, então é trazido mensagem de erro", async () => {
        expect.assertions(2)
        try {
            const input = {
                q: "Normal Mock",
                token:"token-mock-normal"
            }
            const response = await userBusiness.getUsers(input)
            var date = Date.now()
            let dateNow = (moment(date)).format('YYYY-MM-DD HH:mm:ss')
            expect(response).toEqual(
                [{
                    id: "id-mock",
                    nickname: "Normal Mock",
                    email: "normal@email.com",
                    role: USER_ROLES.USER,
                    createdAt: dateNow,
                }]
            )
        } catch (error) {
            if (error instanceof BadRequestError) {
                expect(error.message).toBe("Acesso Negado! Seu acesso é de usuário")
                expect(error.statusCode).toBe(400)
            }
        }
    })

})