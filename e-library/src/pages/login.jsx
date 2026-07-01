import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/authService";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await login({ email, password });

      if (res.data.token) {
        // Save token and user
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));

        alert("Login Successful");

        // Redirect based on role
        if (res.data.user.role === "admin") {
          navigate("/admin/dashboard");
        } else if (res.data.user.role === "subscriber") {
          navigate("/user/dashboard");
        } else {
          navigate("/");
        }
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      console.log(err);
      alert("Login Failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-96">
        <h2 className="text-3xl font-bold text-center mb-6">
          E-Library Login
        </h2>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            className="border w-full p-3 rounded mb-4"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="border w-full p-3 rounded mb-6"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="w-full bg-green-700 text-white p-3 rounded hover:bg-green-800"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;