import api from "../http";

const route = '/user'

export default class User {
    static async login(email, password, remember_me) {
        return api.post(`${route}/login/`, {email, password, remember_me})
    }

    static async createUser(email, password, first_name, last_name, middle_name) {
        return api.post(`${route}`, {email, password, first_name, last_name, middle_name})
    }

    static async logout() {
        return api.delete(`${route}/login`)
    }

    static async getCurrentUser() {
        return api.get(`${route}/curr`)
    }

    static async getAvatarCurrentUser() {
        return api.get(`${route}/curr/avatar`)
    }

    static async updateAvatarCurrentUser(avatar) {
        return api.patch(`${route}/curr/avatar`, {avatar}, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
    }
}