import { API_URL } from "../utils/constants";

export const loginUser = async (email, password) => {
  try {
    const response = await fetch(`${API_URL}/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erro ao fazer Login:", error);
  }
};

export const loginAdmin = async (email, password) => {
  try {
    const response = await fetch(`${API_URL}/admin/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erro ao fazer login:", error);
  }
};

const apiCall = async (endpoint, method, body = null) => {
  try {
    const response = await fetch(`${API_URL}/${endpoint}`, {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      body: body ? JSON.stringify(body) : null,
    });
    return await response.json();
  } catch (error) {
    console.error("Erro na API:", error);
    throw error;
  }
};

const apiCallWithAuth = async (endpoint, method, body = null, token) => {
  try {
    const fetchOptions = {
      method: method,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    if (body instanceof FormData) {
      fetchOptions.body = body;
    } else if (method !== "GET" && method !== "HEAD" && body) {
      fetchOptions.headers["Content-Type"] = "application/json";
      fetchOptions.body = JSON.stringify(body);
    }

    const response = await fetch(`${API_URL}/${endpoint}`, fetchOptions);

    if (!response.ok) {
      throw new Error(`Erro no HTTP! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Erro na API com autenticação:", error);
    throw error;
  }
};

export const userLogin = (email, password) => loginUser(email, password);
export const userRegister = (cpf, name, email, password) =>
  apiCall("users/register", "POST", { cpf, name, email, password });
export const userForgotPassword = (email) => apiCall("users/forgot-password", "POST", { email });
export const userResetPassword = (token, newPassword) =>
  apiCall("users/reset-password", "POST", {
    token,
    newPassword,
  });

export const adminLogin = (email, password) => loginAdmin(email, password);
export const addAdmin = async (email, token) => {
  return apiCallWithAuth("admin/add", "POST", { email }, token);
};
export const adminForgotPassword = (email) => apiCall("admin/forgot-password", "POST", { email });
export const adminResetPassword = (token, newPassword) =>
  apiCall("admin/reset-password", "POST", { token, newPassword });

export const fetchAllClothing = () => apiCall("user/clothes", "GET");
export const fetchClothingBySeason = (season) => apiCall(`user/season/${season}`, "GET");

export const fetchClothingById = (id) => apiCall(`user/${id}`, "GET");

export const fetchAllClothingForAdmin = (token) =>
  apiCallWithAuth("admin/clothes", "GET", null, token);
export const addClothingForAdmin = (clothingData, token) =>
  apiCallWithAuth("admin/clothing/add", "POST", clothingData, token);
export const updateClothingForAdmin = (id, clothingData, token) =>
  apiCallWithAuth(`admin/clothing/${id}`, "PUT", clothingData, token);
export const deleteClothingForAdmin = (id, token) =>
  apiCallWithAuth(`admin/clothing/${id}`, "DELETE", null, token);

export const markAsDonatedForAdmin = (clothingId, token) => {
  apiCallWithAuth(`admin/clothing/${clothingId}/donated`, "PUT", null, token);
};

export const fetchDonatedClothingForAdmin = (token) => {
  return apiCallWithAuth("admin/clothing/donated", "GET", null, token);
};

export const fetchDonatedClothingForUser = (token) => {
  return apiCallWithAuth("user/clothing/donated", "GET", null, token);
};

export const deleteAdmin = async (adminId, token) => {
  return apiCallWithAuth(`admin/${adminId}`, "DELETE", null, token);
};

export const getAllAdmins = async (token) => {
  return apiCallWithAuth("admin/all", "GET", null, token);
};

export const startOrContinueChat = async (userId, clothingId, token) => {
  return apiCallWithAuth("chats/startOrContinue", "POST", { userId, clothingId }, token);
};

export const assignAdminToChat = (chatId, token) => {
  return apiCallWithAuth(`chats/${chatId}/assign-admin`, "POST", {}, token);
};

export const fetchChats = async (token) => {
  return apiCallWithAuth("chats", "GET", null, token);
};

export const fetchChatsForAdmin = async (token) => {
  return apiCallWithAuth("admin/chats", "GET", null, token);
};

export const sendMessage = async (chatId, message, senderId, senderRole, token) => {
  const payload = { senderId, senderRole, content: message };
  return apiCallWithAuth(`chats/${chatId}/messages`, "POST", payload, token);
};

export const sendMessageAsAdmin = async (chatId, content, token) => {
  const payload = { content };
  return apiCallWithAuth(`chats/${chatId}/admin/messages`, "POST", payload, token);
};

export const fetchMessages = async (chatId, token) => {
  return apiCallWithAuth(`chats/${chatId}/messages`, "GET", null, token);
};

export const fetchMessagesForAdminChat = async (chatId, token) => {
  return apiCallWithAuth(`admin/chats/${chatId}/messages`, "GET", null, token);
};
