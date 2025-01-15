import React, { useState, useEffect } from "react";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";

const Authentication = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Monitor authentication state and redirect if logged in
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Redirect to the homepage if the user is authenticated
        navigate("/");
      }
    });

    // Cleanup the subscription
    return () => unsubscribe();
  }, [navigate]);

  const handleAuth = async (e) => {
    e.preventDefault();

    try {
      if (isLogin) {
        // Log in the user
        await signInWithEmailAndPassword(auth, email, password);
        alert("Logged in successfully!");
        navigate("/"); 
      } else {
        // Create a new user
        await createUserWithEmailAndPassword(auth, email, password);
        alert("Account created successfully!");
        navigate("/"); 
      }
    } catch (error) {
      alert(error.message); // Show error message
    }
  };

  return (
    <div className="login-page">
      <form onSubmit={handleAuth} className={isLogin ? "fade-in" : ""}>
        <h3>{isLogin ? "Login" : "Create Account"}</h3>
        <input
          type="email"
          id="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          id="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">{isLogin ? "Login" : "Create Account"}</button>
        <span
          onClick={() => setIsLogin(!isLogin)}
          className="toggle-link"
        >
          {isLogin ? "Don't have an account? Register" : "Already have an account? Login"}
        </span>
      </form>
    </div>
  );
};

export default Authentication;
