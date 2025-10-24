import { motion } from "framer-motion";
import { Github } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-base-200 text-base-content p-6">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-10"
      >
        {/* Logo */}
        <img
          src="/flux-logo.png"
          alt="Flux Logo"
          className="mx-auto sm:w-70 sm:h-40 mb-4 object-contain"
        />
        <p className="text-base-content/70 text-sm sm:text-base max-w-2xl mx-auto">
          <strong>Flux </strong> is a secure and intelligent messaging
          experience built with the{" "}
          <span className="text-primary">MERN stack</span>, designed to adapt
          with your theme — sleek, fast, and reliable.
        </p>
      </motion.div>

      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl bg-base-100 border border-base-300 shadow-xl rounded-3xl p-8 relative overflow-hidden"
      >
        {/* Decorative Gradient Glow */}
        <div className="absolute inset-0  from-primary/10 to-secondary/10 blur-3xl -z-10"></div>

        {/* Features Section */}
        <div className="grid sm:grid-cols-2 gap-6">
          {/* Features Card */}
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-base-300 p-5 rounded-2xl shadow-inner hover:shadow-md transition-all"
          >
            <h2 className="text-lg font-semibold text-primary mb-3 flex items-center gap-2">
              Features
            </h2>
            <ul className="list-disc list-inside text-sm space-y-1 text-base-content/80">
              <li>User Authentication (JWT + Cookies)</li>
              <li>Image Upload & Sharing</li>
              <li>Real-time Messaging UI</li>
              <li>Responsive Layout (DaisyUI + Tailwind)</li>
            </ul>
          </motion.div>

          {/* Upcoming Card */}
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-base-300 p-5 rounded-2xl shadow-inner hover:shadow-md transition-all"
          >
            <h2 className="text-lg font-semibold text-secondary mb-3 flex items-center gap-2">
              Upcoming
            </h2>
            <ul className="list-disc list-inside text-sm space-y-1 text-base-content/80">
              <li>OAuth Login (Google / GitHub)</li>
              <li>End-to-End Encryption</li>
              <li>Advanced Security Controls</li>
              <li>Smart Reactions & Message Status</li>
            </ul>
          </motion.div>
        </div>

        {/* GitHub Button */}
        <motion.a
          href="https://github.com/ujwals05/flux-v1"
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.05 }}
          className="inline-flex items-center gap-2 mt-8 bg-primary text-primary-content px-6 py-3 rounded-full font-medium shadow-md transition-all hover:shadow-lg"
        >
          <Github className="w-5 h-5" />
          View Project on GitHub
        </motion.a>

        {/* Disclaimer Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mt-6 p-4 bg-red-600 border border-base-300 rounded-xl text-xs  text-white"
        >
          <strong>Disclaimer:</strong> Portions of the frontend code and UI
          design were assisted by AI tools, including ChatGPT. The content and
          implementation are reviewed and adapted manually to ensure
          functionality and accuracy.
        </motion.div>

        {/* Footer */}
        <p className="mt-6 text-xs text-base-content/60 text-center">
          Built by{" "}
          <a
            href="https://www.linkedin.com/in/ujwal-s-6718762b0/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-primary hover:underline"
          >
            Ujwal
          </a>{" "}
          | Flux
        </p>
      </motion.div>
    </div>
  );
};

export default About;
