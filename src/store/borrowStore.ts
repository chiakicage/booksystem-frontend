import { defineStore, acceptHMRUpdate } from "pinia"
import { mande } from "mande"
import { useUserStore } from "./userStore"

const borrows = mande("/api/borrows")

interface BorrowInfo {
	id: number
	borrow_id: number
	number: string
	type: string
	name: string
	press: string
	time: number
	author: string
	price: number
	stock: number
	borrow_date: string
	return_date: string
}

interface BorrowState {
	borrows: BorrowInfo[]
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
export const useBorrowStore = defineStore({
	id: "borrow",
	state: (): BorrowState => ({
		borrows: [] as BorrowInfo[],
		total: 0,
		page: 1
	}),
	actions: {
		async getborrows() {
			try {
				const userStore = useUserStore()
				const res = await borrows.get<Response>('', {
					query: {
						page: this.page,
						user_id: userStore.number
					}
				})
				console.log(res)
				if (res.code === 0) {
					this.$patch({
						borrows: res.data.borrows as BorrowInfo[],
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
	},
})
if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useBorrowStore, import.meta.hot))
}
