import React, { useState } from "react";
import { useAuthStore } from "../store/useAuthStore.js";
import { User, Mail, Lock, Eye, EyeOff, Loader2, IdCard } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import AuthImagePattern from "../components/AuthImagePatter.jsx";
import toast from "react-hot-toast";

const SignUpPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullname: "",
    username: "",
    email: "",
    password: "",
  });
  const { signup, isSigningUp } = useAuthStore();
  const validateForm = () => {
    if (!formData.fullname.trim()) return toast.error("Full name required");
    if (!formData.username.trim()) return toast.error("User name is required");
    if (!formData.email.trim()) return toast.error("Email is required");
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(formData.email)) {
      return toast.error("Invalid email format");
    }
    if (!formData.password.trim()) return toast.error("Password is required ");
    if (formData.password.length < 6)
      return toast.error("Password must be atleast 6 character");

    return true;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    const success = validateForm();

    if (success === true) {
      await signup(formData);
      navigate("/login");
    }
  };
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/**Left side */}
      {/* Logo */}
      <div className="flex justify-center mb-6">
        <img
          src="/flux-logo.png" // replace with your logo path
          alt="App Logo"
          className=" w-120 h-120 object-contain "
        />
      </div>
      {/**Right side */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        {/* Form */}
        <div className="w-full max-w-md space-y-8">
          <form onSubmit={handleSubmit}>
            <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-full border p-4">
              <legend className="fieldset-legend text-yellow-400">
                Create Account
              </legend>

              <label className="label text-yellow-300">Full Name</label>
              <div className="flex items-center border border-base-300 rounded-lg bg-base-200 px-3 py-2 focus-within:ring-2 focus-within:ring-neutral">
                <User className="mr-2" size={18} />
                <input
                  type="text"
                  className="bg-transparent outline-none w-full"
                  placeholder="Full name"
                  value={formData.fullname}
                  onChange={(e) =>
                    setFormData({ ...formData, fullname: e.target.value })
                  }
                />
              </div>
              <label className="label text-yellow-300">User name</label>
              <div className="flex items-center border border-base-300 rounded-lg bg-base-200 px-3 py-2 focus-within:ring-2 focus-within:ring-neutral">
                <IdCard className="mr-2" size={18} />
                <input
                  type="text"
                  className="bg-transparent outline-none w-full"
                  placeholder="User name"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                />
              </div>

              <label className="label text-yellow-300">Email</label>
              <div className="flex items-center border border-base-300 rounded-lg bg-base-200 px-3 py-2 focus-within:ring-2 focus-within:ring-neutral">
                <Mail className="mr-2" size={18} />
                <input
                  type="email"
                  className="bg-transparent outline-none w-full"
                  placeholder="abc@email.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>

              <label className="label text-yellow-300">Password</label>
              <div className="flex items-center border border-base-300 rounded-lg bg-base-200 px-3 py-2 focus-within:ring-2 focus-within:ring-neutral">
                <Lock className="mr-2" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  className="bg-transparent outline-none w-full"
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="hover:text-yellow-300"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <button
                type="submit"
                className="btn btn-neutral mt-4 w-full hover:text-yellow-300"
                disabled={isSigningUp}
              >
                {isSigningUp ? (
                  <>
                    <Loader2 className="siz e-5 animate-spin " />
                    Loading...
                  </>
                ) : (
                  "Create Account"
                )}
              </button>
            </fieldset>
          </form>

          <div className="text-center text-sm mt-4 w-full">
            <p className="text-base-content/60">
              Already have an account?{" "}
              <Link
                to="/login"
                className=" font-medium hover:underline text-green-400 "
              >
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
      {/* Right Side */}
      {/* <AuthImagePattern
        title={"Join our community"}
        subtitle={"Connect with friends, share moments and stay active"}
      /> */}
    </div>
  );
};

export default SignUpPage;
