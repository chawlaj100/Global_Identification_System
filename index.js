// var http = require('http');
// var server = http.createServer(function(req, res) {
//     res.writeHead(200, {'Content-Type': 'text/plain'});
//     var message = 'It works!\n',
//         version = 'NodeJS ' + process.versions.node + '\n',
//         response = [message, version].join('\n');
//     res.end("<h1>Hello</h1>");
// });
// server.listen();

var http = require('http');
const express = require("express");
var sql = require("mysql");
const bcrypt = require("bcrypt");
const app = express();
// const port = 3000
const bodyparser = require("body-parser");

function getConnection(){
    return sql.createConnection({
    host: "11.86.0.24:3306",
    user: "root",
    password: "",
    database: "globalis_GIS"
    });
}

app.use(express.static("public"));
app.use("/css", express.static(__dirname + "public/css"));
app.use("/img", express.static(__dirname + "public/img"));
app.use("/js", express.static(__dirname + "public/js"));
app.use(bodyparser.urlencoded({extended: false}));

app.set("views", "./views");
app.set("view engine", "ejs");


app.get("/", (req, res) => {
    // conn.query("SELECT * FROM user", function(error, rows, fields){
    //     if(error){
    //         console.log("Error")
    //     }
    //     else{
    //         console.log("Fetching")
    //         console.log(rows)
    //     }
    // })
    res.render("index");
});
app.get("/index", (req, res) => {
    res.render("index");
});
app.get("/login", (req, res) => {
    res.render("login", {msg: ""});
});
app.post("/log_in", (req, res) => {
    const email = req.body.email_id;
    const pass = req.body.password_id;
    console.log("Email: " + email);
    console.log("Password: " + pass);
    
    const queryString = "SELECT email,password,fname FROM register WHERE email = ?";
    getConnection().query(queryString, [email], (err, result, fields) => {
        if (err){
            console.log("Some error.");
            res.render("login", {msg:" Try again in some time..."});
        }
        else if (result.length === 0){
            console.log("User not found.");
            res.render("login", {msg: "User with this email-id not found. Please Sign-Up first."});
        }
        else if (result.length > 0 ){
            if(bcrypt.compareSync(pass, result[0].password)){
                    res.render("user", {user: result[0].fname});
            }
            else{
                console.log("Incorrect Password");
                res.render("login", {msg: "Incorrect Password, Try again."});
            }
        }
    });
});
app.get("/registration", (req, res) => {
    res.render("registration", {msg:""});
});
app.post("/registered", (req, res) => {
    const email = req.body.form_email;
    const pass = req.body.form_password;
    const rpass = req.body.form_rpassword;
    const fname = req.body.form_fname;
    const mname = req.body.form_mname;
    const lname = req.body.form_lname;
    const mobile = req.body.form_mobile;
    const pan = req.body.form_pan;
    const dob = req.body.form_dob;
    const aadhar = req.body.form_aadhar;
    const apartment = req.body.form_apartment;
    const street = req.body.form_street;
    const area = req.body.form_area;
    const pincode = req.body.form_pincode;
    const city = req.body.form_city;
    const state = req.body.form_state;
    const country = req.body.country;
    const queryString = "SELECT * FROM register WHERE email = (?)";
    getConnection().query(queryString, [email], (err, row) => {    
        if (err || row.length > 0){
            console.log("Failed to insert");
            res.render("registration", {msg: "User with this mail-id already exists. Sign-Up using a different one."});
        }
        else{
            const hashed_password = bcrypt.hashSync(pass,8);
            const hashed_r = hashed_password;
            const queryString1 = "INSERT INTO register VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
            getConnection().query(queryString1, [email,hashed_password,hashed_r,fname,mname,lname,mobile,pan,dob,aadhar,apartment,street,area,pincode,city,state,country], (err, result, fields) => {
                if (err){
                    console.log("Failed to start", err);
                    res.render("registration", {msg: "Failed to register. Please try again after some time..."});
                }
                else{
                    console.log("Entry success.");
                    res.render("login", {msg: "Registration Successful. Now Sign-in here !!"});
                }
            });
        }
    });
});
app.get("/user", (req, res) => {
    res.render("user", {msg:""});
});
app.listen(process.env.PORT || 3000, () => console.log('Server Started on port', process.env.PORT || 3000));