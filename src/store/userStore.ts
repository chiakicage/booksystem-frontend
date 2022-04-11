import { defineStore, acceptHMRUpdate } from 'pinia'
import { mande } from 'mande'
import { sha256 } from "js-sha256"

const users = mande('http://localhost:8080/api/users')

type UserType = 'admin' | 'teacher' | 'student'
interface UserState {
	name: string,
	number: string,
	department: string,
	type: UserType,
	logined: boolean
}
interface Response {
	code: number,
	message: string,
	data: Record<string, any>
}
interface RetType {
	code: number,
	message: string
}
export const useUserStore = defineStore({
	id: 'user',
	state: () : UserState => ({
		name: '请登录',
		number: '',
		department: '',
		type: 'student',
		logined: false
	}),
	actions: {
		async login(number: string, passwd: string): Promise<RetType> {
			try {
				const user = await users.get<Response>('login', {
					query: {
						number,
						passwd: sha256(passwd + '_librarysys')
					}
				})
				console.log(user)
				if (user.code === 0) {
					this.$patch({
						logined: true,
						...user.data
					})
					return { code: 0, message: '登录成功' }
				} else {
					return { code: 1, message: '登录失败' }
				}
			} catch (err) {
				return { code: 1, message: err as string }
			}
			
		},
		async check() {
			const user = await users.get<Response>('check')
			if (user.code === 0) {
				this.$patch({
					logined: true,
					...user.data,
				})
			} else {
				this.$reset()
			}
		},
		async logout(): Promise<RetType> {
			if (this.logined) {
				try {
					await users.get('logout')
					this.$reset()
					return { code: 0, message: '退出成功' }

				} catch (err) {
					return { code: 1, message: err as string }
				}
			} else {
				return { code: 0, message: '退出成功' }
			}
		},
		async createUser(name: string, number: string, passwd: string, department: string, type: UserType) {
			const res = await users.post('create', {
				name, 
				number,
				passwd,
				department,
				type
			})
			return res
		}
	}
})
if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot))
}
