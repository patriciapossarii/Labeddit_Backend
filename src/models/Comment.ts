import moment, { Moment } from 'moment'
var date = Date.now()
let dateNow = (moment(date)).format('YYYY-MM-DD HH:mm:ss')
export class Comment {

    constructor(
        private idComment: string,
        private idCreatorComment: string,
        private idPostComment: string,
        private contentComment: string,
        private likes: number = 0,
        private dislikes: number = 0,
        private createdAt: string = dateNow,
        private updatedAt: string = dateNow
    ) { }

    public getIdComment(): string {
        return this.idComment
    }
    public setIdComment(value: string): void {
        this.idComment = value
    }


    public getIdCreatorComment(): string {
        return this.idCreatorComment
    }
    public setIdCreatorComment(value: string): void {
        this.idCreatorComment = value
    }


    public getIdPostComment(): string {
        return this.idPostComment
    }
    public setIdPostComment(value: string): void {
        this.idPostComment = value
    }


    public getContentComment(): string {
        return this.contentComment
    }
    public setContentComment(value: string): void {
        this.contentComment = value
    }


    public getLikes(): number {
        return this.likes
    }
    public setLikes(value: number): void {
        this.likes = value
    }


    public getDislikes(): number {
        return this.dislikes
    }
    public setDislikes(value: number): void {
        this.dislikes = value
    }


    public getCreatedAt(): string {
        return this.createdAt
    }
    public setCreatedAt(value: string): void {
        this.createdAt = value
    }


    public getUpdatedAt(): string {
        return this.updatedAt
    }
    public setUpdatedAt(value: string): void {
        this.updatedAt = value
    }
}