import { ArrowLeft, Mic, Paperclip, Square } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import chatShimmer from "../../../assets/ChatShimmer.json";
import Lottie from "lottie-react";

const formatDuration = (totalSeconds = 0) => {
  const seconds = Math.max(0, Math.round(totalSeconds));
  const mins = String(Math.floor(seconds / 60)).padStart(2, "0");
  const secs = String(seconds % 60).padStart(2, "0");
  return `${mins}:${secs}`;
};

const getMessageType = (msg) => {
  if (msg?.messageType) return msg.messageType;
  if (!msg?.mediaUrl) return "text";

  const mimeType = msg?.mediaMeta?.mimeType || "";
  if (mimeType.startsWith("image/")) return "image";
  if (mimeType.startsWith("audio/")) return "voice";
  if (/\.(png|jpe?g|gif|webp|bmp|svg)$/i.test(msg.mediaUrl)) return "image";
  return "voice";
};

const ChatWindow = ({
  client,
  messages,
  message,
  setMessage,
  messageHandlers,
  user,
  onlineUsers = [],
  handleImageUpload,
  handleVoiceUpload,
  isUploadingMedia = false,
  onBack,
}) => {
  const isClientOnline = client && onlineUsers.includes(client?._id);
  const fileInputRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const audioChunksRef = useRef([]);
  const recordingStartedAtRef = useRef(0);
  const recordingTimerRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);

  const stopTimer = () => {
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }
  };

  const stopStream = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      if (
        mediaRecorderRef.current &&
        mediaRecorderRef.current.state !== "inactive"
      ) {
        mediaRecorderRef.current.stop();
      }
      stopTimer();
      stopStream();
    };
  }, []);

  const startRecording = async () => {
    if (
      typeof MediaRecorder === "undefined" ||
      !navigator?.mediaDevices?.getUserMedia
    ) {
      console.error("Voice recording is not supported in this browser");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      audioChunksRef.current = [];

      const supportsPreferredMime =
        MediaRecorder.isTypeSupported &&
        MediaRecorder.isTypeSupported("audio/webm;codecs=opus");
      const recorder = supportsPreferredMime
        ? new MediaRecorder(stream, { mimeType: "audio/webm;codecs=opus" })
        : new MediaRecorder(stream);

      mediaRecorderRef.current = recorder;
      recordingStartedAtRef.current = Date.now();
      setRecordingSeconds(0);

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onerror = () => {
        setIsRecording(false);
        setRecordingSeconds(0);
        stopTimer();
        stopStream();
        console.error("Unable to record voice message");
      };

      recorder.onstop = async () => {
        setIsRecording(false);
        stopTimer();
        stopStream();

        const elapsedSeconds = Math.max(
          1,
          Math.round((Date.now() - recordingStartedAtRef.current) / 1000)
        );
        setRecordingSeconds(0);

        const audioBlob = new Blob(audioChunksRef.current, {
          type: recorder.mimeType || "audio/webm",
        });
        audioChunksRef.current = [];
        mediaRecorderRef.current = null;

        if (audioBlob.size > 0 && handleVoiceUpload) {
          await handleVoiceUpload(audioBlob, elapsedSeconds);
        }
      };

      recorder.start();
      setIsRecording(true);
      recordingTimerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } catch (error) {
      setIsRecording(false);
      setRecordingSeconds(0);
      stopTimer();
      stopStream();
      console.error("Microphone permission denied:", error);
    }
  };

  const toggleRecording = async () => {
    if (isUploadingMedia) return;

    if (isRecording) {
      if (
        mediaRecorderRef.current &&
        mediaRecorderRef.current.state !== "inactive"
      ) {
        mediaRecorderRef.current.stop();
      }
      return;
    }

    await startRecording();
  };

  const handleImageSelect = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file || !handleImageUpload) return;
    await handleImageUpload(file);
  };

  const renderMessageBody = (msg) => {
    const type = getMessageType(msg);

    if (type === "image" && msg.mediaUrl) {
      return (
        <div className="space-y-2">
          <img
            src={msg.mediaUrl}
            alt={msg?.mediaMeta?.name || "Shared image"}
            className="max-h-64 w-full rounded-xl object-cover"
          />
          {msg.message && <p>{msg.message}</p>}
        </div>
      );
    }

    if (type === "voice" && msg.mediaUrl) {
      const duration = Number(msg?.mediaMeta?.duration || 0);

      return (
        <div className="space-y-1">
          <audio controls src={msg.mediaUrl} className="max-w-full w-64" />
          {duration > 0 && (
            <p className="text-[11px] text-gray-600">
              Duration: {formatDuration(duration)}
            </p>
          )}
        </div>
      );
    }

    return msg.message;
  };

  return (
    <div className="w-full h-full min-h-0 flex flex-col bg-white rounded-2xl shadow-sm overflow-hidden">
      {client ? (
        <div className="flex-1 min-h-0 flex flex-col">
          {/* Chat Header */}
          <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-3">
            <button
              onClick={onBack}
              className="lg:hidden p-2 -ml-2 text-[#66706D] hover:bg-[#EBF3F2] hover:text-[#0A4F48] rounded-xl transition-colors"
              aria-label="Back to message list"
            >
              <ArrowLeft size={18} />
            </button>

            <div className="relative">
              <div className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-[#EBF3F2] flex items-center justify-center text-[#0A4F48] font-bold">
                {client?.name?.split(" ")?.[0]?.[0]}
                {client?.name?.split(" ")?.[1]?.[0]}
              </div>
              {isClientOnline && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h1 className="text-[#0A4F48] font-bold truncate">{client.name}</h1>
              <p className="text-xs text-[#66706D] capitalize truncate">
                {client?.role}
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs text-gray-600 shrink-0">
              <span
                className={`inline-flex items-center gap-1 px-2 py-1 rounded-full bg-[#F0F4F8] ${
                  isClientOnline ? "text-green-700" : "text-gray-600"
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    isClientOnline ? "bg-green-500" : "bg-gray-400"
                  }`}
                />
                {isClientOnline ? "Online" : "Offline"}
              </span>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 min-h-0 overflow-y-auto p-4 md:p-6 space-y-4 bg-[#F0F4F8]">
            {messages.map((msg, index) => {
              const isMe = msg.sender === user?._id;
              const messageType = getMessageType(msg);
              const hasMedia = messageType !== "text";
              const timestamp = msg?.time ? new Date(msg.time) : null;

              return (
                <div
                  key={`${msg.time || index}-${index}`}
                  className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                >
                  <div className="max-w-[82%] md:max-w-[70%]">
                    <div
                      className={`px-4 py-3 rounded-2xl text-sm shadow-sm wrap-break-word ${
                        hasMedia
                          ? isMe
                            ? "bg-white text-gray-800 border border-[#0A4F48]/10"
                            : "bg-white text-gray-800"
                          : isMe
                            ? "bg-[#0A4F48] text-white"
                            : "bg-white text-gray-800"
                      }`}
                    >
                      {renderMessageBody(msg)}
                    </div>

                    <div
                      className={`mt-1 text-[11px] text-gray-500 ${
                        isMe ? "text-right" : "text-left"
                      }`}
                    >
                      {timestamp
                        ? timestamp.toLocaleTimeString("en-US", {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          })
                        : ""}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Message Input */}
          <div className="bg-white px-4 md:px-6 py-3 pb-14 lg:pb-4 border-t border-gray-100">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageSelect}
            />

            {(isRecording || isUploadingMedia) && (
              <p className="text-xs text-gray-500 mb-2">
                {isRecording
                  ? `Recording voice... ${formatDuration(recordingSeconds)}`
                  : "Uploading media..."}
              </p>
            )}

            <div className="flex items-center gap-2 md:gap-3 bg-[#F0F4F8] rounded-xl p-2">
              <button
                type="button"
                className="text-gray-500 hover:text-[#0A4F48] transition"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploadingMedia || isRecording}
              >
                <Paperclip size={20} />
              </button>
              <input
                type="text"
                placeholder="Type something.."
                value={message}
                className="flex-1 bg-transparent text-sm text-gray-800 outline-none placeholder-gray-400"
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (
                    e.key === "Enter" &&
                    message.trim() &&
                    !isUploadingMedia &&
                    !isRecording
                  ) {
                    messageHandlers();
                  }
                }}
              />
              <button
                type="button"
                className={`transition ${
                  isRecording
                    ? "text-red-600 hover:text-red-700"
                    : "text-gray-500 hover:text-[#0A4F48]"
                }`}
                onClick={toggleRecording}
                disabled={isUploadingMedia}
              >
                {isRecording ? (
                  <Square
                    size={20}
                    className="text-white bg-red-600 rounded-full p-1 w-7 h-7"
                  />
                ) : (
                  <Mic
                    size={20}
                    className="text-white bg-[#0A4F48] rounded-full p-1 w-7 h-7"
                  />
                )}
              </button>
              <button
                type="submit"
                disabled={!message.trim() || isUploadingMedia || isRecording}
                className={`bg-[#0A4F48] text-white px-4 md:px-5 py-2 rounded-xl font-semibold transition text-sm ${
                  message.trim() && !isUploadingMedia && !isRecording
                    ? "hover:bg-[#0D6159]"
                    : "opacity-50 cursor-not-allowed"
                }`}
                onClick={() => messageHandlers()}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center w-full h-full bg-white">
          <div className="w-full max-w-xl">
          <Lottie
            animationData={chatShimmer}
            loop
            autoPlay
          />
            <p className="text-center text-sm text-[#66706D] -mt-6">
              Select a chat to start messaging.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWindow;
