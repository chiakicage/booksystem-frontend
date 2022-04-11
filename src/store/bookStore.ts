import { defineStore, acceptHMRUpdate } from "pinia"
import { mande } from "mande"

const books = mande("http://localhost:8080/api/books")

interface BookInfo {
	id: number
	number: string
	type: string
	name: string
	press: string
	time: number
	author: string
	price: number
	stock: number
	count: number
	return_time: number
}

interface BookState {
	filter: {
		name: string
		type: string
		number: string
		author: string
		press: string
		time: [string, string]
		price: [string, string]
	},
	books: BookInfo[]
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
export const useBookStore = defineStore({
	id: "book",
	state: (): BookState => ({
		filter: {
			press: '',
			name: '',
			type: '',
			number: '',
			author: '',
			time: ['', ''],
			price: ['', '']
		},
		books: [] as BookInfo[],
		total: 0,
		page: 1
	}),
	actions: {
		async getbooks() {
			try {
				const res = await books.get<Response>('', {
					query: {
						press: this.filter.press,
						name: this.filter.name,
						type: this.filter.type,
						number: this.filter.number,
						author: this.filter.author,
						time_s: this.filter.time[0],
						time_t: this.filter.time[1],
						price_s: this.filter.price[0],
						price_t: this.filter.price[1],
						page: this.page
					}
				})
				console.log(res)
				if (res.code === 0) {
					this.$patch({
						books: res.data.books as BookInfo[],
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
	import.meta.hot.accept(acceptHMRUpdate(useBookStore, import.meta.hot))
}
