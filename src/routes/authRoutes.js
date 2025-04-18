import express, { json } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import db from '../db.js'

const router = express.Router()

//register new user
router.post('/register',(req,res)=>{

    // console.log(req)
    const {username,password} = req.body
    //ecrypt password
    const hashedPW = bcrypt.hashSync(password,8)
    // console.log(`Actual Password: ${password}\n Hashed Password ${hashedPW}`)
    try{
        const insertUser = db.prepare(`INSERT INTO users(username,password) VALUES (?,?)`)
        const result = insertUser.run(username,hashedPW)

        //default todo
        const defaultTodo = 'Hello :) Add your todo'
        const insertTodo = db.prepare(`INSERT INTO todos(user_id,task) VALUES (?,?)`)
        insertTodo.run(result.lastInsertRowid,defaultTodo)

        //token to confirm if the current user
        const token = jwt.sign(
            {
                id: result.lastInsertRowid
            },
            process.env.JWT_SECRET,
            {
                expiresIn:'24h'
            })
            res.json({token})

    }catch(err){
        console.log(err.message)
        res.sendStatus(503)
    }

    res.sendStatus(201)

})


//login
router.post('/login',(req,res)=>{

    // console.log(req)
    const {username,password} = req.body
    try{
        const getUser = db.prepare('SELECT * FROM users WHERE username=?')
        const user = getUser.get(username)

        if(!user){
            return res.status(404).send({
                message:"User not found"
            })
        }
        const passwordIsValid = bcrypt.compareSync(password,user.password)
        if(!passwordIsValid){
            return res.status(401).send(
                {
                    message:'Invalid Password'
                }
            )
        }
        const token = jwt.sign({
            id:user.id
        },process.env.JWT_SECRET,{expiresIn:'24h'})

        res.json({token})


    }catch(err){
        console.log(err.message)
        res.sendStatus(503)
    }

})



export default router