const mysqlpool = require("../Database/DatabaseConnect");


const getAllSchool = async (req,res)=>
{
    try {
        console.log("fetcing schools data");

        const query = "Select * from Schools";

        const data = await mysqlpool.query(query);

        if(!data) console.log("Data not found.")

        console.log("school data fetched successfully.")

        return res.status(200).send(
            {
                success:true,
                message:"Data recive successfully.",
                data:data[0]
            }
        )
    } catch (error) {
        console.log(error);
        return res.status(500).send(
            {
                success:true,
                message:"Some thing went wrong while fetching data.",
                data:data[0]
            }
        )
    }

}

const addSchoolDetails = async (req,res)=>
{
    try {

        console.log("Adding school details in Process");

        const {name,address,latitude,longitude} = req.body;

        if(!name || !address || !latitude || !longitude)
        {
            console.log("Parameters are missing.");

            return res.status(404).json({
                success:false,
                message:"Not all parameter are filled."
            })
        }

        const query = ` Insert into 
                            Schools 
                        values
                            (null,
                            \"${name}\",
                            \"${address}\",
                            ${latitude},
                            ${longitude})`

        console.log("executing SQL query.");

        const data = await mysqlpool.query(query);

        if(!data)
        {
            return res.status(500).json({
                success:false,
                message:"Somthing went wring while inserting data."
            })
        }

        console.log("School details inserted successfully.");

        return res.status(200).send(
            {
                success:true,
                message:"School details inserted successfully.",
                data
            }
        )
        
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success:false,
            message:("Something went wrong while adding shcool details.")
        })
    }
}

const getListOfNearerSchool = async (req,res)=>
{
    try {

        const { latitude, longitude } = req.query;

        if (!latitude || !longitude) {
            return res.status(400).json({ error: 'Latitude and longitude both are required' });
        }

        console.log("Got user latitude and longitude information.")

        const query = `
        SELECT 
            id, 
            name, 
            address, 
            latitude, 
            longitude, 
            (6371 * acos(cos(radians(${latitude})) * cos(radians(latitude)) * cos(radians(longitude) - radians(${longitude})) + sin(radians(${latitude})) * sin(radians(latitude)))) AS distance 
        FROM 
            Schools 
        ORDER BY 
            distance ASC
    `;

    console.log("executing sql query.")
    
    const data = await mysqlpool.query(query);

    if(!data)
    {
        return res.status(500).json({
            success:false,
            message:"Somthing went wring while fetching data."
        }) 
    }

    return res.status(200).send(
        {
            success:true,
            message:"School details fetched in order successfully.",
            data:data[0]
        }
    )
        
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success:false,
            message:("Something went wrong while geting list of shcool details.")
        })
    }
}

module.exports = {getAllSchool,addSchoolDetails,getListOfNearerSchool};