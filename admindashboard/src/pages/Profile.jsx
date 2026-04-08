import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "../redux/features/auth/auth.selectores";
import { Button } from "../components/ui/button";
import {
  X,
  Eye,
  EyeOff,
  User,
  Mail,
  Phone,
  Calendar,
  UserCheck,
  MapPin,
  CalendarDays,
  ShieldCheck,
  KeyRound,
  Edit2,
  Shield,
} from "lucide-react";
import { toast } from "react-toastify";
import {
  changePassword,
  editProfile,
  refreshProfile,
} from "@/redux/features/auth/auth.thunk";
import { assets } from "@/assets/asset";

const DetailItem = ({ icon: Icon, label, value, className = "" }) => (
  <div
    className={`flex items-start gap-4 p-5 rounded-3xl bg-white border border-gray-100 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.03)] hover:shadow-[0_8px_30px_-4px_rgba(6,81,237,0.08)] transition-all duration-300 ${className} `}
  >
    <div className="p-3.5 bg-gradient-to-br from-teal-50 to-emerald-50 text-[#0A4F48] rounded-2xl shadow-sm">
      <Icon className="w-5 h-5 flex-shrink-0" />
    </div>
    <div className="flex-1 overflow-hidden pt-0.5">
      <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
        {label}
      </p>
      <p className="text-[15px] font-semibold text-gray-800 truncate">
        {value || "N/A"}
      </p>
    </div>
  </div>
);

const Profile = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isChangePasswordMode, setIsChangePasswordMode] = useState(false);

  const [preview, setPreview] = useState(null);

  const [profileForm, setProfileForm] = useState({
    name: "",
    dob: "",
    gender: "",
    email: "",
    phone: "",
    address: "",
    profilePhoto: null,
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Format date for input field (YYYY-MM-DD)
  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  const handleEditProfile = () => {
    setProfileForm({
      name: user?.name || "",
      dob: formatDateForInput(user?.dob) || "",
      gender: user?.gender || "",
      email: user?.email || "",
      phone: user?.phone || "",
      address: user?.address || "",
      profilePhoto: null,
    });
    
    setIsEditMode(true);
  };

const handleProfileChange = (e) => {
  const { name, value, files } = e.target;

  if (files) {
    const file = files[0];

    setPreview(URL.createObjectURL(file)); // ✅ preview
    setProfileForm({
      ...profileForm,
      [name]: file,
    });
  } else {
    setProfileForm({
      ...profileForm,
      [name]: value,
    });
  }
};

  const handlePasswordChange = (e) => {
    setPasswordForm({
      ...passwordForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();

      Object.keys(profileForm).forEach((key) => {
        if (profileForm[key] !== null) {
          formData.append(key, profileForm[key]);
        }
      });
      await dispatch(editProfile(formData)).unwrap();
      await dispatch(
        refreshProfile({ id: user?._id, role: user.role }),
      ).unwrap();
      toast.success("Profile updated successfully!");
      setIsEditMode(false);
    } catch (error) {
      toast.error(
        error?.message || "Failed to update profile. Please try again.",
      );
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }
    try {
      await dispatch(changePassword(passwordForm)).unwrap();
      toast.success("Password changed successfully!");
      setIsChangePasswordMode(false);
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setShowPassword({
        currentPassword: false,
        newPassword: false,
        confirmPassword: false,
      });
    } catch (error) {
      toast.error(
        error?.message || "Failed to change password. Please try again.",
      );
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-16 font-sans selection:bg-teal-100 selection:text-teal-900">
      {/* Top Banner with Modern Pattern */}
      <div className="h-[280px] bg-[#0A4F48] relative overflow-hidden rounded-b-5xl lg:rounded-b-[80px] shadow-lg">
        <div className="absolute inset-0 bg-linear-to-r from-[#0A4F48] via-[#0d645c] to-[#0A4F48]"></div>
        {/* Abstract Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none mix-blend-overlay">
          <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full border-10 border-white/20 blur-xl"></div>
          <div className="absolute bottom-10 -left-20 w-72 h-72 rounded-full border-[30px] border-white/20 blur-xl"></div>
          <div className="absolute top-1/2 left-1/4 w-40 h-40 bg-white rounded-full blur-3xl opacity-30"></div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-56 relative z-10 transition-all duration-500">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">
          {/* Left Column: Interactive Profile Card */}
          <div className="lg:w-[380px] shrink-0 flex flex-col gap-6">
            <div className="bg-white rounded-4xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100/50 overflow-hidden relative backdrop-blur-xl bg-white/95">
              <div className="h-32 bg-gray-50/50 relative border-b border-gray-100/50">
                <button
                  onClick={handleEditProfile}
                  className="absolute top-6 right-6 p-2.5 bg-white/80 backdrop-blur-md hover:bg-white rounded-2xl text-[#0A4F48] shadow-sm hover:shadow-md transition-all duration-300 group"
                  aria-label="Edit Profile"
                >
                  <Edit2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                </button>
              </div>

              <div className="px-8 pb-10 flex flex-col items-center relative">
                {/* Modern Avatar Ring */}
                <div className="absolute -top-16">
                  <div className="w-32 h-32 rounded-3xl rotate-3 shadow-xl bg-white p-2 transition-transform duration-500 hover:rotate-6">
                    {!user?.profilePhoto ? (
                      <div className="w-full h-full -rotate-3 bg-gradient-to-br from-[#0A4F48] to-[#136e65] rounded-2xl flex items-center justify-center text-5xl font-bold text-white shadow-inner relative overflow-hidden group">
                        <span className="relative z-10 drop-shadow-md">
                          {user?.name?.charAt(0).toUpperCase()}
                        </span>
                        <div className="absolute inset-0 bg-black/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                      </div>
                    ) : (
                      <img
                        className="-rotate-3 border rounded-2xl h-full w-full"
                        src={`${import.meta.env.VITE_API_BASE_URL.replace("/api/v1", "")}${user?.profilePhoto}`}
                      />
                    )}
                  </div>
                </div>

                <div className="mt-20 w-full text-center">
                  <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
                    {user?.name}
                  </h2>
                  <div className="inline-flex items-center gap-1.5 px-4 py-1.5 mt-3 bg-teal-50/80 text-[#0A4F48] rounded-xl text-xs font-bold uppercase tracking-widest border border-teal-100/50">
                    <ShieldCheck className="w-4 h-4" />
                    {user?.role}
                  </div>
                </div>

                <div className="mt-8 w-full space-y-3">
                  <div className="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl border border-gray-100/50 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] animate-pulse"></div>
                      <span className="text-sm font-semibold text-gray-600">
                        Account Status
                      </span>
                    </div>
                    <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">
                      Active
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl border border-gray-100/50 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <CalendarDays className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-semibold text-gray-600">
                        Join Date
                      </span>
                    </div>
                    <span className="text-sm font-bold text-gray-900">
                      {formatDate(new Date())}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Security Quick Action */}
            <div
              className="bg-white rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100/50 p-6 flex items-center justify-between group hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 cursor-pointer hover:-translate-y-1"
              onClick={() => setIsChangePasswordMode(true)}
            >
              <div className="flex items-center gap-4">
                <div className="p-3.5 bg-red-50 text-red-500 rounded-2xl group-hover:bg-red-500 group-hover:text-white transition-colors duration-300 shadow-sm">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-[15px]">
                    Security Settings
                  </h3>
                  <p className="text-xs font-medium text-gray-500 mt-1">
                    Update your password
                  </p>
                </div>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-red-50 group-hover:text-red-500 transition-colors duration-300">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Right Column: Detailed Grid */}
          <div className="flex-1">
            <div className="bg-transparent">
              <div className="flex items-center gap-3 mb-8 px-2 lg:px-0">
                <div className="p-2 bg-white rounded-xl shadow-sm border border-gray-100 text-[#0A4F48]">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">
                    Personal Information
                  </h3>
                  <p className="text-sm text-gray-500 mt-0.5 font-medium">
                    Manage your personal details and contact info
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <DetailItem
                  icon={User}
                  label="Full Name"
                  value={user?.name}
                  className="sm:col-span-2 md:col-span-1"
                />
                <DetailItem
                  icon={Mail}
                  label="Email Address"
                  value={user?.email}
                  className="sm:col-span-2 md:col-span-1"
                />
                <DetailItem
                  icon={Phone}
                  label="Phone Number"
                  value={user?.phone}
                />
                <DetailItem
                  icon={Calendar}
                  label="Date of Birth"
                  value={formatDate(user?.dob)}
                />
                <DetailItem
                  icon={UserCheck}
                  label="Gender"
                  value={user?.gender}
                />
                <DetailItem
                  icon={Shield}
                  label="Account Role"
                  value={user?.role}
                />
                <DetailItem
                  icon={MapPin}
                  label="Residential Address"
                  value={user?.address}
                  className="sm:col-span-2"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Drawer (Modernized) */}
      {isEditMode && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity"
            onClick={() => setIsEditMode(false)}
          />
          <div className="relative w-full max-w-md h-full bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-500 overflow-hidden border-l border-gray-100">
            <div className="px-8 py-6 flex justify-between items-center bg-white border-b border-gray-50">
              <div className="flex items-center gap-4">
                <div className="p-2.5 bg-teal-50 text-[#0A4F48] rounded-2xl">
                  <Edit2 className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 tracking-tight">
                    Edit Profile
                  </h2>
                  <p className="text-xs font-semibold text-gray-500 mt-1 uppercase tracking-wider">
                    Update details
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsEditMode(false)}
                className="p-2.5 bg-gray-50 hover:bg-gray-100 rounded-2xl transition-colors text-gray-500"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <form
              onSubmit={handleProfileSubmit}
              className="flex-1 overflow-y-auto px-8 py-6 space-y-6 custom-scrollbar"
            >
              <div className="space-y-5">
                <div className="">
                  {/* Preview Image */}
                  <div className="mb-3 flex flex-col items-center gap-1">
                    <label className="block text-[14px] font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">
                      PROFILE PHOTO
                    </label>
                    <label className="cursor-pointer">
                      <img
                        src={
                          preview
                            ? preview
                            : user?.profilePhoto
                              ? `${import.meta.env.VITE_API_BASE_URL.replace("/api/v1", "")}${user?.profilePhoto}`
                              : assets.profileVector
                        }
                        className="w-24 h-24 object-fill rounded-xl border hover:opacity-80"
                      />
                      <input
                        type="file"
                        name="profilePhoto"
                        accept="image/*"
                        onChange={handleProfileChange}
                        className="hidden"
                      />
                    </label>

                    <p className="text-xs text-gray-500">
                      Click image to change
                    </p>
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={profileForm?.name}
                    onChange={handleProfileChange}
                    className="w-full px-5 py-3.5 bg-gray-50 border-0 rounded-2xl text-sm font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0A4F48]/20 focus:bg-white transition-all shadow-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">
                    Date of Birth
                  </label>
                  <input
                    required
                    type="date"
                    name="dob"
                    value={profileForm.dob}
                    onChange={handleProfileChange}
                    className="w-full px-5 py-3.5 bg-gray-50 border-0 rounded-2xl text-sm font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0A4F48]/20 focus:bg-white transition-all shadow-sm"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">
                    Gender
                  </label>
                  <div className="relative">
                    <select
                      required
                      name="gender"
                      value={profileForm.gender}
                      onChange={handleProfileChange}
                      className="w-full px-5 py-3.5 bg-gray-50 border-0 rounded-2xl text-sm font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0A4F48]/20 focus:bg-white transition-all shadow-sm appearance-none"
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                    <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    readOnly
                    value={profileForm.email}
                    onChange={handleProfileChange}
                    className="w-full px-5 py-3.5 bg-gray-100 border-0 rounded-2xl text-sm font-semibold text-gray-500 cursor-not-allowed opacity-70"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={profileForm.phone}
                    onChange={handleProfileChange}
                    className="w-full px-5 py-3.5 bg-gray-50 border-0 rounded-2xl text-sm font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0A4F48]/20 focus:bg-white transition-all shadow-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">
                    Address
                  </label>
                  <textarea
                    required
                    name="address"
                    value={profileForm.address}
                    onChange={handleProfileChange}
                    rows="3"
                    className="w-full px-5 py-3.5 bg-gray-50 border-0 rounded-2xl text-sm font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0A4F48]/20 focus:bg-white transition-all shadow-sm resize-none"
                  />
                </div>
              </div>
            </form>

            <div className="p-8 bg-white border-t border-gray-50 flex gap-4">
              <Button
                type="button"
                onClick={() => setIsEditMode(false)}
                className="flex-1 bg-gray-50 text-gray-700 hover:bg-gray-100 py-6 rounded-2xl font-bold transition-colors"
                variant="ghost"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                onClick={handleProfileSubmit}
                className="flex-1 bg-[#0A4F48] text-white hover:bg-[#083d38] py-6 rounded-2xl font-bold shadow-lg shadow-teal-900/20 hover:shadow-teal-900/30 transition-all"
              >
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Change Password Drawer (Modernized) */}
      {isChangePasswordMode && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity"
            onClick={() => setIsChangePasswordMode(false)}
          />

          <div className="relative w-full max-w-md h-full bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-500 overflow-hidden border-l border-gray-100">
            <div className="px-8 py-6 flex justify-between items-center bg-white border-b border-gray-50">
              <div className="flex items-center gap-4">
                <div className="p-2.5 bg-red-50 text-red-500 rounded-2xl">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 tracking-tight">
                    Security
                  </h2>
                  <p className="text-xs font-semibold text-gray-500 mt-1 uppercase tracking-wider">
                    Update Password
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsChangePasswordMode(false)}
                className="p-2.5 bg-gray-50 hover:bg-gray-100 rounded-2xl transition-colors text-gray-500"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <form
              onSubmit={handlePasswordSubmit}
              className="flex-1 overflow-y-auto px-8 py-8 space-y-8"
            >
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword.currentPassword ? "text" : "password"}
                    name="currentPassword"
                    value={passwordForm.currentPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-5 py-4 pr-12 bg-gray-50 border-0 rounded-2xl text-sm font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:bg-white transition-all shadow-sm placeholder:text-gray-400 placeholder:font-medium"
                    placeholder="Enter current password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("currentPassword")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
                  >
                    {showPassword.currentPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-6 pt-4 border-t border-gray-50">
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword.newPassword ? "text" : "password"}
                      name="newPassword"
                      value={passwordForm.newPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-5 py-4 pr-12 bg-gray-50 border-0 rounded-2xl text-sm font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:bg-white transition-all shadow-sm placeholder:text-gray-400 placeholder:font-medium"
                      placeholder="Enter new password"
                      required
                      minLength="6"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility("newPassword")}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
                    >
                      {showPassword.newPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  <p className="text-[11px] font-bold text-gray-400 mt-2.5 flex items-center gap-1.5 ml-1">
                    <span className="w-1.5 h-1.5 bg-red-200 rounded-full"></span>
                    MINIMUM 6 CHARACTERS
                  </p>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword.confirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={passwordForm.confirmPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-5 py-4 pr-12 bg-gray-50 border-0 rounded-2xl text-sm font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:bg-white transition-all shadow-sm placeholder:text-gray-400 placeholder:font-medium"
                      placeholder="Confirm new password"
                      required
                      minLength="6"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        togglePasswordVisibility("confirmPassword")
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
                    >
                      {showPassword.confirmPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </form>

            <div className="p-8 bg-white border-t border-gray-50 flex gap-4">
              <Button
                type="button"
                onClick={() => setIsChangePasswordMode(false)}
                className="flex-1 bg-gray-50 text-gray-700 hover:bg-gray-100 py-6 rounded-2xl font-bold transition-colors"
                variant="ghost"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                onClick={handlePasswordSubmit}
                className="flex-1 bg-red-500 text-white hover:bg-red-600 py-6 rounded-2xl font-bold shadow-lg shadow-red-500/20 hover:shadow-red-500/30 transition-all"
              >
                Update
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
