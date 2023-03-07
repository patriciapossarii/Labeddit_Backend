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

//===============================

export interface TPostRequest {
    content: string
}

export type TUserPost = {
    id: string,
    nickname: string
}

export interface PostWithUser {
    id: string,
    content: string,
    likes: number,
    dislikes: number,
    comments:string,
    createdAt: string,
    updatedAt: string,
    creator: TUserPost
}


export interface PostDB {
    id_post: string,
    id_creatorPost: string,
    content_post: string,
    likes_post: number,
    dislikes_post: number,
    comments_post:string,
    updated_at: string,
    created_at: string
}

