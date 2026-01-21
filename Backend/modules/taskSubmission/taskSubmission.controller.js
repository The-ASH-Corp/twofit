import TaskSubmission from "./taskSubmission.model.js";
import User from "../auth/auth.model.js";
import Plan from "../plan/plan.model.js";
import mongoose from "mongoose";
import { getIO } from "../../utils/socket.js";

// Helper to determine if we should advance the user's day
const checkAndAdvanceDay = async (userId, globalDayIndex) => {
    const user = await User.findById(userId).populate({
        path: 'programType',
        populate: { path: 'plan' }
    });

    if (!user?.programType?.plan) return;

    const plan = user.programType.plan;
    let currentDayConfig = null;
    let dayCounter = 0;

    for (const week of plan.weeks) {
        for (const day of week.days) {
            dayCounter++;
            if (dayCounter === Number(globalDayIndex)) {
                currentDayConfig = day;
                break;
            }
        }
        if (currentDayConfig) break;
    }

    if (!currentDayConfig) return;

    const totalExercises = currentDayConfig.exercises.length;

    // Count total VERIFIED exercises for this userId and globalDayIndex from nested structure
    const userSubmission = await TaskSubmission.findOne({ userId });
    if (!userSubmission) return;

    const daySubmission = userSubmission.dailySubmissions.find(d => d.globalDayIndex === Number(globalDayIndex));
    if (!daySubmission) return;

    const verifiedSubmissionsCount = daySubmission.exercises.filter(ex => ex.status === "verified").length;

    if (verifiedSubmissionsCount >= totalExercises) {
        if (user.currentGlobalDay === Number(globalDayIndex)) {
            user.currentGlobalDay += 1;
            await user.save();
        }
    }
};

export const submitTask = async (req, res) => {
    try {
        const { programId, weekIndex, dayIndex, globalDayIndex, exerciseIndex, notes } = req.body;
        const userId = req.user._id || req.user.id;
        const file = req.file ? "/uploads/" + req.file.filename : null;

        const gIndex = Number(globalDayIndex);
        const eIndex = Number(exerciseIndex);
        const wIndex = Number(weekIndex);
        const dIndex = Number(dayIndex);

        let userSubmission = await TaskSubmission.findOne({ userId });

        if (!userSubmission) {
            userSubmission = new TaskSubmission({
                userId,
                programId: mongoose.Types.ObjectId.isValid(programId) ? programId : undefined,
                dailySubmissions: [{
                    globalDayIndex: gIndex,
                    weekIndex: wIndex,
                    dayIndex: dIndex,
                    exercises: [{
                        exerciseIndex: eIndex,
                        status: "pending",
                        file,
                        notes,
                        updatedAt: Date.now()
                    }]
                }]
            });
            await userSubmission.save();
        } else {
            // Find the day
            let day = userSubmission.dailySubmissions.find(d => d.globalDayIndex === gIndex);

            if (!day) {
                userSubmission.dailySubmissions.push({
                    globalDayIndex: gIndex,
                    weekIndex: wIndex,
                    dayIndex: dIndex,
                    exercises: [{
                        exerciseIndex: eIndex,
                        status: "pending",
                        file,
                        notes,
                        updatedAt: Date.now()
                    }]
                });
            } else {
                // Find the exercise
                let exercise = day.exercises.find(e => e.exerciseIndex === eIndex);

                if (exercise) {
                    if (exercise.status === 'verified') {
                        return res.status(400).json({ success: false, message: "Task already verified" });
                    }
                    exercise.status = 'pending';
                    exercise.file = file || exercise.file;
                    exercise.notes = notes || exercise.notes;
                    exercise.adminComment = "";
                    exercise.updatedAt = Date.now();
                } else {
                    day.exercises.push({
                        exerciseIndex: eIndex,
                        status: "pending",
                        file,
                        notes,
                        updatedAt: Date.now()
                    });
                }
            }

            if (mongoose.Types.ObjectId.isValid(programId)) {
                userSubmission.programId = programId;
            }
            await userSubmission.save();
        }

        // Get the specific submission object for socket/response (flattened format)
        const day = userSubmission.dailySubmissions.find(d => d.globalDayIndex === gIndex);
        const submission = day.exercises.find(e => e.exerciseIndex === eIndex);

        // Notify Experts and Admins via Socket
        try {
            const io = getIO();
            const client = await User.findById(userId).select("trainer dietition therapist");

            if (client) {
                const expertsToNotify = [
                    client.trainer?.toString(),
                    client.dietition?.toString(),
                    client.therapist?.toString()
                ].filter(id => id);

                expertsToNotify.forEach(expertId => {
                    io.to(expertId).emit("new_task_submission", { userId, submissionId: userSubmission._id });
                });

                io.to("admin_tasks").emit("new_task_submission", { userId, submissionId: userSubmission._id });
            }
        } catch (socketError) {
            console.error("Socket notification failed:", socketError.message);
        }

        res.status(200).json({ success: true, data: submission });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getPendingSubmissions = async (req, res) => {
    try {
        const expertId = (req.user._id || req.user.id);
        const userRole = req.user.role || "";
        const lowerRole = userRole.toLowerCase();

        let matchQuery = {};

        const allowedRolesToSeeAll = ["admin", "manager", "head", "founder"];

        if (!allowedRolesToSeeAll.includes(lowerRole)) {
            const searchId = new mongoose.Types.ObjectId(expertId);

            const clientIds = await User.find({
                $or: [
                    { trainer: searchId },
                    { dietition: searchId },
                    { therapist: searchId }
                ]
            }).distinct("_id");

            matchQuery.userId = { $in: clientIds };
        }

        const submissions = await TaskSubmission.aggregate([
            { $match: matchQuery },
            { $unwind: "$dailySubmissions" },
            { $unwind: "$dailySubmissions.exercises" },
            { $match: { "dailySubmissions.exercises.status": "pending" } },
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "userDetails"
                }
            },
            { $unwind: "$userDetails" },
            {
                $lookup: {
                    from: "programslists", // Mongoose pluralizes ProgramsList to programslists
                    localField: "programId",
                    foreignField: "_id",
                    as: "programDetails"
                }
            },
            { $unwind: { path: "$programDetails", preserveNullAndEmptyArrays: true } },
            {
                $project: {
                    _id: "$dailySubmissions.exercises._id",
                    parentSubmissionId: "$_id",
                    userId: {
                        _id: "$userDetails._id",
                        name: "$userDetails.name",
                        email: "$userDetails.email",
                        profileImage: "$userDetails.profileImage"
                    },
                    programId: {
                        _id: "$programDetails._id",
                        title: "$programDetails.title"
                    },
                    weekIndex: "$dailySubmissions.weekIndex",
                    dayIndex: "$dailySubmissions.dayIndex",
                    globalDayIndex: "$dailySubmissions.globalDayIndex",
                    exerciseIndex: "$dailySubmissions.exercises.exerciseIndex",
                    status: "$dailySubmissions.exercises.status",
                    file: "$dailySubmissions.exercises.file",
                    notes: "$dailySubmissions.exercises.notes",
                    createdAt: "$dailySubmissions.exercises.createdAt"
                }
            },
            { $sort: { createdAt: -1 } }
        ]);

        res.status(200).json({ success: true, data: submissions });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const verifyTask = async (req, res) => {
    try {
        const { id } = req.params;
        const userSubmission = await TaskSubmission.findOne({ "dailySubmissions.exercises._id": id });

        if (!userSubmission) {
            return res.status(404).json({ success: false, message: "Submission not found" });
        }

        let foundGlobalDayIndex = null;
        let foundExerciseIndex = null;

        userSubmission.dailySubmissions.forEach(day => {
            const ex = day.exercises.find(e => e._id.toString() === id);
            if (ex) {
                ex.status = "verified";
                ex.updatedAt = Date.now();
                foundGlobalDayIndex = day.globalDayIndex;
                foundExerciseIndex = ex.exerciseIndex;
            }
        });

        await userSubmission.save();

        // Check if we need to advance the day
        await checkAndAdvanceDay(userSubmission.userId, foundGlobalDayIndex);

        // Notify Experts and Admins via Socket
        try {
            const io = getIO();
            const client = await User.findById(userSubmission.userId).select("trainer dietition therapist");
            if (client) {
                const expertsToNotify = [
                    client.trainer?.toString(),
                    client.dietition?.toString(),
                    client.therapist?.toString()
                ].filter(id => id);

                expertsToNotify.forEach(expertId => {
                    io.to(expertId).emit("task_updated", { submissionId: userSubmission._id, status: "verified" });
                });
                io.to("admin_tasks").emit("task_updated", { submissionId: userSubmission._id, status: "verified" });

                // Notify the specific client
                io.to(userSubmission.userId.toString()).emit("task_status_updated", {
                    submissionId: userSubmission._id,
                    status: "verified",
                    globalDayIndex: foundGlobalDayIndex,
                    exerciseIndex: foundExerciseIndex
                });
            }
        } catch (socketError) {
            console.error("Socket notification failed:", socketError.message);
        }

        res.status(200).json({ success: true, message: "Task verified" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const rejectTask = async (req, res) => {
    try {
        const { id } = req.params;
        const { comment } = req.body;

        const userSubmission = await TaskSubmission.findOne({ "dailySubmissions.exercises._id": id });
        if (!userSubmission) {
            return res.status(404).json({ success: false, message: "Submission not found" });
        }

        let foundGlobalDayIndex = null;
        let foundExerciseIndex = null;

        userSubmission.dailySubmissions.forEach(day => {
            const ex = day.exercises.find(e => e._id.toString() === id);
            if (ex) {
                ex.status = "rejected";
                ex.adminComment = comment || "Rejected by expert";
                ex.updatedAt = Date.now();
                foundGlobalDayIndex = day.globalDayIndex;
                foundExerciseIndex = ex.exerciseIndex;
            }
        });

        await userSubmission.save();

        // Notify Experts and Admins via Socket
        try {
            const io = getIO();
            const client = await User.findById(userSubmission.userId).select("trainer dietition therapist");
            if (client) {
                const expertsToNotify = [
                    client.trainer?.toString(),
                    client.dietition?.toString(),
                    client.therapist?.toString()
                ].filter(id => id);

                expertsToNotify.forEach(expertId => {
                    io.to(expertId).emit("task_updated", { submissionId: userSubmission._id, status: "rejected" });
                });
                io.to("admin_tasks").emit("task_updated", { submissionId: userSubmission._id, status: "rejected" });

                // Notify the specific client
                io.to(userSubmission.userId.toString()).emit("task_status_updated", {
                    submissionId: userSubmission._id,
                    status: "rejected",
                    globalDayIndex: foundGlobalDayIndex,
                    exerciseIndex: foundExerciseIndex
                });
            }
        } catch (socketError) {
            console.error("Socket notification failed:", socketError.message);
        }

        res.status(200).json({ success: true, message: "Task rejected" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getUserTaskStatus = async (req, res) => {
    try {
        const userId = req.user._id || req.user.id;
        const { globalDayIndex } = req.query;

        const userSubmission = await TaskSubmission.findOne({ userId });
        if (!userSubmission) {
            return res.status(200).json({ success: true, data: [] });
        }

        let flattenedSubmissions = [];
        userSubmission.dailySubmissions.forEach(day => {
            if (!globalDayIndex || day.globalDayIndex === Number(globalDayIndex)) {
                day.exercises.forEach(ex => {
                    const submissionObj = ex.toObject ? ex.toObject() : ex;
                    flattenedSubmissions.push({
                        ...submissionObj,
                        globalDayIndex: day.globalDayIndex,
                        weekIndex: day.weekIndex,
                        dayIndex: day.dayIndex,
                        programId: userSubmission.programId,
                        userId: userSubmission.userId
                    });
                });
            }
        });

        res.status(200).json({ success: true, data: flattenedSubmissions });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}
