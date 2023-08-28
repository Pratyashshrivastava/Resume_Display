require('./userDetails');
const jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs")
const { log } = require('console');
const express = require('express');
const mongoose = require('mongoose');
const cors = require("cors");


const app = express();


app.use(express.json());
app.use(cors());

const JWT_SECRET = "dhaksfagbojefkajbdqe;[23[4[3]";

const mongoUrl = 'mongodb+srv://Test1:Test1@cluster0.3bidyco.mongodb.net/?retryWrites=true&w=majority'

mongoose.connect(mongoUrl, {
    useNewUrlParser: true
}).then(() => { console.log("Connected to Database") })
    .catch(e => console.log(e));


app.listen(5000, () => {
    console.log("Server Started");

});

app.post("/post", async (req, res) => {
    console.log(req.body);
    const { data } = req.body;

    try {
        if (data == "pratyash") {
            res.send({ status: "ok" });
        } else {
            res.send({ status: 'user not found' });
        }
    } catch (error) {
        res.send({ status: 'error' });
    }
});

/* Registering the User*/
const User = mongoose.model("UserInfo");





app.post('/register', async (req, res) => {
    const { fname, lname, email, password } = req.body;

    const encryptedPassword = await bcrypt.hash(password, 10);
    try {
        const oldUser = await User.findOne({ email });
        if (oldUser) {
            return res.send({ error: "User already Exists" });
        }
        await User.create({
            fname,
            lname,
            email,
            password: encryptedPassword,
        });
        res.send({ status: "ok" });
    } catch (error) {
        res.send({ status: "Error" })
    }
});

/* User Login*/

app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
        return res.json({ error: "User Not Found" });
    }

    if (await bcrypt.compare(password, user.password)) {
        const token = jwt.sign({email:user.email}, JWT_SECRET);

        if (res.status(201)) {
            return res.json({ status: 'ok', data: token });
        } else {
            return res.json({ error: "error" });
        }
    }
    return res.json({ status: "Invalid Password" });
});

app.post('/userData', async (req, res) => {
    const { token } = req.body;
    try {
        const user = jwt.verify(token, JWT_SECRET);
        const useremail = user.email;
        User.findOne({ email: useremail }).then((data)=>{
            res.send({status:"ok", data:data});
        })
        .catch((eror)=>{
            res.send({status:'error',data:error});
        });
    } catch (error) {

    }

});