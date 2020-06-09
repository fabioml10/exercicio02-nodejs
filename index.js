import express from 'express'
import { promises } from 'fs'
import accountsRouter from './routes/grades.js'

const app = express()
const port = 3010
const readFile = promises.readFile
const writeFile = promises.writeFile

global.fileName = "grades.json"

app.use(express.json())
app.use("/grades", accountsRouter)

app.listen(port, async () => {
  try {
    let data = await readFile(fileName, "utf8")
  } catch (err) {
    res.status(400).send({ error: err.message })
  }
})