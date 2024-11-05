const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const ObjectId=mongoose.ObjectId

const User = new Schema({
    username:String,
    password:String,
    email:{type : String, unique : true}

})


const  todo = new  Schema({
    desceraption:String,
    done:Boolean,
    userId:ObjectId

}) 

const UserModel=mongoose.model('users',User)
const todoModel=mongoose.model('todos',todo)

module.exports = {
    UserModel:UserModel,
    todoModel : todoModel
}
