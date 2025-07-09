import axios from 'axios';
import {Platform} from 'react-native';
import Config from 'react-native-config';
import DeviceInfo from 'react-native-device-info';

const API_BASE_URL = 'http://192.168.1.83:3300/';
// const API_BASE_URL = 'https://movies.mindiii.com/';

const apiInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    accept: 'application/json',

    'device-type': Platform.OS === 'android' ? 'android' : 'ios',
    'api-key': 'NtE]yUS%tF7eqAePNT6|WWlQxhJQNgb8,)M*|y8y59HkAv6nZs',
  },
  timeout: 10000,
});

apiInstance.interceptors.request.use(
  async config => {
    const deviceId = await DeviceInfo.getUniqueId();
    config.headers['device-id'] = deviceId;
    config.headers['device-token'] = deviceId;
    console.log('Request interceptor --->', {
      url: config.url,
      method: config.method,
      headers: config.headers,
      data: config.data,
      params: config.params,
    });

    // You can also modify headers or attach tokens here if needed
    // Example: config.headers.Authorization = `Bearer ${token}`;

    return config;
  },
  error => {
    console.error('Request Error --->', error);
    return Promise.reject(error);
  },
);

apiInstance.interceptors.response.use(
  response => {
    console.log('Response interceptor ---->', response);
    return response;
  },
  error => {
    const errorData = error?.response?.data;
    console.log('Error is ----->', error?.response?.data);

    if (errorData?.message) {
      if (
        errorData.error_type === 'SESSION_EXPIRED' ||
        errorData.error_type === 'item_discard'
      ) {
        return error;
      }
      alert(errorData.message);
    } else if (error?.response?.data.code == 100) {
      alert('Oops! Something went wrong. Please try again.');
    } else if (error?.response?.data.code == 101) {
      alert('Your device is not supported. Please update your app.');
    } else if (error?.response?.data.code == 102) {
      alert('We’re having trouble connecting. Please try again later.');
    } else if (error?.response?.data.code == 103) {
      alert('Please login to mySK first!');
    } else if (error?.response?.data.code == 104) {
      alert('Your session has expired. Please log in again.');
    } else if (error?.response?.data.code == 105) {
      alert('Please check the information you entered.');
    } else if (error?.response?.data.code == 106) {
      alert("Server error. We're fixing it. Please try again later.");
    } else if (error?.response?.data.code == 107) {
      alert('We couldn’t find your account. Please sign up or try again.');
    } else if (error?.response?.data.code == 108) {
      alert('Your account is temporarily blocked. Please contact support.');
    } else if (error?.response?.data.code == 109) {
      alert('Social login failed. Please try again or use another method.');
    } else if (error?.response?.data.code == 110) {
      alert('Invalid option selected. Please choose again.');
    } else if (error?.response?.data.code == 111) {
      alert(
        'Something’s wrong with the content. Please refresh and try again.',
      );
    } else if (error?.response?.data.code == 112) {
      alert('This email is already registered. Try logging in.');
    } else if (error?.response?.data.code == 113) {
      alert('Couldn’t send the email. Please try again.');
    } else if (error?.response?.data.code == 114) {
      alert('Too many attempts. Please wait a while before trying again.');
    } else if (error?.response?.data.code == 115) {
      alert('Incorrect email or password. Please check and try again.');
    } else if (error?.response?.data.code == 116) {
      alert('This code has already been used.');
    } else if (error?.response?.data.code == 118) {
      alert('The code you entered is incorrect. Please try again.');
    } else {
      if (
        errorData?.error_type === 'SESSION_EXPIRED' ||
        errorData?.error_type === 'item_discard'
      ) {
        return error;
      }
      alert('Something went wrong, Please try again later.');
    }

    return Promise.reject(error);
  },
);

// export const get = async ({url, params}) => {
//   const response = await apiInstance.get(url, {params});
//   return response.data;
// };

export const get = async ({url, params, token}) => {
  console.log('Token get ------->', token);

  const headers = {
    'access-token': token || '',
  };

  console.log('Headers ----->', headers);

  const response = await apiInstance.get(url, {
    params,
    headers,
  });

  return response.data;
};

// export const post = async ({url, data}) => {
//   const response = await apiInstance.post(url, data);
//   return response.data;
// };

export const post = async ({ url, params, token }) => {
  console.log('Token post ------->', token);

  const headers = {
    'access-token': token || '',
  };

  console.log('Headers ----->', headers);

  const response = await apiInstance.post(url, params, {
    headers,
  });

  return response.data;
};

export const put = async ({url, data}) => {
  const response = await apiInstance.put(url, data);
  return response.data;
};

export const del = async url => {
  const response = await apiInstance.delete(url);
  return response.data;
};

export default apiInstance;
