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

//=============================== POST
//=============================== POST

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
    likesDislikes: number,
    comments: number,
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
    comments_post: number,
    updated_at: string,
    created_at: string
}


//=============================== COMMENT



export interface CommentDB {
    id_comment: string,
    id_creatorComment: string,
    id_postComment: string,
    content_comment: string,
    likes_comment: number,
    dislikes_comment: number,
    updated_at: string,
    created_at: string
}



export interface TCommenttRequest {
    content: string
}
export type TCommentPost = {
    idComment: string,
    nickname:string,
    contentComment: string,
    likesDislikes: number,

}

export interface PostComments {
    idPost: string,
    nickname:string,
    content: string,
    likesDislikes: number,
    qtdComments: number,
    comments: TCommentPost[]
}