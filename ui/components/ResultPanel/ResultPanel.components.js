import { EVENTS } from '../../../core/constants.js'
import {
	getPlayerPoints,
	getGooglePoints,
	subscribe,
	unSubscribe,
} from '../../../core/state-manager.js'

export function ResultPanelComponent() {
	const element = document.createElement('div')

	const spanPlayer1 = document.createElement('span')
	spanPlayer1.textContent = 'Player1:'
	const spanPlayer1Result = document.createElement('span')
	spanPlayer1Result.textContent = '0'

	const spanPlayer2 = document.createElement('span')
	spanPlayer2.textContent = 'Player2:'
	const spanPlayer2Result = document.createElement('span')
	spanPlayer1Result.textContent = '0'

	const spanGoogle = document.createElement('span')
	spanGoogle.textContent = 'Google:'
	const spanGoogleResult = document.createElement('span')
	spanGoogleResult.textContent = '0'

	const spanElements = [
		spanPlayer1,
		spanPlayer1Result,
		spanPlayer2,
		spanPlayer2Result,
		spanGoogle,
		spanGoogleResult,
	]

	const elemRender = [spanPlayer1Result, spanPlayer2Result, spanGoogleResult]

	element.classList.add('result-panel')
	element.append(...spanElements)

	const observer = e => {
		if (e.name !== EVENTS.SCORES_CHANGED) return
		render(elemRender)
	}
	subscribe(observer)

	render(elemRender)
	return {
		element,
		cleanUp: () => {
			unSubscribe(observer)
		},
	}
}

// async function render(element) {
// 	element.innerHTML = ''

// 	const googlePoint = await getGooglePoints()
// 	const player1Points = await getPlayerPoints(1)
// 	const player2Points = await getPlayerPoints(2)

// 	element.innerHTML = `Player1: ${player1Points},Player2: ${player2Points},Google: ${googlePoint},`
// }

async function render(element) {
	element.innerHTML = ''

	try {
		const [googlePoint, player1Points, player2Points] = await Promise.all([
			getGooglePoints(),
			getPlayerPoints(1),
			getPlayerPoints(2),
		])
		element[0].textContent = player1Points
		element[1].textContent = player2Points
		element[2].textContent = googlePoint
	} catch (error) {
		console.error('Error rendering points:', error)
		element.innerHTML = 'Error loading points'
	}
}
