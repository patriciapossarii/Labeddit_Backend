import {  USER_ROLES } from "../../src/types"
import { TokenPayload } from "../../src/services/TokenManager"

export class TokenManagerMock {

    public createToken = (payload: TokenPayload): string => {
        if (payload.role == USER_ROLES.USER) {
            return "token-mock-normal"
        } else {
            return "token-mock-admin"
        }
    }

    public getPayload = (token: string): TokenPayload | null => {
        if (token == "token-mock-normal") {
            return {
                id: "id-mock",
                nickname: "Normal Mock",
                role: USER_ROLES.USER
            }

        } else if (token == "token-mock-admin") {
            return {
                id: "id-mock",
                nickname: "Admin Mock",
                role: USER_ROLES.ADMIN
            }

        } else {
            return null
        }
    }
}