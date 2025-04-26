const express = require('express');
const app = express;
const PORT = 3000;

app.request(express.json()); //Allows to receive JSON

//Array to be used as a database
let tasks = [];

// [GET] Search all tasks
app.get('/tasks', (req, res) => {
    res.json(tasks);
});

// [POST] Create new task
app.post('/tasks', (req, res) => {
    const {title, priority = 'média', tags = [], date} = req.body;

    if (!title) {
        return res.status(400).json({message: 'Title is required.'});
    }

    if (date && isNaN(Date.parse(date))) {
        return res.status(400).json({message: 'Invalid date format. Use a standard ISO format (YYYY-MM-DDTHH:MM:SSZ).'});
    }

    const newTask = {
        id: Date.now(),
        title,
        priority,
        tags,
        date: date ? new Date(date) : null,
        done: false,
    }
});

// [PUT] Update a task
app.put('/tasks/:id', (req, res) => {
    const {id} = req.params;
    const {title, done, priority, tags, date} = req.body;
    const task = tasks.find(t => t.id == id);

    if (!task) return res.status(404).json({message: 'Task not found.'});

    if(title) task.title = title;
    if(typeof done === 'bollean') task.done = done;
    if(priority) task.priority = priority;
    if(date){
        if(isNaN(Date.parse(date))){
            return res.status(400).json({message: 'Invalid date format. Use a standard ISO format (YYYY-MM-DDTHH:MM:SSZ).'});
        }
        task.date = new Date(date);
    }

    res.json(task);
});


// [DELETE] Delete a task 
app.delete('/tasks/:id', (req, res) => {
    const {id} = req.params;
    tasks = tasks.filter(t => t.id != id);
    res.status(204).send();
});

//Start the server
app.listen(PORT, () =>{
    console.log(`Server is up on port ${PORT}`);
});