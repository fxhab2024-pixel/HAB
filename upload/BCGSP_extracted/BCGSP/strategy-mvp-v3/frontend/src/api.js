const BASE = "http://localhost:8000";

export async function registerUser({ name, email, password, role = "sme" }) {
  const res = await fetch(`${BASE}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password, role }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || "Register failed");
  return data;
}

export async function loginUser({ email, password }) {
  const res = await fetch(`${BASE}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || "Login failed");
  return data;
}

export async function diagnose(payload) {
  const res = await fetch(`${BASE}/diagnose`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || "Diagnose failed");
  return data;
}

export async function getReports(userId) {
  const res = await fetch(`${BASE}/reports/${userId}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || "Get reports failed");
  return data;
}

export async function getAdminOverview(adminUserId) {
  const res = await fetch(`${BASE}/admin/overview?admin_user_id=${adminUserId}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || "Admin overview failed");
  return data;
}

export async function getAdminUserReports(adminUserId, userId) {
  const res = await fetch(`${BASE}/admin/user/${userId}/reports?admin_user_id=${adminUserId}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || "Admin user reports failed");
  return data;
}
