import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FaBriefcase, FaGraduationCap, FaHandsHelping } from 'react-icons/fa';

export default function Resume() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const experience = [
    {
      period: 'Mar 2025 - Present',
      title: 'Executive Member | Robotics Club, IOE WRC',
      description: 'Oversee and guide technical development across ongoing projects and events.',
    },
    {
      period: 'Mar 2024 - Mar 2025',
      title: 'General Member | Robotics Club, IOE WRC',
      description: 'Developed award-winning Micromouse robot using maze-solving algorithms. Coordinated a 15-day "Rainy Session" workshop, training 100+ students in robotics.',
    },
  ];

  const education = [
    {
      period: '2023 - Present',
      title: 'B.E Computer Engineering (Third Year)',
      description: "Currently studying Bachelor in Computer Engineering at WRC, Pokhara under IOE, TU.",
    },
    {
      period: '2020 - 2022',
      title: 'High School',
      description: 'Completed high school from AmarSingh Secondary School, Pokhara',
    },
  ];

  const volunteering = [
    {
      period: '2024 - 2025',
      title: 'Rainy Session & Robo Rookies Instructor | Robotics Club',
      description: 'Worked as an instructor for Rainy Session and Robo Rookies programs, training students in robotics fundamentals and hands-on projects.',
    },
    {
      period: '2025',
      title: 'Robotics Mentor | AAKAR Foundation',
      description: 'Taught students Robotics and Home Automation during the "Book Free Day" program in Ward 26, Pokhara Metropolitan City.',
    },
  ];

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <section id="resume" className="section-padding bg-white dark:bg-gray-900">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-gray-900 dark:text-white">My </span>
            <span className="gradient-text">Resume</span>
          </h2>
        </motion.div>

        <div ref={ref} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Experience Card */}
          <motion.div
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.2,
                },
              },
            }}
            className="bg-gray-50 dark:bg-gray-800 p-8 rounded-2xl shadow-xl"
          >
            <div className="flex items-center gap-3 mb-8">
              <FaBriefcase className="text-3xl text-primary-600" />
              <h4 className="text-2xl font-bold text-gray-900 dark:text-white">
                Experience
              </h4>
            </div>

            <div className="space-y-6">
              {experience.map((item, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="border-l-4 border-primary-500 pl-6 py-4"
                >
                  <h6 className="text-primary-600 dark:text-primary-500 font-bold mb-2">
                    {item.period}
                  </h6>
                  <p className="font-semibold text-gray-900 dark:text-white mb-2">
                    {item.title}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {item.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Education Card */}
          <motion.div
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.2,
                },
              },
            }}
            className="bg-gray-50 dark:bg-gray-800 p-8 rounded-2xl shadow-xl"
          >
            <div className="flex items-center gap-3 mb-8">
              <FaGraduationCap className="text-3xl text-primary-600" />
              <h4 className="text-2xl font-bold text-gray-900 dark:text-white">
                Education
              </h4>
            </div>

            <div className="space-y-6">
              {education.map((item, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="border-l-4 border-purple-500 pl-6 py-4"
                >
                  <h6 className="text-purple-600 dark:text-purple-500 font-bold mb-2">
                    {item.period}
                  </h6>
                  <p className="font-semibold text-gray-900 dark:text-white mb-2">
                    {item.title}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {item.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Volunteering Section - Full Width Below */}
        <motion.div
          ref={ref}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.2,
              },
            },
          }}
          className="mt-8 bg-gray-50 dark:bg-gray-800 p-8 rounded-2xl shadow-xl"
        >
          <div className="flex items-center gap-3 mb-8">
            <FaHandsHelping className="text-3xl text-primary-600" />
            <h4 className="text-2xl font-bold text-gray-900 dark:text-white">
              Volunteering
            </h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {volunteering.map((item, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="border-l-4 border-green-500 pl-6 py-4"
              >
                <h6 className="text-green-600 dark:text-green-500 font-bold mb-2">
                  {item.period}
                </h6>
                <p className="font-semibold text-gray-900 dark:text-white mb-2">
                  {item.title}
                </p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
