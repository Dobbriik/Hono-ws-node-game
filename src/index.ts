import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serve } from '@hono/node-server'
import { serveStatic } from '@hono/node-server/serve-static'
import {
	start,
	playAgain,
	movePlayer,
	getGridSize,
	getWinPlayer,
	getGameStatus,
	getGooglePoints,
	getPlayerPoints,
	getGooglePositions,
	getPlayersPositions,
	subscribe,
	unSubscribe,
} from '../core/state-manager-server'
const functions = {
	start,
	playAgain,
	movePlayer,
	getGridSize,
	getWinPlayer,
	getGameStatus,
	getGooglePoints,
	getPlayerPoints,
	getGooglePositions,
	getPlayersPositions,
}
import { createNodeWebSocket } from '@hono/node-ws'
import { WebSocketServer } from 'ws'
import fs from 'fs'
// const options = {
// 	key: fs.readFileSync('key.pem'),
// 	cert: fs.readFileSync('cert.pem'),
// }

const app = new Hono()

// app.use('*', cors())

app.use(
	'*',
	cors({
		origin: '*',
		allowMethods: ['GET', 'POST', 'PUT'], // Разрешенные методы
		allowHeaders: ['Content-Type', 'Authorization'], // Разрешенные заголовки
		maxAge: 86400, // Время кэширования предварительных запросов (в секундах)
		credentials: true, // Разрешить отправку куки и заголовков авторизации
	})
)

app.use('/*', serveStatic({ root: '' }))
app.get('/', serveStatic({ path: 'index.html' }))
app.get('/:id', async c => {
	const id = c.req.param('id')
	const playerNumber = c.req.query('playerNumber')
	const direction = c.req.query('direction')

	if (functions[`${id}`]) {
		try {
			const result = await functions[`${id}`](playerNumber, direction)
			return c.json({ data: result })
		} catch (error) {
			console.log('error')
		}
	}
})

const wss = new WebSocketServer({ port: 3000 })

wss.on('connection', ws => {
	console.log('WebSocket connection established (back)')

	ws.on('message', message => {
		console.log(`Received message: ${message} (back)`)
		const observer = e => {
			ws.send(`${JSON.stringify(e)}`)
		}
		subscribe(observer)
	})

	ws.on('close', () => {
		// unSubscribe(observer)
		console.log('WebSocket connection closed (back)')
	})
})

//server
const port = 8080
console.log(`Server is running on http://localhost:${port}`)

serve({
	fetch: app.fetch,
	port: port,
	// tls: options,
	websocket: {
		onUpgrade: (request, socket, head) => {
			wss.handleUpgrade(request, socket, head, ws => {
				wss.emit('connection!!!', ws, request)
			})
		},
	},
})

export default app
