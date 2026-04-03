import React from "react";

function CircleStat({ title, value, subtitle, percent, tone = "default" }) {
  const isComplianceTone = tone === "compliance";
  const radius = isComplianceTone ? 39 : 38;
  const circumference = 2 * Math.PI * radius;
  const safePercent = Math.max(0, Math.min(Number(percent) || 0, 100));
  const strokeDashoffset = circumference - (safePercent / 100) * circumference;
  const ringSize = isComplianceTone ? "h-[110px] w-[110px] sm:h-[124px] sm:w-[124px]" : "h-[105px] w-[105px] sm:h-[116px] sm:w-[116px]";
  const trackStroke = isComplianceTone ? "#edf0ed" : "#e4eae3";
  const progressStroke = "#0A4F48";
  const strokeWidth = isComplianceTone ? 7.5 : 7;

  return (
    <div className="client-card flex min-h-[176px] flex-col p-4">
      <h4 className="client-title text-[14px]">{title}</h4>
      <div className="flex flex-1 items-center justify-center">
        <div className={`relative flex ${ringSize} items-center justify-center`}>
          {isComplianceTone && (
            <>
              <div className="absolute inset-[5px] rounded-full shadow-[inset_0_10px_14px_rgba(255,255,255,0.72),inset_0_-7px_10px_rgba(10,79,72,0.08),0_8px_14px_rgba(10,79,72,0.08)]" />
              <div className="absolute inset-[8px] rounded-full border border-[#f5f7f4]" />
            </>
          )}
          <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r={radius} stroke={trackStroke} strokeWidth={strokeWidth} fill="none" />
            {isComplianceTone && (
              <circle
                cx="50"
                cy="50"
                r={radius}
                stroke="#063a35"
                strokeOpacity="0.2"
                strokeWidth={strokeWidth + 2}
                fill="none"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
              />
            )}
            <circle
              cx="50"
              cy="50"
              r={radius}
              stroke={progressStroke}
              strokeWidth={strokeWidth}
              fill="none"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-700 ease-out"
            />
            {isComplianceTone && (
              <circle
                cx="50"
                cy="50"
                r={radius}
                stroke="#2a7f76"
                strokeOpacity="0.35"
                strokeWidth={Math.max(strokeWidth - 3, 3)}
                fill="none"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
              />
            )}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <p className="client-title text-[19px] leading-none">{value}</p>
            <p className="client-subtitle mt-1 text-[12px]">{subtitle}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProgramCalendar({ currentDay }) {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const safeCurrentDay = Math.max(1, Math.min(Number(currentDay) || 1, daysInMonth));

  const calendarCells = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarCells.push({ day: null, status: "empty" });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    if (d < safeCurrentDay) {
      calendarCells.push({ day: d, status: "completed" });
    } else if (d === safeCurrentDay) {
      calendarCells.push({ day: d, status: "current" });
    } else {
      calendarCells.push({ day: d, status: "upcoming" });
    }
  }

  const weekdays = ["S", "M", "T", "W", "T", "F", "S"];

  return (
    <div className="client-card flex min-h-[166px] flex-col p-4">
      <h4 className="client-title text-[14px]">Program Days</h4>
      <div className="mt-2.5 grid grid-cols-7 gap-y-1 text-center">
        {weekdays.map((wd, i) => (
          <span key={i} className="client-subtitle text-[10px] font-semibold">
            {wd}
          </span>
        ))}
        {calendarCells.slice(0, 35).map((cell, i) => (
          <div key={i} className="flex h-5 items-center justify-center">
            <span
              className={`flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-semibold ${
                cell.day === null
                  ? ""
                  : cell.status === "current"
                    ? "client-action-pill text-white"
                    : cell.status === "completed"
                      ? "bg-[#0A4F48] text-white"
                    : "client-title"
              }`}
            >
              {cell.day === null ? "" : cell.status === "completed" ? "✓" : cell.day}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function StatsGrid({ statsData }) {
  const complianceValue = Number(String(statsData?.compliance || "0").replace("%", "")) || 0;
  const numericWeight = Number(statsData?.currentWeight) || 0;
  const weightPercent = numericWeight > 0 ? Math.min(Math.round((numericWeight / 120) * 100), 100) : 0;
  const streakDays = Number(statsData?.activeStreak) || 0;
  const streakPercent = Math.min(streakDays * 5, 100);
  const currentProgramDay = Number(String(statsData?.programDays || "1/30").split("/")[0]) || 1;

  return (
    <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-4">
      <ProgramCalendar currentDay={currentProgramDay} />

      <CircleStat
        title="Overall Compliance"
        value={`${Math.round(complianceValue)}%`}
        subtitle="Progress"
        percent={complianceValue}
        tone="compliance"
      />
      <CircleStat
        title="Weight Progress"
        value={numericWeight > 0 ? `${numericWeight}k` : "--"}
        subtitle="Progress"
        percent={weightPercent}
        tone="compliance"
      />
      <CircleStat
        title="Active Streak"
        value={`${streakDays}`}
        subtitle="Streak"
        percent={streakPercent}
        tone="compliance"
      />
    </div>
  );
}
