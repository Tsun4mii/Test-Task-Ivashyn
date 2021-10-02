const express = require('express');
const multer = require('multer');
const db = require('./models');
const path = require('path');
const session = require('express-session');
const User = require('./models').User;
const func = require('./funcs');
const bodyParser = require('body-parser');
const app = express();
var sess;

app.use(express.static("./"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({secret: 'ssshhhhh',saveUninitialized: true,resave: true}));

const storageConfig = multer.diskStorage({
    destination: (req, file, cb) =>{
        cb(null, "images");
    },
    filename: (req, file, cb) =>{
        cb(null, file.originalname);
    }
});

app.use(multer({storage:storageConfig}).single("file"));

app.get('/index', (req, res) => {
    sess = req.session;
    if(sess.email){
        res.sendFile(__dirname + '/views/index.html')
    }
    else{
        res.redirect('/login');
    }
    res.sendFile(__dirname + '/views/index.html')
})
app.get('/api/get', (req, res) =>{
    User.findAll().then((users)=>{
        res.send(JSON.stringify(users))
    })
})
app.post('/api/post', (req, res) => {
    console.log(req.body);
    func.addUser(req, res);
})
app.put('/api/put', (req, res)=>{
    func.updUser(req, res);
})
app.delete('/api/delete', (req, res)=>{
    func.delUser(req, res);
})
app.post('/api/generate', (req, res)=>{
    func.genPdf(req, res);
})
app.post('/api/loadimg', (req, res)=>{
    func.loadImage(req, res);
})
app.get('/login', (req, res)=>{
    sess = req.session;
    if(sess.email)
    {
        res.redirect('/index')
    }
    else{
        res.sendFile(__dirname+'/views/login.html')
    }
})
app.post('/login', (req, res)=>{
   User.findOne({where:{email: req.body.email}}).then((user)=>{
        if(user.email){
            sess = req.session;
            sess.email = req.body.email;
            console.log(`User with ${req.body.email} authorized `);
            res.redirect('/index')
        }
        else{
            console.log('authorize error');
        }
    })
})
db.sequelize.sync().then((req) =>{
    app.listen(5000, () => {
        console.log('server is running')
    })
})
