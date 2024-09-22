const port = 8080
const ip = 'localhost'
const url = `http://${ip}:${port}`
// const url = `http://testgameserver.zapto.org:${port}`
const uri = `${ip}:${3000}`
// EventSource
// const eventSource = new EventSource(`${url}/events`)
// eventSource.addEventListener('message', ese => {
// 	const event = JSON.parse(ese.data)
// 	_notifyObserver(event.name, event.payload)
// })

//ws
const socket = new WebSocket(`ws://${uri}`)
let observer
socket.addEventListener('open', ws => {
	socket.send('hello')
	// const event = JSON.parse(ws.data)
	// _notifyObserver(event.name, event.payload)
	console.log('Connected to WebSocket server. (say Client)')
})
socket.addEventListener('message', ws => {
	const event = JSON.parse(ws.data)
	_notifyObserver(event.name, event.payload)
})
socket.addEventListener('close', event => {
	console.log('close.')
})

socket.addEventListener('error', error => {
	console.error('WebSocket error:', error)
})

// Observer
let _observer = []
export function subscribe(observer) {
	_observer.push(observer)
}

export function unSubscribe(observer) {
	_observer = _observer.filter(o => o !== observer)
}

function _notifyObserver(name, payload = {}) {
	const event = {
		name,
		payload,
	}
	_observer.forEach(o => {
		try {
			o(event)
		} catch (error) {
			console.log(error)
		}
	})
}

// COMMANDS/SETTERS
export async function start() {
	fetch(`${url}/start`)
}
export async function playAgain() {
	fetch(`${url}/playAgain`)
}
export async function movePlayer(playerNumber, direction) {
	await fetch(
		`${url}/movePlayer?playerNumber=${playerNumber}&direction=${direction}`
	)
}

//GETTERS/SELECTORS
export async function getGooglePoints() {
	const response = await fetch(`${url}/getGooglePoints`)
	const responsePayload = await response.json()
	return responsePayload.data
}
export async function getPlayerPoints(playerNumber) {
	const response = await fetch(
		`${url}/getPlayerPoints?playerNumber=` + playerNumber
	)
	const responsePayload = await response.json()
	return responsePayload.data
}
export async function getGridSize() {
	const response = await fetch(`${url}/getGridSize`)
	const responsePayload = await response.json()
	return responsePayload.data
}
export async function getGooglePositions() {
	const response = await fetch(`${url}/getGooglePositions`)
	const responsePayload = await response.json()
	return responsePayload.data
}
export async function getPlayersPositions(playerNumber) {
	const response = await fetch(
		`${url}/getPlayersPositions?playerNumber=` + playerNumber
	)
	const responsePayload = await response.json()
	return responsePayload.data
}
export async function getGameStatus() {
	const response = await fetch(`${url}/getGameStatus`)
	const responsePayload = await response.json()
	return responsePayload.data
}
export async function getWinPlayer() {
	const response = await fetch(`${url}/getWinPlayer`)
	const responsePayload = await response.json()
	return responsePayload.data
}
