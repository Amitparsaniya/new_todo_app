const express =require("express")
const { createTodo, addNewTask, getTasks, deleteTask, getTaskById, updateTask, serchdata, getlatesttask } = require("../controllers/user_todo")
const multer = require("multer")
const { isAuth } = require("../middleware/Authuser")
const { newTask, validte, todoValidator } = require("../middleware/validator")
const { storage } = require("../middleware/multer")


const router = express.Router()

router.post("/create-todo",isAuth,storage,todoValidator,validte,createTodo)


router.get("/task",isAuth,getTasks)
router.get("/serch/:key",isAuth,serchdata)
router.get("/findByid/:taskid",isAuth,getTaskById)
router.get("/latesttask",isAuth,getlatesttask)

router.post("/updatetask/:taskid",storage,updateTask)
router.delete("/deletetask/:taskid",isAuth,deleteTask)


module.exports= router
