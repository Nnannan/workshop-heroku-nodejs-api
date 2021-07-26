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
        let sql = 'INSERT INTO pets (id ,pet_name , age , species  VALUES (?,?,?,?)'; //value ใส่ ? แทน Parameters ตามจำนวน columns ที่เรามี
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
        let sql = 'UPDATE pets SET pet_name = ? , age = ? , species = ?) where id = ?'; // ?  คือ parameter   
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

app.listen(port,() => {
    console.log(`Node JS Application is running on port ${port}`);  
});
