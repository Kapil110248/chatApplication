import React from "react";
import Left from "./home/Leftpart/Left";
import Right from "./home/Rightpart/Right";
import Signup from "./components/Signup";
import Login from "./components/Login";
import { useAuth } from "./context/AuthProvider";
import { Toaster } from "react-hot-toast";
import Logout from "./home/left1/Logout";
import Profile from "./home/Leftpart/Profile"; // ✅ Import Profile
import { Navigate, Route, Routes } from "react-router-dom";
import NotificationToast from "./home/Rightpart/NotificationToast";

function App() {
  const [authUser] = useAuth();

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            authUser ? (
              <div className="flex h-screen">
                <Logout />
                <Left />
                <Right />
              </div>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/login"
          element={authUser ? <Navigate to="/" /> : <Login />}
        />
        <Route
          path="/signup"
          element={authUser ? <Navigate to="/" /> : <Signup />}
        />

        {/* ✅ Profile route */}
        <Route
          path="/profile"
          element={
            authUser ? (
              <div className="flex items-center justify-center h-screen bg-slate-900">
                <Profile user={authUser.user} onClose={() => {}} />
              </div>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
<NotificationToast />
      <Toaster />
    </>
  );
}

export default App;
