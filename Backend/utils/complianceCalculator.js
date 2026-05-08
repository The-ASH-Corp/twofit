import TaskSubmission from "../modules/taskSubmission/taskSubmission.model.js";
import User from "../modules/auth/auth.model.js";
import ProgramExtension from "../modules/plan/programExtension.model.js";

// Helper function to calculate total duration including extensions
const getTotalProgramDurationWithExtensions = async (userId, originalProgramId) => {
    try {
        const user = await User.findById(userId).select('duration');
        if (!user) return user?.duration || 0;

        // Check for any extensions for this program
        const extension = await ProgramExtension.findOne({
            userId,
            originalProgramId,
        });

        if (extension && extension.isActivated) {
            // Return combined duration: original + extended
            return parseInt(user.duration) + extension.extensionDuration;
        }

        return parseInt(user.duration) || 0;
    } catch (error) {
        console.error('Error getting total duration with extensions:', error.message);
        return 0;
    }
};

export { getTotalProgramDurationWithExtensions };

export const getUserComplianceStats = async (
    userId,
    programPlan,
    therapyPlan = null,
    programTitle = "",
    durationInMonths = null,
    graphDays = 7,
) => {
    try {
        const userSubmission = await TaskSubmission.findOne({ userId });

        if (!userSubmission || (!programPlan && !therapyPlan)) {
            return {
                overall: 0,
                workout: 0,
                diet: 0,
                therapy: 0,
                weeklyData: [],
                monthwiseData: [],
                graphDays: Math.max(7, Math.min(Number(graphDays) || 7, 30)),
            };
        }
        // Calculate total expected tasks per type
        const totalDays = programPlan ? (programPlan.duration.split(" ")[0] || 0) : (therapyPlan?.duration?.split(" ")[0] || 0);
        const daysWithPlan = programPlan?.weeks?.flatMap((week, weekIndex) =>
            week.days.map((day, dayIndex) => ({
                weekIndex: weekIndex + 1,
                dayIndex: dayIndex + 1,
                globalIndex: weekIndex * 7 + dayIndex + 1,
                exercises: day.exercises || []
            }))
        ) || [];

        const daysWithTherapy = therapyPlan?.weeks?.flatMap((week, weekIndex) =>
            week.days.map((day, dayIndex) => ({
                weekIndex: weekIndex + 1,
                dayIndex: dayIndex + 1,
                globalIndex: weekIndex * 7 + dayIndex + 1,
                therapies: day.therapies || []
            }))
        ) || [];

        // Count expected tasks
        const isWeightLoss = programTitle?.toLowerCase().includes("weight loss");
        const mealCountPerDay = isWeightLoss ? 4 : 5;

        // Calculate Total Program Days for overall completion stats
        const totalProgramDays = parseInt(programPlan ? (programPlan.duration.split(" ")[0] || 0) : (therapyPlan?.duration?.split(" ")[0] || 0));

        let expectedWorkouts = 0;
        let expectedMeals = mealCountPerDay * totalProgramDays;
        let expectedTherapy = 0;

        daysWithPlan.forEach(day => {
            expectedWorkouts += day.exercises.filter(ex => !ex.type || ex.type === 'Workout').length;
            expectedTherapy += day.exercises.filter(ex => ex.type === 'Therapy').length;
        });

        daysWithTherapy.forEach(day => {
            expectedTherapy += day.therapies.length;
        });

        // Count completed (verified) tasks from submissions
        let completedWorkouts = 0;
        let completedMeals = 0;
        let completedTherapy = 0;
        let skippedCount = 0;
        let missedCount = 0;

        userSubmission.dailySubmissions.forEach(day => {
            day.exercises.forEach(ex => {
                if (ex.status === 'verified') {
                    if (ex.taskType === 'Workout') completedWorkouts++;
                    else if (ex.taskType === 'Meal') completedMeals++;
                    else if (ex.taskType === 'Therapy') completedTherapy++;
                } else if (ex.status === 'skipped') {
                    skippedCount++;
                } else if (ex.status === 'missed') {
                    missedCount++;
                }
            });
        });

        // Calculate percentages
        const workoutCompliance = expectedWorkouts > 0
            ? Math.round((completedWorkouts / expectedWorkouts) * 100)
            : 0;

        const dietCompliance = expectedMeals > 0
            ? Math.round((completedMeals / expectedMeals) * 100)
            : 0;

        const therapyCompliance = expectedTherapy > 0
            ? Math.round((completedTherapy / expectedTherapy) * 100)
            : 0;

        // Calculate overall compliance
        const totalExpected = expectedWorkouts + expectedMeals + expectedTherapy;
        const totalCompleted = completedWorkouts + completedMeals + completedTherapy;
        const overallCompliance = totalExpected > 0
            ? Math.round((totalCompleted / totalExpected) * 100)
            : 0;

        // Calculate trend compliance data for last N days (default 7)
        const user = await User.findById(userId);
        const currentGlobalDay = user?.currentGlobalDay || 1;
        const safeGraphDays = Math.max(7, Math.min(Number(graphDays) || 7, 30));
        const trendDays = [];

        const startDateCandidate = user?.programStartDate || user?.createdAt;
        const parsedStartDate = startDateCandidate ? new Date(startDateCandidate) : null;
        const hasValidStartDate = parsedStartDate && !Number.isNaN(parsedStartDate.getTime());

        for (let i = safeGraphDays - 1; i >= 0; i--) {
            const dayIndex = currentGlobalDay - i;
            if (dayIndex <= 0) continue;

            const dayData = daysWithPlan.find(d => d.globalIndex === dayIndex);
            const therapyDayData = daysWithTherapy.find(d => d.globalIndex === dayIndex);
            const daySubmission = userSubmission.dailySubmissions.find(d => d.globalDayIndex === dayIndex);

            const expectedForDay = (dayData?.exercises.length || 0) + mealCountPerDay; // exercises + mealCount meals
            let completedForDay = 0;

            if (daySubmission) {
                completedForDay = daySubmission.exercises.filter(ex => ex.status === 'verified').length;
            }

            // Calculate compliance as decimal for stacked bar chart
            const workoutVerified = daySubmission?.exercises.filter(
                ex => ex.taskType === 'Workout' && ex.status === 'verified'
            ).length || 0;
            const mealVerified = daySubmission?.exercises.filter(
                ex => ex.taskType === 'Meal' && ex.status === 'verified'
            ).length || 0;
            const therapyVerified = daySubmission?.exercises.filter(
                ex => ex.taskType === 'Therapy' && ex.status === 'verified'
            ).length || 0;

            const expectedWorkoutForDay = dayData?.exercises.filter(ex => !ex.type || ex.type === 'Workout').length || 0;
            const expectedMealForDay = mealCountPerDay;
            const expectedTherapyFromPlan = dayData?.exercises.filter(ex => ex.type === 'Therapy').length || 0;
            const expectedTherapyFromTherapyPlan = therapyDayData?.therapies.length || 0;
            const expectedTherapyForDay = expectedTherapyFromPlan + expectedTherapyFromTherapyPlan;

            const dayDate = hasValidStartDate
                ? new Date(parsedStartDate.getTime() + ((dayIndex - 1) * 24 * 60 * 60 * 1000))
                : null;

            trendDays.push({
                day: `Day ${dayIndex}`,
                dayDate: dayDate ? dayDate.toISOString() : null,
                workout: expectedWorkoutForDay > 0 ? Math.round((workoutVerified / expectedWorkoutForDay) * 100) : 0,
                diet: expectedMealForDay > 0 ? Math.round((mealVerified / expectedMealForDay) * 100) : 0,
                therapy: expectedTherapyForDay > 0 ? Math.round((therapyVerified / expectedTherapyForDay) * 100) : 0,
            });
        }



        const monthwiseData = [];
        const monthsToCalc = durationInMonths || 12;

        for (let m = 0; m < monthsToCalc; m++) {
            const mEnd = currentGlobalDay - (m * 30);
            const mStart = Math.max(1, currentGlobalDay - ((m + 1) * 30) + 1);

            if (mEnd < 1) break;

            let mExpWorkouts = 0, mExpMeals = 0, mExpTherapy = 0;
            let mCompWorkouts = 0, mCompMeals = 0, mCompTherapy = 0;

            const checkM = (idx) => idx >= mStart && idx <= mEnd;

            daysWithPlan.forEach(day => {
                if (checkM(day.globalIndex)) {
                    mExpWorkouts += day.exercises.filter(ex => !ex.type || ex.type === 'Workout').length;
                    mExpTherapy += day.exercises.filter(ex => ex.type === 'Therapy').length;
                }
            });
            daysWithTherapy.forEach(day => {
                if (checkM(day.globalIndex)) {
                    mExpTherapy += day.therapies.length;
                }
            });

            const mDaysCount = Math.max(0, mEnd - mStart + 1);
            mExpMeals = mDaysCount * mealCountPerDay;

            userSubmission.dailySubmissions.forEach(day => {
                if (checkM(day.globalDayIndex)) {
                    day.exercises.forEach(ex => {
                        if (ex.status === 'verified') {
                            if (ex.taskType === 'Workout') mCompWorkouts++;
                            else if (ex.taskType === 'Meal') mCompMeals++;
                            else if (ex.taskType === 'Therapy') mCompTherapy++;
                        }
                    });
                }
            });

            const mTotalExp = mExpWorkouts + mExpMeals + mExpTherapy;
            const mTotalComp = mCompWorkouts + mCompMeals + mCompTherapy;
            const monthComp = mTotalExp > 0 ? Math.round((mTotalComp / mTotalExp) * 100) : 0;

            const userStartMs = user.createdAt ? new Date(user.createdAt).getTime() : Date.now();
            const dateOfBlock = new Date(userStartMs + ((mStart - 1) * 24 * 60 * 60 * 1000));
            const monthName = dateOfBlock.toLocaleString('default', { month: 'short' });

            monthwiseData.unshift({
                month: monthName,
                compliance: monthComp
            });
        }

        // Apply monthwiseData to response object before returning
        return {
            overall: overallCompliance,
            workout: workoutCompliance,
            diet: dietCompliance,
            therapy: therapyCompliance,
            weeklyData: trendDays,
            graphDays: safeGraphDays,
            monthwiseData,
            stats: {
                completedWorkouts,
                expectedWorkouts,
                completedMeals,
                expectedMeals,
                completedTherapy,
                expectedTherapy,
                skippedCount,
                missedCount
            }
        };

    } catch (error) {
        console.error("Error calculating compliance:", error);
        return {
            overall: 0,
            workout: 0,
            diet: 0,
            therapy: 0,
            weeklyData: [],
            graphDays: Math.max(7, Math.min(Number(graphDays) || 7, 30)),
        };
    }
};

export const calculateUserStreaks = async (userId) => {
    try {
        const userSubmission = await TaskSubmission.findOne({ userId });
        if (!userSubmission) return { activeStreak: 0, longestStreak: 0 };

        // Get all dates with at least one verified task
        const activeDates = new Set();

        userSubmission.dailySubmissions.forEach(day => {
            day.exercises.forEach(ex => {
                if (ex.status === 'verified' && ex.updatedAt) {
                    const dateStr = new Date(ex.updatedAt).toISOString().split('T')[0];
                    activeDates.add(dateStr);
                }
            });
        });

        if (activeDates.size === 0) return { activeStreak: 0, longestStreak: 0 };

        const sortedDates = Array.from(activeDates).sort();

        let currentStreak = 0;
        let longestStreak = 0;
        let prevDate = null;
        let streakEnd = null;

        // Logic: Iterate sorted dates. If diff is 1 day, increment streak. Else reset.
        for (const dateStr of sortedDates) {
            const currentDate = new Date(dateStr);
            currentDate.setHours(0, 0, 0, 0); // Normalize

            if (prevDate) {
                const diffTime = Math.abs(currentDate - prevDate);
                const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

                if (diffDays === 1) {
                    currentStreak++;
                } else {
                    currentStreak = 1;
                }
            } else {
                currentStreak = 1;
            }

            if (currentStreak > longestStreak) {
                longestStreak = currentStreak;
            }

            streakEnd = dateStr;
            prevDate = currentDate;
        }

        // Calculate Active Streak

        const today = new Date();
        const todayStr = today.toISOString().split('T')[0];

        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        let activeStreak = 0;

        // Check if the very last active date was today or yesterday

        if (streakEnd === todayStr || streakEnd === yesterdayStr) {
            activeStreak = currentStreak;
        } else {
            activeStreak = 0;
        }

        return { activeStreak, longestStreak };

    } catch (error) {
        console.error("Error calculating streaks:", error);
        return { activeStreak: 0, longestStreak: 0 };
    }
};
