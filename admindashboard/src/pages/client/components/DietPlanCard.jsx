import React from "react";
import { ChevronRight, Apple, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function DietPlanCard({ dietPlanPdf }) {
  const navigate = useNavigate();
  const subtitle = "Personalized Diet Plan";

  const handleViewDietPage = () => {
    navigate("/client/diet");
  };

  const getDietPlanFilename = (url) => {
    try {
      const parsed = new URL(url, window.location.origin);
      const baseName = parsed.pathname.split("/").filter(Boolean).pop() || "diet-plan.pdf";
      return baseName.includes(".") ? baseName : `${baseName}.pdf`;
    } catch {
      return "diet-plan.pdf";
    }
  };

  const handleDownloadDietPlan = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (!dietPlanPdf) return;

    const link = document.createElement("a");
    link.href = dietPlanPdf;
    link.download = getDietPlanFilename(dietPlanPdf);
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section className="">
      <div className="flex items-center justify-between mb-3">
        <h3 className="client-title text-[14px]">
          Diet Plan
        </h3>
        <button
          type="button"
          onClick={handleDownloadDietPlan}
          disabled={!dietPlanPdf}
          className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10.5px] font-semibold transition-all ${
            dietPlanPdf
              ? "border-[rgba(10,79,72,0.22)] text-[#0A4F48] hover:bg-[rgba(10,79,72,0.06)]"
              : "cursor-not-allowed border-[#dce4dd] text-[#adb8b0] opacity-80"
          }`}
        >
          <Download size={12} />
          Download
        </button>
      </div>

      <button
        type="button"
        className="client-card-soft flex w-full items-center justify-between p-3.5 text-left transition-all hover:border-[rgba(10,79,72,0.18)]"
        onClick={handleViewDietPage}
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-[11px] border border-[rgba(10,79,72,0.12)] bg-white text-[#0A4F48] shadow-[0_4px_10px_rgba(39,57,45,0.08)]">
            <Apple size={16} fill="#0A4F48" fillOpacity={0.2} />
          </div>
          <div className="min-w-0">
            <h4 className="client-title text-[13px] leading-tight">Diet Plan</h4>
            <p className="client-subtitle text-[10.5px]">{subtitle}</p>
          </div>
        </div>
        <ChevronRight size={16} className="shrink-0 text-[#a6b3aa]" />
      </button>
    </section>
  );
}

