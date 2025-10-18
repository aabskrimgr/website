import { FaHeart } from 'react-icons/fa';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="container-custom px-6">
        <div className="text-center">
          <p className="flex items-center justify-center gap-2 text-gray-400">
            © {currentYear} Created With 
            <FaHeart className="text-primary-500 animate-pulse" /> 
            By{' '}
            <a
              href="https://github.com/aabskrimgr"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-500 hover:text-primary-400 transition-colors font-semibold"
            >
              Aabiskar
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
