import express from 'express'
import path,{dirname} from 'path'
import { fileURLToPath } from 'url'
import authRoutes from './routes/authRoutes.js'
import todoRoutes from './routes/todoRoutes.js'
import authMiddleware from './middleware/authMiddleware.js'

const app = express()
const PORT = process.env.PORT||5000


//path of current dir
const __filename = fileURLToPath(import.meta.url)
//dir name from filepath
const __dirname = dirname(__filename)




//middleware
app.use(express.json())
app.use(express.static(path.join(__dirname,'../public')))





//serving html file from public dir
app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'public','index.html'))
})



app.use('/auth',authRoutes)
app.use('/todo',authMiddleware,todoRoutes)





app.listen(PORT,()=>{
    console.log(`Server has started on ${PORT}`)
})