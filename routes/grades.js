import express from 'express'
import { promises } from 'fs'

const readFile = promises.readFile
const writeFile = promises.writeFile

const router = express.Router()

router.post('/', async (req, res) => {
  let grade = req.body

  try {
    let data = await readFile(fileName, "utf8")
    let json = JSON.parse(data)
    const date = new Date();

    grade = { id: json.nextId++, ...grade, timestamp: date }
    json.grades.push(grade)

    await writeFile(fileName, JSON.stringify(json))
    res.send(grade)

  } catch (err) {
    res.status(400).send({ error: err.message })
  }

})

router.put("/:id", async (req, res) => {
  try {

    let newGrade = req.body
    let data = await readFile(fileName, "utf8")
    let json = JSON.parse(data)
    const oldIndex = json.grades.findIndex(grade => grade.id === parseInt(req.params.id))
    newGrade.id = json.grades[oldIndex].id
    newGrade.timestamp = json.grades[oldIndex].timestamp

    if (oldIndex >= 0) {

    } else {
      throw new Error("Não encontrado.")
    }

    json.grades[oldIndex] = newGrade

    await writeFile(fileName, JSON.stringify(json))

    res.send(newGrade)

  } catch (err) {
    res.status(400).send({ error: err.message })
  }
})

router.delete("/:id", async (req, res) => {

  try {
    let data = await readFile(fileName, "utf8")
    let json = JSON.parse(data)
    const result = json.grades.filter(grade => grade.id !== parseInt(req.params.id))
    json.grades = result

    await writeFile(fileName, JSON.stringify(json))
    res.send(result)

  } catch {
    res.status(400).send({ error: err.message })
  }

})

router.get('/', async (_, res) => {
  try {
    let data = await readFile(fileName, "utf8")
    let json = JSON.parse(data)
    delete json.nextId
    res.send(json)

  } catch (err) {
    res.status(400).send({ error: err.message })
  }
})

router.get("/:id", async (req, res) => {
  try {
    let data = await readFile(fileName, "utf8")
    let json = JSON.parse(data)
    const result = json.grades.find(grade => grade.id === parseInt(req.params.id))
    res.send(result)

  } catch (err) {
    res.status(400).send({ error: err.message })
  }
})

router.get("/total/result/:student/:subject", async (req, res) => {
  try {
    let data = await readFile(fileName, "utf8")
    let json = JSON.parse(data)
    const student = json.grades.filter(grade => {
      return grade.student === req.params.student && grade.subject === req.params.subject
    })
    const total = student.reduce((acc, cur) => {
      return acc + cur.value
    }, 0)

    res.send(`total: ${total}`)

  } catch (err) {
    res.status(400).send({ error: err.message })
  }
})

router.get("/total/result2/:type/:subject", async (req, res) => {
  try {
    let data = await readFile(fileName, "utf8")
    let json = JSON.parse(data)
    const student = json.grades.filter(grade => {
      return grade.type === req.params.type && grade.subject === req.params.subject
    })
    const total = student.reduce((acc, cur) => {
      return acc + cur.value
    }, 0)

    res.send(`media: ${total / student.length}`)

  } catch (err) {
    res.status(400).send({ error: err.message })
  }
})

router.get("/total/result3/:type/:subject", async (req, res) => {
  try {
    let data = await readFile(fileName, "utf8")
    let json = JSON.parse(data)
    const student = json.grades.filter(grade => {
      return grade.type === req.params.type && grade.subject === req.params.subject
    })
    const total = student.sort(function (a, b) {
      return b.value - a.value;
    });

    res.send(`melhores: \n${JSON.stringify(total[0])}\n${JSON.stringify(total[1])}\n${JSON.stringify(total[2])}`)

  } catch (err) {
    res.status(400).send({ error: err.message })
  }
})





export default router