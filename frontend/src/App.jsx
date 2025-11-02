import { useEffect } from "react";

import Navbar from "./components/Navbar.jsx";

import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import HomePage from "./pages/HomePage.jsx";
import LogInPage from "./pages/LogInPage.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import SettingsPage from "./pages/SettingsPage.jsx";
import AboutUs from "./pages/AboutUs.jsx";

import { useAuthStore } from "./store/useAuthStore.js";
import { useThemeStore } from "./store/useThemeStore.js";

import LoaderAnimate from "./components/LoaderAnimate.jsx";

function App() {
  const { authUser, checkAuth, isCheckingAuth, onlineUsers } = useAuthStore();
  const { theme } = useThemeStore();


  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // if (true)
  if (isCheckingAuth && !authUser)
    return (
      <div data-theme={theme}>
        {/* <Loader className="size-10 animate-spin" /> */}
        <LoaderAnimate />
      </div>
    );

  // console.log({ authUser });
  return (
    <div data-theme={theme}>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={authUser ? <HomePage /> : <Navigate to={"/login"} />}
        />
        <Route
          path="/signup"
          element={!authUser ? <SignUpPage /> : <Navigate to={"/"} />}
        />
        <Route
          path="/login"
          element={!authUser ? <LogInPage /> : <Navigate to={"/"} />}
        />
        <Route path="/settings" element={<SettingsPage />} />
        <Route
          path="/profile"
          element={authUser ? <ProfilePage /> : <Navigate to={"/login"} />}
        />
        <Route path="/aboutus" element={!authUser && <AboutUs />} />
      </Routes>

      <Toaster />
    </div>
  );
}

export default App;
