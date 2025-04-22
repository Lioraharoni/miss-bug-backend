import express from 'express'
import cookieParser from 'cookie-parser'
import { bugService } from './services/bug.service.js'
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
// app.get('/api/bug', async (req, res) => {
//     res.send("aaa")
// })



//* ------------------- Bugs Crud -------------------
//* Read/List
app.get('/api/bug', async (req, res) => {
    console.log("req.query", req.query)
    const filterBy = {
        title: req.query.title,
        minSeverity: +req.query.minSeverity
    }
    console.log("filterBy:", filterBy);

    try {
        const bugs = await bugService.query(filterBy)
        res.send(bugs)
    } catch (err) {
        loggerService.error(`Couldn't get bugs`, err)
        res.status(400).send(`Couldn't get bugs`)
    }
})

//* Add/Update
app.get('/api/bug/save', async (req, res) => {
    const bugToSave = {
        _id: req.query._id,
        title: req.query.title,
        severity: +req.query.severity
    }
    console.log({ bugToSave })

    try {
        const savedBug = await bugService.save(bugToSave)
        res.send(savedBug)
    } catch (err) {
        loggerService.error(`Couldn't save bug`, err)
        res.status(400).send(`Couldn't save bug`)
    }
})

//* Read
app.get('/api/bug/:bugId', async (req, res) => {
    const { bugId } = req.params
    let visitedBugs = req.cookies.visitedBugs || []
    // let visitedBugs = req.cookies.visitedBugs ? JSON.parse(req.cookies.visitedBugs) : []

    if (visitedBugs.length >= 3) {
        return res.status(401).send('Wait for a bit')
    }
    try {
        if (!visitedBugs.includes(bugId)) {
            visitedBugs.push(bugId)
        }
        console.log('----User visited at the following bugs:', visitedBugs);
        res.cookie('visitedBugs', visitedBugs, { maxAge: 7000, sameSite: 'None', secure: true })
        const bug = await bugService.getById(bugId)
        res.send(bug)
    } catch (err) {
        loggerService.error(`Couldn't get bug ${bugId}`, err)
        res.status(400).send(`Couldn't get bug`)
    }
})

//* Delete
app.get('/api/bug/:bugId/remove', async (req, res) => {
    const { bugId } = req.params
    try {
        const bug = await bugService.remove(bugId)
        res.send('OK')
    } catch (err) {
        loggerService.error(`Couldn't get remove ${bugId}`, err)
        res.status(400).send(`Couldn't remove bug`)
    }
})


app.get('/', (req, res) => res.send('Hello there'))
app.listen(3030, () => console.log('Server ready at port 3030'))
