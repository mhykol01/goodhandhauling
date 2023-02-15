// Require
const express = require('express')
const app = express()
const fs = require('fs')
const path = require('path')
const nodemailer = require('nodemailer')
const bp = require('body-parser')
const helmet = require('helmet')
require('dotenv').config()

// Mime type
const mime = {
    html: 'text/html',
    txt: 'text/plain',
    css: 'text/css',
    gif: 'image/gif',
    jpg: 'image/jpeg',
    png: 'image/png',
    svg: 'image/svg+xml',
    js: 'application/javascript'
}

// Read html files in the views folder
const readFile = (file) => {
    const res = {
        // Add layouts here
        header: fs.readFileSync('./views/layouts/header.html', 'utf-8'),
        footer: fs.readFileSync('./views/layouts/footer.html', 'utf-8'),
    }
    try { // Attempt to read html file in the views folder
        res.body = fs.readFileSync('./views/' + file + '.html', 'utf-8')
        return res.header + res.body + res.footer
    } catch (e) {
        res.body = fs.readFileSync('./views/404.html', 'utf-8')
        return res.header + res.body + res.footer
    }
}

// Login to smtp server
const transporter = nodemailer.createTransport({
    host: process.env.smtp,
    port: 465,
    secure: true,
    auth: {
        user: process.env.email,
        pass: process.env.pass,
    },
    tls: {
        rejectUnauthorized: false,
    },
})
// Verify if login was successful
transporter.verify((err, success) => {
    if (err) {
        console.error(err)
    } else {
        console.log("Logged in successfully")
    }
})

app.use(bp.json())
app.use(helmet())

// GET request
app.get ('*', (req, res) => {
    this.path = req.path.split('/')
    if (this.path[1] == '') { // Check if path is an empty string
        res.set('Content-Type', mime.html)
        res.send(readFile('index'))
    } else if (this.path[1] == 'favicon.ico') { // Check if path is favicon.ico
        const s = fs.createReadStream('./assets/favicon.ico')
        s.on('open', () => {
            res.set('Content-Type', 'text/plain')
            s.pipe(res)
        })
        s.on('error', () => {
            res.set('Content-Type', mime.html)
            res.send(readFile('404'))
        })
    } else if (!this.path[2]) { // Attempt to read html files in the views folder
        res.set('Content-Type', mime.html)
        res.send(readFile(this.path[1]))
    } else if (this.path[2]) { // If this.path[2] exists then this will check the assets folder for the requested content 
        const type = mime[path.extname('./assets/' + this.path[1] + '/' + this.path[2]).slice(1)] || 'text/plain'
        const s = fs.createReadStream('./assets/' + this.path[1] + '/' + this.path[2])
        s.on('open', () => {
            res.set('Content-Type', type)
            s.pipe(res)
        })
        s.on('error', () => {
            res.set('Content-Type', mime.html)
            res.send(readFile('404'))
        })
    } else { // Display "page not found"
        res.set('Content-Type', mime.html)
        res.send(readFile('404'))
    }
})

// Post request
app.post('/', (req, res) => {
    // Check if submitted content is blank
    if (req.body.fname == '' || req.body.lname == '' || req.body.email == '' || req.body.bname == '' || req.body.fname == undefined || req.body.lname == undefined || req.body.email == undefined || req.body.bname == undefined) {
        console.log('Form is blank')
        res.send('Form is blank')
    } else {
        const options = { // Setup email content
            from: "site@" + process.env.domain,
            to: process.env.email,
            subject: "Quote",
            html: "First Name: " + req.body.fname + "<br>Last Name: " + req.body.lname + "<br>Email: " + req.body.email + "<br>Business Name: " + req.body.bname
        }
        
        // Send email from this site to email specified in .env
        transporter.sendMail(options, (err, info) => {
            if (err) {
                console.log(err)
                return
            }
            console.log("Sent: " + info.response)
        })
        console.log('sent')
        res.send('Sent')
    }
})

app.listen(3000)
