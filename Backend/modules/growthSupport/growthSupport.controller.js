import * as growthSupportService from "./growthSupport.service.js";

export const createGrowthSupport = async (req, res) => {
  try {
    const { recipientType, recipientIds, message } = req.body;
    const senderId = req.user._id;

    let attachments = [];
    if (req.files && req.files.attachments) {
      attachments = req.files.attachments.map(
        (file) => "/uploads/" + file.filename,
      );
    }

    // Parse recipientIds if it's a string (from FormData)
    let parsedRecipientIds = recipientIds;
    if (typeof recipientIds === "string") {
      try {
        parsedRecipientIds = JSON.parse(recipientIds);
      } catch (e) {
        parsedRecipientIds = [recipientIds];
      }
    }

    const data = {
      sender: senderId,
      recipientType,
      recipientIds: parsedRecipientIds,
      message,
      attachments,
    };

    const growthSupport = await growthSupportService.createGrowthSupport(data);

    res.status(201).json({
      success: true,
      data: growthSupport,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getReceivedSupport = async (req, res) => {
  try {
    const userId = req.user._id;
    const { page = 1, limit = 10 } = req.query;

    const data = await growthSupportService.getReceivedSupport(
      userId,
      Number(page),
      Number(limit),
    );

    res.status(200).json({
      success: true,
      data: data.requests,
      totalCount: data.totalCount,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const updated = await growthSupportService.markAsRead(id, userId);

    res.status(200).json({
      success: true,
      data: updated,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
