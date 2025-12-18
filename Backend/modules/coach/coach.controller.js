import * as coachService from "./coach.service.js"
import mongoose from "mongoose";

export const createCoach = async(req, res)=> {
    try {
        const coach = await coachService.createCoach(req.body);
        res
          .status(201)
          .json({
            success: true,
            message: "Coach created successfully",
            data: coach,
          });

    } catch (error) {
        console.log(error)
    }
};

export const getAllCoach = async(req, res)=> {
    try {
     const {page,limit} = req.params
        const coachs = await coachService.getAllCoach(page,limit);
        res
          .status(200)
          .json({
            success: true,
            data: coachs,
          });


    } catch (error) {
        console.log(error)
    }
};

export const getCoachById = async (req, res)=> {
    try {
        const { coachId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(coachId)) {
          return res.status(400).json({
            success: false,
            message: "Invalid coach ID",
          });
        }

        const coach = await coachService.getCoachById(coachId);

        if (!coach) {
          return res.status(404).json({
            success: false,
            message: "coach not found",
          });
        }

        res.status(200).json({
          success: true,
          data: coach,
        });
    } catch (error) {
        console.log(error)
    }
};

export const updateCoachById = async (req, res)=> {
    try {
        const {coachId} = req.params;
        const updatedData = req.body;

        if (!mongoose.Types.ObjectId.isValid(coachId)) {
          return res.status(400).json({
            success: false,
            message: "Invalid coach ID",
          });
        }

        const data = await coachService.updateCoachById(coachId, updatedData);

         if (data.matchedCount === 0) {
           return res.status(404).json({
             success: false,
             message: "Coach not found",
           });
         }

        res.status(200).json({
          success: true,
          message: "Coach details updated successfully",
        });
    } catch (error) {
      console.log(error)
    }
};

export const deleteCoachById = async (req, res)=> {
      try {
        const { coachId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(coachId)) {
          return res.status(400).json({
            success: false,
            message: "Invalid coach ID",
          });
        }

        const data =  await coachService.deleteCoachById(coachId);

        if (!data) {
          return res.status(404).json({
            success: false,
            message: "coach not found",
          });
        }

        res.status(200).json({
          success: true,
          message: "Coach deleted successfully",
        });
      } catch (error) {
        console.log(error)
      }
}

export const AssignCoachToUser = async (req, res)=> {
  try {
    const {coachId, userId} = req.body;

    if (!mongoose.Types.ObjectId.isValid(coachId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid coach ID",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    const data = await coachService.AssignCoachToUser(coachId, userId);

    res.status(200).json({
      success: true,
      message: "Coach assigned to user successfully",
      data: data,
    });
  } catch (error) {
    console.log(error)
  }
} 

export const getUsersAssignedToACoach = async (req, res)=> {
  const {coachId} = req.params;

  if (!mongoose.Types.ObjectId.isValid(coachId)) {
    return res.status(400).json({
      success: false,
      message: "Invalid coach ID",
    });
  }

  const assignedUsers =  await coachService.getUsersAssignedToACoach(coachId);
  res.status(200).json({
    success: true,
    data: assignedUsers
  })

}