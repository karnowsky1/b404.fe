import { authedRequest, setAuthToken } from './login';
import { AUTH_TOKEN_KEY } from '../utils';

const tokenValue = 'token';

beforeEach(() => {
  setAuthToken(undefined);
});

test('setAuthToken saves token to localStorage', () => {
  setAuthToken(tokenValue);

  const authToken = localStorage.getItem(AUTH_TOKEN_KEY);
  expect(authToken).toBe(tokenValue);
});

test('authedRequest throws error when authToken is undefined', () => {
  const request = authedRequest(() => () => {});

  expect(() => {
    request();
  }).toThrow();
});

test('authedRequest works when authToken is defined', () => {
  const mockCallback = jest.fn(() => {});
  const request = authedRequest(() => mockCallback);

  setAuthToken(tokenValue);
  request();
  expect(mockCallback.mock.calls.length).toBeGreaterThan(0);
});
