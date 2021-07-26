const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const port = 3000;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

const dbCon = mysql.createConnection(
    {
        host:'localhost',
        user:'root',
        password:"so6,ko123",
        database:'nodejs_api'

    }
);

dbCon.connect();

// home page 
app.get('/',(req,res)=>{
    return res.send({error:false,message:'Welcome to RESTful APIs by NodeJs.'});
});


// get all user
app.get('/api/v1/users',(req,res) =>{
    dbCon.query('SELECT * FROM users',(error,results,fields) =>{
        if(error) throw error;

        let message = '';
        if(results === undefined || results.length == 0){
            message = 'Users table id empty'
        }else{
            message = 'Successfully get all users.'
        }

        return res.send({error:false,data:results,message:message}); //ส่งdata มาด้วย 
    });
});

//add new user 
app.post('/api/v1/user',(req,res) =>{
   
    //ประกาศตัวแปรมาเก็บค่ารับข้อมูลจาก Body 
    let id = req.body.id;
    let password = req.body.password;
    let firstName = req.body.firstName;
    let lastName = req.body.lastName;
    let section = req.body.section;
    console.log(id+'-'+password+'-'+firstName+'-'+lastName+'-'+section); //ข้อมูลทืั้ insert
    //เงื่อนไขเมื่อไม่มีข้อมูลในตัวแปร 
    if (!id || !password || !firstName || !lastName || !section){
        return res.status(400).send({error:false,message:'Please provide user data'});
    }else{
        let sql = 'INSERT INTO users (id ,password , first_name , last_name ,section) VALUES (?,?,?,?,?)'; //value ใส่ ? แทน Parameters ตามจำนวน columns ที่เรามี
        dbCon.query(sql,[id ,password , firstName , lastName ,section],(error,results,fields) => {
            if(error) throw error

            return res.send({error:false,data:results,message:'OK User successfully added.'});
        });
    }
});



app.listen(port,() => {
  console.log(`Node JS Application is running on port ${port}`);  
});
