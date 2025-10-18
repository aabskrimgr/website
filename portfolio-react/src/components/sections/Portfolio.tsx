import { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

export default function Portfolio() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [activeFilter, setActiveFilter] = useState('all');

  const projects = [
    {
      id: 1,
      title: 'Micromouse Robot',
      category: 'robotics',
      image: '/projects/micromouse.jpg',
      description: 'Award-winning autonomous maze-solving robot using PID control, QTR-8A sensors, and path optimization algorithms. Features both left-hand and right-hand line-following strategies.',
      tags: ['Arduino', 'PID Control', 'Pathfinding', 'C++'],
      link: 'https://github.com/aabskrimgr/micromouse',
    },
    {
      id: 2,
      title: 'Line Follower Robot',
      category: 'robotics',
      image: '/projects/line-follower.png',
      description: 'High-speed line following robot with advanced PID tuning and sensor calibration for optimal track performance.',
      tags: ['Arduino', 'QTR Sensors', 'Motor Control', 'Embedded Systems'],
      link: 'https://github.com/aabskrimgr/line-follower',
    },
    {
      id: 3,
      title: 'Rubik\'s Cube Solver',
      category: 'robotics',
      image: '/projects/rubiks-cube.png',
      description: 'Computer graphics project featuring a functional Rubik\'s cube simulation with solving algorithms and interactive 3D visualization.',
      tags: ['Computer Graphics', '3D Simulation', 'Algorithms', 'OpenGL'],
      link: 'https://github.com/aabskrimgr/rubiks-cube',
    },
    {
      id: 4,
      title: 'Home Automation System',
      category: 'iot',
      image: '/projects/home-automation.jpg',
      description: 'IoT-based smart home automation system with mobile app control, sensor integration, and real-time monitoring.',
      tags: ['IoT', 'ESP32', 'Mobile App', 'Smart Home'],
      link: 'https://github.com/aabskrimgr/home-automation',
    },
    {
      id: 5,
      title: 'Robotics Mentor - AAKAR Foundation',
      category: 'volunteering',
      image: '/projects/volunteering-aakar.jpg',
      description: 'Taught students Robotics and Home Automation during the "Book Free Day" program in Ward 26, Pokhara Metropolitan City.',
      tags: ['Teaching', 'Robotics', 'Community Service', 'Education'],
      link: '#',
    },
    {
      id: 6,
      title: 'Photography Work',
      category: 'photography',
      image: '/projects/photography.jpeg',
      description: 'Mobile photography collection featuring Nepal\'s beautiful landscapes',
      tags: ['Photography', 'Mobile Photography', 'Editing'],
      link: '/index.html',
    },
  ];

  const filters = [
    { id: 'all', label: 'All Projects' },
    { id: 'robotics', label: 'Robotics' },
    { id: 'iot', label: 'IoT' },
    { id: 'volunteering', label: 'Volunteering' },
    { id: 'photography', label: 'Photography' },
  ];

  const filteredProjects = activeFilter === 'all' 
    ? projects 
    : projects.filter(project => project.category === activeFilter);

  return (
    <section id="portfolio" className="section-padding bg-gray-50 dark:bg-gray-800">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-gray-900 dark:text-white">My </span>
            <span className="gradient-text">Portfolio</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Explore my recent work in robotics, IoT, web development, and photography
          </p>
        </motion.div>

        {/* Filter Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                activeFilter === filter.id
                  ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/50'
                  : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </motion.div>

        {/* Projects Grid */}
        <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
          {filteredProjects.map((project, index) => (
            <motion.a
              key={project.id}
              href={project.link}
              target={project.link?.startsWith('http') ? '_blank' : '_self'}
              rel={project.link?.startsWith('http') ? 'noopener noreferrer' : undefined}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-xl card-hover cursor-pointer"
            >
              {/* Project Image */}
              <div className="relative h-64 bg-gradient-to-br from-primary-400 to-purple-600 overflow-hidden">
                <img 
                  src={project.image} 
                  alt={project.title}
                  className="absolute inset-0 w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback to gradient if image not found
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-all duration-300 flex items-center justify-center">
                  <span className="px-6 py-3 bg-white text-gray-900 rounded-full font-semibold transform scale-0 group-hover:scale-100 transition-transform duration-300">
                    View Project
                  </span>
                </div>
              </div>

              {/* Project Info */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {project.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
