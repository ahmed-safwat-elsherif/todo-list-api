const express = require('express');
const app = express();
require('./db-connect');

const todos = require('./routes/todos')
const users = require('./routes/users')


app.use(express.json());

app.use((req, res, next) => {
    const timeNow = new Date();
    console.log({ method: req.method, timeNow, URL: req.url });
    next();
})
//----------------------------------------------------------------------------------------------------

app.use('/api/todos', todos)
app.use('/api/users', users)

//----------------------------------------------------------------------------------------------------

app.use(function (err, req, res, next) {
    console.error(err.stack)
    res.status(500).send('Something broke!')
})
const port = 3000;
app.listen(process.env.PORT || port, () => {
    console.log(`Server is listening on: http://localhost:${port}`)
})

