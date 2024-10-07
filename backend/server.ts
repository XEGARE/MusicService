import express from 'express'
import userRouter from './routes/userRouter'
import filesRouter from './routes/filesRouter'
import albumsRouter from './routes/albumsRouter'
import fs from 'node:fs'
import http from 'http'
import https from 'https'
const app = express()

app.use('/.well-known', express.static('.well-known', { dotfiles: 'allow' }))

app.use(express.static('../frontend/dist'))

app.use(express.json({ limit: '50mb' }))
app.use('/user', userRouter)
app.use('/files', filesRouter)
app.use('/albums', albumsRouter)

const httpServer = http.createServer(app)
httpServer.listen(80, () =>
	console.log('HTTP Server running on  http://localhost:80')
)

try {
	const privateKey = fs.readFileSync(
		'/etc/letsencrypt/live/pilipzov.fvds.ru/privkey.pem',
		'utf8'
	)
	const certificate = fs.readFileSync(
		'/etc/letsencrypt/live/pilipzov.fvds.ru/fullchain.pem',
		'utf8'
	)
	const httpsServer = https.createServer(
		{
			key: privateKey,
			cert: certificate,
		},
		app
	)

	httpsServer.listen(443, () => {
		console.log('HTTPS Server running on https://pilipzov.fvds.ru:443')
	})
} catch (error) {
	console.log('HTTPS Server running error:')
	console.log(error.message)
}
