import React, { useState } from "react";
import { useAuthStore } from "../store/useAuthStore.js";
import { User, Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import AuthImagePattern from "../components/AuthImagePatter.jsx";

const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
  });
  const { signup, isSigningUp } = useAuthStore();
  const validateForm = () => {};
  const handleSubmit = (e) => {
    e.preventDefault();
  };
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/**Left side */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="mb-6">
          <img
            src="/flux-logo.png" // replace with your logo path
            alt="App Logo"
            className=" w-50 object-contain"
          />
        </div>
        <div className="w-full max-w-md space-y-8">
          <form onSubmit={handleSubmit}>
            <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-full border p-4">
              <legend className="fieldset-legend text-yellow-100">
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
                    <Loader2 className="size-5 animate-spin " />
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
                className="text-neutral font-medium hover:underline text-yellow-500 "
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
      {/* Right Side */}
      <AuthImagePattern
        title={"Join our community"}
        subtitle={"Connect with friends, share moments and stay active"}
      />
    </div>
  );
};

export default SignUpPage;
