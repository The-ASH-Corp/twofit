import Therapy from './therapy.model.js'

export const createTherapy = async (data) => {
  return await Therapy.create(data);
};



 export const getTherapyById = async (therapyId) => {
  return await Therapy.findById(therapyId);
};