const express = require("express");
const multer = require("multer");
const { getAllSchool, addSchoolDetails, getListOfNearerSchool } = require("../Controllers/SchoolControllers");

const upload = multer();


// Route object
const route = express.Router();


route.get("/",(req,res)=>
{
    return res.status(200).json(
        {
            success:true,
            message:"Welcome to School Management API"
        }
    )
})

route.get("/getAllSchools",getAllSchool);

route.post("/addSchool",upload.any(),addSchoolDetails);

route.get("/listSchools",getListOfNearerSchool)


module.exports = route;
