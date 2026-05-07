 import HealthConcern from './concern.model.js'


 export const createConcernService = async (userId, data) => {
  let { name, percentage, status } = data;
  percentage = Number(percentage);

  if (!name?.trim()) {
    throw new Error("Concern name is required");
  }

  if (!Number.isFinite(percentage) || percentage < 0 || percentage > 100) {
    throw new Error("Percentage must be between 0 and 100");
  }

   if (percentage === 100) {
    status = "Reversed";
  }

  const concern = await HealthConcern.create({
    userId,
    name: name.trim(),
    percentage,
    status,
  });

  return concern;
};

 export const getConcernsService = async (userId) => {
  return await HealthConcern.find({ userId }).sort({ createdAt: -1 });
};

 export const updateConcernService = async (id, data) => {
  let { name, percentage, status } = data;
  const update = {};

  if (percentage !== undefined) {
    percentage = Number(percentage);

    if (!Number.isFinite(percentage) || percentage < 0 || percentage > 100) {
      throw new Error("Invalid percentage");
    }

    if (percentage === 100) {
      status = "Reversed";
    }
    update.percentage = percentage;
  }

  if (name !== undefined) {
    if (!name?.trim()) {
      throw new Error("Concern name is required");
    }

    update.name = name.trim();
  }

  if (status !== undefined) {
    update.status = status;
  }

  const updated = await HealthConcern.findByIdAndUpdate(
    id,
    update,
    { new: true }
  );

  if (!updated) {
    throw new Error("Concern not found");
  }

  return updated;
};

 export const deleteConcernService = async (id) => {
  const deleted = await HealthConcern.findByIdAndDelete(id);

  if (!deleted) {
    throw new Error("Concern not found");
  }

  return true;
};
