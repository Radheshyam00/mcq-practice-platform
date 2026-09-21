import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { isAdminRole } from "@/lib/user-permissions";

export async function getAdminSession() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return null;
  }

  if (!session.user.role) {
    return null;
  }

  if (!isAdminRole(session.user.role)) {
    return null;
  }

  return session;
}