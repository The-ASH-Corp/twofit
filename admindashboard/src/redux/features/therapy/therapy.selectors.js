export const selectTherapyState = (state) => state.therapy;

export const selectTherapyPlans = (state) =>
  state.therapy?.plans || [];

export const selectTherapyPlan = (state) =>
  state.therapy?.plan || null;

export const selectTherapyLoading = (state) =>
  state.therapy?.loading;

export const selectTherapyError = (state) =>
  state.therapy?.error;
