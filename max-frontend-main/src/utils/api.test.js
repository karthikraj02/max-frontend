import { getApiBaseUrl } from './api';

describe('getApiBaseUrl', () => {
  const originalApiUrl = process.env.REACT_APP_API_URL;
  const originalBackendUrl = process.env.REACT_APP_BACKEND_URL;

  afterEach(() => {
    process.env.REACT_APP_API_URL = originalApiUrl;
    process.env.REACT_APP_BACKEND_URL = originalBackendUrl;
  });

  it('normalizes REACT_APP_API_URL without /api suffix', () => {
    process.env.REACT_APP_API_URL = 'https://api.example.com/';
    expect(getApiBaseUrl()).toBe('https://api.example.com/api');
  });

  it('keeps REACT_APP_API_URL when /api is already present', () => {
    process.env.REACT_APP_API_URL = 'https://api.example.com/api';
    expect(getApiBaseUrl()).toBe('https://api.example.com/api');
  });

  it('uses REACT_APP_BACKEND_URL when REACT_APP_API_URL is absent', () => {
    delete process.env.REACT_APP_API_URL;
    process.env.REACT_APP_BACKEND_URL = 'https://backend.example.com';
    expect(getApiBaseUrl()).toBe('https://backend.example.com/api');
  });

  it('falls back to local backend on localhost', () => {
    delete process.env.REACT_APP_API_URL;
    delete process.env.REACT_APP_BACKEND_URL;
    expect(getApiBaseUrl()).toBe('http://localhost:5000/api');
  });
});
