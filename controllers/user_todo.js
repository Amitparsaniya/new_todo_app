const user = require("../models/user");
const UserTodo = require("../models/task");
const { deletefile } = require("../utils/deleteImageFile");
const { sendScuccess, sendError } = require("../utils/helper");
const messages = require("../utils/sucessmessage");
const statusCode = require("../utils/statuscode");
const { errormessages } = require("../utils/errormessages");
const item_per_page = 1

exports.createTodo = async (req, res) => {
   try {
      const { task } = req.body
      const image = req.file
      const todo = new UserTodo({
         task: task,
         image: image?.path || "null",
         owner: req.user
      })

      await todo.save()

      // console.log(image, task);
      // res.status(i18n.__("CREATE_TASK_STATUS")).send(i18n.__('CREATE_TASK_USER'))
      sendScuccess(res, messages.CREATE_TASK_USER, statusCode.CREATE)
      // res.status(201).res.__('CREATE_USER')
   } catch (e) {
      console.log(e);
   }
}



exports.getTasks = async (req, res) => {
   try {
      page = req.query.page || 1
      const user = await UserTodo.find({ owner: req.user._id }).skip((page - 1) * item_per_page).limit(item_per_page)
      // console.log(user);
      sendScuccess(res, user, statusCode.SUCCESS)
      // res.status(200).json({user:user})
   } catch (e) {
      console.log(e);
   }
}
exports.getTaskById = async (req, res) => {
   try {
      const TaskId = req.params.taskid
      const task = await UserTodo.findById(TaskId)
      // console.log(/t/, task);
      sendScuccess(res, task, statusCode.SUCCESS)

      // res.status(200).json({task})
   } catch (e) {
      console.log(e);
   }

}
exports.serchdata = async (req, res) => {
   try {
      date = req.params.key
      // console.log(date);
      const userDate = new Date(date)
      // console.log(userDate);
      newdate = new Date(userDate.getFullYear(), userDate.getMonth(), userDate.getDate() + 1)
      
     let data= await UserTodo.find({
         date: {
            $gte: userDate.toISOString()
            , $lte: newdate
         }
      })
      if(data.length===0){
         return sendError(res,errormessages.TASKID_NOT_FOUND_ON_SERCH_DATE,statusCode.NOT_FOUND)
      }
      sendScuccess(res, data, statusCode.SUCCESS)

   } catch (e) {
      console.log(e);
   }
}

exports.getlatesttask = async (req, res) => {
   try {
      const latestTask = await UserTodo.find({ owner: req.user._id }).sort({ createdAt: -1 })
      // console.log(latestTask);
      sendScuccess(res, latestTask, statusCode.SUCCESS)

      // res.status(200).json({latestTask})
   } catch (e) {
      console.log(e);
   }
}
exports.updateTask = async (req, res) => {
   try {
      const updatedId = req.params.taskid
      const usertask = await UserTodo.findById(updatedId)
      if (!usertask) {
         return sendError(res, errormessages.TASKID_NOT_FOUND, statusCode.ERRORCODE)
      }
      const updatedtask = req.body?.task
      const image = req?.file
      console.log(image);
      usertask.task = updatedtask
      if (image) {
         deletefile(usertask?.image)
         usertask.image = image.path
      }
      await usertask.save()
      sendScuccess(res, messages.UPDATE_TASK, statusCode.SUCCESS)

   } catch (e) {
      console.log(e);
   }

}

exports.deleteTask = async (req, res) => {
   try {
      const TaskId = req.params.taskid
      const task = await UserTodo.findById(TaskId)
      if (!task) {
         return sendError(res, errormessages.TASKID_NOT_FOUND, statusCode.ERRORCODE)
      }
      deletefile(task?.image)
      const deletedtask = await UserTodo.findByIdAndRemove(TaskId)
      // console.log(/t/, task)
      sendScuccess(res, messages.TASK_DELETE_SUCCESSFULLY, statusCode.SUCCESS)
   } catch (e) {
      console.log(e);
   }
}
