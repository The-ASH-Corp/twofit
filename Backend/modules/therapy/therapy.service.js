import User from '../auth/auth.model.js';
import Therapy from './therapy.model.js'

export const createTherapy = async (data) => {
  return await Therapy.create(data);
};



export const getAllTherapy = async (page, limit) => {
  const totalTherapy = await Therapy.countDocuments();
  const therapyList = await Therapy.find()
    .skip((page - 1) * limit)
    .limit(limit)
    .lean();

  const therapy = await Promise.all(
    therapyList.map(async (t) => {
      const count = await User.countDocuments({ therapyType: t._id });
      return { ...t, clients: count };
    })
  );

  const users = await User.find({
    therapyType: { $in: therapyList.map((t) => t._id) },
  }).countDocuments();

  return {
    totalTherapy,
    therapy,
    users,
  };
};

export const getTherapyById = async (therapyId) => {
  const therapy = await Therapy.findById(therapyId).lean();
  if (!therapy) return null;
  const clients = await User.countDocuments({ therapyType: therapyId });
  return { ...therapy, clients };
};