/**
 * Simple logging utility
 */
class Logger {
  static info(message, data = null) {
    const timestamp = new Date().toISOString();
    console.log(`[INFO] ${timestamp}: ${message}`);
    if (data) {
      console.log(JSON.stringify(data, null, 2));
    }
  }
  
  static error(message, error = null) {
    const timestamp = new Date().toISOString();
    console.error(`[ERROR] ${timestamp}: ${message}`);
    if (error) {
      console.error(error);
    }
  }
  
  static warn(message, data = null) {
    const timestamp = new Date().toISOString();
    console.warn(`[WARN] ${timestamp}: ${message}`);
    if (data) {
      console.warn(JSON.stringify(data, null, 2));
    }
  }
}

module.exports = Logger; 