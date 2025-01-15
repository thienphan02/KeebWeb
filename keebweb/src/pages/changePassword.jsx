import React, { useState } from "react";
import { auth } from "../firebase";
import { updatePassword } from "firebase/auth";

const ChangePassword = () => {
  const [newPassword, setNewPassword] = useState("");

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;

    if (user) {
      try {
        await updatePassword(user, newPassword);
        alert("Password updated successfully!");
      } catch (error) {
        alert(error.message);
      }
    } else {
      alert("You need to be logged in to change your password.");
    }
  };

  return (
    <form id="change-password-form" onSubmit={handleUpdatePassword}>
      <h3>Change Password</h3>
      <label htmlFor="new-password">New Password</label>
      <input
        type="password"
        placeholder="Enter new password"
        id="new-password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        required
      />
      <button id="update-password-btn" type="submit">Update Password</button>
    </form>
  );
};

export default ChangePassword;
