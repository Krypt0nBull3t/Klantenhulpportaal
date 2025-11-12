import { describe, it, expect, beforeEach } from 'vitest';
import { 
  setErrorBag, 
  setMessage, 
  destroyErrors, 
  destroyMessage, 
  getErrorBag, 
  getMessage, 
  getErrorByProperty 
} from '../../resources/js/services/error';

describe('Error Service', () => {
  beforeEach(() => {
    // Clean up before each test
    destroyErrors();
    destroyMessage();
  });

  describe('Error Bag Management', () => {
    it('sets and gets error bag correctly', () => {
      // Arrange
      const testErrorBag = {
        email: ['Email is required', 'Email format is invalid'],
        password: ['Password is too short']
      };

      // Act
      setErrorBag(testErrorBag);

      // Assert
      expect(getErrorBag.value).toEqual(testErrorBag);
    });

    it('gets error by specific property', () => {
      // Arrange
      const testErrorBag = {
        email: ['Email is required', 'Email format is invalid'],
        password: ['Password is too short']
      };
      setErrorBag(testErrorBag);

      // Act
      const emailErrors = getErrorByProperty('email');
      const passwordErrors = getErrorByProperty('password');
      const nonExistentErrors = getErrorByProperty('username');

      // Assert
      expect(emailErrors.value).toEqual(['Email is required', 'Email format is invalid']);
      expect(passwordErrors.value).toEqual(['Password is too short']);
      expect(nonExistentErrors.value).toBeUndefined();
    });

    it('destroys error bag correctly', () => {
      // Arrange
      const testErrorBag = {
        email: ['Email is required'],
        password: ['Password is too short']
      };
      setErrorBag(testErrorBag);
      expect(getErrorBag.value).toEqual(testErrorBag);

      // Act
      destroyErrors();

      // Assert
      expect(getErrorBag.value).toEqual({});
    });

    it('handles empty error bag', () => {
      // Arrange
      setErrorBag({});

      // Act & Assert
      expect(getErrorBag.value).toEqual({});
      expect(getErrorByProperty('email').value).toBeUndefined();
    });
  });

  describe('Message Management', () => {
    it('sets and gets message correctly', () => {
      // Arrange
      const testMessage = 'Login successful!';

      // Act
      setMessage(testMessage);

      // Assert
      expect(getMessage.value).toBe(testMessage);
    });

    it('uses default message when empty string is provided', () => {
      // Act
      setMessage('');

      // Assert
      expect(getMessage.value).toBe('Er is een fout opgetreden.');
    });

    it('uses default message when null is provided', () => {
      // Act
      setMessage(null as unknown as string);

      // Assert
      expect(getMessage.value).toBe('Er is een fout opgetreden.');
    });

    it('uses default message when undefined is provided', () => {
      // Act
      setMessage(undefined as unknown as string);

      // Assert
      expect(getMessage.value).toBe('Er is een fout opgetreden.');
    });

    it('destroys message correctly', () => {
      // Arrange
      setMessage('Test message');
      expect(getMessage.value).toBe('Test message');

      // Act
      destroyMessage();

      // Assert
      expect(getMessage.value).toBe('');
    });
  });

  describe('Reactivity', () => {
    it('error bag computed values update reactively', () => {
      // Arrange
      const initialErrorBag = { email: ['Initial error'] };
      setErrorBag(initialErrorBag);
      const emailErrors = getErrorByProperty('email');

      // Act
      const updatedErrorBag = { email: ['Updated error'], password: ['New password error'] };
      setErrorBag(updatedErrorBag);

      // Assert
      expect(emailErrors.value).toEqual(['Updated error']);
      expect(getErrorBag.value).toEqual(updatedErrorBag);
    });

    it('message computed values update reactively', () => {
      // Arrange
      setMessage('Initial message');
      const messageRef = getMessage;

      // Act
      setMessage('Updated message');

      // Assert
      expect(messageRef.value).toBe('Updated message');
    });
  });

  describe('Edge Cases', () => {
    it('handles complex error bag structures', () => {
      // Arrange
      const complexErrorBag = {
        'user.email': ['User email is required'],
        'user.profile.name': ['Profile name is too long'],
        'items.0.title': ['First item title is missing']
      };

      // Act
      setErrorBag(complexErrorBag);

      // Assert
      expect(getErrorByProperty('user.email').value).toEqual(['User email is required']);
      expect(getErrorByProperty('user.profile.name').value).toEqual(['Profile name is too long']);
      expect(getErrorByProperty('items.0.title').value).toEqual(['First item title is missing']);
    });
  });
});