import axios, { AxiosResponse, AxiosError } from 'axios';
import { IUser, RandomUserResponse, ApiError } from '../types/types';
import { transformRandomUser } from './helpers';

// Configuration
const API_CONFIG = {
  RANDOM_USER_API_URL: 'https://randomuser.me/api/',
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  NUMBER_OF_USERS: 10,
  TIMEOUT: 10000,
} as const;

// Create axios instances with proper configuration
const createApiClient = (baseURL: string) => {
  return axios.create({
    baseURL,
    timeout: API_CONFIG.TIMEOUT,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

const userClient = createApiClient(API_CONFIG.API_URL);
const randomUserClient = createApiClient(API_CONFIG.RANDOM_USER_API_URL);

// Error handling utility
const handleApiError = (error: unknown, defaultMessage: string): never => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;
    const responseData = axiosError.response?.data as any;
    const message = responseData?.message || axiosError.message || defaultMessage;
    throw new Error(message);
  }
  throw new Error(defaultMessage);
};

// Random Users API
const getRandomUsers = async (): Promise<IUser[]> => {
  try {
    const response: AxiosResponse<RandomUserResponse> = await randomUserClient.get(
      `/?results=${API_CONFIG.NUMBER_OF_USERS}`
    );
    
    return response.data.results.map(transformRandomUser);
  } catch (error) {
    throw handleApiError(error, 'Failed to fetch random users. Please try again.');
  }
};

// User Management API
const getAllUsers = async (): Promise<IUser[]> => {
  try {
    const response: AxiosResponse<IUser[]> = await userClient.get('/users');
    return response.data;
  } catch (error) {
    throw handleApiError(error, 'Failed to fetch users. Please try again.');
  }
};

const getUserById = async (id: string): Promise<IUser> => {
  try {
    const response: AxiosResponse<IUser> = await userClient.get(`/users/${id}`);
    return response.data;
  } catch (error) {
    throw handleApiError(error, 'Failed to fetch user. Please try again.');
  }
};

const saveUser = async (user: IUser): Promise<IUser> => {
  try {
    const response: AxiosResponse<IUser> = await userClient.post('/users', user);
    return response.data;
  } catch (error) {
    throw handleApiError(error, 'Failed to save user. Please try again.');
  }
};

const updateUser = async (id: string, user: Partial<IUser>): Promise<IUser> => {
  try {
    const response: AxiosResponse<IUser> = await userClient.put(`/users/${id}`, user);
    return response.data;
  } catch (error) {
    throw handleApiError(error, 'Failed to update user. Please try again.');
  }
};

const deleteUser = async (id: string): Promise<void> => {
  try {
    await userClient.delete(`/users/${id}`);
  } catch (error) {
    throw handleApiError(error, 'Failed to delete user. Please try again.');
  }
};

export const userAPI = {
  getRandomUsers,
  getAllUsers,
  getUserById,
  saveUser,
  updateUser,
  deleteUser,
} as const;

// Export types for external use
export type { ApiError };



