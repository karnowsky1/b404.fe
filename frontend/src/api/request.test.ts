import { request, setAuthToken } from './request';
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

test('request throws error when authToken is undefined', () => {
  expect(() => {
    request({ route: '' });
  }).toThrow();
});
