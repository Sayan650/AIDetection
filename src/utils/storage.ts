import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage keys
const STORAGE_KEYS = {
  ONBOARDING_COMPLETED: 'onboarding_completed',
} as const;

// Onboarding state management
export const onboardingStorage = {
  /**
   * Check if onboarding has been completed
   * @returns Promise<boolean> - true if onboarding is completed
   */
  async isCompleted(): Promise<boolean> {
    try {
      const value = await AsyncStorage.getItem(STORAGE_KEYS.ONBOARDING_COMPLETED);
      return value === 'true';
    } catch (error) {
      console.error('Error checking onboarding completion:', error);
      return false;
    }
  },

  /**
   * Mark onboarding as completed
   * @returns Promise<void>
   */
  async setCompleted(): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.ONBOARDING_COMPLETED, 'true');
    } catch (error) {
      console.error('Error setting onboarding completion:', error);
      throw error;
    }
  },

  /**
   * Reset onboarding state (useful for testing)
   * @returns Promise<void>
   */
  async reset(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.ONBOARDING_COMPLETED);
    } catch (error) {
      console.error('Error resetting onboarding state:', error);
      throw error;
    }
  },
};

// Generic storage utilities
export const storage = {
  /**
   * Store a value with a key
   * @param key - Storage key
   * @param value - Value to store (will be JSON stringified)
   * @returns Promise<void>
   */
  async setItem<T>(key: string, value: T): Promise<void> {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (error) {
      console.error(`Error storing item with key ${key}:`, error);
      throw error;
    }
  },

  /**
   * Retrieve a value by key
   * @param key - Storage key
   * @returns Promise<T | null> - Parsed value or null if not found
   */
  async getItem<T>(key: string): Promise<T | null> {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error(`Error retrieving item with key ${key}:`, error);
      return null;
    }
  },

  /**
   * Remove an item by key
   * @param key - Storage key
   * @returns Promise<void>
   */
  async removeItem(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing item with key ${key}:`, error);
      throw error;
    }
  },

  /**
   * Clear all stored data
   * @returns Promise<void>
   */
  async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Error clearing storage:', error);
      throw error;
    }
  },
};