import express from 'express'
 import { createCategoryController, deleteAllCategoriesController, deleteSingleCategoryController, getAllCategoryController, getSingleCategoryController, updateCategoryController } from './category.controller.js'
 const router=express.Router()

router.post('/create',createCategoryController)
router.get('/get-all-category/:page/:limit',getAllCategoryController)
router.get('/list/:catId',getSingleCategoryController)
router.put('/update/:catId',updateCategoryController)
router.delete('/delete/:catId',deleteSingleCategoryController)
router.delete('/delete',deleteAllCategoriesController)


export default router