export const ROUTE_NAMES = {
    HOME: 'Home',
    RANDOM_USERS: 'RandomUsers',
    HISTORY: 'History',
    USER_PROFILE: 'UserProfile',
    NOT_FOUND: 'NotFound'
  } as const;

export interface Profile {
  firstName: string;
  lastName: string;
  email: string;
  bio?: string;
  avatar?: string;
}

export interface IUser {
  id?: string;
  _id: string;
  name: {
    title: string;
    first: string;
    last: string;
  };
  email: string;
  phone: string;
  gender: string;
  picture: {
    thumbnail: string;
    large: string;
  };
  location: {
    country: string;
    city: string;
    state: string;
  };
  dob: {
    date: string;
    age: number;
  };
}

export interface RandomUserResponse {
  results: Array<{
    id: { name: string; value: string };
    email: string;
    [key: string]: any;
  }>;
}

export interface ApiError {
  message: string;
  status?: number;
}