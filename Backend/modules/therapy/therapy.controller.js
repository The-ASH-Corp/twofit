import { success } from "zod"
import * as therapyService from "./therapy.service.js"

export const createTherapy = async (req, res) => {
    try {
        const { name, sets, attachment } = req.body;
        const therapyData = {
          name,
          sets,
          attachment,
          media: `/uploads/${req.file.filename}`,
        };
        const therapy = await therapyService.createTherapy(therapyData)
        res.status(201).json({
          success: true,
          message: "Therapy created successfully",
          data: therapy,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error,
        })
    }
}

export const getAllTherapy = async (req, res) => {
    try {
        const therapies = await therapyService.getAllTherapy();
        res.status(200).json({
          success: true,
          data: therapies,
        });
    } catch (error) {
        return res.status(400).json({
          success: false,
          message: error,
        });
    }
}

export const getTherapy = async (req, res) => {
    try {
        const therapy = await therapyService.getTherapy(req.params.id)
        res.status(200).json({
            success: true,
            data: therapy
        })
    } catch (error) {
        return res.status(400).json({
          success: false,
          message: error,
        });
    }
}

export const updateTherapy = async (req, res) => {
    try {
        const therapy = await therapyService.updateTherapy(
          req.params.id,
          req.body
        );
        res.status(200).json({
          success: true,
          message: "Therapy updated successfully",
          data: therapy,
        });
    } catch (error) {
         return res.status(400).json({
           success: false,
           message: error,
         });
    }
}