import {defineStore} from 'pinia'
import {ref, computed} from 'vue'
import {authApi} from '@/api'
import type {UserInfoResponse} from '@/api/types'

export const useUserStore = defineStore('user', () => {
    const token = ref<string | null>(localStorage.getItem('token'))
    const userInfo = ref<UserInfoResponse | null>(null)
    const roles = ref<string[]>([])

    const isLoggedIn = computed(() => !!token.value)
    const username = computed(() => userInfo.value?.username || '')
    const realName = computed(() => userInfo.value?.realName || '')

    async function login(username: string, password: string) {
        const res = await authApi.login({username, password})
        if (res.code === 200 && res.data) {
            token.value = res.data.token
            localStorage.setItem('token', res.data.token)
            roles.value = res.data.roles || []
            return res
        }
        throw new Error(res.message || '登录失败')
    }

    async function fetchUserInfo() {
        if (!token.value) return null
        try {
            const res = await authApi.getUserInfo()
            if (res.code === 200 && res.data) {
                userInfo.value = res.data
                roles.value = res.data.roles || []
                return res.data
            }
        } catch (error) {
            // 网络错误或后端异常，不自动登出，让用户自己处理
            console.error('获取用户信息失败', error)
        }
        return null
    }

    function logout() {
        token.value = null
        userInfo.value = null
        roles.value = []
        localStorage.removeItem('token')
    }

    function hasRole(role: string) {
        return roles.value.includes(role)
    }

    return {
        token,
        userInfo,
        roles,
        isLoggedIn,
        username,
        realName,
        login,
        logout,
        fetchUserInfo,
        hasRole
    }
})
