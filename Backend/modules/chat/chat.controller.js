import * as service from "./chat.service.js";


export const getChatWithClient = async (req, res) => {
  try {
    const {page,limit,chatId} =req.params;
    const chat = await service.getchats(page,limit,chatId);
    res.status(200).json({ success: true, data: chat });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
