const pool = require("../Database/DatabaseConnect");

function isFloat(value) {
    return /^-?\d*\.\d+$/.test(value);
}

function isValidLatitude(lat) {
    return !isNaN(lat) && lat >= -90.0 && lat <= 90.0;
}

function isValidLongitude(lon) {
    return !isNaN(lon) && lon >= -180.0 && lon <= 180.0;
}

const getAllSchool = async (req,res)=>
{
    try {
        console.log("fetcing schools data");

        const query = "Select * from Schools";

        const data = await pool.query(query);

        if(!data) console.log("Data not found.")

        console.log("school data fetched successfully.")

        return res.status(200).send(
            {
                success:true,
                message:"Data recive successfully.",
                data:data.rows
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

        let {name,address,latitude,longitude} = req.body;

        if(!name || !address || !latitude || !longitude)
        {
            console.log("Parameters are missing.");

            return res.status(404).json({
                success:false,
                message:"Not all parameter are filled."
            })
        }

        name = name.trim();
        address=address.trim();
        latitude = latitude.trim();
        longitude = longitude.trim();

        //checking name value
        if (typeof name !== "string")
        {
            return res.status(404).json({
                success:false,
                message:"name is not with right data type string."
            })
        }

        // checking address value
         
        if(typeof address !== "string")
        {
            return res.status(404).json({
                success:false,
                message:"Address is not with right data type string."
            })
        }

        // checking latitude and longitude with float value

        if(!isFloat(latitude))
        {
            return res.status(404).json({
                success:false,
                message:"latitude value is not in float type."
            })
        }

        if(!isFloat(longitude))
        {
            return res.status(404).json({
                success:false,
                message:"longitude value is not in float type."
            })
        }

        const num1 = parseFloat(latitude);
        const num2 = parseFloat(longitude);

        if(!isValidLatitude(num1) || !isValidLongitude(num2))
        {
            return res.status(404).json({
                success:false,
                message:"latitude and longitude is not in  right range."
            })
        }


        const query = `INSERT INTO schools (name, address, latitude, longitude) VALUES ('${name}', '${address}', ${latitude},${longitude})`

        console.log("executing SQL query.");

        const data = await pool.query(query);

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

        // checking latitude and longitude data type
        if(!isFloat(latitude))
        {
            return res.status(404).json({
                success:false,
                message:"latitude value is not in float type."
            })
        }

        if(!isFloat(longitude))
        {
            return res.status(404).json({
                success:false,
                message:"longitude value is not in float type."
            })
        }

        const num1 = parseFloat(latitude);
        const num2 = parseFloat(longitude);

        if(!isValidLatitude(num1) || !isValidLongitude(num2))
        {
            return res.status(404).json({
                success:false,
                message:"latitude and longitude is not in  right range."
            })
        }

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
    
    const data = await pool.query(query);

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
            data:data.rows
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