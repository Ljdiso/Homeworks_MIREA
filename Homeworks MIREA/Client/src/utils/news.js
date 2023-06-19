import api from "../http";

const route = '/news'

export default class News {
    static async createNews(title, content) {
        return api.post(`${route}`, {title, content})
    }

    static async getAllNews() {
        return api.get(`${route}/all`)
    }
}