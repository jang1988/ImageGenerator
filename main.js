import express from 'express'
// import config from 'config'
import { engine } from 'express-handlebars'
import { Configuration, OpenAIApi } from 'openai'

const configuration = new Configuration({
  apiKey: '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',
})
const openai = new OpenAIApi(configuration)

const app = express()

app.engine('handlebars', engine())
app.set('view engine', 'handlebars')
app.set('views', './views')
app.use(express.urlencoded({ extended: true }))

app.get('/', (_, res) => {
  res.render('index')
})

app.get('/hello', (_, res) => {
    res.send('hello')
  })

app.post('/', async (req, res) => {
  const prompt = req.body.prompt
  const size = req.body.size ?? '512x512'
  const number = req.body.number ?? 1

  try {
    const response = await openai.createImage({
      prompt,
      size,
      n: Number(number),
    })

    res.render('index', {
        images: response.data.data,
      })
  } catch (e) {
    console.error('Error:', e.response.data.error.message);
    res.render('index', {
      error: e.message,
    })
  }
})

app.listen(80, () => console.log('Server started...'))