const API_URL = "http://localhost:8080/api/auth/";

class AuthService {
  async login(email, password) {
    const response = await fetch(API_URL + "signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Falha no login");
    }

    const data = await response.json();
    if (data.token) {
      const { perfil, ...userData } = data;
      localStorage.setItem("user", JSON.stringify(userData));
    }
    return data;
  }

  logout() {
    localStorage.removeItem("user");
  }

  async register(nome, email, password) {
    const response = await fetch(API_URL + "signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nome,
        email,
        password,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Falha no registo");
    }

    return response.text();
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem("user"));
  }
}

export default new AuthService();
