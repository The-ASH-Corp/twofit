import ComplianceChart from "@/components/chart/ComplianceChart";
import React from "react";
import ProgressChart from "./components/ProgressChart";
import { assets } from "@/assets/asset";
import KpiCard from "@/components/cards/KpiCard";

export default function Dashboard() {
  return (
    <div className=" w-full grid grid-cols-[70%_30%]  gap-10">
      <div>
        <div className="flex ">
          <img className="w-[60%] rounded-xl" src="src/assets/wl.jpg" />
          <div className="grid grid-cols-2 gap-4 px-4">
            <KpiCard
              title="Total Experts"
              value="150"
              icon={assets.website}
              bg="#FFFFFF"
            />
            <KpiCard
              title="Total Monthly Salary"
              value="12,300,000"
              icon={assets.website}
              bg="#FFFFFF"
            />
            <KpiCard
              title="Total Incentives"
              value="1,200,300"
              icon={assets.chats}
              bg="#FFFFFF"
            />
            <KpiCard
              title="Average Expert Rating"
              value="$250,000"
              icon={assets.filter}
              bg="#FFFFFF"
            />
          </div>
        </div>
        <div className="flex gap-2 my-4 ">
          {" "}
          <div className="w-[50%] bg-white p-4 rounded-xl">
            <h2>Last Week Compliance</h2>
            <ComplianceChart />
          </div>
          <div className="w-[50%] bg-white p-4 rounded-xl">
             <h2>Weight Progress</h2>
            <ProgressChart />
          </div>
        </div>
      </div>
      <div className="bg-white"></div>
    </div>
  );
}
