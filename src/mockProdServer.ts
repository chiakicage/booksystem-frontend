import { createProdMockServer } from "vite-plugin-mock/es/createProdMockServer"
import userModule from "../mock/user"
export const mockModules = [...userModule]

export function setupProdMockServer() {
	createProdMockServer(mockModules)
}
