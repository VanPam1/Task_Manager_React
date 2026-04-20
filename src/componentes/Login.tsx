import { useState } from "react";

type Props = {
  onLogin: (token: string) => void;
};

function Login({ onLogin }: Props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      // 🔥 guardar token
      localStorage.setItem("token", data.token);

      onLogin(data.token);

    } catch (error) {
      console.error("Error login:", error);
    }
  };

  return (
    <div className="login">
      <h2>Login</h2>

      <input
        placeholder="Usuario"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleLogin}>Ingresar</button>
    </div>
  );
}

export default Login;