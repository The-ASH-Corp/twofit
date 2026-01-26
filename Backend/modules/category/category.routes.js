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
router.get('/list/:id',getSingleCategoryController)
router.get("/founder/list/:page/:limit", gatFounderCategoryList);
router.put('/update/:id',updateCategoryController)
router.delete('/delete/:id',deleteSingleCategoryController)
router.delete('/delete',deleteAllCategoriesController)




export default router