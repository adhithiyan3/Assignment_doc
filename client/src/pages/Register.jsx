import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    role: "user",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Registration failed");

      alert("Registration successful!");
      navigate("/login");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-6 rounded-lg shadow-md w-80"
      >
        <h2 className="text-xl font-bold mb-4 text-center">Register</h2>

        <div className="space-y-2">
          <input
            type="text"
            name="firstname"
            placeholder="First Name"
            value={formData.firstname}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-700 text-white placeholder-gray-400"
            required
          />
          <input
            type="text"
            name="lastname"
            placeholder="Last Name"
            value={formData.lastname}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-700 text-white placeholder-gray-400"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-700 text-white placeholder-gray-400"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-700 text-white placeholder-gray-400"
            required
          />

          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-700 text-white"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded mt-4 hover:bg-blue-700"
        >
          Register
        </button>
      </form>
    </div>
  );
}
