const express = require("express");
const dotenv =  require("dotenv");
const morgan = require("morgan");
const route = require("./Routes/SchoolsRoutes");
const pool = require('./Database/DatabaseConnect');

dotenv.config();

// main app object
const app = express();

const port = process.env.PORT || 8001;

//middleware
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.get('/',(req,res)=>{
    return res.status(200).json(
    {
        success:true,
        message:"Welcome to School Management API"
    }
)});

// connect to database
pool.connect()
    .then(() => console.log('Connected to CockroachDB successfully'))
    .catch(err => console.error('Error connecting to CockroachDB:', err.stack));

app.use("/api/v1/schools",route);



app.listen(port,()=>{console.log("Server is running on port "+port);});

