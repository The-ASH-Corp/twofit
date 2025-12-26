import express from "express";
import * as chatController from "./chat.controller.js";




const router  = express.Router()


router.get("/get-client-chat/:page/:limit/:chatId",chatController.getChatWithClient)