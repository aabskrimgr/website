import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FaEdit, FaImage, FaProjectDiagram } from 'react-icons/fa';

export default function AdminUpdate() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // Replace these URLs with your actual Google Forms URLs
  const forms = [
    {
      title: 'Update Profile Information',
      description: 'Update your bio, skills, and personal details',
      icon: <FaEdit className="text-4xl" />,
      formUrl: 'YOUR_GOOGLE_FORM_URL_FOR_PROFILE',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      title: 'Add New Portfolio Project',
      description: 'Add new projects to your portfolio section',
      icon: <FaProjectDiagram className="text-4xl" />,
      formUrl: 'YOUR_GOOGLE_FORM_URL_FOR_PROJECTS',
      color: 'from-purple-500 to-pink-500',
    },
    {
      title: 'Upload Photos & Gallery',
      description: 'Add new photography work to your gallery',
      icon: <FaImage className="text-4xl" />,
      formUrl: 'YOUR_GOOGLE_FORM_URL_FOR_PHOTOS',
      color: 'from-green-500 to-teal-500',
    },
  ];

  return (
    <section className="section-padding bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-gray-900 dark:text-white">Admin </span>
            <span className="gradient-text">Updates</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Easily update your portfolio content through Google Forms. No coding required!
          </p>
        </motion.div>

        <div ref={ref} className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {forms.map((form, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="group"
            >
              <div className="relative bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 hover:scale-105 h-full flex flex-col">
                {/* Gradient Background */}
                <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${form.color}`}></div>
                
                {/* Icon */}
                <div className={`mb-6 text-transparent bg-clip-text bg-gradient-to-r ${form.color}`}>
                  {form.icon}
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  {form.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 flex-grow">
                  {form.description}
                </p>

                {/* Button */}
                <a
                  href={form.formUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-block w-full text-center px-6 py-3 bg-gradient-to-r ${form.color} text-white rounded-xl font-semibold transition-all duration-300 transform hover:shadow-lg`}
                >
                  Open Form
                </a>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Instructions Card */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12 bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 p-6 rounded-xl"
        >
          <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
            📝 How to Set Up Google Forms
          </h4>
          <div className="text-gray-700 dark:text-gray-300 space-y-2">
            <p className="font-semibold">Follow these steps to enable content updates:</p>
            <ol className="list-decimal list-inside space-y-1 ml-4">
              <li>Create Google Forms for each update category (Profile, Projects, Photos)</li>
              <li>Set up form fields to collect the data you want to update</li>
              <li>Connect forms to Google Sheets for data storage</li>
              <li>Update the <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">formUrl</code> values in the code with your actual form URLs</li>
              <li>Optionally, use Google Apps Script or a backend service to automatically update your website when forms are submitted</li>
            </ol>
            <p className="mt-4 text-sm italic">
              💡 Tip: You can use services like Zapier or Make (Integromat) to automatically push form submissions to your website or CMS.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
