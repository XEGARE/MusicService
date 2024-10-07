import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

const vitePWA = VitePWA({
	registerType: 'autoUpdate',
	outDir: 'dist',
	manifest: {
		name: 'Волна',
		short_name: 'Волна',
		description: 'Сервис для создания музыкальных альбомов',
		theme_color: '#FFFFFF',
		icons: [
			{
				src: 'images/icon-192.png',
				sizes: '192x192',
				type: 'image/png',
			},
			{
				src: 'images/icon-512.png',
				sizes: '512x512',
				type: 'image/png',
			},
		],
		screenshots: [
			{
				src: 'images/icon-512.png',
				sizes: '512x512',
				type: 'image/png',
				form_factor: 'narrow',
			},
			{
				src: 'images/icon-512.png',
				sizes: '512x512',
				type: 'image/png',
				form_factor: 'wide',
			},
		],
	},
})

const backendServerAddress = 'http://localhost:80'

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react(), vitePWA],
	server: {
		proxy: {
			'/user': {
				target: `${backendServerAddress}/user`,
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/user/, ''),
			},
			'/files': {
				target: `${backendServerAddress}/files`,
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/files/, ''),
			},
			'/albums': {
				target: `${backendServerAddress}/albums`,
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/albums/, ''),
			},
		},
		host: '0.0.0.0',
	},
	build: {
		assetsInlineLimit: 0,
	},
})
