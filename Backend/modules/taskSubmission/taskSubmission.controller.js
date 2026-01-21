import * as taskSubmissionService from "./taskSubmission.service.js";

export const submitTask = async (req, res) => {
    try {
        const { programId, weekIndex, dayIndex, globalDayIndex, exerciseIndex, notes, taskType } = req.body;
        const userId = req.user._id || req.user.id;
        const file = req.file ? "/uploads/" + req.file.filename : null;

        const submission = await taskSubmissionService.createTaskSubmission({
            userId,
            programId,
            weekIndex,
            dayIndex,
            globalDayIndex,
            exerciseIndex,
            notes,
            file,
            taskType
        });

        res.status(200).json({ success: true, data: submission });
    } catch (error) {
        if (error.message === "Task already verified") {
            return res.status(400).json({ success: false, message: error.message });
        }
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getPendingSubmissions = async (req, res) => {
    try {
        const expertId = (req.user._id || req.user.id);
        const userRole = req.user.role || "";

        const submissions = await taskSubmissionService.getPendingTaskSubmissions(expertId, userRole);

        res.status(200).json({ success: true, data: submissions });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const verifyTask = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await taskSubmissionService.verifyTaskSubmission(id);
        res.status(200).json(result);
    } catch (error) {
        if (error.message === "Submission not found") {
            return res.status(404).json({ success: false, message: error.message });
        }
        res.status(500).json({ success: false, message: error.message });
    }
};

export const rejectTask = async (req, res) => {
    try {
        const { id } = req.params;
        const { comment } = req.body;

        const result = await taskSubmissionService.rejectTaskSubmission(id, comment);
        res.status(200).json(result);
    } catch (error) {
        if (error.message === "Submission not found") {
            return res.status(404).json({ success: false, message: error.message });
        }
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getUserTaskStatus = async (req, res) => {
    try {
        const userId = req.user._id || req.user.id;
        const { globalDayIndex } = req.query;

        const data = await taskSubmissionService.getUserTaskStatusByUserId(userId, globalDayIndex);

        res.status(200).json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}
