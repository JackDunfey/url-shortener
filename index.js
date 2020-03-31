const express = require('express');
const path = require('path');
const Datastore = require('nedb');
require('dotenv/config');
const app = express();
const db = new Datastore({filename: "data.db",autoload:true});
app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.listen(process.env.PORT || 8080, ()=>{console.log(`Server started at ${new Date().toString()}`)})
app.get('/',(req,res)=>{
  res.sendFile(`${path.resolve()}/sites/index.html`);
})
app.get('/g/:code',(req,res)=>{
  db.find({code: req.params.code}, (err,databaseArray)=>{
    if(err){
      res.status(500).send(`Database err: ${err}`);
    } else if(databaseArray.length != 1){
      res.status(400).send("Incorrect number of docs");
    } else {
      res.redirect(302, databaseArray[0].url);
    }
  })
})
app.get('/view',(req,res)=>{
  db.find({},(err,data)=>{
    if(err){
      res.status(500).send(`Viewing error: ${err}`);
    } else {
      res.json(data);
    }
  })
})
app.post('/add',(req,res)=>{
  db.find({code: req.body.code}, (err, databaseArray)=>{
    if(databaseArray.length > 0){
      res.status(400).sendFile(`${path.resolve()}/sites/index.html`);
    } else {
      db.insert(req.body);
      res.status(201).send("Database updated!");
    }
  });
})
