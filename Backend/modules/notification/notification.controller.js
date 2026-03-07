import * as notificationService from "./notification.service.js";

export const createNotification = async (req, res) => {
  try {
    const payload = {
      ...req.body,
    };

    if (!payload.recipientRole && !payload.recipientId) {
      payload.recipientRole = req.user?.role || "all";
    }

    const notification = await notificationService.createNotification(payload);

    res.status(201).json({
      success: true,
      data: notification,
      suppressed: notification === null,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getRecentNotifications = async (req, res) => {
  try {
    const notifications = await notificationService.getRecentNotifications(
      req.user,
      req.query,
    );

    res.status(200).json({
      success: true,
      data: notifications,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getAllNotifications = async (req, res) => {
  try {
    const result = await notificationService.getAllNotifications(
      req.user,
      req.query,
    );

    res.status(200).json({
      success: true,
      data: result.notifications,
      pagination: result.pagination
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getUnreadCount = async (req, res) => {
  try {
    const result = await notificationService.getUnreadCount(req.user, req.query);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const markNotificationAsRead = async (req, res) => {
  try {
    const notification = await notificationService.markNotificationAsRead(
      req.params.id,
      req.user,
    );

    res.status(200).json({
      success: true,
      data: notification,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const markAllNotificationsAsRead = async (req, res) => {
  try {
    const result = await notificationService.markAllNotificationsAsRead(
      req.user,
      req.query,
    );

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const dismissNotification = async (req, res) => {
  try {
    const notification = await notificationService.dismissNotification(
      req.params.id,
      req.user,
    );

    res.status(200).json({
      success: true,
      data: notification,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getNotificationPreferences = async (req, res) => {
  try {
    const preferences = await notificationService.getNotificationPreferences(
      req.user,
    );

    res.status(200).json({
      success: true,
      data: preferences,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const updateNotificationPreferences = async (req, res) => {
  try {
    const preferences = await notificationService.updateNotificationPreferences(
      req.user,
      req.body,
    );

    res.status(200).json({
      success: true,
      data: preferences,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getNotificationSummary = async (req, res) => {
  try {
    const summary = await notificationService.getNotificationSummary(
      req.user,
      req.query,
    );

    res.status(200).json({
      success: true,
      data: summary,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
