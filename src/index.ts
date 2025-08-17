/**
 * Main entry point for the Enhanced Person Card
 */

// Import and export the main EnhancedPersonCard class
export { EnhancedPersonCard } from './enhanced-person-card';

// Ensure the custom element is registered when this module is loaded
import './enhanced-person-card';

console.info('%c ENHANCED-PERSON-CARD-TS INDEX %c Loaded successfully %c', 
  'background: #1976d2; color: white; padding: 2px 6px; border-radius: 3px 0 0 3px; font-weight: bold;', 
  'background: #388e3c; color: white; padding: 2px 6px; border-radius: 0 3px 3px 0; font-weight: bold;', 
  'background: transparent;');
