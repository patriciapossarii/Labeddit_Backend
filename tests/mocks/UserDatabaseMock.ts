import { BaseDatabase } from "../../src/database/BaseDatabase"
import { USER_ROLES } from "../../src/services/TokenManager"
import { UserDB } from "../../src/types"
import moment, { Moment } from 'moment'

export class UserDatabaseMock extends BaseDatabase {
    public static TABLE_USERS = "users"

    public insertUser = async (userDB: UserDB): Promise<void> => {
        // não precisa retornar nada, porque é void
    }


    public async findUsers(q: string | undefined): Promise<UserDB[]> {
        /*  if (q) {
              for (var user of this.users) {
                  if (user.nickname.toLowerCase().includes(q.toLowerCase())) {
                      return user
                  }
              }
  
          }
          return this.users*/

        var date = Date.now()
        let dateNow = (moment(date)).format('YYYY-MM-DD HH:mm:ss')

        switch (q) {
            case "Normal Mock":
                return [{
                    id: "id-mock",
                    nickname: "Normal Mock",
                    email: "normal@email.com",
                    password: "hash-bananinha",
                    role: USER_ROLES.USER,
                    created_at: dateNow,
                }]
            case "Admin Mock":
                return [{
                    id: "id-mock",
                    nickname: "Admin Mock",
                    email: "admin@email.com",
                    password: "hash-bananinha",
                    role: USER_ROLES.ADMIN,
                    created_at: dateNow

                }]
            default:
                return [{
                    id: "id-mock",
                    nickname: "Normal Mock",
                    email: "normal@email.com",
                    password: "hash-bananinha",
                    role: USER_ROLES.USER,
                    created_at: new Date().toISOString(),
                },
                {
                    id: "id-mock",
                    nickname: "Admin Mock",
                    email: "admin@email.com",
                    password: "hash-bananinha",
                    role: USER_ROLES.ADMIN,
                    created_at: new Date().toISOString()

                }
                ]
        }
    }

    /*
        users = [{
            id: "id-mock",
            nickname: "Normal Mock",
            email: "normal@email.com",
            role: USER_ROLES.USER,
            createdAt: new Date().toISOString(),
        },
        {
            id: "id-mock",
            nickname: "Admin Mock",
            email: "admin@email.com",
    
            role: USER_ROLES.ADMIN,
            createdAt: new Date().toISOString()
    
        }
        ]
    */


    public checkEmailUserExist = async (email: string): Promise<UserDB[]> => {
        switch (email) {
            case "normal@email.com":
                return [{
                    id: "id-mock",
                    nickname: "Normal Mock",
                    email: "normal@email.com",
                    password: "hash-bananinha",
                    role: USER_ROLES.USER,
                    created_at: new Date().toISOString(),
                }]
            case "admin@email.com":
                return [{
                    id: "id-mock",
                    nickname: "Admin Mock",
                    email: "admin@email.com",
                    password: "hash-bananinha",
                    role: USER_ROLES.ADMIN,
                    created_at: new Date().toISOString()

                }]
            default:
                return []
        }
    }



    public findEmail = async (email: string): Promise<UserDB | undefined> => {
        switch (email) {
            case "normal@email.com":
                return {
                    id: "id-mock",
                    nickname: "Normal Mock",
                    email: "normal@email.com",
                    password: "hash-bananinha",
                    role: USER_ROLES.USER,
                    created_at: new Date().toISOString(),

                }
            case "admin@email.com":
                return {
                    id: "id-mock",
                    nickname: "Admin Mock",
                    email: "admin@email.com",
                    password: "hash-bananinha",
                    role: USER_ROLES.ADMIN,
                    created_at: new Date().toISOString(),
                }
            default:
                return undefined
        }
    }




}
