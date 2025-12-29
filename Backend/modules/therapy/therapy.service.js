import { id } from "zod/v4/locales";
import { TherapyModel } from "./therapy.model.js"


export const  createTherapy = async (therapy) => {
    return await TherapyModel.create({
      name: therapy.name,
      sets: therapy.sets,
      attachment: therapy.attachment,
      media: therapy.media,
    });
}

export const getAllTherapy = async () => {
    return await TherapyModel.find()
}

export const getTherapy = async (id) => {
    return await TherapyModel.findById(id)
}

export const updateTherapy = async (id, updatedData) => {
    return await TherapyModel.findByIdAndUpdate( id, updatedData)
}