import TaskSubmission from "../modules/taskSubmission/taskSubmission.model.js";
import User from "../modules/auth/auth.model.js";

export const getUserComplianceStats = async (userId, programPlan) => {
    try {
        const userSubmission = await TaskSubmission.findOne({ userId });
        
        if (!userSubmission || !programPlan) {
            return {
                overall: 0,
                workout: 0,
                diet: 0,
                therapy: 0,
                weeklyData: []
            };
        }

        // Calculate total expected tasks per type
        const totalDays = programPlan.duration || 0;
        const daysWithPlan = programPlan.weeks?.flatMap((week, weekIndex) =>
            week.days.map((day, dayIndex) => ({
                weekIndex: weekIndex + 1,
                dayIndex: dayIndex + 1,
                globalIndex: weekIndex * 7 + dayIndex + 1,
                exercises: day.exercises || []
            }))
        ) || [];

        // Count expected tasks
        let expectedWorkouts = 0;
        let expectedMeals = 4 * totalDays; // 4 meals per day
        let expectedTherapy = 0;

        daysWithPlan.forEach(day => {
            expectedWorkouts += day.exercises.length;
            // Count therapy tasks if they exist in the plan
            expectedTherapy += day.exercises.filter(ex => ex.type === 'Therapy').length;
        });

        // Count completed (verified) tasks from submissions
        let completedWorkouts = 0;
        let completedMeals = 0;
        let completedTherapy = 0;

        userSubmission.dailySubmissions.forEach(day => {
            day.exercises.forEach(ex => {
                if (ex.status === 'verified') {
                    if (ex.taskType === 'Workout') completedWorkouts++;
                    else if (ex.taskType === 'Meal') completedMeals++;
                    else if (ex.taskType === 'Therapy') completedTherapy++;
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

        // Calculate weekly compliance data (last 7 days)
        const user = await User.findById(userId);
        const currentGlobalDay = user?.currentGlobalDay || 1;
        const last7Days = [];

        for (let i = 6; i >= 0; i--) {
            const dayIndex = currentGlobalDay - i;
            if (dayIndex <= 0) continue;

            const dayData = daysWithPlan.find(d => d.globalIndex === dayIndex);
            const daySubmission = userSubmission.dailySubmissions.find(d => d.globalDayIndex === dayIndex);

            const expectedForDay = (dayData?.exercises.length || 0) + 4; // exercises + 4 meals
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

            const expectedWorkoutForDay = dayData?.exercises.filter(ex => ex.type !== 'Therapy').length || 0;
            const expectedMealForDay = 4;
            const expectedTherapyForDay = dayData?.exercises.filter(ex => ex.type === 'Therapy').length || 0;

            last7Days.push({
                day: `Day ${dayIndex}`,
                workout: expectedWorkoutForDay > 0 ? Math.round((workoutVerified / expectedWorkoutForDay) * 100) : 0,
                diet: expectedMealForDay > 0 ? Math.round((mealVerified / expectedMealForDay) * 100) : 0,
                therapy: expectedTherapyForDay > 0 ? Math.round((therapyVerified / expectedTherapyForDay) * 100) : 0,
            });
        }

        return {
            overall: overallCompliance,
            workout: workoutCompliance,
            diet: dietCompliance,
            therapy: therapyCompliance,
            weeklyData: last7Days,
            stats: {
                completedWorkouts,
                expectedWorkouts,
                completedMeals,
                expectedMeals,
                completedTherapy,
                expectedTherapy
            }
        };
    } catch (error) {
        console.error("Error calculating compliance:", error);
        return {
            overall: 0,
            workout: 0,
            diet: 0,
            therapy: 0,
            weeklyData: []
        };
    }
};
