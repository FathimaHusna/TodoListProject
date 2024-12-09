//using express
const express = require('express')
const cors = require('cors')
//create an instance of expresss
const app = express()
const mongoose = require('mongoose')
app.use(express.json())
app.use(cors())

//Define a route
// app.get('uri', callbackfunction)
// app.get('/', (req,res) => {
//     res.send("hello world")
// })

//sample in memory storage for todo items
// todos = []
// Connecting Mongodb
mongoose.connect('mongodb://localhost:27017/mern-todo')
.then(()=>{
    console.log("DB conected")

})
.catch((err)=>{
    console.log(err)
})
// Creating Schema
const todoSchema = new mongoose.Schema({
    title: {
        required: true,
        type: String
    },

    description:{
        required: true,
        type: String

    } 
})

// Creating Model
const todoModel = mongoose.model('Todo', todoSchema)


// create a new todo item
app.post('/todos', async(req, res)=>{
    const {title, description} = req.body
    // const newtodos = {
    //     id:todos.length+1,
    //     title,
    //     description
    // }
    // todos.push(newtodos)
    // console.log(todos)
    // res.status(201).json(newtodos)
    try {
    const newTodo = new todoModel({title, description})
    await newTodo.save()
    res.status(201).json(newTodo)

    }
    catch(error){
        console.log(error)
        res.status(500).json({message: error.message})

    }
    
    
    

})
//Get all items
app.get('/todos',async (req,res)=> {
    try{
        const todos = await todoModel.find()
        res.json(todos)
    
    }catch(error){
        res.status(500).json({message: error.message})

    }
    
})
// update item
app.put('/todos/:tid', async(req, res)=>{
    try{
        const {title, description} = req.body
    const id = req.params.tid
    const updatedTodo = await todoModel.findByIdAndUpdate(
        id,
        {title, description},
        {new: true}

    )
    if(!updatedTodo){
    
        return res.status(404).json({message: "Todo is not found"})

    }
    res.json(updatedTodo)
    }
    catch(error){
        console.log(error)
        res.status(500).json({message: error.message})

    }
    


})

//delete Item
app.delete('/todos/:tid', async(req, res)=>{
    try{
        const id = req.params.tid
        await todoModel.findByIdAndDelete(id)
        res.status(204).end()

    }catch(error){
        console.log(error)
        res.status(500).json({message: error.message})

    }
    
})

//Start the server
const port = 8000;
app.listen(port, ()=> {
    console.log(`Server is listening on ${port}`)
})




