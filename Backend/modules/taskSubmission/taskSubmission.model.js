import mongoose from "mongoose";

const taskSubmissionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // One document per user
    },
    programId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProgramsList",
    },
    dailySubmissions: [
      {
        globalDayIndex: {
          type: Number,
          required: true,
        },
        weekIndex: {
          type: Number,
          required: true,
        },
        dayIndex: {
          type: Number,
          required: true,
        },
        waterIntakeMl: {
          type: Number,
          default: 0,
          min: 0,
        },
        waterIntakeUpdatedAt: {
          type: Date,
        },
        exercises: [
          {
            exerciseIndex: {
              type: Number,
              required: true,
            },
            taskType: {
              type: String,
              enum: ["Workout", "Meal", "Therapy"],
              default: "Workout",
            },
            status: {
              type: String,
              enum: ["pending", "verified", "rejected", "skipped", "missed"],
              default: "pending",
            },
            file: {
              type: String,
            },
            notes: {
              type: String,
            },
            effortRating: {
              ratingNumber: {
                type: Number,
                min: 1,
                max: 10,
              },
              ratingLabel: {
                type: String,
              },
              ratingDescription: {
                type: String,
              },
            },
            adminComment: {
              type: String,
            },
            wasRejectedOnce: {
              type: Boolean,
              default: false,
            },
            createdAt: {
              type: Date,
              default: Date.now,
            },
            updatedAt: {
              type: Date,
              default: Date.now,
            },
          },
        ],
      },
    ],
  },
  {
    timestamps: true,
  },
);

const TaskSubmission = mongoose.model("TaskSubmission", taskSubmissionSchema);
export default TaskSubmission;
