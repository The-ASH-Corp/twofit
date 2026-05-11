import React, { useEffect, useRef } from "react";
import {
  ChevronDown,
  Upload,
  FileText,
  X,
  Smile,
  Bold,
  Italic,
  Strikethrough,
  Code,
  Plus,
  Info,
} from "lucide-react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { selectBroadcast } from "@/redux/features/broadcast/broadcast.selector";
import {
  getBroadcast,
  updateBroadcast,
} from "@/redux/features/broadcast/broadcast.thunk";
import { toast } from "react-toastify";

const BroadcastEdit = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const broadcast = useSelector(selectBroadcast);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (id) {
      dispatch(getBroadcast(id));
    }
  }, [id, dispatch]);

  // Convert Mongoose Map object to plain object for Formik
  const getVariableSamples = () => {
    const raw = broadcast?.variableSamples;
    if (!raw) return {};
    // Mongoose returns Map as plain object after JSON serialization
    if (typeof raw === "object" && !(raw instanceof Map)) return raw;
    const obj = {};
    raw.forEach?.((v, k) => { obj[k] = v; });
    return obj;
  };

  const initialValues = {
    title: broadcast?.title || "",
    type: broadcast?.type || "Promotional",
    message: broadcast?.message || "",
    attachment: null,
    attachmentName: broadcast?.attachment
      ? broadcast.attachment.split("/").pop()
      : "",
    variableSamples: getVariableSamples(),
  };

  const validationSchema = Yup.object({
    title: Yup.string().required("Broadcast title is required"),
    type: Yup.string().required("Broadcast type is required"),
    message: Yup.string().max(1024, "Message is too long").required("Message body is required"),
  });

  const handleSubmit = async (values) => {
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("type", values.type);
    formData.append("message", values.message);
    formData.append("variableSamples", JSON.stringify(values.variableSamples));

    if (values.attachment instanceof File) {
      formData.append("attachment", values.attachment);
    }
    try {
      const result = await dispatch(
        updateBroadcast({ id, updatedData: formData }),
      ).unwrap();
      toast.success("Broadcast updated successfully");
      navigate(`/founder/broadcasts/summary/${result?.data?._id}`);
    } catch (error) {
      toast.error(error || "Failed to update Broadcast");
    }
  };

  const handleFormat = (marker, setFieldValue, currentMessage) => {
    if (!textareaRef.current) return;
    const { selectionStart, selectionEnd } = textareaRef.current;
    const selectedText = currentMessage.substring(selectionStart, selectionEnd);
    let newMessage;
    if (selectedText.startsWith(marker) && selectedText.endsWith(marker)) {
      newMessage = currentMessage.substring(0, selectionStart) +
        selectedText.substring(marker.length, selectedText.length - marker.length) +
        currentMessage.substring(selectionEnd);
    } else {
      newMessage = currentMessage.substring(0, selectionStart) +
        marker + selectedText + marker +
        currentMessage.substring(selectionEnd);
    }
    setFieldValue("message", newMessage);
    setTimeout(() => {
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(selectionStart + marker.length, selectionEnd + marker.length);
    }, 0);
  };

  const handleAddVariable = (message, setFieldValue) => {
    const variables = message.match(/{{[0-9]+}}/g) || [];
    const nextNum = variables.length + 1;
    const marker = `{{${nextNum}}}`;
    if (textareaRef.current) {
      const { selectionStart, selectionEnd } = textareaRef.current;
      const newMessage = message.substring(0, selectionStart) + marker + message.substring(selectionEnd);
      setFieldValue("message", newMessage);
      setTimeout(() => {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(selectionStart + marker.length, selectionStart + marker.length);
      }, 0);
    } else {
      setFieldValue("message", message + marker);
    }
  };

  const VariableSamplesSection = ({ message, variableSamples, setFieldValue }) => {
    const variables = [...new Set(message.match(/{{[0-9]+}}/g) || [])].sort((a, b) => {
      return parseInt(a.replace(/[{}]/g, "")) - parseInt(b.replace(/[{}]/g, ""));
    });
    if (variables.length === 0) return null;
    return (
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h3 className="text-sm font-bold text-slate-800">Variable samples</h3>
          <p className="text-xs text-slate-500 font-medium">
            Include samples for all variables to help review your template.
          </p>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Body</span>
        </div>
        <div className="grid grid-cols-1 gap-3">
          {variables.map((v) => {
            const varNum = v.replace(/[{}]/g, "");
            return (
              <div key={v} className="flex items-center gap-3">
                <div className="w-16 px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-xs font-bold text-slate-500 text-center">
                  {v}
                </div>
                <input
                  type="text"
                  placeholder="Sample value"
                  value={variableSamples[varNum] || ""}
                  onChange={(e) =>
                    setFieldValue(`variableSamples.${varNum}`, e.target.value)
                  }
                  className="flex-1 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg focus:ring-1 focus:ring-[#0A4F48] focus:border-[#0A4F48] outline-none transition-all"
                />
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-130px)] bg-slate-50 overflow-hidden rounded-3xl">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize={true}
      >
        {({ setFieldValue, values }) => (
          <Form className="flex flex-col h-full">
            {/* Top Toolbar */}
            <div className="flex items-center justify-between px-8 py-5 bg-white border-b border-slate-200 shrink-0">
              <div className="flex flex-col">
                <h1 className="text-xl font-bold text-slate-800">
                  Edit Broadcast
                </h1>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Modify your broadcast content and settings ( <span className="text-xs text-red-500 font-bold mt-0.5"> * do the Same edit in the Meta Business Manager also.</span>)
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => navigate("/founder/broadcasts")}
                  className="px-5 py-2 rounded-lg text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  Discard Changes
                </button>
                <div className="h-6 w-px bg-slate-200 mx-1"></div>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-lg text-xs font-bold bg-[#0A4F48] text-white hover:bg-[#083b36] shadow-sm flex items-center gap-2"
                >
                  <span>Update Broadcast</span>
                </button>
              </div>
            </div>

            {/* Main Content Area - Split Layout */}
            <div className="flex-1 overflow-y-auto p-8 no-scrollbar">
              <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Core Content */}
                <div className="lg:col-span-2 flex flex-col gap-6">
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-1">
                      <Field
                        name="title"
                        type="text"
                        placeholder="Broadcast Title"
                        className="w-full px-6 py-4 text-lg font-bold text-slate-800 placeholder:text-slate-300 border-none rounded-t-xl focus:ring-0 focus:outline-none bg-transparent"
                      />
                    </div>
                    <div className="h-px bg-slate-100 mx-6"></div>

                    <div className="flex flex-col">
                      <div className="px-6 pt-4 flex items-center justify-between">
                        <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Body</span>
                        <span className={`text-[10px] font-bold ${values.message.length > 1024 ? 'text-red-500' : 'text-slate-400'}`}>
                          {values.message.length}/1024
                        </span>
                      </div>

                      <Field name="message">
                        {({ field }) => (
                          <textarea
                            {...field}
                            ref={textareaRef}
                            rows={10}
                            placeholder="Type your message content here..."
                            className="w-full px-6 py-4 text-sm font-medium text-slate-600 placeholder:text-slate-300 border-none focus:ring-0 focus:outline-none resize-none bg-transparent leading-relaxed"
                          />
                        )}
                      </Field>

                      {/* Toolbar */}
                      <div className="px-5 py-2.5 border-t border-slate-50 flex items-center gap-1">
                        <button type="button" className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-all">
                          <Smile className="w-4 h-4" />
                        </button>
                        <div className="w-px h-4 bg-slate-100 mx-1"></div>
                        <button type="button" onClick={() => handleFormat("*", setFieldValue, values.message)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-all">
                          <Bold className="w-4 h-4" />
                        </button>
                        <button type="button" onClick={() => handleFormat("_", setFieldValue, values.message)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-all">
                          <Italic className="w-4 h-4" />
                        </button>
                        <button type="button" onClick={() => handleFormat("~", setFieldValue, values.message)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-all">
                          <Strikethrough className="w-4 h-4" />
                        </button>
                        <button type="button" onClick={() => handleFormat("```", setFieldValue, values.message)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-all">
                          <Code className="w-4 h-4" />
                        </button>
                        <div className="w-px h-4 bg-slate-100 mx-1"></div>
                        <button
                          type="button"
                          onClick={() => handleAddVariable(values.message, setFieldValue)}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add variable</span>
                        </button>
                        <div className="ml-auto">
                          <button type="button" className="p-2 text-slate-300 hover:text-slate-400 rounded-lg transition-all">
                            <Info className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <VariableSamplesSection
                    message={values.message}
                    variableSamples={values.variableSamples}
                    setFieldValue={setFieldValue}
                  />

                  <div className="flex flex-col gap-1">
                    <ErrorMessage
                      name="title"
                      component="p"
                      className="text-xs font-bold text-red-500 px-2"
                    />
                    <ErrorMessage
                      name="message"
                      component="p"
                      className="text-xs font-bold text-red-500 px-2"
                    />
                  </div>
                </div>

                {/* Right Column - Meta & Media */}
                <div className="flex flex-col gap-6">
                  {/* Category Card */}
                  <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex flex-col gap-4">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">
                      Classification
                    </h3>
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-bold text-slate-700">
                        Type
                      </label>
                      <div className="relative">
                        <Field
                          as="select"
                          name="type"
                          className="w-full appearance-none pl-4 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 focus:outline-none focus:border-[#0A4F48] focus:ring-1 focus:ring-[#0A4F48] transition-all cursor-pointer"
                        >
                          <option value="Promotional">Promotional</option>
                          <option value="Welcome">Welcome</option>
                          <option value="Motivation">Motivation</option>
                          <option value="Progress">Progress</option>
                          <option value="Tips">Tips</option>
                        </Field>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  {/* Attachment Card */}
                  <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex flex-col gap-4">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">
                      Media
                    </h3>

                    {!values.attachment && !values.attachmentName ? (
                      <div className="relative">
                        <input
                          type="file"
                          id="file-upload-sidebar"
                          className="hidden"
                          accept=".jpg,.png,.pdf"
                          onChange={(e) =>
                            setFieldValue(
                              "attachment",
                              e.currentTarget.files[0],
                            )
                          }
                        />
                        <label
                          htmlFor="file-upload-sidebar"
                          className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50 hover:bg-slate-100 hover:border-[#0A4F48]/30 transition-all cursor-pointer group"
                        >
                          <Upload className="w-6 h-6 text-slate-300 group-hover:text-[#0A4F48] mb-2 transition-colors" />
                          <span className="text-xs font-bold text-slate-500 group-hover:text-slate-700">
                            Upload New File
                          </span>
                        </label>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                        <div className="p-2 bg-white rounded shadow-sm">
                          <FileText className="w-4 h-4 text-[#0A4F48]" />
                        </div>
                        <div className="flex flex-col flex-1 min-w-0">
                          <p className="text-xs font-bold text-slate-700 truncate">
                            {values.attachment
                              ? values.attachment.name
                              : initialValues.attachmentName}
                          </p>
                          <p className="text-[10px] text-slate-400 uppercase">
                            {values.attachment
                              ? `${(values.attachment.size / 1024).toFixed(0)} KB`
                              : "Existing Attachment"}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setFieldValue("attachment", null);
                            setFieldValue("attachmentName", "");
                          }}
                          className="text-slate-400 hover:text-red-500 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default BroadcastEdit;
