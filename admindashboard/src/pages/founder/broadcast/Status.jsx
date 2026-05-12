import React, { useEffect, useState } from "react";
import axiosInstance from "@/utils/axiosInstance";
import { SyncLoader } from "react-spinners";
import BaseTable from "@/components/table/BaseTable";
import { statusColumns } from "./Statuscolumns";
import { AlertCircle } from "lucide-react";

const Status = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [filteredMessages, setFilteredMessages] = useState([]);

  useEffect(() => {
    fetchMessages();
  }, [page, limit]);

  useEffect(() => {
    setFilteredMessages(messages);
  }, [messages]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(
        `/whatsapp/all-messages?page=${page}&limit=${limit}`,
      );
      if (response.success) {
        setMessages(response.data);
        setTotalCount(response.totalCount);
      } else {
        setError(response.message || "Failed to fetch messages");
      }
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const searchInputHandler = (e) => {
    const value = e.target.value.toLowerCase();
    if (!value) {
      setFilteredMessages(messages);
      return;
    }
    const filtered = messages.filter((msg) =>
      msg.recipientUserId?.name?.toLowerCase().includes(value) ||
      msg.recipientPhone?.toLowerCase().includes(value) ||
      msg.templateName?.toLowerCase().includes(value) ||
      msg.broadcastId?.title?.toLowerCase().includes(value)
    );
    setFilteredMessages(filtered);
  };

  if (loading && page === 1) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-130px)]">
        <SyncLoader color="#0A4F48" loading margin={2} size={15} />
      </div>
    );
  }

  return (
    <div
      className={` ${messages?.length > 0 ? "pb-4" : "pb-0"} overflow-auto no-scrollbar px-1`}
    >
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 flex items-center gap-3 mb-4">
          <AlertCircle size={20} />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      <BaseTable
        data={filteredMessages}
        columns={statusColumns()}
        pageLabel={"WhatsApp Messages"}
        onSearchInputChange={searchInputHandler}
        handlePageChange={setPage}
        handleLimitChange={setLimit}
        page={page}
        limit={limit}
        totalCount={totalCount}
      />
    </div>
  );
};

export default Status;
