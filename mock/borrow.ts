import { MockMethod, Recordable } from "vite-plugin-mock"
interface Request {
	url: Recordable
	body: Recordable
	query: Recordable
	headers: Recordable
}

export default [
	{
		url: "/api/borrows",
		method: "get",
		response: ({ query }: Request) => {
			query.page = Number(query.page)
			console.log("query>>>>>>>>", query)
			if (query.page === 1) {
				return {
					code: 0,
					message: "ok",
					data: {
						total: 100,
						borrows: [
							{
								id: 1,
								borrow_id: 1,
								number: "computer_01",
								type: "computer science",
								press: "机械工业出版社",
								time: "2022",
								name: "没人理解计算机系统",
								author: "Alan Turing",
								price: 99.9,
								borrow_time: "2022-3-1",
								return_time: "2022-3-2",
							},
							{
								id: 2,
								borrow_id: 2,
								number: "computer_02",
								type: "computer science",
								press: "机械工业出版社",
								time: "2022",
								name: "深入理解计算机系统",
								author: "Jianling Sun",
								price: 99.9,
								borrow_time: "2022-4-1",
								return_time: "2022-5-2",
							},
						],
					},
				}
			} else {
				return {
					code: 0,
					message: "ok",
					data: {
						total: 100,
						borrows: [
							{
								id: 3,
								borrow_id: 3,
								number: "histroy_01",
								type: "histroy",
								press: "浙江大学出版社",
								time: "2022",
								name: "中国古代史",
								author: "xxx",
								price: 99.9,
								borrow_time: "2022-6-1",
								return_time: "2022-7-2",
							},
							{
								id: 4,
								borrow_id: 4,
								number: "computer_03",
								type: "computer science",
								press: "清华大学出版社",
								time: "2022",
								name: "数据库系统设计",
								author: "Jianling Sun",
								price: 66.6,
								borrow_time: "2022-6-1",
								return_time: "2022-7-2",
							},
						],
					},
				}
			}
		},
	},
] as MockMethod[]
