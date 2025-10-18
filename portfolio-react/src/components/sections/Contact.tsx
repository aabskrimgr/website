import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FaEnvelope, FaMapMarkerAlt, FaGithub, FaTwitter, FaInstagram, FaFacebook, FaLinkedin } from 'react-icons/fa';
import emailjs from '@emailjs/browser';

export default function Contact() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const formRef = useRef<HTMLFormElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Replace these with your actual EmailJS credentials
      // Get them from https://www.emailjs.com/
      await emailjs.sendForm(
        import.meta.env.VITE_EMAILJS_SERVICE_ID || 'YOUR_SERVICE_ID',
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'YOUR_TEMPLATE_ID',
        formRef.current!,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'YOUR_PUBLIC_KEY'
      );
      
      setSubmitStatus('success');
      formRef.current?.reset();
    } catch (error) {
      console.error('Email send error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: <FaEnvelope className="text-2xl" />,
      label: 'Email',
      value: 'aabiskarregmi3@gmail.com',
      href: 'mailto:aabiskarregmi3@gmail.com',
    },
    {
      icon: <FaMapMarkerAlt className="text-2xl" />,
      label: 'Address',
      value: 'Machhapuchchhre-4, Lahachok, Kaski',
      href: null,
    },
  ];

  const socialLinks = [
    { icon: <FaFacebook />, href: 'https://www.facebook.com/abhishequeregmi', label: 'Facebook' },
    { icon: <FaTwitter />, href: 'https://www.twitter.com/_abskr_imgr', label: 'Twitter' },
    { icon: <FaInstagram />, href: 'https://instagram.com/aabiskar_._regmi/', label: 'Instagram' },
    { icon: <FaLinkedin />, href: 'https://www.linkedin.com/in/aabiskar-regmi-611364344/', label: 'LinkedIn' },
    { icon: <FaGithub />, href: 'https://github.com/aabskrimgr', label: 'GitHub' },
  ];

  return (
    <section id="contact" className="section-padding bg-white dark:bg-gray-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary-500 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl"></div>
      </div>

      <div className="container-custom relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-gray-900 dark:text-white">Get In </span>
            <span className="gradient-text">Touch</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Have a project in mind? Let's work together to create something amazing!
          </p>
        </motion.div>

        <div ref={ref} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2"
          >
            <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-2xl shadow-xl">
              <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Send a Message
              </h4>
              
              <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <input
                    type="text"
                    name="user_name"
                    placeholder="Your Name *"
                    required
                    className="w-full px-6 py-4 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <input
                    type="email"
                    name="user_email"
                    placeholder="Your Email *"
                    required
                    className="w-full px-6 py-4 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <textarea
                    name="message"
                    placeholder="Your Message *"
                    rows={6}
                    required
                    className="w-full px-6 py-4 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all resize-none text-gray-900 dark:text-white"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-primary-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>

                {submitStatus === 'success' && (
                  <div className="p-4 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-xl">
                    Message sent successfully! I'll get back to you soon.
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div className="p-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-xl">
                    Failed to send message. Please try again or email me directly.
                  </div>
                )}
              </form>
            </div>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            <div className="bg-gradient-to-br from-primary-500 to-purple-600 p-8 rounded-2xl shadow-xl text-white">
              <h4 className="text-2xl font-bold mb-6">Contact Info</h4>
              
              <div className="space-y-6">
                {contactInfo.map((item, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex-shrink-0">{item.icon}</div>
                    <div>
                      <h6 className="font-semibold mb-1">{item.label}</h6>
                      {item.href ? (
                        <a
                          href={item.href}
                          className="text-white/90 hover:text-white transition-colors"
                        >
                          {item.value}
                        </a>
                      ) : (
                        <p className="text-white/90">{item.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-8 border-t border-white/20">
                <h6 className="font-semibold mb-4">Follow Me</h6>
                <div className="flex gap-4">
                  {socialLinks.map((social, index) => (
                    <a
                      key={index}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 flex items-center justify-center bg-white/20 hover:bg-white/30 rounded-full text-xl transition-all duration-300 hover:scale-110"
                      aria-label={social.label}
                    >
                      {social.icon}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
