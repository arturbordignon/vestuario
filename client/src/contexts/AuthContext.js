import React, { createContext, useState } from "react";
import { adminLogin, userLogin } from "../services/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isInAdminMode, setIsInAdminMode] = useState(false);

  const [user, setUser] = useState(null);

  const login = async (email, password, isAdministrator) => {
    try {
      const response = isAdministrator
        ? await adminLogin(email, password)
        : await userLogin(email, password);

      if (response && response.status === "Sucesso") {
        const { token } = response.data;
        const id = isAdministrator ? response.data.adminId : response.data.userId;

        setUser({ email, token, id, role: isAdministrator ? "admin" : "user" });
        setIsInAdminMode(isAdministrator);
        return { success: true };
      } else {
        console.log("Falha ao fazer Login:", response.message || "Erro Desconhecido");
      }
    } catch (error) {
      console.error("Erro ao fazer Login:", error);
    }
  };

  const switchToAdminMode = () => {
    setIsInAdminMode(true);
  };

  const switchToUserMode = () => {
    setIsInAdminMode(false);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ isInAdminMode, user, login, switchToAdminMode, switchToUserMode, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
