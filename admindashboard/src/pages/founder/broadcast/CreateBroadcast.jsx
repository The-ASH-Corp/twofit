import React from "react";
import { ChevronDown, Upload, FileText, X } from "lucide-react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { createBroadcast } from "@/redux/features/broadcast/broadcast.thunk";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const CreateBroadcast = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const initialValues = {
    title: "",
    type: "Promotional",
    message: "",
    attachment: null,
  };

  const validationSchema = Yup.object({
    title: Yup.string().required("Broadcast title is required"),
    type: Yup.string().required("Broadcast type is required"),
    message: Yup.string().required("Message body is required"),
  });

  const handleSubmit = async (values) => {
    const formData = new FormData();

    formData.append("title", values.title);
    formData.append("type", values.type);
    formData.append("message", values.message);

    if (values.attachment) {
      formData.append("attachment", values.attachment);
    }

    try {
      const broadcast = await dispatch(createBroadcast(formData)).unwrap();
      toast.success("Broadcast created successfully");
      navigate(`/founder/broadcasts/summary/${broadcast?.data?._id}`);
    } catch (error) {
      toast.error(error || "Failed to create Broadcast");
    }
  };

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-130px)] bg-slate-50 overflow-hidden rounded-3xl">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ setFieldValue, values }) => (
          <Form className="flex flex-col h-full">
            {/* Top Toolbar */}
            <div className="flex items-center justify-between px-8 py-5 bg-white border-b border-slate-200 shrink-0">
              <div className="flex flex-col">
                <h1 className="text-xl font-bold text-slate-800">New Broadcast</h1>
                <p className="text-xs text-slate-500 font-medium mt-0.5">Draft your message to the community</p>
              </div>
              
              <div className="flex items-center gap-3">
                 <button
                  type="button"
                  onClick={() => navigate("/founder/broadcasts")}
                  className="px-5 py-2 rounded-lg text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  Discard
                </button>
                <div className="h-6 w-px bg-slate-200 mx-1"></div>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-lg text-xs font-bold bg-[#0A4F48] text-white hover:bg-[#083b36] shadow-sm flex items-center gap-2"
                >
                  <span>Publish Broadcast</span>
                </button>
              </div>
            </div>

            {/* Main Content Area - Split Layout */}
            <div className="flex-1 overflow-y-auto p-8 no-scrollbar">
              <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Left Column - Core Content */}
                <div className="lg:col-span-2 flex flex-col gap-6">
                  <div className="bg-white p-1 rounded-2xl shadow-sm border border-slate-200">
                    <Field
                      name="title"
                      type="text"
                      placeholder="Broadcast Title"
                      className="w-full px-6 py-4 text-lg font-bold text-slate-800 placeholder:text-slate-300 border-none rounded-t-xl focus:ring-0 focus:outline-none bg-transparent"
                    />
                    <div className="h-px bg-slate-100 mx-6"></div>
                    <Field
                      as="textarea"
                      name="message"
                      rows={12}
                      placeholder="Type your message content here..."
                      className="w-full px-6 py-6 text-sm font-medium text-slate-600 placeholder:text-slate-300 border-none rounded-b-xl focus:ring-0 focus:outline-none resize-none bg-transparent leading-relaxed"
                    />
                  </div>
                   <ErrorMessage
                      name="title"
                      component="p"
                      className="text-xs font-bold text-red-500 px-2"
                    />
                   <ErrorMessage
                      name="message"
                      component="p"
                      className="text-xs font-bold text-red-500 px-2 -mt-4"
                    />
                </div>

                {/* Right Column - Meta & Media */}
                <div className="flex flex-col gap-6">
                  
                  {/* Category Card */}
                  <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex flex-col gap-4">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Classification</h3>
                    <div className="flex flex-col gap-2">
                       <label className="text-sm font-bold text-slate-700">Type</label>
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
                     <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Media</h3>
                     
                     {!values.attachment ? (
                        <div className="relative">
                           <input
                            type="file"
                            id="file-upload-sidebar"
                            className="hidden"
                            accept=".jpg,.png,.pdf"
                            onChange={(e) =>
                              setFieldValue("attachment", e.currentTarget.files[0])
                            }
                          />
                          <label 
                            htmlFor="file-upload-sidebar"
                            className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50 hover:bg-slate-100 hover:border-[#0A4F48]/30 transition-all cursor-pointer group"
                          >
                             <Upload className="w-6 h-6 text-slate-300 group-hover:text-[#0A4F48] mb-2 transition-colors" />
                             <span className="text-xs font-bold text-slate-500 group-hover:text-slate-700">Upload File</span>
                          </label>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                           <div className="p-2 bg-white rounded shadow-sm">
                              <FileText className="w-4 h-4 text-[#0A4F48]" />
                           </div>
                           <div className="flex flex-col flex-1 min-w-0">
                              <p className="text-xs font-bold text-slate-700 truncate">{values.attachment.name}</p>
                              <p className="text-[10px] text-slate-400 uppercase">{(values.attachment.size / 1024).toFixed(0)} KB</p>
                           </div>
                           <button
                             type="button"
                             onClick={() => setFieldValue("attachment", null)}
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


export default CreateBroadcast;
