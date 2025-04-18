import express from 'express'
// import db from '../db.js'
import prisma from '../prismaClient.js'

const router = express.Router()

//get all todos
router.get('/',async(req,res)=>{
    // const getTodos = db.prepare('SELECT * FROM todos WHERE user_id=?')
    // const todos = getTodos.all(req.userId)
    const todos = await prisma.todo.findMany({
        where:{
            userId: req.userId
        }
    })
    res.json({todos})

})


//creating new todos
router.post('/',async(req,res)=>{
    const {task}=req.body
    // const insertTodo = db.prepare(`INSERT INTO todos (user_id,task) VALUES (?,?)`)
    // const result = insertTodo.run(req.userId,task)

    const todos = await prisma.todo.create({
        data:{
            task,
            userId: req.userId
        }
    })


    res.json(todo)
})

//update todo
router.put('/:id',async(req,res)=>{
    const {completed} = req.body
    const {id}=req.params
    // const updatedTodo = db.prepare(`UPDATE todos SET completed=? WHERE id=?`)
    // updatedTodo.run(completed,id)

    const updatedTodo = await prisma.todo.update({
        where:{
            id:parseInt(id),
            userId:req.userId
        },
        data:{
            completed: !!completed //forces to become boolean
        }
    })


    res.json(updatedTodo)
})


//delete todo

router.delete('/:id',async(req,res)=>{
    const {id}=req.params
    const userId = req.userId
    // const deleteTodo = db.prepare(`DELETE FROM todos WHERE id=? AND user_id=?`)
    // deleteTodo.run(id,userId)

    await prisma.todo.delete({
        where:{
            id:parseInt(id),
            userId:userId
        }
    })



    res.json({
        message:"Todo has been deleted"
    })
})



export default router