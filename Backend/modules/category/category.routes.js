import express from 'express'
 import {
   createCategoryController,
   deleteAllCategoriesController,
   deleteSingleCategoryController,
   getAllCategoryController,
   getSingleCategoryController,
   updateCategoryController,
   gatFounderCategoryList,
 } from "./category.controller.js";
 const router=express.Router()

router.post('/create',createCategoryController)
router.get('/list/:page/:limit',getAllCategoryController)
router.get('/list/:catId',getSingleCategoryController)
router.get("/founder/list/:page/:limit", gatFounderCategoryList);
router.put('/update/:catId',updateCategoryController)
router.delete('/delete/:catId',deleteSingleCategoryController)
router.delete('/delete',deleteAllCategoriesController)




export default router