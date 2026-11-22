import { db } from "@/lib/auth";

// ─── Shared profile types ────────────────────────────────────────────────────

export type ProfileStat = {
  label: string;
  value: string;
};

export type ProfileMetaTone = "neutral" | "success" | "warning" | "danger";

export type ProfileMeta = {
  label: string;
  value: string;
  tone?: ProfileMetaTone;
};

export type ProfileUserData = {
  name: string;
  email: string;
  role: "customer" | "technician" | "admin";
  image: string | null;
  phone: string;
  area: string;
  bio: string;
  createdAt: Date | string | null;
};

export type ProfileData = {
  user: ProfileUserData;
  stats: ProfileStat[];
  meta: ProfileMeta[];
  verifiedTechnician: boolean;
};

type SessionUser = {
  id?: string | null;
  name?: string | null;
  email?: string | null;
  role?: string | null;
  image?: string | null;
  phone?: string | null;
  area?: string | null;
  bio?: string | null;
  createdAt?: Date | string | null;
};

type MongoUser = Record<string, unknown> & {
  name?: string;
  email?: string;
  role?: string;
  image?: string;
  phone?: string;
  area?: string;
  bio?: string;
  createdAt?: Date | string;
  isVerified?: boolean;
  verified?: boolean;
  verificationStatus?: string;
  status?: string;
  accountStatus?: string;
  banned?: boolean;
  disabled?: boolean;
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function normalizeRole(role?: string | null): ProfileUserData["role"] {
  const normalized = (role || "customer").toLowerCase();

  if (normalized === "technician" || normalized === "admin") {
    return normalized;
  }

  return "customer";
}

function formatMemberSince(value?: Date | string | null) {
  if (!value) return null;

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return null;

  return date.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

function ownerFilter(
  email: string,
  id: string,
  emailField: string,
  idField: string
) {
  const filters: Record<string, string>[] = [];

  if (email) filters.push({ [emailField]: email });
  if (id) filters.push({ [idField]: id });

  // A user always has an email in a BetterAuth session. This fallback keeps
  // the query safe if that ever changes.
  return filters.length > 0 ? { $or: filters } : {};
}

function titleCase(value: string) {
  return value
    .trim()
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function resolveAccountStatus(user: MongoUser | null): ProfileMeta | null {
  if (!user) return null;

  const rawStatus = user.status ?? user.accountStatus;

  if (typeof rawStatus === "string" && rawStatus.trim()) {
    const value = titleCase(rawStatus);
    const normalized = rawStatus.trim().toLowerCase();

    let tone: ProfileMetaTone = "neutral";

    if (["active", "enabled", "verified", "approved"].includes(normalized)) {
      tone = "success";
    } else if (
      ["suspended", "disabled", "banned", "blocked", "rejected"].includes(
        normalized
      )
    ) {
      tone = "danger";
    } else if (["pending", "inactive", "unverified"].includes(normalized)) {
      tone = "warning";
    }

    return { label: "Account Status", value, tone };
  }

  if (user.banned === true || user.disabled === true) {
    return { label: "Account Status", value: "Suspended", tone: "danger" };
  }

  // The account exists and is currently signed in, with no ban/disabled flag.
  return { label: "Account Status", value: "Active", tone: "success" };
}

async function getTechnicianAverageRating(
  email: string,
  id: string
): Promise<number | null> {
  try {
    const match = ownerFilter(email, id, "technicianEmail", "technicianId");

    if (!("$or" in match)) return null;

    const result = await db
      .collection("reviews")
      .aggregate([
        {
          $match: {
            ...match,
            rating: { $type: "number" },
          },
        },
        {
          $group: {
            _id: null,
            average: { $avg: "$rating" },
            count: { $sum: 1 },
          },
        },
      ])
      .toArray();

    const row = result[0];

    if (!row || !row.count || !Number.isFinite(row.average)) {
      return null;
    }

    return Number(row.average);
  } catch (error) {
    // The reviews collection may not exist yet. In that case there is no
    // genuine rating data and the UI hides the rating section.
    console.error("Technician rating lookup error:", error);
    return null;
  }
}

// ─── Main loader ─────────────────────────────────────────────────────────────

export async function getProfileData(sessionUser: SessionUser): Promise<ProfileData> {
  const email = sessionUser.email?.trim().toLowerCase() || "";
  const userId = sessionUser.id?.trim() || "";

  const usersCol = db.collection<MongoUser>("user");
  const userDoc = email ? await usersCol.findOne({ email }) : null;

  const role = normalizeRole(
    (typeof userDoc?.role === "string" && userDoc.role) || sessionUser.role
  );

  const user: ProfileUserData = {
    name:
      (typeof userDoc?.name === "string" && userDoc.name) ||
      sessionUser.name?.trim() ||
      "Mendizo User",
    email: sessionUser.email?.trim() || "",
    role,
    image:
      (typeof userDoc?.image === "string" && userDoc.image) ||
      sessionUser.image ||
      null,
    phone:
      (typeof userDoc?.phone === "string" && userDoc.phone) ||
      sessionUser.phone ||
      "",
    area:
      (typeof userDoc?.area === "string" && userDoc.area) ||
      sessionUser.area ||
      "",
    bio:
      (typeof userDoc?.bio === "string" && userDoc.bio) ||
      sessionUser.bio ||
      "",
    createdAt: userDoc?.createdAt || sessionUser.createdAt || null,
  };

  const stats: ProfileStat[] = [];
  const meta: ProfileMeta[] = [];
  let verifiedTechnician = false;

  try {
    if (role === "customer") {
      const filter = ownerFilter(
        email,
        userId,
        "customerEmail",
        "customerId"
      );

      const [totalBookings, completedBookings] = await Promise.all([
        db.collection("bookings").countDocuments(filter),
        db
          .collection("bookings")
          .countDocuments({ ...filter, status: "completed" }),
      ]);

      stats.push(
        { label: "Total Bookings", value: totalBookings.toLocaleString() },
        {
          label: "Completed Bookings",
          value: completedBookings.toLocaleString(),
        }
      );
    } else if (role === "technician") {
      const serviceFilter = ownerFilter(
        email,
        userId,
        "technicianEmail",
        "technicianId"
      );
      const bookingFilter = ownerFilter(
        email,
        userId,
        "technicianEmail",
        "technicianId"
      );

      const [totalServices, completedJobs, averageRating] = await Promise.all([
        db.collection("services").countDocuments(serviceFilter),
        db
          .collection("bookings")
          .countDocuments({ ...bookingFilter, status: "completed" }),
        getTechnicianAverageRating(email, userId),
      ]);

      stats.push(
        { label: "Total Services", value: totalServices.toLocaleString() },
        { label: "Completed Jobs", value: completedJobs.toLocaleString() }
      );

      if (averageRating !== null) {
        stats.push({
          label: "Average Rating",
          value: `${averageRating.toFixed(1)} / 5`,
        });
      }

      verifiedTechnician = Boolean(
        userDoc &&
          (userDoc.isVerified === true ||
            userDoc.verified === true ||
            userDoc.verificationStatus?.toLowerCase() === "verified")
      );
    } else {
      const totalUsers = await usersCol.countDocuments();
      const accountStatus = resolveAccountStatus(userDoc);

      stats.push({
        label: "Total Registered Users",
        value: totalUsers.toLocaleString(),
      });

      if (accountStatus) meta.push(accountStatus);
    }
  } catch (error) {
    console.error("Profile statistics error:", error);
  }

  const memberSince = formatMemberSince(user.createdAt);

  if (memberSince) {
    meta.push({ label: "Member Since", value: memberSince });
  }

  return {
    user,
    stats,
    meta,
    verifiedTechnician,
  };
}
