import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FaCamera, FaCode, FaLaptopCode } from 'react-icons/fa';

export default function About() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // Skills based on GitHub projects
  const technicalSkills = [
    'Arduino', 'C/C++', 'Python', 'Embedded Systems',
    'PID Control', 'Sensor Integration', 'DC Motor Drivers',
    'IoT Development', 'ESP32/ESP8266', 'Robotics',
    'Computer Vision', 'Maze Solving', 'PCB Design',
    'React', 'JavaScript', 'HTML/CSS'
  ];

  const expertise = [
    {
      icon: <FaLaptopCode className="text-4xl" />,
      title: 'IoT Development',
      description: 'Building smart solutions with microcontrollers and sensors',
    },
    {
      icon: <FaCode className="text-4xl" />,
      title: 'Robotics',
      description: 'Designing autonomous robots and embedded systems',
    },
    {
      icon: <FaCamera className="text-4xl" />,
      title: 'Photography',
      description: 'Mobile photography and creative visuals',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <section id="about" className="section-padding bg-gray-50 dark:bg-gray-800">
      <div className="container-custom">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          {/* Who Am I */}
          <motion.div
            variants={itemVariants}
            className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-xl card-hover"
          >
            <h3 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
              Who am I?
            </h3>
            <div className="w-20 h-1 bg-gradient-to-r from-primary-500 to-pink-500 mb-6"></div>
            <h5 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-300">
              Computer Engineering Student & Robotics Enthusiast
            </h5>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              I'm a third-year Computer Engineering student from Nepal with a passion for IoT solutions, autonomous robotics, and embedded systems. I love building intelligent systems that solve real-world problems and bringing innovative ideas to life through technology.
            </p>
          </motion.div>

          {/* Personal Info */}
          <motion.div
            variants={itemVariants}
            className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-xl card-hover"
          >
            <h3 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
              Personal Info
            </h3>
            <div className="w-20 h-1 bg-gradient-to-r from-primary-500 to-pink-500 mb-6"></div>
            <ul className="space-y-3 text-gray-600 dark:text-gray-400">
              <li>
                <span className="font-semibold text-gray-900 dark:text-white">Email:</span> aabiskarregmi3@gmail.com
              </li>
              <li>
                <span className="font-semibold text-gray-900 dark:text-white">Address:</span> Machhapuchchhre-4, Lahachok, Kaski
              </li>
            </ul>
          </motion.div>
        </motion.div>

        {/* Expertise and Skills Section - Side by Side */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8"
        >
          {/* Technical Skills */}
          <motion.div
            variants={itemVariants}
            className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-xl"
          >
            <h4 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
              Technical Skills
            </h4>
            <div className="w-20 h-1 bg-gradient-to-r from-primary-500 to-pink-500 mb-6"></div>
            <div className="flex flex-wrap gap-3 justify-center">
              {technicalSkills.map((skill, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={inView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="px-4 py-2 bg-gradient-to-r from-primary-500 to-pink-500 text-white rounded-full text-sm font-medium shadow-lg hover:shadow-xl hover:scale-105 transition-all cursor-default"
                >
                  {skill}
                </motion.span>
              ))}
            </div>
          </motion.div>

          {/* My Expertise */}
          <motion.div
            variants={itemVariants}
            className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-xl card-hover"
          >
            <h3 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
              My Expertise
            </h3>
            <div className="w-20 h-1 bg-gradient-to-r from-primary-500 to-pink-500 mb-6"></div>
            <div className="space-y-6">
              {expertise.map((item, index) => (
                <div key={index} className="flex gap-4">
                  <div className="text-primary-600 dark:text-primary-500 flex-shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <h6 className="font-semibold text-gray-900 dark:text-white mb-2">
                      {item.title}
                    </h6>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
