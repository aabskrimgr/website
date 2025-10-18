import { motion } from "framer-motion";
import { FaGithub, FaTwitter, FaInstagram, FaFacebook, FaLinkedin } from "react-icons/fa";

export default function Hero() {
  const socialLinks = [
    { icon: <FaFacebook />, href: "https://www.facebook.com/abhishequeregmi" },
    { icon: <FaTwitter />, href: "https://www.twitter.com/_abskr_imgr" },
    { icon: <FaInstagram />, href: "https://instagram.com/aabiskar_._regmi/" },
    { icon: <FaLinkedin />, href: "https://www.linkedin.com/in/aabiskar-regmi-611364344/" },
    { icon: <FaGithub />, href: "https://github.com/aabskrimgr" },
  ];

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-900 via-purple-900 to-black">
      {/* Animated Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-red-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center">
        {/* Social Links */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8 flex gap-4 justify-center"
        >
          {socialLinks.map((social, index) => (
            <motion.a
              key={index}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 + 0.5 }}
              className="w-12 h-12 flex items-center justify-center bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-full text-white text-xl transition-all duration-300 hover:scale-110"
            >
              {social.icon}
            </motion.a>
          ))}
        </motion.div>

        {/* Main Content */}
        <motion.h4
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xl md:text-2xl text-gray-300 mb-4"
        >
          Hello, I am
        </motion.h4>

        <motion.h1
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-6xl md:text-8xl font-bold mb-6 gradient-text"
        >
          Aabiskar
        </motion.h1>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-2xl md:text-4xl text-gray-200 mb-8"
        >
          Computer Engineer | Robotics and IoT
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-lg text-gray-400 mb-12 max-w-2xl mx-auto"
        >
          Building intelligent systems and autonomous solutions for real-world problems
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="flex flex-wrap gap-4 justify-center"
        >
          <a
            href="#portfolio"
            className="px-8 py-4 bg-gradient-to-r from-primary-600 to-pink-600 hover:from-primary-700 hover:to-pink-700 text-white rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            View My Work
          </a>
        </motion.div>
      </div>
    </section>
  );
}
