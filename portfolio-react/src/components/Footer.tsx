import { motion } from 'framer-motion';
import { 
  FaHeart, 
  FaGithub, 
  FaLinkedin, 
  FaEnvelope, 
  FaChess,
  FaArrowUp,
  FaReact,
  FaPython,
  FaNodeJs,
  FaCode,
  FaRobot,
  FaGamepad
} from 'react-icons/fa';
import { SiTypescript, SiTailwindcss, SiArduino } from 'react-icons/si';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const quickLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Resume', href: '#resume' },
    { name: 'Portfolio', href: '#portfolio' },
    { name: 'Contact', href: '#contact' },
    { name: 'Fun Zone', href: '#fun-zone' },
  ];

  const socialLinks = [
    { 
      icon: FaGithub, 
      href: 'https://github.com/aabskrimgr', 
      label: 'GitHub',
      color: 'hover:text-gray-400'
    },
    { 
      icon: FaLinkedin, 
      href: 'https://www.linkedin.com/in/aabiskar-regmi-5b73b3252/', 
      label: 'LinkedIn',
      color: 'hover:text-blue-400'
    },
    { 
      icon: FaChess, 
      href: 'https://www.chess.com/member/aabiskaregmi', 
      label: 'Chess.com',
      color: 'hover:text-green-400'
    },
    { 
      icon: FaEnvelope, 
      href: '#contact', 
      label: 'Email',
      color: 'hover:text-red-400'
    },
  ];

  const techStack = [
    { icon: FaReact, name: 'React', color: 'text-blue-400' },
    { icon: SiTypescript, name: 'TypeScript', color: 'text-blue-500' },
    { icon: FaPython, name: 'Python', color: 'text-yellow-400' },
    { icon: FaNodeJs, name: 'Node.js', color: 'text-green-500' },
    { icon: SiTailwindcss, name: 'Tailwind', color: 'text-cyan-400' },
    { icon: SiArduino, name: 'Arduino', color: 'text-teal-400' },
    { icon: FaRobot, name: 'Robotics', color: 'text-purple-400' },
    { icon: FaCode, name: 'C++', color: 'text-pink-400' },
  ];

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="container-custom px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold gradient-text mb-4">Aabiskar Regmi</h3>
            <p className="text-gray-400 text-sm mb-4">
              Robotics Enthusiast, Software Developer, and Problem Solver. Building innovative solutions with code and circuits.
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <FaGamepad className="text-purple-500" />
              <span>Check out the Fun Zone for games!</span>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-primary-500 transition-colors duration-300 text-sm flex items-center gap-2 group"
                  >
                    <span className="w-0 group-hover:w-4 h-0.5 bg-primary-500 transition-all duration-300"></span>
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Connect Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-bold mb-4">Connect</h3>
            <div className="space-y-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target={social.href.startsWith('http') ? '_blank' : undefined}
                  rel={social.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className={`flex items-center gap-3 text-gray-400 ${social.color} transition-all duration-300 text-sm group`}
                >
                  <social.icon className="text-xl" />
                  <span className="group-hover:translate-x-1 transition-transform duration-300">
                    {social.label}
                  </span>
                </a>
              ))}
            </div>
          </motion.div>

          {/* Tech Stack */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-bold mb-4">Tech Stack</h3>
            <div className="grid grid-cols-4 gap-3">
              {techStack.map((tech) => (
                <motion.div
                  key={tech.name}
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  className="flex flex-col items-center gap-1 group cursor-pointer"
                  title={tech.name}
                >
                  <tech.icon className={`text-2xl ${tech.color} transition-all duration-300`} />
                  <span className="text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {tech.name}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 my-8"></div>

        {/* Bottom Bar */}
        <div className="flex flex-col items-center justify-center gap-4">
          <p className="flex items-center gap-2 text-gray-400 text-sm">
            © {currentYear} Created With 
            <FaHeart className="text-red-500 animate-pulse" /> 
            By{' '}
            <a
              href="https://github.com/aabskrimgr"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-500 hover:text-primary-400 transition-colors font-semibold"
            >
              Aabiskar Regmi
            </a>
          </p>

          {/* Back to Top Button */}
          <motion.button
            onClick={scrollToTop}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-3 bg-primary-600 hover:bg-primary-700 rounded-full text-white shadow-lg hover:shadow-primary-500/50 transition-all duration-300"
            aria-label="Back to top"
          >
            <FaArrowUp />
          </motion.button>
        </div>
      </div>

      {/* Decorative Wave */}
      <div className="w-full h-1 bg-gradient-to-r from-primary-600 via-purple-600 to-pink-600"></div>
    </footer>
  );
}
