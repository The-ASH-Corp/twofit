export const allowRoles = (...roles) => {
  const allowed = roles.map(r => r.toLowerCase());
  return (req, res, next) => {
    const userRole = (req.user.role || "").toLowerCase();
    if (!allowed.includes(userRole))
      return res.status(403).json({ message: "Forbidden: insufficient role" });
    next();
  };
};
