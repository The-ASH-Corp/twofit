import Therapy from './therapy.model.js'

export const createTherapy = async (data) => {
  return await Therapy.create(data);
};



 export const getAllTherapy = async () => {
  return await Therapy.find();
};

export const getTherapyById=async(therapyId)=>{
  return await Therapy.findById(therapyId)
}