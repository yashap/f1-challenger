import React from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'
import {required} from '@f1-challenger/errors'

const container = required(document.getElementById('app'))
const root = createRoot(container)
root.render(<App />)
