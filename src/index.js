const express = require('express')
const studentArray=require('./InitialData');
const Joi=require('joi');
const app = express()
const bodyParser = require("body-parser");
const port = 8080
app.use(express.urlencoded());

// Parse JSON bodies (as sent by API clients)
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//global variables
var ID=7;
//schema for validation
const schemaPOST=Joi.object({
    name: Joi.string().min(1).required(),
    currentClass:Joi.number().min(1).required(),
    division: Joi.string().max(1).required()
});

const schemaPUT=Joi.object({
    id:Joi.number().min(1),
    name:Joi.string().min(1),
    currentClass:Joi.number().min(1),
    division:Joi.string().max(1)
})

app.get('/api/student',(req,res)=>{
    console.log("Inside GET: /api/student");
    res.send(studentArray);
})

app.get('/api/student/:id',(req,res)=>{
    console.log("Inside GET: /api/student/:id");
    var id=parseInt(req.params.id);
    var obj=studentArray.find(student=>student.id===id);
    if(obj===undefined){
        res.status(404).send("Student not found");
        return;
    }
    res.send(obj);
})

app.post('/api/student',(req,res)=>{
    console.log("Inside POST: /api/student");
    const validationObj=schemaPOST.validate(req.body);
    if(validationObj.error){
        console.log("Validation error");
        res.status(400).send(validationObj.error.details[0].message);
        return;
    }
    var obj={...req.body};
    obj.id=++ID;
    console.log(obj);
    studentArray.push(obj);
    res.send({"id":`${obj.id}`});
})

app.put('/api/student/:id',(req,res)=>{
    console.log("Inside PUT: /api/student/:id");
    var id=parseInt(req.params.id);
    var obj={...req.body};
    obj.id=id;
    //validate
    const validationObj=schemaPUT.validate(obj);
    if(validationObj.error){
        res.status(400).send(validationObj.error.details[0].message);
        return;
    }

    var index=studentArray.findIndex(element=>element.id===id);
    if(index===-1){
        res.status(400).send("Invalid id");
        return;
    }
    var oldObj=studentArray[index];
    var newObj={...oldObj,...obj}
    //console.log(newObj);
    studentArray.splice(index,1,newObj);
    //console.log(studentArray);
    res.send(studentArray);

})

app.delete('/api/student/:id',(req,res)=>{
    console.log("Inside DELETE: /api/student/:id");
    var id=parseInt(req.params.id);
    var index=studentArray.findIndex(element=>element.id==id);
    if(index===-1){
        res.status(400).send("Invalid id");
        return;
    }
    var obj=studentArray[index];
    studentArray.splice(index,1);
    res.send(obj);
})
app.listen(port, () => console.log(`App listening on port ${port}!`))

module.exports = app;   