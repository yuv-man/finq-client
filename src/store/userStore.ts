import { defineStore } from 'pinia';
import { ref } from 'vue';
import { IUser } from '../types/types';

export const useUserStore = defineStore('user', () => {
  const users = ref<IUser[]>([]);
  const isRandomPage = ref(false);

  const setUsers = (newUsers: IUser[]) => {
    users.value = newUsers;
  };

  const setIsRandomPage = (isRandom: boolean) => {
    isRandomPage.value = isRandom;
  };

  const removeUser = (userId: string) => {
    users.value = users.value.filter(user => user._id !== userId);
  };

  return {
    users,
    isRandomPage,
    setUsers,
    setIsRandomPage,
    removeUser
  };
}); 