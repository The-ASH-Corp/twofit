import React, { useState, useRef } from "react";
import { ChevronUp, Upload, Plus, Check, Trash2 } from "lucide-react";
import { InputGroup } from "./InputGroup";

export default function TherapyPlan({
  title,
  therapies = [],
  onAddTherapy,
  onUpdateTherapy,
  onRemoveTherapy,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formState, setFormState] = useState({
    type: "",
    notes: "",
    url: "",
    media: null,
    mediaName: "",
  });

  const fileInputRef = useRef(null);

  // ---------- handlers ----------
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFormState((prev) => ({
      ...prev,
      media: file,
      mediaName: file.name,
    }));
  };

  const handleSubmit = () => {
    if (!formState.type) return;

    const payload = {
      id: editingId || Date.now(),
      type: formState.type,
      notes: formState.notes,
      url: formState.url,
      mediaName: formState.mediaName,
    };

    if (editingId) {
      onUpdateTherapy(payload);
    } else {
      onAddTherapy(payload);
    }

    resetForm();
  };

  const handleEdit = (therapy) => {
    setEditingId(therapy.id);
    setFormState({
      type: therapy.type,
      notes: therapy.notes || "",
      url: therapy.url || "",
      media: null,
      mediaName: therapy.mediaName || "",
    });
    setIsOpen(true);
  };

  const resetForm = () => {
    setEditingId(null);
    setFormState({
      type: "",
      notes: "",
      url: "",
      media: null,
      mediaName: "",
    });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // ---------- UI ----------
  return (
    <div className="flex flex-col gap-3">
      {/* Header */}
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h4 className="text-sm font-bold text-[#011412]">{title}</h4>
        <ChevronUp
          size={16}
          className={`transition-transform ${
            isOpen ? "rotate-0" : "rotate-180"
          }`}
        />
      </div>

      {isOpen && (
        <div className="flex flex-col gap-4">
          {/* Form */}
          <div className="p-4 bg-gray-50 rounded-xl border">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputGroup
                label="Therapy Type"
                placeholder="Enter therapy type"
                value={formState.type}
                onChange={(e) =>
                  setFormState({ ...formState, type: e.target.value })
                }
              />
              <InputGroup
                label="Notes"
                placeholder="Add notes"
                value={formState.notes}
                onChange={(e) =>
                  setFormState({ ...formState, notes: e.target.value })
                }
              />
            </div>

            <InputGroup
              label="Attach URL"
              placeholder="Paste link here"
              value={formState.url}
              onChange={(e) =>
                setFormState({ ...formState, url: e.target.value })
              }
            />

            {/* File upload */}
            <div className="mt-3">
              <label className="text-xs font-bold text-[#011412]">
                Media Attachment
              </label>
              <div className="flex border rounded-xl overflow-hidden bg-white">
                <button
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                  className="flex items-center gap-2 px-4 py-2 bg-[#EBF3F2] text-xs font-bold"
                >
                  <Upload size={14} />
                  Upload
                </button>
                <input
                  type="text"
                  readOnly
                  value={formState.mediaName}
                  className="flex-1 px-3 text-xs outline-none"
                  placeholder="No file selected"
                />
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>
            </div>

            <button
              onClick={handleSubmit}
              className="mt-4 flex items-center gap-2 px-4 py-2 bg-[#0A4F48] text-white text-xs font-bold rounded-lg"
            >
              {editingId ? <Check size={14} /> : <Plus size={14} />}
              {editingId ? "Update Therapy" : "Add Therapy"}
            </button>
          </div>

          {/* List */}
          {therapies.length > 0 && (
            <div className="flex flex-col gap-2">
              {therapies.map((therapy) => (
                <div
                  key={therapy.id}
                  className="flex items-center justify-between p-3 bg-white border rounded-lg"
                >
                  <span className="text-sm font-medium">
                    {therapy.type}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(therapy)}
                      className="text-xs text-blue-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onRemoveTherapy(therapy.id)}
                      className="text-xs text-red-600"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
