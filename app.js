const express = require('express')
const app = express()

app.get('/', function(req, res) {
    res.send('This will be the landing page soon!!!')
})




app.listen(3000, 'localhost', function() {
    console.log('FunCamp server has started, listening on port 3000, you camper!!!');
})