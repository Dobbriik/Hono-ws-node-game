import { AppComponent } from './ui/components/App.components.js'

const rootElement = document.querySelector('#root')

rootElement.innerHTML = ''
const appComponent = AppComponent()
rootElement.append(appComponent.element)
