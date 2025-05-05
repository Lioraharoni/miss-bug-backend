import { loggerService } from "../../services/logger.service.js";
import { userService } from "./user.service.js";

//* ------------------- Users Crud -------------------
export async function getUsers (req, res) {
    // console.log("+++getUsers+++");
    const filterBy = {
        title: req.query.title,
        minSeverity: +req.query.minSeverity,
        pageIdx: +req.query.pageIdx,
        sortBy: req.query.sortBy,
        sortDir: +req.query.sortDir
    }

    try {
        const users = await userService.query(filterBy)
        res.send(users)
    } catch (err) {
        loggerService.error(`Couldn't get users`, err)
        res.status(400).send(`Couldn't get users`)
    }
}

export async function getUser (req, res) {
    const { userId }= req.params
    // console.log("---getUser---");
    // console.log({userId})
    try {
        const user = await userService.getById(userId)
        res.send(user)
    } catch (err) {
        loggerService.error(`Couldn't get user ${userId}`, err)
        res.status(400).send(`Couldn't get user`)
    }
}

export async function updateUser (req, res) {
    const userToSave = {
        _id: req.body._id,
        score: +req.body.score
    }
    // console.log({ userToSave })
    try {
        const savedUser = await userService.save(userToSave)
        res.send(savedUser)
    } catch (err) {
        loggerService.error(`Couldn't save user`, err)
        res.status(400).send(`Couldn't save user`)
    }
}

export async function addUser (req, res) {
    // console.log("add user", req.body);
    const userToSave = {
        fullname: req.body.fullname,
        username: req.body.username,
        password: req.body.password,
        score: +req.body.score
    }
    // console.log({ userToSave })

    try {
        const savedUser = await userService.save(userToSave)
        res.send(savedUser)
    } catch (err) {
        loggerService.error(`Couldn't save user`, err)
        res.status(400).send(`Couldn't save user`)
    }
}

export async function removeUser (req, res) {
    const { userId }= req.params
    try {
        // console.log("removeUser ", userId, req.params);
        const user = await userService.remove(userId)
        res.send('OK')
    } catch (err) {
        loggerService.error(`Couldn't get remove ${userId}`, err)
        res.status(400).send(`Couldn't remove user`)
    }
}