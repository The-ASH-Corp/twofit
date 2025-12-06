import * as service from "../services/authServices.js";

export const createUserByAdmin = async (req, res) => {
  try {
    const user = await service.adminCreateUser(req.body);
    res.status(201).json({
      success: true,
      message: "Client account created successfully",
      data: user,
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const loginController = async (req, res) => {
  try {
    const data = await service.loginUser(req.body);
    res.json({ success: true, message: "Login successful", data });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const adminLoginController = async (req, res) => {
  try {
    const data = await service.adminLogin(req.body);
    res.json({ success: true, message: "Admin login successful", data });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};


// export const forgotPasswordController = async (req, res) => {
//   try {
//     const { email } = req.body;

//     const result = await service.forgotPassword(email);

//     res.json({ success: true, message: result.message });
//   } catch (err) {
//     res.status(400).json({ success: false, message: err.message });
//   }
// };

// export const resetPasswordController = async (req, res) => {
//   try {
//     const { token, newPassword } = req.body;

//     const result = await service.resetPassword({ token, newPassword });

//     res.json({ success: true, message: result.message });
//   } catch (err) {
//     res.status(400).json({ success: false, message: err.message });
//   }
// };


