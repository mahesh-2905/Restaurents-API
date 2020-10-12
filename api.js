const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongo = require('mongodb')
const MongoClient = mongo.MongoClient;


const app = express();
const port = process.env.PORT || 8900;
const Mongo_Url = "mongodb+srv://Mahesh290501:Mahesh290501@cluster0.qmby2.mongodb.net/Zomato?retryWrites=true&w=majority";

var db;

app.use(cors());
app.use(bodyParser.urlencoded({extended:true}));

// setting the type of template engine
app.set('view engine','ejs');

//Health check
app.get('/healthcheck',(req,res)=>{
    res.send("API is working");
});

//API's List
app.get('/',(req,res)=>{
    res.render('index')
});

app.get('/healthcheck',(req,res)=>{
    res.send('API is working');
});

//List of Cities
app.get('/cities',(req,res)=>{
    db.collection('city').find({}).toArray((err,result)=>{
        res.send(result);
    });
});


//List of Cusines
app.get('/cuisine',(req,res)=>{
    db.collection('cuisine').find({}).toArray((err,result)=>{
        res.send(result);
    });
});


//List of MealTypes
app.get('/mealtypes/:id',(req,res)=>{
     var query={ }
    if(req.params.id){
        query={_id:req.params.id};
    }
    else{
        query={ }
    }
    db.collection('mealType').find(query).toArray((err,result)=>{
        res.send(result);
    });
});


//Get all Orders
app.get('/orders',(req,res)=>{
    db.collection('orders').find({}).toArray((err,result)=>{
        res.send(result);
    });
});


//Restaurent
app.get('/restaurents',(req,res)=>{
    var query ={}
    if(req.query.city && req.query.mealtype){
        query = {city:req.query.city,"type.mealtype":req.query.mealtype}
    } else if(req.query.mealtype){
        query ={"type.mealtype":req.query.mealtype}
    } else if(req.query.city){
        query ={city:req.query.city}
    }
    else{
        query={ }
    }
    db.collection("restaurent").find(query).toArray((err,result)=>{
        if(err) throw err
        res.send(result)
    });
});


//RestaurentList
app.get('/restaurents/:mealtype',(req,res) => {
    var query = {};
    if(req.query.cuisine){
        query={"type.mealtype":req.params.mealtype,"Cuisine.cuisine":req.query.cuisine}
    }else if(req.query.city){
        query={"type.mealtype":req.params.mealtype,city:req.query.city}
    }else if(req.query.lcost && req.query.hcost){
        query={"type.mealtype":req.params.mealtype,cost:{$lt:Number(req.query.hcost),$gt:Number(req.query.lcost)}}
    }
    else{
        query= {"type.mealtype":req.params.mealtype}
    }
    db.collection('restaurent').find(query).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})

//Restaurents Details
app.get('/restaurent/:id',(req,res)=>{
    db.collection('restaurent').find({_id:req.params.id}).toArray((err,result)=>{
        res.send(result);
    })
})
//Database connection
MongoClient.connect(Mongo_Url,(err,connection)=>{
    if(err) throw err;
    db = connection.db('Zomato');
    app.listen(port,(err)=>{
        if(err) throw err;
        console.log(`Server running at the port no: ${port}`);
    })
})


