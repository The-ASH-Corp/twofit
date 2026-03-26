import React, { useEffect, useState } from "react";
import { useDispatch, } from "react-redux";
import { extendProgram } from "@/redux/features/plans/plan.thunk";
import { X, Calendar, AlertCircle } from "lucide-react";
import { toast } from "react-toastify";

const ExtendProgramModal = ({ isOpen, onClose, client, onSuccess }) => {
  const dispatch = useDispatch();
  const [selectedDuration, setSelectedDuration] = useState(null);
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const assignedPlanDuration = (() => {
    const userDuration = Number(client?.duration);
    if (Number.isInteger(userDuration) && userDuration > 0) return userDuration;

    const planDurationText = client?.programType?.plan?.duration;
    if (typeof planDurationText === "string") {
      const parsed = Number.parseInt(planDurationText, 10);
      if (Number.isInteger(parsed) && parsed > 0) return parsed;
    }

    return null;
  })();

  const durations = assignedPlanDuration ? [assignedPlanDuration] : [];

  useEffect(() => {
    if (!isOpen) return;
    setSelectedDuration(assignedPlanDuration ?? null);
  }, [isOpen, assignedPlanDuration]);

  const handleExtendProgram = async () => {
    if (!selectedDuration) {
      toast.error("Assigned plan duration not found");
      return;
    }

    setIsLoading(true);
    try {
      const result = await dispatch(
        extendProgram({
          userId: client._id,
          originalProgramId: client.programType._id,
          extendedProgramId: client.programType._id, // Same program is extended
          extensionDuration: selectedDuration,
          notes: notes || "",
        })
      ).unwrap();

      if (result) {
        toast.success(`Program extended by ${selectedDuration} days successfully!`);
        setSelectedDuration(null);
        setNotes("");
        onClose();
        if (onSuccess) onSuccess();
      }
    } catch (error) {
      toast.error(error || "Failed to extend program");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 space-y-6 animate-in slide-in-from-bottom-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-[#0A4F48]">Extend Program</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={isLoading}
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Alert Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-3">
          <AlertCircle size={20} className="text-blue-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-blue-900">
              After {client?.programType?.title} ends on {client?.programEndDate}, the extended program will automatically activate.
            </p>
          </div>
        </div>

        {/* Client Info */}
        <div className="space-y-3">
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-xs uppercase font-bold text-gray-600 mb-1">Client</p>
            <p className="font-semibold text-gray-900">{client?.name}</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-xs uppercase font-bold text-gray-600 mb-1">Current Program</p>
            <p className="font-semibold text-gray-900">{client?.programType?.title}</p>
          </div>
        </div>

        {/* Duration Selection */}
        <div className="space-y-3">
          <label className="text-sm font-semibold text-gray-700">
            Extension Duration (Assigned Plan)
          </label>
          <div className="grid grid-cols-1 gap-3">
            {durations.map((duration) => (
              <button
                key={duration}
                onClick={() => setSelectedDuration(duration)}
                disabled={isLoading}
                className={`py-3 rounded-lg font-semibold transition-all duration-200 ${
                  selectedDuration === duration
                    ? "bg-[#0A4F48] text-white border-2 border-[#0A4F48]"
                    : "bg-gray-100 text-gray-700 border-2 border-gray-200 hover:border-[#0A4F48]"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {duration} Days
              </button>
            ))}
            {!assignedPlanDuration && (
              <div className="py-3 px-4 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-sm font-medium">
                Assigned plan duration is unavailable for this client.
              </div>
            )}
          </div>
        </div>

        {/* Notes */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">
            Notes (Optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add any notes about this extension..."
            disabled={isLoading}
            className="w-full p-3 border border-gray-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#0A4F48] disabled:bg-gray-50 disabled:cursor-not-allowed"
            rows={3}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleExtendProgram}
            disabled={isLoading || !selectedDuration}
            className="flex-1 px-4 py-2 bg-[#0A4F48] text-white rounded-lg font-semibold hover:bg-[#084240] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Extending...
              </>
            ) : (
              <>
                <Calendar size={18} />
                Extend Program
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExtendProgramModal;
