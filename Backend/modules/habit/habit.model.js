import mongoose from "mongoose";


const habitSchema = new mongoose.Schema(
    {
        clientId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true, 
        },
        habits: [
      {
        name: {
          type: String,
          required: true,
        },
        logs: [
          {
            date: {
              type: Date,
              default: Date.now,
            },
            status: {
              type: String,
              enum: ["done", "missed"],
            },
          },
        ],
    }],
    reflectionLogs: [
      {
        date: {
          type: Date,
          default: Date.now,
        },
        note: {
          type: String,
          trim: true,
          maxlength: 500,
        },
      },
    ],
    },
    {
        timestamps: true,
    }
);      

const HabitModel = mongoose.model("Habit", habitSchema);
export default HabitModel;
