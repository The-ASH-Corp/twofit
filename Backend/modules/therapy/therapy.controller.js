import * as therapyService from './therapy.service.js'; ;

export const createTherapyController = async (req, res) => {
  try {
    const therapy = await therapyService.createTherapy(req.body);
    res.status(201).json({
      success: true,
      message: "Therapy created successfully",
      data: therapy,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getTherapyController = async (req, res) => {
  try {
    const therapy = await therapyService.getTherapyById(req.params.id);
    if (!therapy) {
      return res.status(404).json({ message: "Therapy not found" });
    }
    res.status(200).json({ success: true, data: therapy });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

 
