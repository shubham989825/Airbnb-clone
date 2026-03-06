import React from "react";

const Profile = () => {
  const token = localStorage.getItem("token");

  return (
    <div style={{ padding: "20px" }}>
      <h1>Profile Page</h1>
      {token ? (
        <p>Logged in with token: {token}</p>
      ) : (
        <p>You are not logged in.</p>
      )}
    </div>
  );
};

export default Profile;