import { mock } from "node:test"
import { UserBusiness } from "../../src/business/UserBusiness"
import { UserDTO } from "../../src/dto/userDTO"
import { TSignupRequest, USER_ROLES } from "../../src/types"
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

    test("cadastro bem-sucedido retorna token", async () => {
        const input: TSignupRequest = {
            email: "example@email.com",
            nickname: "Example Mock",
            password: "Bananinha1"
        }

        const response = await userBusiness.signUp(input)
        expect(response.token).toBe("token-mock-normal")
    })
})