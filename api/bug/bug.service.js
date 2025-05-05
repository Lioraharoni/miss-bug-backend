import { makeId, readJsonFile, writeJsonFile } from "../../services/utils.js"

export const bugService = {
    query,
    getById,
    remove,
    save
}

const bugs = readJsonFile('./data/bugs.json')
const PAGE_SIZE = 3

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
    let bugsToDisplay = bugs
    // console.log("query", bugsToDisplay)
    try {
        if (filterBy.title) {
            const regExp = new RegExp(filterBy.title, 'i')
            bugsToDisplay = bugsToDisplay.filter(bug => regExp.test(bug.title))
        }

        if (filterBy.minSeverity) {
            bugsToDisplay = bugsToDisplay.filter(bug => bug.severity >= filterBy.minSeverity)
        }

        if (filterBy.pageIdx !== undefined && !isNaN(filterBy.pageIdx)) {
            const startIdx = filterBy.pageIdx * PAGE_SIZE
            bugsToDisplay = bugsToDisplay.slice(startIdx, startIdx + PAGE_SIZE)
        }

        console.log("filterBy.sortBy", filterBy.sortBy);

        if (filterBy.sortBy) {
            let sortDir = filterBy.sortDir || 1
            // console.log({ sortDir });

            if (filterBy.sortBy === 'title') {
                bugsToDisplay.sort((a, b) => compareStrings(a.title, b.title) * sortDir)
            }

            if (filterBy.sortBy === 'severity') {
                bugsToDisplay.sort((a, b) => compareNumbers(a.severity, b.severity) * sortDir)
            }

            if (filterBy.sortBy === 'createdAt') {
                bugsToDisplay.sort((a, b) => compareTimestamp(a.createdAt, b.createdAt) * sortDir)
            }
        }
        // console.log("bugsToDisplay", bugsToDisplay);
        return bugsToDisplay
    } catch (err) {
        throw err
    }
}

async function getById(bugId) {
    try {
        const bug = bugs.find(bug => bug._id === bugId)
        if (!bug) throw new Error('Cannot find bug')
        return bug
    } catch (err) {
        throw err
    }
}

async function remove(bugId) {
    try {
        const bugIdx = bugs.findIndex(bug => bug._id === bugId)
        if (bugIdx === -1) throw new Error('Cannot find bug')
        bugs.splice(bugIdx, 1)
        await saveBugsToFile()
    } catch (err) {
        console.log('err:', err)
    }
}

async function save(bugToSave) {
    try {
        console.log("bug save", bugToSave)
        if (bugToSave._id) {
            const bugIdx = bugs.findIndex(bug => bug._id === bugToSave._id)
            if (bugIdx === -1) throw new Error('Cannot find bug')
            bugs[bugIdx] = { ...bugs[bugIdx], ...bugToSave }
        } else {
            bugToSave._id = makeId()
            bugToSave.createdAt = Date.now()
            bugs.unshift(bugToSave)
        }
        await saveBugsToFile()
        return bugToSave
    } catch (err) {
        throw err
    }
}


function saveBugsToFile() {
    return writeJsonFile('./data/bugs.json', bugs)
}
