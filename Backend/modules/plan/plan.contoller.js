import * as planService from "./plan.service.js"

export const createNewPlan =async(req,res)=>{
    try {
        const plan = await planService.createPlan(req.body)
        res.status(201).json({success:true,message:"Plan created successfully",data:plan})
    } catch (error) {
        res.status(500).json({success:false,message:error.message})
    }
}