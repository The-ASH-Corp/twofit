import express from "express";
import * as chatController from "./chat.controller.js";




const router  = express.Router()


router.get("/get-chat/:page/:limit/:chatId",chatController.getChatWithClient)


export default router;