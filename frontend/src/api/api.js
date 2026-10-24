const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export async function apiRequest(path, options = {}) {
  const headers = new Headers(options.headers);

  if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
    credentials: "include",
  });

  if (response.status === 204) {
    return null;
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || "Something went wrong.");
  }

  return data;
}

export function login(credentials) {
  return apiRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
}

export function signup(details) {
  return apiRequest("/auth/signup", {
    method: "POST",
    body: JSON.stringify(details),
  });
}

export function logout() {
  return apiRequest("/auth/logout", { method: "POST" });
}

export function getCurrentUser() {
  return apiRequest("/auth/me");
}

export function getDashboard() {
  return apiRequest("/dashboard");
}

export function getWallet() {
  return apiRequest("/wallet");
}

export function getWalletTransactions(page = 1, limit = 10) {
  return apiRequest(`/wallet/transactions?page=${page}&limit=${limit}`);
}

export function getMatches() {
  return apiRequest("/matches");
}

export function getMatch(id) {
  return apiRequest(`/matches/${id}`);
}

export function createMatch(details) {
  return apiRequest("/matches", {
    method: "POST",
    body: JSON.stringify(details),
  });
}

export function updateMatch(id, details) {
  return apiRequest(`/matches/${id}`, {
    method: "PATCH",
    body: JSON.stringify(details),
  });
}

export function updateMatchScore(id, scores) {
  return apiRequest(`/matches/${id}/score`, {
    method: "PATCH",
    body: JSON.stringify({ scores }),
  });
}

export function updateMatchStatus(id, status) {
  return apiRequest(`/matches/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

export function createPrediction(details) {
  return apiRequest("/predictions", {
    method: "POST",
    body: JSON.stringify(details),
  });
}

export function getPredictions() {
  return apiRequest("/predictions");
}

export function getPrediction(id) {
  return apiRequest(`/predictions/${id}`);
}
