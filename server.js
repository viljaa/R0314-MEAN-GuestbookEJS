// APPLICATION SETUP
const express = require('express');
const app = express();

// Modules
const fs = require('fs');
const bodyParser = require('body-parser');

// Variables
const jsonPath = './messages.json';
let id_count = getID();

// Implement EJS
app.set('view engine', 'ejs');
// Implement bodyParser
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files
app.use(express.static('public'));

// GET ROUTES

// Homepage
app.get('/', (req,res)=>{
    res.render('pages/index');
});
// Guestbook
app.get('/guestbook', (req,res)=>{
    let data = require(jsonPath);
    res.render('pages/guestbook',{data});
});
// New message
app.get('/newmsg', (req,res)=>{
    res.render('pages/newmsg');
});
// Handle page not found
app.get('*', (req,res)=>{
    res.send('Error 404, page not found.', 404);
});

// POST ROUTES

//Route for recieving form data
app.post('/submitdata', (req, res)=>{
    id_count += 1;
    // Save data from the recieved form
    let name = req.body.name;
    let country = req.body.country;
    let message = req.body.message;
    // Get date for guestbook entry and format it
    let date = new Date();
    date = date.getHours()+':'+date.getMinutes()+' '+date.getDate()+'.'+date.getMonth()+'.'+date.getFullYear();

    // Add data to json
    let data = require(jsonPath);
    data.push({
        'id': id_count,
        'username': name,
        'country': country,
        'message': message,
        'date': date
    });
    fs.writeFileSync(jsonPath, JSON.stringify(data, null, 4), (err)=>{
        if (err) return console.error(err);
    });
    console.log(`Data saved to ${jsonPath}`)

    res.render('pages/guestbook',{data});

});


//  PORT CONFIGURATION
const port = process.env.PORT || 5000;
app.listen(port,()=>{
    console.log(`Listening port ${port}`);
});

// FUNCTIONS

//Function for checking how many id's are already on the json file
function getID(){
    let json = require(jsonPath);
    let id_count = json.length;

    return id_count;
}