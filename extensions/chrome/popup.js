/**
 * Chrome extension popup script
 */

document.addEventListener('DOMContentLoaded', function() {
  // Check if backend is available
  checkBackendStatus();
});

/**
 * Check if the backend server is running
 */
async function checkBackendStatus() {
  try {
    const response = await fetch('http://localhost:3000/health');
    if (response.ok) {
      console.log('Backend server is running');
    } else {
      showBackendWarning();
    }
  } catch (error) {
    console.log('Backend server is not running');
    showBackendWarning();
  }
}

/**
 * Show warning if backend is not available
 */
function showBackendWarning() {
  const statusElement = document.querySelector('.status');
  if (statusElement) {
    statusElement.innerHTML = '⚠️ Backend server not running<br><small>Please start the backend server</small>';
    statusElement.style.background = '#fff3cd';
    statusElement.style.color = '#856404';
  }
} 