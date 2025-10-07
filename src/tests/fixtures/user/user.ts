import { currentUserResponse, teacher1 } from "../teachers/teachers";
import type { User } from "@/stores/userStore";

export const currentAdminUser: User = {
  id: currentUserResponse.id, // 1
  name: currentUserResponse.name,
  email: currentUserResponse.email,
  role: currentUserResponse.role, // "admin"
  school: "First school",
};

export const currentTeacherUser: User = {
  id: teacher1.id, // 2
  name: teacher1.name,
  email: teacher1.email,
  role: teacher1.role, // "teacher"
  school: "First school",
};
