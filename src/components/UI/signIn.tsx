import { useState } from "react";
import { Button } from "./button";
import { Link, useNavigate } from "react-router-dom";
import { login, signup } from "../../api";

export default function SignIn({ type }: { type: "login" | "signup" }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const handleLogin = async () => {
    const response = await login({ email, password });
    if (response.status === 200) {
      navigate("/dashboard");
    } else {
      setError(response.data.message);
    }
    console.log(response);
  };
  const handleSignup = async () => {
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    const response = await signup({ email, password });
    if (response.status === 200) {
      navigate("/login");
    } else {
      setError(response.data);
    }
  };
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-3 sm:w-1/2 md:w-1/3 mx-auto p-4">
      <h1 className="text-2xl font-bold">
        {type === "login" ? "Login" : "Signup"}
      </h1>
      <h3 className="self-start">Email</h3>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border-2 border-gray-300 rounded-md shadow-sm p-2 w-full"
      />
      <h3 className="self-start">Password</h3>
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border-2 border-gray-300 rounded-md shadow-sm p-2 w-full"
      />
      {type === "signup" && (
        <>
          <h3 className="self-start">Confirm Password</h3>
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="border-2 border-gray-300 rounded-md shadow-sm p-2 w-full"
          />
        </>
      )}
      {error && <p className="text-red-500">{error}</p>}
      {type === "login" ? (
        <Button
          variant="outline"
          size="lg"
          onClick={handleLogin}
          className="w-full mt-2"
        >
          Login
        </Button>
      ) : (
        <Button
          variant="outline"
          size="lg"
          onClick={handleSignup}
          className="w-full mt-2"
        >
          Signup
        </Button>
      )}

      {type === "login" ? (
        <Link to="/signup" className="text-sm text-gray-500">
          Don't have an account? Signup
        </Link>
      ) : (
        <Link to="/login" className="text-sm text-gray-500">
          Already have an account? Login
        </Link>
      )}
    </div>
  );
}
