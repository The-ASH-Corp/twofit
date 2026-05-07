import {
  createConcernService,
  getConcernsService,
  updateConcernService,
  deleteConcernService,
} from "./concern.service.js";

 export const addConcern = async (req, res) => {
  try {
    const userId = req.body.userId || req.user.id;
    const concern = await createConcernService(
      userId,
      req.body
    );

    res.status(201).json({
      success: true,
      message: "Health concern added",
      data: concern,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

 export const getConcerns = async (req, res) => {
  try {
    const userId = req.query.userId || req.user.id;
    const data = await getConcernsService(userId);

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

 export const updateConcern = async (req, res) => {
  try {
    const updated = await updateConcernService(
      req.params.id,
      req.body
    );

    res.json({
      success: true,
      message: "Updated successfully",
      data: updated,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

 export const deleteConcern = async (req, res) => {
  try {
    await deleteConcernService(req.params.id);

    res.json({
      success: true,
      message: "Deleted successfully",
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};
