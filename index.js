const bcrypt=require("bcrypt")
const express=require("express");
const { UserModel,Todomodel, todoModel }= require("./db");
const jwt=require("jsonwebtoken");
const mongoose = require("mongoose")
const {z} = require("zod")
const Jwt_SECRET="adi123";

mongoose.connect("mongodb+URL")
const app=express();

app.use(express.json());

app.post("/signup", async function(req,res){
    const requirebody = z.object({
        email: z.string(),
        name: z.string(),
        password : z.string()
    })

    const parsed= requirebody.safeParse(req.body);

    if(!parsed.success){
        res.json({
            message:"incro format",
            error:parsed.error
        })
        return 
    }


    const username=req.body.username
    const password=req.body.password
    const email=req.body.email
  try {
    const haspaswword= await bcrypt.hash(password,5)
    console.log(haspaswword);
 
     await UserModel.create({
        username:username,
        password:haspaswword,
        email:email

    })
} catch (error) {
    res.json({
        message:"user already exit"
        
    })
    return 

    
}  
    res.json({
        message:"you are login"
    })

})


app.post("/signin", async function(req,res){
    const email=req.body.email
    const password=req.body.password

    const response = await UserModel.findOne({
        email:email

    })

    if(!response){
        res.status(403).json({
            message:"user not exit"
        })
        return
    }

   const passwordMatch =  await bcrypt.compare(password, response.password);

    if(passwordMatch){
        const token = jwt.sign({
            id : response._id.toString()
        },Jwt_SECRET);

        res.json({
            token : token 
        })
    }
    else{
        res.status(403).json({
            message:"incorect login"
          })
        
    }

})

app.post("/todo",auth,async function(req,res){
    const userId=req.userId
    const title=req.body.title
    const done=req.body.done

    await todoModel.create({
        userId,
        title,
        done
    })

    res.json({
        message:"todo create"
    })

})

app.get("/todos",auth,function(req,res){
    const userId=req.userId

    res.json({
        userId:userId
    })

})

function auth(req,res,next){
    const token = req.headers.token

    const decodedata=jwt.verify(token,Jwt_SECRET);

    if(decodedata){
        req.userId =decodedata.id
        next()
    }
    else{
        res.status(404).json({
            message:"incorect login"
        })
    }

}

app.listen(3000)
