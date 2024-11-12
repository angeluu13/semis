//instantiation
//import express
const express = require('express')
const app = express()
const moment = require('moment')

//importing mysql
const mysql = require('mysql')  
//port number
const PORT = process.env.PORT || 2002;

const logger = (req, res, next) => {
    console.log(`${req.protocol}://${req.get('host')}${req.originalUrl} : ${moment().format()}`)
    next()
}

app.use(logger)

//connection to mysql
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'product_info',
});
//initilization of connection
connection.connect();

//API
//get request and response are the parameters
app.get("/api/product_info", (req, res) => {
    //create querry
    connection.query("SELECT * FROM product_info", (err, rows, fields)=>{
        //checking error
        if(err) throw err;
        //response
        //key value pair
        res.json(rows);
    })
})

//API
//passing the id parameter
app.get("/api/product_info/:id", (req, res) => {
    const id=req.params.id;
    connection.query(`SELECT * FROM product_info WHERE id ='${id}'` , (err, rows, fields) => {
        if (err) throw err;

        if(rows.lenght > 0){
            res.json(rows);
        }else{
            res.status(400).json({msg:`${id} id not found!`});
        }
    } )
    //res.send(id);

})

//Post
app.use(express.urlencoded({extended: false}))
app.post("/api/product_info", (req, res) => { 

    const item = req.body.item;
    const price = req.body.price;
    const quan = req.body.quan;
    const supply = req.body.supply;

    connection.query(`INSERT INTO product_info (itemName, unitPrice, quantity, supplier) VALUE ('${item}', '${price}', '${quan}','${supply}')`, (err, rows, fields) => {
        if (err) throw err;
        res.json({msg:`Successfully Inserted!`});
    })


})

//CRUD
//API
//PUT - UPDATE
app.use(express.urlencoded({extended: false}))
app.put("/api/product_info", (req, res) => {

    const item = req.body.item;
    const price = req.body.price;
    const quan = req.body.quan;
    const supply = req.body.supply;
    const id = req.body.id;

    connection.query(`UPDATE product_info SET itemName = '${item}', unitPrice = '${price}', quantity = '${quan}',  supplier = '${supply}' WHERE id = '${id}'`, (err, rows, fields) => {
        if(err) throw err;
        res.json({msg:`Successfully updated`});
    })


})

//delete api
app.use(express.urlencoded({extended: false}));
app.delete("/api/product_info", (req, res) => {
    const id = req.body.id;
    connection.query(`DELETE FROM product_info WHERE id = '${id}'`, (err, rows, fields) => {
        if(err) throw err;
        res.json({msg: `Successfully deleted`});
    })


})


app.listen(2002, () => {
    console.log(`Server is running on ${PORT}`);
})