import { loggerService } from "../../services/logger.service.js";
import { bugService } from "./bug.service.js";

//* ------------------- Bugs Crud -------------------
export async function getBugs (req, res) {
    // console.log("req.query", req.query)
    // console.log("+++getBugs+++");
    const filterBy = {
        title: req.query.title,
        minSeverity: +req.query.minSeverity,
        pageIdx: +req.query.pageIdx,
        sortBy: req.query.sortBy,
        sortDir: +req.query.sortDir
    }
    // console.log("filterBy:", filterBy);

    try {
        const bugs = await bugService.query(filterBy)
        res.send(bugs)
    } catch (err) {
        loggerService.error(`Couldn't get bugs`, err)
        res.status(400).send(`Couldn't get bugs`)
    }
}

export async function getBug (req, res) {
    const { bugId }= req.params
    // console.log("---getBug---");
    // console.log({bugId})
    let visitedBugs = req.cookies.visitedBugs || []
    // let visitedBugs = req.cookies.visitedBugs ? JSON.parse(req.cookies.visitedBugs) : []

    if (visitedBugs.length >= 3) {
        return res.status(401).send('Wait for a bit')
    }
    try {
        if (!visitedBugs.includes(bugId)) {
            visitedBugs.push(bugId)
        }
        // console.log('----User visited at the following bugs:', visitedBugs);
        res.cookie('visitedBugs', visitedBugs, { maxAge: 7000, sameSite: 'None', secure: true })
        const bug = await bugService.getById(bugId)
        res.send(bug)
    } catch (err) {
        loggerService.error(`Couldn't get bug ${bugId}`, err)
        res.status(400).send(`Couldn't get bug`)
    }
}

export async function updateBug (req, res) {
    const bugToSave = {
        _id: req.body._id,
        title: req.body.title,
        severity: +req.body.severity
    }
    // console.log({ bugToSave })

    try {
        const savedBug = await bugService.save(bugToSave)
        res.send(savedBug)
    } catch (err) {
        loggerService.error(`Couldn't save bug`, err)
        res.status(400).send(`Couldn't save bug`)
    }
}

export async function addBug (req, res) {
    // console.log("add bug", req.body);
    
    const bugToSave = {
        title: req.body.title,
        severity: +req.body.severity
    }
    // console.log({ bugToSave })

    try {
        const savedBug = await bugService.save(bugToSave)
        res.send(savedBug)
    } catch (err) {
        loggerService.error(`Couldn't save bug`, err)
        res.status(400).send(`Couldn't save bug`)
    }
}

export async function removeBug (req, res) {
    const { bugId }= req.params
    try {
        // console.log("removeBug ", bugId, req.params);
        const bug = await bugService.remove(bugId)
        res.send('OK')
    } catch (err) {
        loggerService.error(`Couldn't get remove ${bugId}`, err)
        res.status(400).send(`Couldn't remove bug`)
    }
}