/**
 * Generate a browser fingerprint for unique visitor identification
 * This helps prevent duplicate counts even if localStorage is cleared
 */
export const generateFingerprint = async (): Promise<string> => {
  const components: string[] = [];

  // Screen resolution
  components.push(`${window.screen.width}x${window.screen.height}`);
  components.push(`${window.screen.colorDepth}`);

  // Timezone
  components.push(Intl.DateTimeFormat().resolvedOptions().timeZone);

  // Language
  components.push(navigator.language);

  // Platform
  components.push(navigator.platform);

  // User agent
  components.push(navigator.userAgent);

  // Hardware concurrency
  components.push(String(navigator.hardwareConcurrency || 0));

  // Device memory (if available)
  if ('deviceMemory' in navigator) {
    components.push(String((navigator as any).deviceMemory));
  }

  // Canvas fingerprint
  try {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (ctx) {
      canvas.width = 200;
      canvas.height = 50;
      ctx.textBaseline = 'top';
      ctx.font = '14px Arial';
      ctx.fillStyle = '#f60';
      ctx.fillRect(125, 1, 62, 20);
      ctx.fillStyle = '#069';
      ctx.fillText('Hello, world!', 2, 15);
      ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
      ctx.fillText('Hello, world!', 4, 17);
      components.push(canvas.toDataURL());
    }
  } catch (e) {
    // Canvas fingerprinting failed
  }

  // WebGL fingerprint
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl') as WebGLRenderingContext | null;
    if (gl) {
      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
      if (debugInfo) {
        components.push(gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL));
        components.push(gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL));
      }
    }
  } catch (e) {
    // WebGL fingerprinting failed
  }

  // Create hash of all components
  const fingerprint = await hashString(components.join('|||'));
  return fingerprint;
};

/**
 * Simple hash function for creating fingerprint
 */
const hashString = async (str: string): Promise<string> => {
  // Use SubtleCrypto API if available
  if (window.crypto && window.crypto.subtle) {
    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(str);
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      return hashHex;
    } catch (e) {
      // Fallback to simple hash
    }
  }

  // Fallback: simple hash function
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(36);
};

/**
 * Get or create a persistent visitor ID
 */
export const getVisitorId = (): string => {
  const STORAGE_KEY = 'portfolio_visitor_id';
  
  // Check localStorage
  let visitorId = localStorage.getItem(STORAGE_KEY);
  
  if (!visitorId) {
    // Generate new visitor ID
    visitorId = `v_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    localStorage.setItem(STORAGE_KEY, visitorId);
  }
  
  return visitorId;
};

/**
 * Check if visitor has been counted
 */
export const hasBeenCounted = (): boolean => {
  const COUNTED_KEY = 'portfolio_visitor_counted';
  const lastCounted = localStorage.getItem(COUNTED_KEY);
  
  if (!lastCounted) {
    return false;
  }
  
  // Check if last count was within 24 hours
  const lastCountedTime = parseInt(lastCounted);
  const now = Date.now();
  const ONE_DAY = 24 * 60 * 60 * 1000;
  
  return (now - lastCountedTime) < ONE_DAY;
};

/**
 * Mark visitor as counted
 */
export const markAsCounted = (): void => {
  const COUNTED_KEY = 'portfolio_visitor_counted';
  localStorage.setItem(COUNTED_KEY, Date.now().toString());
};
