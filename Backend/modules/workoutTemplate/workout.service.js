import workoutModel from "./workout.model.js";

export const createWorkout = async (workout) => {
    return workoutModel.create(workout);
}

export const getAllWorkout = async (page, limit) => {

    const skip = (page - 1) * limit;

    return workoutModel.find().skip(skip).limit(limit);
}