import { defineStore, acceptHMRUpdate } from "pinia"
import { mande } from "mande"
import { sha256 } from "js-sha256"

const users = mande("http://localhost:8080/api/users")

type UserType = "admin" | "teacher" | "student"
interface UserInfo {
	name: string
	number: string
	department: string
	type: UserType
}
interface UserManageState {
	users: UserInfo[]
	total: number
	page: number
}
interface Response {
	code: number
	message: string
	data: Record<string, any>
}
interface RetType {
	code: number
	message: string
}
export const useUserManageStore = defineStore({
	id: "user_manage",
	state: (): UserManageState => ({
		users: [],
		total: 0,
		page: 1
	}),
	actions: {
		async getusers() {
			try {
				const res = await users.get<Response>('', {
					query: {
						page: this.page
					}
				})
				if (res.code === 0) {
					this.$patch({
						users: res.data.users as UserInfo[],
						total: res.data.total
					})
					return { code: 0, message: '查询成功' }
				} else {
					return { code: 1, message: '查询失败' }
				}
			} catch (err) {
				return { code: 1, message: err as string }
			}
		},
		async createUser(
			name: string,
			number: string,
			passwd: string,
			department: string,
			type: UserType
		) {
			const res = await users.post("create", {
				name,
				number,
				passwd,
				department,
				type,
			})
			return res
		},
	},
})
if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useUserManageStore, import.meta.hot))
}
