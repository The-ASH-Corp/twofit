import KpiCard from "@/components/cards/KpiCard";
import {
  selectSopError,
  selectSopHistory,
  selectSopStats,
  selectSopStatus,
  selectSopTodayTasks,
} from "@/redux/features/sop/sop.selector";
import { todaySop, getSOPStats, getSOPHistory } from "@/redux/features/sop/sop.thunk";
import { ClipboardCheck, ClipboardList, SquarePercent } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { SyncLoader } from "react-spinners";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const ExpertHistory = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const todayTasks = useSelector(selectSopTodayTasks);
  const status = useSelector(selectSopStatus);
  const error = useSelector(selectSopError);
  const stats = useSelector(selectSopStats);
  const history = useSelector(selectSopHistory);

  const today = new Date();
  const currentMonth = today.getMonth() + 1;
  const currentYear = today.getFullYear();
  const [month, setMonth] = useState(currentMonth);
  const [year, setYear] = useState(currentYear);
  const [graphMonth, setGraphMonth] = useState(currentMonth);
  const [graphYear, setGraphYear] = useState(currentYear);

  useEffect(() => {
    dispatch(todaySop({ coachId: id }));
    dispatch(
      getSOPStats({
        coachId: id,
        month: graphMonth,
        year: graphYear,
      }),
    );
  }, [dispatch, id, graphMonth, graphYear]);

  useEffect(() => {
    dispatch(getSOPHistory({ coachId: id, month, year }));
  }, [dispatch, id, month, year]);

  const fillMissingDays = (stats, month, year) => {
    const daysInMonth = new Date(year, month, 0).getDate();

    const map = {};
    stats.forEach((s) => {
      const day = new Date(s._id).getDate();
      map[day] = s;
    });

    const filled = [];

    for (let i = 1; i <= daysInMonth; i++) {
      if (map[i]) {
        filled.push(map[i]);
      } else {
        filled.push({
          _id: new Date(year, month - 1, i),
          completed: 0,
          pending: 0,
        });
      }
    }

    return filled;
  };

  const chartData = fillMissingDays(stats, currentMonth, currentYear);

  if (status === "loading")
    return (
      <div className="flex justify-center items-center h-[calc(100vh-120px)]">
        <SyncLoader color="#0A4F48" />
      </div>
    );
  if (error) return <p className="text-red-500">{error}</p>;

  const completedToday = todayTasks.filter((t) => t.completed).length;
  const totalToday = todayTasks.length;

  const percentage = totalToday
    ? Math.round((completedToday / totalToday) * 100)
    : 0;
    const monthName = new Date(currentYear, currentMonth - 1).toLocaleString(
      "default",
      { month: "long" },
    );

  return (
    <div className="p-2 pt-4 md:p-4 mx-auto space-y-8 bg-white rounded-2xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Tasks overview</h1>
        <p className="text-gray-500">Daily duty performance overview</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3  gap-4">
        <KpiCard
          title="Today's Tasks"
          value={totalToday}
          icon={
            <ClipboardList size={20} className="text-[#ffffff] md:w-6 md:h-6" />
          }
          bg="#0A4F48"
        />
        <KpiCard
          title="Completed"
          value={completedToday}
          icon={
            <ClipboardCheck
              size={20}
              className="text-[#ffffff] md:w-6 md:h-6"
            />
          }
          bg="#0A4F48"
        />
        <KpiCard
          title="Completion Rate"
          value={`${percentage}%`}
          icon={
            <SquarePercent size={20} className="text-[#ffffff] md:w-6 md:h-6" />
          }
          bg="#0A4F48"
        />
      </div>

      <div className="flex flex-col md:flex-row items-start justify-between w-full gap-4">
        {/* Today Tasks */}
        <div className="bg-white p-6 shadow rounded-lg w-full md:w-[50%]">
          <h2 className="text-lg font-semibold mb-4">Today Task Status</h2>

          <div className="space-y-4">
            {todayTasks.map((task) => (
              <div
                key={task.sopId}
                className="flex justify-between border-b pb-3"
              >
                <div>
                  <p className="font-medium">{task.title}</p>
                  <p className="text-sm text-gray-500">{task.timeSlot}</p>
                </div>

                <div>
                  <span
                    className={`px-2 py-1 rounded-xl text-sm ${
                      task.completed
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {task.completed ? "Completed" : "Pending"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Graph */}
        <div className="flex flex-col lg:flex-row items-stretch gap-4 w-full md:w-1/2">
          <div className="bg-white p-4 sm:p-6 shadow rounded-lg w-full">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <h2 className="text-base sm:text-lg font-semibold mb-4">
                Task Completion for {monthName} {currentYear}
              </h2>
              <div className="flex gap-3">
                <select
                  value={graphMonth}
                  onChange={(e) => setGraphMonth(Number(e.target.value))}
                  className="border rounded px-2 py-1"
                >
                  {[
                    "Jan",
                    "Feb",
                    "Mar",
                    "Apr",
                    "May",
                    "Jun",
                    "Jul",
                    "Aug",
                    "Sep",
                    "Oct",
                    "Nov",
                    "Dec",
                  ].map((m, i) => (
                    <option key={i} value={i + 1}>
                      {m}
                    </option>
                  ))}
                </select>

                <input
                  type="number"
                  value={graphYear}
                  onChange={(e) => setGraphYear(Number(e.target.value))}
                  className="border rounded px-2 py-1 w-20"
                />
              </div>
            </div>

            <div className="w-full h-[250px] sm:h-[300px]">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  margin={{ top: 5, right: 5, left: -10, bottom: 0 }}
                  data={chartData}
                >
                  <XAxis
                    dataKey="_id"
                    tickFormatter={(date) => new Date(date).getDate()}
                    tick={{ fontSize: 12 }}
                    interval={3}
                  />

                  <YAxis
                    width={30}
                    tick={{ fontSize: 12 }}
                    allowDecimals={false}
                  />

                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      borderRadius: "8px",
                      border: "1px solid #eee",
                    }}
                    formatter={(value, name) => [
                      value,
                      name === "completed"
                        ? "Completed Tasks"
                        : "Pending Tasks",
                    ]}
                    labelFormatter={(label) =>
                      `Date: ${new Date(label).toLocaleDateString()}`
                    }
                  />

                  <Legend />

                  <Bar
                    dataKey="completed"
                    stackId="a"
                    fill="#0A4F48"
                    barSize={14}
                  />
                  <Bar
                    dataKey="pending"
                    stackId="a"
                    fill="#F4DBC7"
                    barSize={14}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col p-4 rounded-2xl shadow gap-4">
        <div className="flex justify-between md:items-center gap-4 md:flex-row flex-col">
          <div>
            <h1 className="text-3xl font-bold">Task History</h1>
            <p className="text-gray-500">Monthly task completion status</p>
          </div>

          {/* Month Selector */}
          <div className="flex gap-3">
            <select
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
              className="border rounded px-2 py-1"
            >
              {[
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
                "Sep",
                "Oct",
                "Nov",
                "Dec",
              ].map((m, i) => (
                <option key={i} value={i + 1}>
                  {m}
                </option>
              ))}
            </select>

            <input
              type="number"
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="border rounded px-2 py-1 w-20"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white shadow rounded-lg overflow-x-auto">
          <table className="min-w-[600px] w-full text-left">
            <thead className="bg-green-100">
              <tr>
                <th className="p-3 text-sm font-semibold">Date</th>
                <th className="p-3 text-sm font-semibold">Task</th>
                <th className="p-3 text-sm font-semibold">Time Slot</th>
                <th className="p-3 text-sm font-semibold">status</th>
                <th className="p-3 text-sm font-semibold text-center">
                  Completion Status
                </th>
              </tr>
            </thead>

            <tbody>
              {history.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center p-6 text-gray-500">
                    No history found
                  </td>
                </tr>
              ) : (
                history.map((log) => (
                  <tr
                    key={log._id}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="p-3 text-sm whitespace-nowrap">
                      {new Date(log.date).toLocaleDateString()}
                    </td>

                    <td className="p-3 text-sm font-medium">
                      {log.sopId?.title}
                    </td>

                    <td className="p-3 text-sm">{log.sopId?.timeSlot}</td>

                    <td className="p-3 text-sm">
                      <span
                        className={`px-3 text-xs font-medium ${
                          log?.sopId?.status === "Active"
                            ? " text-green-700"
                            : " text-red-600"
                        }`}
                      >
                        {log.sopId?.status}
                      </span>
                    </td>

                    <td className="p-3 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          log.completed
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {log.completed ? "Completed" : "Not Completed"}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ExpertHistory;
