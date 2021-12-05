const express = require("express");
const app = express();
const mysql = require("mysql");
const bodyParser = require("body-parser");
const cors = require('cors');
const {encrypt, decrypt} = require('./Encryption');

const db = mysql.createConnection({
    user: "root",
    host: "localhost",
    password: "Hello22World!",
    database: "PasswordsDB",
});

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));


app.get("/app/showpasswords" , (req, res) => {
    const sqlShowPasswords = "SELECT * FROM passwords"; 
    db.query(sqlShowPasswords, (err, result)=> {
        res.send(result);
    });
})

app.post("/app/add", (req, res) => {
    const website = req.body.website;
    const email = req.body.email;
    const password = req.body.password;

    const hashedPassword = encrypt(password);

    const sqlAdd = "INSERT INTO passwords (website, email, password, iv) VALUES (?, ?, ?, ?)"
    db.query(sqlAdd, [website, email, hashedPassword.password, hashedPassword.iv], (err, result)=> {
        console.log(err); // can change err to result
    });
});

app.delete('/app/delete/:id', (req, res) => {
    const id = req.params.id;
    const sqlDelete = "DELETE FROM passwords WHERE `id` = ?";

    db.query(sqlDelete, id, (err, result) => {
        if (err) {
             console.log(err);
             console.log("not working");
        }
        else
            console.log(result);
            console.log("nope");
    });
});


app.post('/app/decryptpassword', (req, res) => {
    res.send(decrypt(req.body));
})

app.listen(3001, () => {
    console.log('Server is running');
});