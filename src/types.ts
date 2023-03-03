export enum USER_ROLES {
    USER = "USER",
    ADMIN = "ADMIN"
}

export interface UserDB {
    id: string,
    nickname: string,
    email: string,
    password: string,
    role: USER_ROLES,
    created_at: string
}


export interface TSignupRequest {
    nickname: string,
    email: string,
    password: string,
}

export interface TLoginRequest {
    email: string,
    password: string,
}

