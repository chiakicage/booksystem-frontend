import { defineConfig, ConfigEnv, UserConfigExport } from 'vite'
import { viteMockServe } from 'vite-plugin-mock'
import vue from '@vitejs/plugin-vue'
import AutoImport from "unplugin-auto-import/vite"
import Components from "unplugin-vue-components/vite"
import { ElementPlusResolver } from "unplugin-vue-components/resolvers"

// https://vitejs.dev/config/

export default ({ command }: ConfigEnv): UserConfigExport => {
  const prodMock = false
  return {
		plugins: [
			vue(),
			AutoImport({
				resolvers: [ElementPlusResolver()],
			}),
			Components({
				resolvers: [ElementPlusResolver()],
			}),
			viteMockServe({
				mockPath: "mock",
				localEnabled: command === "serve",
				prodEnabled: command !== "serve" && prodMock,
				injectCode: `
          import { setupProdMockServer } from './mockProdServer';
          setupProdMockServer();
        `,
				logger: true,
			}),
		],
  }
}




