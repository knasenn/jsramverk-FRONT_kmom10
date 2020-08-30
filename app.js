//Dep
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fetch = require("node-fetch");
//Config
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//Static files and variables
const api_adress = "http://localhost:8333";
var globalToken = "empty";
var userEmail = "empty";
app.use("/", express.static("assets"));
app.engine('html', require('ejs').renderFile);


//Index GET
//--------------------------------------------------
app.get("/", (req, res) => {
    res.render("index.ejs");
});

app.get("/graph", auth, (req, res) => {
    res.render("chart.html");
});

//Depo GET
app.get("/depo", auth, async  (req, res) => {

    try {
        await fetch(`${api_adress}/api/getuser`, {
            method: 'post',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
              email: userEmail,
              token: globalToken
            })
            }).then(function (response) {
                return response.json();
            })
            .then(async function (result) {
                if (result.msg == "user fetched") {
                    // let stockprice = result.stockprice.toFixed(2);
                    let funds = result.funds.toFixed(2);
                    res.render("depo.ejs", {stock: result.stock, funds: funds, stockprice: result.stockprice});
                } else {
                    res.render("error.ejs", { msg: result.msg });
                }
            })
    } catch(err) {
          console.log(err);
          res.render("error.ejs", {msg: "Something went wrong"});
    }
});
//depo POST
app.post("/depo", auth, async (req, res) => {
    try {
        await fetch(`${api_adress}/api/updateuser`, {
            method: 'post',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
              email: userEmail,
              token: globalToken,
              add_funds: req.body.add_funds,
              buy: req.body.buy,
              sell: req.body.sell
            })
            }).then(function (response) {
                return response.json();
            })
            .then(async function (result) {
                res.redirect('./depo')
            })
    } catch(err) {
          console.log(err);
          res.render("error.ejs", {msg: "Something went wrong"});
    }
});

//Login GET
//--------------------------------------------------
app.get("/login", (req, res) => {
    res.render("login.ejs");
});
//login POST
app.post("/login", async (req, res) => {
    try {
        await fetch(`${api_adress}/api/login`, {
            method: 'post',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
              email: req.body.email,
              password: req.body.password
            })
            }).then(function (response) {
                return response.json();
            })
            .then(async function (result) {
                if (result.msg == "token created") {
                    globalToken = result.token;
                    userEmail = req.body.email;
                    res.redirect('./depo')
                } else {
                    globalToken = result.token;
                    userEmail = "Empty"
                    console.log(result.msg);
                    res.render("error.ejs", { msg: result.msg });
                }
            })
    } catch(err) {
          console.log(err);
          res.render("error.ejs", {msg: "Something went wrong"});
    }
});

//register GET
//--------------------------------------------------
app.get("/register", (req, res) => {
    res.render("register.ejs");
});
//register POST
app.post("/register", async (req, res) => {
    //Login info is checked if OK
    try {
        await fetch(`${api_adress}/api/register`, {
            method: 'post',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
              name: req.body.name,
              email: req.body.email,
              password: req.body.password
            })
            }).then(function (response) {
                return response.json();
            })
            .then(async function (result) {
                if (result.msg == "user created") {
                    res.redirect('./login')
                } else {
                    console.log(result.msg);
                    res.render("error.ejs", { msg: result.msg });
                }
            })
    } catch(err) {
          console.log(err);
          res.render("error.ejs", {msg: "Something went wrong"});
    }
});

//logout GET
//--------------------------------------------------
app.get("/logout", (req, res) => {
    globalToken = "empty";
    res.redirect('./login')
});



//auth
//--------------------------------------------------
async function auth(req, res, next) {
    try {
        await fetch(`${api_adress}/api/auth`, {
            method: 'post',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
              token: globalToken
            })
            }).then(function (response) {
                return response.json();
            })
            .then(async function (result) {
                if (result.msg == "token ok") {
                    next();
                } else {
                    console.log(result.msg);
                    res.render("error.ejs", { msg: result.msg });
                }
            })
    } catch(err) {
          console.log(err);
          res.render("error.ejs", {msg: "Please log in"});
    }

}



app.listen(3000, () => console.log('Server started on port 3000'));
