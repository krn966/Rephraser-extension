/**
 * Shared visual feedback utility functions
 */

import { VISUAL_FEEDBACK } from '../constants.js';

/**
 * Flash an element with a highlight color
 * @param {HTMLElement} element - Element to flash
 */
export function flashElement(element) {
  if (!element) return;
  
  const originalColor = element.style.backgroundColor;
  element.style.backgroundColor = VISUAL_FEEDBACK.HIGHLIGHT_COLOR;
  
  setTimeout(() => {
    element.style.backgroundColor = originalColor;
  }, VISUAL_FEEDBACK.HIGHLIGHT_DURATION);
}

/**
 * Show a temporary notification
 * @param {string} message - Message to show
 * @param {string} type - Type of notification (success, error, info)
 * @param {number} duration - Duration in milliseconds
 */
export function showNotification(message, type = 'info', duration = 3000) {
  // Create notification element
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 12px 20px;
    border-radius: 4px;
    color: white;
    font-family: Arial, sans-serif;
    font-size: 14px;
    z-index: 10000;
    opacity: 0;
    transition: opacity 0.3s ease;
    max-width: 300px;
    word-wrap: break-word;
  `;
  
  // Set background color based on type
  switch (type) {
    case 'success':
      notification.style.backgroundColor = '#4caf50';
      break;
    case 'error':
      notification.style.backgroundColor = '#f44336';
      break;
    case 'info':
    default:
      notification.style.backgroundColor = '#2196f3';
      break;
  }
  
  notification.textContent = message;
  document.body.appendChild(notification);
  
  // Show notification
  setTimeout(() => {
    notification.style.opacity = '1';
  }, 100);
  
  // Hide notification
  setTimeout(() => {
    notification.style.opacity = '0';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, duration);
} 