import { makeId, readJsonFile, writeJsonFile } from "../../services/utils.js"

export const userService = {
    query,
    getById,
    remove,
    save
}

const users = readJsonFile('./data/users.json')
// const PAGE_SIZE = 3

function compareStrings(s1, s2) {
    const str1 = s1.toUpperCase()
    const str2 = s2.toUpperCase()

    if (str1 < str2) {
        return -1
    }
    if (str1 > str2) {
        return 1
    }

    return 0
}

function compareTimestamp(t1, t2) {

    return t1 - t2
}

function compareNumbers(num1, num2) {

    if (num1 > num2) {
        return 1
    }
    if (num1 < num2) {
        return -1
    }

    return 0
}

async function query(filterBy) {
    let usersToDisplay = users
    try {
        if (filterBy.title) {
            const regExp = new RegExp(filterBy.title, 'i')
            usersToDisplay = usersToDisplay.filter(user => regExp.test(user.title))
        }

        if (filterBy.minSeverity) {
            usersToDisplay = usersToDisplay.filter(user => user.severity >= filterBy.minSeverity)
        }

        if (filterBy.pageIdx !== undefined && !isNaN(filterBy.pageIdx)) {
            const startIdx = filterBy.pageIdx * PAGE_SIZE
            usersToDisplay = usersToDisplay.slice(startIdx, startIdx + PAGE_SIZE)
        }

        console.log("filterBy.sortBy", filterBy.sortBy);

        if (filterBy.sortBy) {

            let sortDir = filterBy.sortDir || 1

            if (filterBy.sortBy === 'title') {
                usersToDisplay.sort((a, b) => compareStrings(a.title, b.title) * sortDir)
            }

            if (filterBy.sortBy === 'severity') {
                usersToDisplay.sort((a, b) => compareNumbers(a.severity, b.severity) * sortDir)
            }

            if (filterBy.sortBy === 'createdAt') {
                usersToDisplay.sort((a, b) => compareTimestamp(a.createdAt, b.createdAt) * sortDir)
            }
        }
        return usersToDisplay
    } catch (err) {
        throw err
    }
}

async function getById(userId) {
    try {
        const user = users.find(user => user._id === userId)
        if (!user) throw new Error('Cannot find user')
        return user
    } catch (err) {
        throw err
    }
}

async function remove(userId) {
    try {
        const userIdx = users.findIndex(user => user._id === userId)
        if (userIdx === -1) throw new Error('Cannot find user')
        users.splice(userIdx, 1)
        await saveUsersToFile()
    } catch (err) {
        console.log('err:', err)
    }
}

async function save(userToSave) {
    try {
        console.log("user save", userToSave)

        if (userToSave._id) {
            const userIdx = users.findIndex(user => user._id === userToSave._id)
            if (userIdx === -1) throw new Error('Cannot find user')
            users[userIdx] = { ...users[userIdx], ...userToSave }
        } else {
            userToSave._id = makeId()
            userToSave.createdAt = Date.now()
            users.unshift(userToSave)
        }
        await saveUsersToFile()
        return userToSave
    } catch (err) {
        throw err
    }
}

function saveUsersToFile() {
    return writeJsonFile('./data/users.json', users)
}
