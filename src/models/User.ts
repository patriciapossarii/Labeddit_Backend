import { UserDB, USER_ROLES } from "../types"
import moment, { Moment } from 'moment'
var date = Date.now()
let dateNow = (moment(date)).format('YYYY-MM-DD HH:mm:ss')

export class User {    
    constructor(
        private id: string,
        private Nickname: string,
        private email: string,
        private password: string,
        private role: USER_ROLES,
        private createdAt: string = dateNow
    ) {}

    public getId(): string {
        return this.id
    } 
    public setId(value: string): void {
        this.id = value
    }

    public getNickname(): string {
        return this.Nickname
    }
    public setNickname(value: string): void {
        this.Nickname = value
    }

    public getEmail(): string {
        return this.email
    }
    public setEmail(value: string): void {
        this.email = value
    }

    public getPassword(): string {
        return this.password
    }
    public setPassword(value: string): void {
        this.password = value
    }

    public getRole(): USER_ROLES {
        return this.role
    }
    public setRole(value: USER_ROLES): void {
        this.role = value
    }

    public getCreatedAt(): string {
        return this.createdAt
    }
    public setCreatedAt(value: string): void {
        this.createdAt = value
    }

    
}