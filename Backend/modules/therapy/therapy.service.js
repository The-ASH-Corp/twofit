import Therapy from './therapy.model.js'

export const createTherapy = async (data) => {
  return await Therapy.create(data);
};



 export const getAllTherapy = async (page, limit) => {
   const totalTherapy = await Therapy.countDocuments();
   const therapy = await Therapy.find()
     .skip((page - 1) * limit)
     .limit(limit)
     .lean();
     return {
       totalTherapy,
       therapy
     };
 };

export const getTherapyById=async(therapyId)=>{
  return await Therapy.findById(therapyId)
}