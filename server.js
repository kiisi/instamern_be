const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const PORT = 5000;

app.use(cors())
app.use(express.json())

const {MONGODB_URI} = require('./configs')
mongoose.connect(MONGODB_URI).then(()=>console.log('connected')).catch(err=>console.log(err))

require('./models/user_model')
require('./models/post_model')

app.use(require('./routes/authentication'))
app.use(require('./routes/postRoute'))


app.listen(PORT, ()=>{
    console.log(`server running on PORT: ${PORT}`)
})