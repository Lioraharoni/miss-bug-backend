import express from 'express'
import cookieParser from 'cookie-parser'
import { bugService } from './api/bug/bug.service.js'
import { loggerService } from './services/logger.service.js'

import cors from 'cors'
import { title } from 'process'
import { log } from 'console'



const app = express()

const corsOptions = {
    origin: [
        // 'http://127.0.0.1:5173',
        // 'http://localhost:5173'
        'http://localhost:3030'
    ],
    credentials: true
}

app.use(express.static('public'))
app.use(cors(corsOptions))
app.use(cookieParser())
app.use(express.json())
// app.get('/api/bug', async (req, res) => {
//     res.send("aaa")
// })

// import { bugRoutes } from './api/bug/bug.routes.js'
import { bugRoutes } from './api/bug/bug.routes.js'
app.use('/api/bug', bugRoutes)

import { userRoutes } from './api/user/user.routes.js'
app.use('/api/user', userRoutes)

app.get('/', (req, res) => res.send('Hello there'))
app.listen(3030, () => console.log('Server ready at port 3030'))
