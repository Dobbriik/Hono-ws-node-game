import { subscribe, unSubscribe } from '../../../core/state-manager.js'

export function SettingsComponent() {
	const element = document.createElement('div')
	render(element)

	const observer = () => {
		render(element)
	}
	subscribe(observer)
	return {
		element,
		cleanUp: () => {
			unSubscribe(observer)
		},
	}
}

async function render(element) {
	element.innerHTML = ''
	element.append('Move player WASD and arrow buttons.')
}
