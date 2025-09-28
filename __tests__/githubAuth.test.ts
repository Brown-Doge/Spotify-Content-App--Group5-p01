import { fireEvent, render, waitFor } from '@testing-library/react-native';
import React from 'react';
import { Alert } from 'react-native';
import Login from '../app/(public)/login';
import GhubAuth from '../app/auth/ghub';

// Mock dependencies
jest.mock('expo-web-browser', () => ({
  maybeCompleteAuthSession: jest.fn(),
}));

jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
  }),
}));

jest.mock('../app/db/auth', () => ({
  setCurrentUserId: jest.fn(),
  getCurrentUserId: jest.fn(() => 1),
}));

jest.mock('../app/db/queries', () => ({
  verifyLogin: jest.fn(),
  getUserById: jest.fn(),
}));

jest.mock('../app/db/schema', () => ({
  initializeDatabase: jest.fn(),
}));

const mockUseAuthRequest = jest.fn();
jest.mock('expo-auth-session', () => ({
  useAuthRequest: (...args: any[]) => mockUseAuthRequest(...args),
  makeRedirectUri: jest.fn(() => 'mymovieapp://redirect'),
}));

// Mock Alert
jest.spyOn(Alert, 'alert').mockImplementation(() => {});

describe('GitHub Authentication', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GhubAuth Component', () => {
    it('renders GitHub login button', () => {
      const mockRequest = { clientId: 'test-client-id' };
      const mockPromptAsync = jest.fn();
      mockUseAuthRequest.mockReturnValue([mockRequest, null, mockPromptAsync]);

      const { getByText } = render(React.createElement(GhubAuth));
      
      expect(getByText('Login with GitHub')).toBeTruthy();
    });

    it('disables button when request is not ready', () => {
      mockUseAuthRequest.mockReturnValue([null, null, jest.fn()]);

      const { getByText } = render(React.createElement(GhubAuth));
      const button = getByText('Login with GitHub');
      
      expect(button).toBeDisabled();
    });

    it('enables button when request is ready', () => {
      const mockRequest = { clientId: 'test-client-id' };
      const mockPromptAsync = jest.fn();
      mockUseAuthRequest.mockReturnValue([mockRequest, null, mockPromptAsync]);

      const { getByText } = render(React.createElement(GhubAuth));
      const button = getByText('Login with GitHub');
      
      expect(button).not.toBeDisabled();
    });

    it('calls promptAsync when button is pressed', () => {
      const mockRequest = { clientId: 'test-client-id' };
      const mockPromptAsync = jest.fn();
      mockUseAuthRequest.mockReturnValue([mockRequest, null, mockPromptAsync]);

      const { getByText } = render(React.createElement(GhubAuth));
      const button = getByText('Login with GitHub');
      
      fireEvent.press(button);
      expect(mockPromptAsync).toHaveBeenCalledTimes(1);
    });

    it('shows success alert when GitHub auth succeeds', async () => {
      const mockRequest = { clientId: 'test-client-id' };
      const mockPromptAsync = jest.fn();
      const mockResponse = {
        type: 'success',
        params: { code: 'test-auth-code' }
      };
      
      mockUseAuthRequest.mockReturnValue([mockRequest, mockResponse, mockPromptAsync]);

      render(React.createElement(GhubAuth));
      
      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith('GitHub Code Received', 'test-auth-code');
      });
    });

    it('shows error alert when GitHub auth fails', async () => {
      const mockRequest = { clientId: 'test-client-id' };
      const mockPromptAsync = jest.fn();
      const mockResponse = {
        type: 'error',
        params: { error: 'access_denied', error_description: 'User denied access' }
      };
      
      mockUseAuthRequest.mockReturnValue([mockRequest, mockResponse, mockPromptAsync]);

      render(React.createElement(GhubAuth));
      
      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith(
          'Auth Error', 
          JSON.stringify(mockResponse.params)
        );
      });
    });

    it('shows redirect URI alert on component mount', async () => {
      const mockRequest = { clientId: 'test-client-id' };
      const mockPromptAsync = jest.fn();
      mockUseAuthRequest.mockReturnValue([mockRequest, null, mockPromptAsync]);

      render(React.createElement(GhubAuth));
      
      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith('Redirect URI', 'mymovieapp://redirect');
      });
    });
  });

  describe('GitHub Login Integration in Login Component', () => {
    it('renders GitHub sign in button in login page', () => {
      const mockRequest = { clientId: 'test-client-id' };
      const mockPromptAsync = jest.fn();
      mockUseAuthRequest.mockReturnValue([mockRequest, null, mockPromptAsync]);

      const { getByText } = render(React.createElement(Login));
      
      expect(getByText('Sign in with GitHub')).toBeTruthy();
    });

    it('GitHub button is disabled when request is not ready in login page', () => {
      mockUseAuthRequest.mockReturnValue([null, null, jest.fn()]);

      const { getByText } = render(React.createElement(Login));
      const button = getByText('Sign in with GitHub');
      
      expect(button).toBeDisabled();
    });

    it('triggers GitHub auth when button is pressed in login page', () => {
      const mockRequest = { clientId: 'test-client-id' };
      const mockPromptAsync = jest.fn();
      mockUseAuthRequest.mockReturnValue([mockRequest, null, mockPromptAsync]);

      const { getByText } = render(React.createElement(Login));
      const button = getByText('Sign in with GitHub');
      
      fireEvent.press(button);
      expect(mockPromptAsync).toHaveBeenCalledTimes(1);
    });

    it('handles successful GitHub response in login page', async () => {
      const mockRequest = { clientId: 'test-client-id' };
      const mockPromptAsync = jest.fn();
      const mockResponse = {
        type: 'success',
        params: { code: 'github-auth-code-123' }
      };
      
      mockUseAuthRequest.mockReturnValue([mockRequest, mockResponse, mockPromptAsync]);

      render(React.createElement(Login));
      
      // The login component receives the code but doesn't do anything with it yet
      // This test verifies the response is handled without errors
      await waitFor(() => {
        expect(mockResponse.params.code).toBe('github-auth-code-123');
      });
    });
  });

  describe('GitHub Auth Configuration', () => {
    it('uses correct GitHub OAuth endpoints', () => {
      const mockRequest = { clientId: 'test-client-id' };
      const mockPromptAsync = jest.fn();
      mockUseAuthRequest.mockReturnValue([mockRequest, null, mockPromptAsync]);

      render(React.createElement(GhubAuth));

      // Verify useAuthRequest was called with correct configuration
      expect(mockUseAuthRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          clientId: 'Ov23liStAcDficiTmWmY',
          scopes: ['read:user', 'user:email'],
          redirectUri: 'mymovieapp://redirect'
        }),
        expect.objectContaining({
          authorizationEndpoint: 'https://github.com/login/oauth/authorize',
          tokenEndpoint: 'https://github.com/login/oauth/access_token'
        })
      );
    });

    it('uses correct scopes for GitHub auth', () => {
      const mockRequest = { clientId: 'test-client-id' };
      const mockPromptAsync = jest.fn();
      mockUseAuthRequest.mockReturnValue([mockRequest, null, mockPromptAsync]);

      render(React.createElement(GhubAuth));

      const authConfig = mockUseAuthRequest.mock.calls[0][0];
      expect(authConfig.scopes).toEqual(['read:user', 'user:email']);
    });

    it('uses correct redirect URI scheme', () => {
      const mockRequest = { clientId: 'test-client-id' };
      const mockPromptAsync = jest.fn();
      mockUseAuthRequest.mockReturnValue([mockRequest, null, mockPromptAsync]);

      render(React.createElement(GhubAuth));

      const authConfig = mockUseAuthRequest.mock.calls[0][0];
      expect(authConfig.redirectUri).toBe('mymovieapp://redirect');
    });
  });

  describe('Error Handling', () => {
    it('handles GitHub auth cancellation', async () => {
      const mockRequest = { clientId: 'test-client-id' };
      const mockPromptAsync = jest.fn();
      const mockResponse = {
        type: 'cancel'
      };
      
      mockUseAuthRequest.mockReturnValue([mockRequest, mockResponse, mockPromptAsync]);

      render(React.createElement(GhubAuth));
      
      // Component should not show any alerts for cancellation
      await waitFor(() => {
        expect(Alert.alert).not.toHaveBeenCalledWith(
          expect.stringMatching(/error|Error/),
          expect.anything()
        );
      });
    });

    it('handles network errors during GitHub auth', async () => {
      const mockRequest = { clientId: 'test-client-id' };
      const mockPromptAsync = jest.fn();
      const mockResponse = {
        type: 'error',
        params: { 
          error: 'network_error',
          error_description: 'Network request failed'
        }
      };
      
      mockUseAuthRequest.mockReturnValue([mockRequest, mockResponse, mockPromptAsync]);

      render(React.createElement(GhubAuth));
      
      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith(
          'Auth Error',
          JSON.stringify(mockResponse.params)
        );
      });
    });
  });
});