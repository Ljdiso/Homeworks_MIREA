import {makeAutoObservable} from 'mobx';
import User from "../utils/user";
import News from "../utils/news";

export default class Store {
    user = {}
    isAuth = false
    isLoading = false

    constructor() {
        makeAutoObservable(this)
    }

    setAuth(bool) {
        this.isAuth = bool
    }

    setUser(user) {
        this.user = user
    }

    setLoading(bool) {
        this.isLoading = bool
    }

    readAccessToken = () => {
        return localStorage.getItem('access_token')
    }

    async login(email, password, remember) {
        try {
            const response = await User.login(email, password, remember)
            localStorage.setItem('access_token', response.data.Token.access_token)
            this.setAuth(true)
            this.setUser(response.data.User)
        } catch (e) {
            throw e
        }
    }

    async createUser(email, password, firstName, lastName, middleName) {
        try {
            const response = await User.createUser(email, password, firstName, lastName, middleName)
            localStorage.setItem('access_token', response.data.Token.access_token)
            this.setAuth(true)
            this.setUser(response.data.User)
        } catch (e) {
            throw e
        }
    }

    async logout() {
        try {
            const response = await User.logout()
            localStorage.removeItem('access_token')
            this.setAuth(false)
            this.setUser({})
        } catch (e) {
            console.log(e)
        }
    }

    async checkAccess() {
        this.setLoading(true)
        try {
            const response = await User.getCurrentUser()
            this.setAuth(true)
            this.setUser(response.data)
            return true
        } catch (e) {
            console.log(e.response?.data?.message)
        } finally {
            this.setLoading(false)
        }
    }

    async getAvatarCurrentUser() {
        try {
            const response = await User.getAvatarCurrentUser()
            return response.data
        } catch (e) {
            console.log(e.response?.data?.message)
        }
    }

    async updateAvatarCurrentUser(avatar) {
        try {
            const response = await User.updateAvatarCurrentUser(avatar)
        } catch (e) {
            console.log(e.response?.data?.message)
        }
    }

    async createNews(title, content) {
        try {
            const response = await News.createNews(title, content)
        } catch (e) {
            console.log(e.response?.data?.message)
        }
    }

    async getAllNews() {
        try {
            const response = await News.getAllNews()
            return response.data
        } catch (e) {
            console.log(e.response?.data?.message)
        }
    }
}