const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const port = process.env.PORT || 3000; //รับค่าPROT ในระบบ (ใช้กับHEROKU) หรือ 3000  
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

const dbCon = mysql.createConnection(
    {
        host:'us-cdbr-east-04.cleardb.com',
        user:'b4731cf30a359e',
        password:"fdc83ba0",
        database:'heroku_94413095446dc20'

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
    console.log(id+'-'+password+'-'+firstName+'-'+lastName+'-'+section); //ข้อมูลทื่ insert
    //เงื่อนไขเมื่อไม่มีข้อมูลในตัวแปร 
    if (!id || !password || !firstName || !lastName || !section){
        return res.status(400).send({error:false,message:'Please provide user data'});
    }else{
        let sql = 'INSERT INTO users (id ,password , first_name , last_name ,section) VALUES (?,?,?,?,?)'; //value ใส่ ? แทน Parameters ตามจำนวน columns ที่เรามี
        dbCon.query(sql,[id ,password , firstName , lastName ,section],(error,results,fields) => {
            if(error) throw error

            return res.send({error:false,data:results,message:'User successfully added.'});
        });
    }
});

//update user by id  
app.put('/api/v1/user',(req,res) =>{
   
  //ประกาศตัวแปรมาเก็บค่ารับข้อมูลจาก Body 
  let id = req.body.id;
  let password = req.body.password;
  let firstName = req.body.firstName;
  let lastName = req.body.lastName;
  let section = req.body.section;
  console.log(id+'-'+password+'-'+firstName+'-'+lastName+'-'+section); //ข้อมูลทื่ insert
  //เงื่อนไขเมื่อไม่มีข้อมูลในตัวแปร 
  if (!id || !password || !firstName || !lastName || !section){
      return res.status(400).send({error:false,message:'Please provide user data'});
  }else{
      let sql = 'UPDATE users SET password = ? , first_name = ? , last_name = ? ,section = ? WHERE id = ?'; // ?  คือ parameter   
      dbCon.query(sql,[password , firstName , lastName ,section ,id ],(error,results,fields) => {
          if(error) throw error

          let message ='';
          if(results.affectedRows == 0 ){ //ถ้าหา id  ของ user ไม่เจอ
            message = 'User data is not found.';
          }else{
            message = 'Successfully users updated.'
          }
          return res.send({error:false,data:results,message:message});
      });
  }
});

//delete user by id  
app.delete('/api/v1/user',(req,res) =>{
   
  //ประกาศตัวแปรมาเก็บค่ารับข้อมูลจาก Body 
  let id = req.body.id;
  
  //เงื่อนไขเมื่อไม่มีข้อมูลในตัวแปร 
  if (!id ){
      return res.status(400).send({error:false,message:'Please provide user id'});
  }else{
      let sql = 'DELETE FROM users WHERE id = ?'; // ?  คือ parameter   
      dbCon.query(sql,[id ],(error,results,fields) => {
          if(error) throw error

          let message ='';
          if(results.affectedRows == 0 ){ //ถ้าหา id  ของ user ไม่เจอ
            message = 'User data is not found.';
          }else{
            message = 'Successfully users deleted.'
          }
          return res.send({error:false,data:results,message:message});
      });
  }
});

// ----------------------------------pet-------------------------------------------------------- 



//add new pet 
app.post('/api/v1/pet',(req,res) =>{
 
  //ประกาศตัวแปรมาเก็บค่ารับข้อมูลจาก Body 
  let id = req.body.id;
  let petName = req.body.petName;
  let age = req.body.age;
  let species = req.body.species;
console.log(id + "--" + petName +"--"+age+"--"+species);
  //เงื่อนไขเมื่อไม่มีข้อมูลในตัวแปร 
  if (!id || !petName || !age || !species ){
      return res.status(400).send({error:false,message:'Please provide pet data'});
  }else{
      let sql = 'INSERT INTO pets (id ,pet_name , age , species)  VALUES (?,?,?,?)'; //value ใส่ ? แทน Parameters ตามจำนวน columns ที่เรามี
      dbCon.query(sql,[id ,petName , age , species ],(error,results,fields) => {
          if(error) throw error

          return res.send({error:false,data:results,message:'Pet successfully added.'});
      });
  }
});

//update pet by id  
app.put('/api/v1/pet',(req,res) =>{
 
//ประกาศตัวแปรมาเก็บค่ารับข้อมูลจาก Body 
let id = req.body.id;
let petName = req.body.petName;
let age = req.body.age;
let species = req.body.species;

//เงื่อนไขเมื่อไม่มีข้อมูลในตัวแปร 
if (!id || !petName || !age || !species ){
    return res.status(400).send({error:false,message:'Please provide user data'});
}else{
    let sql = 'UPDATE pets SET pet_name = ? , age = ? , species = ? WHERE id = ?'; // ?  คือ parameter   
    dbCon.query(sql,[petName , age , species  ,id ],(error,results,fields) => {
        if(error) throw error

        let message ='';
        if(results.affectedRows == 0 ){ //ถ้าหา id  ของ pet ไม่เจอ
          message = 'Pet data is not found.';
        }else{
          message = 'Successfully pet updated.'
        }
        return res.send({error:false,data:results,message:message});
    });
}
});

//delete pet by id  
app.delete('/api/v1/pet',(req,res) =>{
 
//ประกาศตัวแปรมาเก็บค่ารับข้อมูลจาก Body 
let id = req.body.id;

//เงื่อนไขเมื่อไม่มีข้อมูลในตัวแปร 
if (!id ){
    return res.status(400).send({error:false,message:'Please provide pet id'});
}else{
    let sql = 'DELETE FROM pets where id = ?'; // ?  คือ parameter   
    dbCon.query(sql,[id ],(error,results,fields) => {
        if(error) throw error

        let message ='';
        if(results.affectedRows == 0 ){ //ถ้าหา id  ของ user ไม่เจอ
          message = 'Pet data is not found.';
        }else{
          message = 'Successfully pet deleted.'
        }
        return res.send({error:false,data:results,message:message});
    });
}
});
//------------------------end pets-------------------------------------

app.listen(port,() => {
  console.log(`Node JS Application is running on port ${port}`);  
});

const readline = require('readline');

const readInterface = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

readInterface.question('Enter your command : ', (command) => {
    readInterface.close();

    if (command == 'get') {
        // get all pet
        app.get('/api/v1/pets',(req,res) =>{
            dbCon.query('SELECT * FROM pets',(error,results,fields) =>{
                if(error) throw error;
        
                let message = '';
                if(results === undefined || results.length == 0){
                    message = 'Pets table id empty'
                }else{
                    message = 'Successfully get all pets.'
                }
                return res.send({error:false,data:results,message:message}); //ส่งdata มาด้วย 
               
            });
        });
        console.log("เข้านี้แหละ")
    }else{
        console.log("พิมพ์อะไรมา");
    }

    
});
