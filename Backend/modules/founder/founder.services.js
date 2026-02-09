import { FounderModel } from "../../seeds/createAdmin.js";
import { AdminModel } from "../admin/admin.model.js";
import allProgramModel from "../allPrograms/allPrograma.model.js";
import User from "../auth/auth.model.js";
import { CoachModel } from "../coach/coach.model.js";
import { HeadsModel } from "../Heads/heads.modal.js";
import TaskSubmission from "../taskSubmission/taskSubmission.model.js";


export const getDashboardData = async() => {
    const clients = await User.find({ role: "user" }).select(
      "_id createdAt status",
    );
    const totalClient = clients.length;
    const totalHeads = await HeadsModel.countDocuments();
    const totalAdmins = await AdminModel.countDocuments();
    const totalPrograms = await allProgramModel.countDocuments();
    const totalExperts = await CoachModel.countDocuments();
    const Trainers = await CoachModel.countDocuments({ role: "Trainer" });
    const Dietitians = await CoachModel.countDocuments({ role: "Dietician" });
    const Therapists = await CoachModel.countDocuments({ role: "Therapist" });

    const now = new Date();

    const buildMonthLabels = (startDate) => {
      const labels = [];
      const monthsDiff =
        (now.getFullYear() - startDate.getFullYear()) * 12 +
        (now.getMonth() - startDate.getMonth());
      for (let i = 0; i <= monthsDiff; i++) {
        const d = new Date(startDate.getFullYear(), startDate.getMonth() + i, 1);
        labels.push(d.toLocaleString("default", { month: "short" }));
      }
      return { labels, monthsDiff };
    };

    // --- Client Growth (last 12 months) ---
    const growthStartDate = new Date(
      now.getFullYear(),
      now.getMonth() - 11,
      1,
    );
    const { labels: growthLabels, monthsDiff: growthMonthsDiff } =
      buildMonthLabels(growthStartDate);

    const activeData = [];
    const inactiveData = [];
    const newData = [];

    for (let i = 0; i <= growthMonthsDiff; i++) {
      const d = new Date(
        growthStartDate.getFullYear(),
        growthStartDate.getMonth() + i,
        1,
      );
      const nextMonth = new Date(d.getFullYear(), d.getMonth() + 1, 1);

      const newClientsCount = clients.filter((c) => {
        const cDate = new Date(c.createdAt);
        return cDate >= d && cDate < nextMonth;
      }).length;
      newData.push(newClientsCount);

      const activeCount = clients.filter((c) => {
        const cDate = new Date(c.createdAt);
        return cDate < nextMonth && c.status === "Active";
      }).length;
      activeData.push(activeCount);

      const inactiveCount = clients.filter((c) => {
        const cDate = new Date(c.createdAt);
        return cDate < nextMonth && c.status === "Inactive";
      }).length;
      inactiveData.push(inactiveCount);
    }

    // --- Client Compliance (last 12 months) ---
    const complianceStartDate = new Date(
      now.getFullYear(),
      now.getMonth() - 11,
      1,
    );
    const { labels: complianceLabels, monthsDiff: complianceMonthsDiff } =
      buildMonthLabels(complianceStartDate);

    const clientIds = clients.map((c) => c._id);
    let complianceStats = [];

    if (clientIds.length > 0) {
      complianceStats = await TaskSubmission.aggregate([
        { $match: { userId: { $in: clientIds } } },
        { $unwind: "$dailySubmissions" },
        { $unwind: "$dailySubmissions.exercises" },
        {
          $match: {
            "dailySubmissions.exercises.updatedAt": { $gte: complianceStartDate },
          },
        },
        {
          $project: {
            month: { $month: "$dailySubmissions.exercises.updatedAt" },
            year: { $year: "$dailySubmissions.exercises.updatedAt" },
            type: "$dailySubmissions.exercises.taskType",
            status: "$dailySubmissions.exercises.status",
          },
        },
        {
          $group: {
            _id: { month: "$month", year: "$year", type: "$type" },
            total: { $sum: 1 },
            completed: {
              $sum: { $cond: [{ $eq: ["$status", "verified"] }, 1, 0] },
            },
          },
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
      ]);
    }

    const complianceMap = {};
    complianceStats.forEach((stat) => {
      const key = `${stat._id.type}-${stat._id.month}-${stat._id.year}`;
      complianceMap[key] = stat;
    });

    const therapyData = [];
    const workoutData = [];
    const dietData = [];

    for (let i = 0; i <= complianceMonthsDiff; i++) {
      const d = new Date(
        complianceStartDate.getFullYear(),
        complianceStartDate.getMonth() + i,
        1,
      );
      const m = d.getMonth() + 1;
      const y = d.getFullYear();

      const getPct = (type) => {
        let dbType = type;
        if (type === "Diet") dbType = "Meal";
        const entry = complianceMap[`${dbType}-${m}-${y}`];
        if (!entry || entry.total === 0) return 0;
        return Math.round((entry.completed / entry.total) * 100);
      };

      therapyData.push(getPct("Therapy"));
      workoutData.push(getPct("Workout"));
      dietData.push(getPct("Diet"));
    }

    const graphData = {
      growth: {
        labels: growthLabels,
        datasets: [
          { label: "Active", data: activeData },
          { label: "Inactive", data: inactiveData },
          { label: "New", data: newData },
        ],
      },
      compliance: {
        labels: complianceLabels,
        datasets: [
          { label: "Diet", data: dietData },
          { label: "Workout", data: workoutData },
          { label: "Therapy", data: therapyData },
        ],
      },
    };

    // --- Latest Progress Reports ---
    const latestReports = await TaskSubmission.aggregate([
      {
        $match: {
          userId: { $in: clientIds },
          "dailySubmissions.exercises": { $exists: true, $ne: [] },
        },
      },
      { $unwind: "$dailySubmissions" },
      { $unwind: "$dailySubmissions.exercises" },
      {
        $sort: {
          "dailySubmissions.exercises.updatedAt": -1,
          "dailySubmissions.exercises.status": -1,
        },
      },
      { $limit: 10 },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $lookup: {
          from: "coaches",
          localField: "user.trainer",
          foreignField: "_id",
          as: "trainer",
        },
      },
      {
        $lookup: {
          from: "coaches",
          localField: "user.dietition",
          foreignField: "_id",
          as: "dietitian",
        },
      },
      {
        $lookup: {
          from: "coaches",
          localField: "user.therapist",
          foreignField: "_id",
          as: "therapist",
        },
      },
      {
        $project: {
          clientName: "$user.name",
          taskType: "$dailySubmissions.exercises.taskType",
          status: "$dailySubmissions.exercises.status",
          updatedAt: "$dailySubmissions.exercises.updatedAt",
          trainerName: { $arrayElemAt: ["$trainer.name", 0] },
          dietitianName: { $arrayElemAt: ["$dietitian.name", 0] },
          therapistName: { $arrayElemAt: ["$therapist.name", 0] },
        },
      },
    ]);

    const formattedReports = latestReports.map((report) => {
      let expertName = "N/A";
      let expertType = "N/A";

      if (report.taskType === "Workout") {
        expertName = report.trainerName;
        expertType = "Trainer";
      } else if (report.taskType === "Meal" || report.taskType === "Diet") {
        expertName = report.dietitianName;
        expertType = "Dietitian";
      } else if (report.taskType === "Therapy") {
        expertName = report.therapistName;
        expertType = "Therapist";
      }

      return {
        name: report.clientName,
        type: report.taskType === "Meal" ? "Diet" : report.taskType,
        expert: expertType,
        submittedBy: expertName
          ? `${expertType} ${expertName.split(" ")[0]}`
          : "Client",
        time: report.updatedAt,
      };
    });

    return {
      totalClient,
      totalHeads,
      totalAdmins,
      totalPrograms,
      totalExperts,
      Trainers,
      Dietitians,
      Therapists,
      graphData,
      latestReports: formattedReports,
    };
} 

export const getFounderProfile = async (id) => {
    const profile = await FounderModel.findById(id).select("-password");
    return profile;
}
