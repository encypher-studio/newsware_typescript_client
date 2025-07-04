import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
export default defineConfig({
    build: {
        lib: {
            entry: resolve(__dirname, './src/index.ts'),
            name: 'newsware',
            fileName: 'index',
        },
    },
    plugins: [
        dts({
            include: ["src"],
            rollupTypes: true
        })
    ]
})