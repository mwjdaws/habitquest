
// This is a barrel file that re-exports everything from the new modules
// to maintain backward compatibility with existing imports

export * from './habitTypes';
export * from './habitUtils';

// Re-export from the new API modules
export * from './api/apiUtils';
export * from './api/habit'; // Updated to use the new habit module
export * from './api/completionAPI';
export * from './api/failureAPI';
export * from './api/trendAPI';
export * from './api/taskAPI';
export * from './taskTypes';
