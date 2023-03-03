import { UserDB } from "../types";
import { BaseDatabase } from "./BaseDatabase";

export class UserDatabase extends BaseDatabase {
    public static TABLE_USERS = "users"

    public async findUsers(q: string | undefined) {
        if (q) {
            const result: UserDB[] = await BaseDatabase
                .connection(UserDatabase.TABLE_USERS)
                .where("name", "LIKE", `%${q}%`)
            return result
        } else {
            const result: UserDB[] = await BaseDatabase
                .connection(UserDatabase.TABLE_USERS)
            return result
        }
    }


    public async checkEmailUserExist(email: string) {
        let usersDB
        const result = await BaseDatabase
            .connection(UserDatabase.TABLE_USERS)
            .where({ email: email })
        usersDB = result
        return usersDB
    }


    public async insertUser(newUserDB: UserDB) {
        await BaseDatabase
            .connection(UserDatabase.TABLE_USERS)
            .insert(newUserDB)
    }

    public findEmail = async (email: string) => {
        const result: UserDB[] = await BaseDatabase
            .connection(UserDatabase.TABLE_USERS)
            .select()
            .where({ email })
           return result[0]
    }

}