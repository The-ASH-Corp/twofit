import {
  createHabitsService,
  getClientHabitsService,
  updateHabitStatusService,
  updateHabit,
  getHabitByIdService,
  getDailyClientHabitSummary,
  getWeeklyClientHabitSummaryService,
  getTodayReflectionService,
  upsertTodayReflectionService
} from "./habit.service.js";

export const createHabitsController = async (req, res) => {
  try {
    const { clientId } = req.params;
    const { habits } = req.body;

    if (!habits || !Array.isArray(habits) || habits.length === 0) {
      return res.status(400).json({
        message: "Habits array is required",
      });
    }

    const habitDoc = await createHabitsService(clientId, habits);

    return res.status(201).json({
      message: "Habits created successfully",
      data: habitDoc,
    });
  } catch (error) {
    if (error.message.includes("already exist")) {
      return res.status(409).json({
        message: error.message,
      });
    }

    return res.status(500).json({
      message: "Failed to create habits",
      error: error.message,
    });
  }
};

export const getClientHabitsController = async (req, res) => {
  try {
    const { clientId } = req.params;

    const habitDoc = await getClientHabitsService(clientId);

    if (!habitDoc) {
      return res.status(404).json({
        message: "No habits found for this client",
      });
    }

    return res.status(200).json({
      data: habitDoc,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch habits",
      error: error.message,
    });
  }
};


export const getHabitByIdController=async(req,res)=>{
  try{
    const {habitId}=req.params;
    const habit=await getHabitByIdService(habitId);
    if(!habit){
      return res.status(404).json({
        message:"No habits found"
      })
    }
    return res.status(200).json({
      data:habit
    })
  }
  catch(error){
    return res.status(500).json({
      message:"Failed to fetch Habits",
      error:error.message
    })
  }
}

export const getTodayReflectionController = async (req, res) => {
  try {
    const { clientId } = req.params;
    const reflection = await getTodayReflectionService(clientId);

    return res.status(200).json({
      data: reflection,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch reflection note",
      error: error.message,
    });
  }
};

export const upsertTodayReflectionController = async (req, res) => {
  try {
    const { clientId } = req.params;
    const { note } = req.body;

    if (typeof note !== "string") {
      return res.status(400).json({
        message: "note is required and must be a string",
      });
    }

    if (note.length > 500) {
      return res.status(400).json({
        message: "Reflection note must be 500 characters or fewer",
      });
    }

    const reflection = await upsertTodayReflectionService(clientId, note);

    return res.status(200).json({
      message: "Reflection note saved successfully",
      data: reflection,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to save reflection note",
      error: error.message,
    });
  }
};
export const updateHabitById = async (req, res) => {
  try {
    const { habitId } = req.params;
    const updateData = req.body;

    const updatedHabit = await updateHabit(habitId, updateData);

    if (!updatedHabit) {
      return res.status(404).json({
        success: false,
        message: "Habit plan not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Habit plan updated successfully",
      data: updatedHabit,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

 



 
export const updateHabitStatusController = async (req, res) => {
  try {
    const { clientId } = req.params;
    const { habitId, status } = req.body;

    if (!habitId || !status) {
      return res.status(400).json({
        message: "habitId and status are required",
      });
    }

    const updatedHabit = await updateHabitStatusService(
      clientId,
      habitId,
      status
    );

    return res.status(200).json({
      message: "Habit status updated successfully",
      data: updatedHabit,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: error.message || "Server Error",
    });
  }
};


 
export const getDailyClientHabitSummaryController = async (req, res) => {
  try {
    const data = await getDailyClientHabitSummary();

    return res.status(200).json(data);

  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};


export const getWeeklyClientHabitSummaryController = async (req, res) => {
  try {
    const data = await getWeeklyClientHabitSummaryService();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
