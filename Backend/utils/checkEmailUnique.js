import User from "../modules/auth/auth.model.js";
import { AdminModel } from "../modules/admin/admin.model.js";
import { HeadsModel } from "../modules/Heads/heads.modal.js";
import { CoachModel } from "../modules/coach/coach.model.js";
import { FounderModel } from "../seeds/createAdmin.js";

/**
 * Checks all user collections for an existing account with the given email.
 * Throws an error if the email is already registered anywhere in the system.
 */
export async function assertEmailUnique(email) {
  const [user, admin, head, coach, founder] = await Promise.all([
    User.findOne({ email }).select("_id").lean(),
    AdminModel.findOne({ email }).select("_id").lean(),
    HeadsModel.findOne({ email }).select("_id").lean(),
    CoachModel.findOne({ email }).select("_id").lean(),
    FounderModel.findOne({ email }).select("_id").lean(),
  ]);

  if (user || admin || head || coach || founder) {
    throw new Error("This email is already registered in the system");
  }
}
