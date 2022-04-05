import { MockMethod, Recordable } from "vite-plugin-mock"
interface Request {
	url: Recordable,
	body: Recordable,
	query: Recordable,
	headers: Recordable
}
type UserType = "admin" | "teacher" | "student"
interface UserInfo {
	name: string,
	number: string,
	department: string,
	type: UserType,
}
export default [
	{
		url: "/api/user/create",
		method: "post",
		response: ({ query, body }: Request) => {
			console.log("body>>>>>>>>", body)
			console.log("query>>>>>>>>", query)
			return {
				code: 0,
				message: "ok",
				data: null,
			}
		},
	},
	{
		url: "/api/users/login",
		method: "get",
		response: ({ query }: Request) => {
			console.log("query>>>>>>>>", query)
			if (
				query.number === "0" &&
				query.passwd ===
					"47f237d599f26206770c4f8100f87aff32c5453da76f26f1be2218b5f4602333"
			) {
				return {
					code: 0,
					message: "登录成功",
					data: {
						name: "admin",
						number: "0",
						type: "admin",
						department: "admin",
					},
				}
			} else if (
				query.number === "1" &&
				query.passwd ===
					"19efa6a59922a57123520fc383c73e1ca18da3ea715f4d0b64f230c69ec8bbf4"
			) {
				return {
					code: 0,
					message: "登录成功",
					data: {
						name: "cage",
						number: "1",
						type: "student",
						department: "cs",
					},
				}
			} else {
				return {
					code: 1,
					message: "借书证不存在",
					data: null,
				}
			}
		},
	},
	{
		url: "/api/users/logout",
		method: "get",
		response: ({ query }: Request) => {
			console.log("query>>>>>>>>", query)
			return {
				code: 0
			}
		},
	},
] as MockMethod[]
