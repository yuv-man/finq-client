<template>
  <div class="user-list-container">
    <div class="user-list-header">
      <h1 style="text-align: center; color: darkblue">{{ isRandom ? 'Random Users' : 'Saved Profiles' }}</h1>
    </div>

    <div class="filters">
      <input
        type="text"
        placeholder="Search users by name..."
        v-model="searchTerm"
        class="search-input"
      />
      <input
        type="text"
        placeholder="Filter by country..."
        v-model="countryFilter"
        class="search-input"
      />
    </div>

    <div v-if="isLoading" class="user-list">
      Loading...
    </div>

    <div v-else-if="error" class="user-list error">
      {{ error }}
    </div>

    <div v-else class="user-list">
      <p v-if="filteredUsers.length === 0">No users found</p>
      <UserCard
        v-else
        v-for="user in filteredUsers"
        :key="user._id"
        :user="user"
        :is-random="isRandom"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import UserCard from './UserCard.vue';
import { userAPI } from '../services/api';
import type { IUser } from '../types/types';
import { useUserStore } from '../store/userStore';
import { useAppToast } from '../composables/useToast';

interface Props {
  isRandom: boolean;
}

const props = defineProps<Props>();

const userStore = useUserStore();
const { showSuccess, showError } = useAppToast();

const isLoading = ref(true);
const error = ref<string | null>(null);
const searchTerm = ref('');
const countryFilter = ref('');

const fetchUsers = computed(() => {
  return props.isRandom ? userAPI.getRandomUsers() : userAPI.getAllUsers();
});

const filteredUsers = computed(() => {
  if (userStore.users.length === 0) return [];
  
  return userStore.users.filter(user => {
    const nameMatch = `${user.name.first} ${user.name.last}`
      .toLowerCase()
      .includes(searchTerm.value.toLowerCase());
    const countryMatch = countryFilter.value === '' || 
      user.location.country.toLowerCase().includes(countryFilter.value.toLowerCase());
    return nameMatch && countryMatch;
  });
});

const loadUsers = async () => {
  const shouldFetch = props.isRandom !== userStore.isRandomPage || userStore.users.length === 0;
  
  if (shouldFetch) {
    userStore.setUsers([]);
    try {
      const data: IUser[] = await fetchUsers.value;
      console.log('API response data:', data);
      error.value = null;
      userStore.setUsers(data);
      console.log('Users set in store:', userStore.users);
      isLoading.value = false;
      userStore.setIsRandomPage(props.isRandom);
      showSuccess(`Successfully loaded ${data.length} users`);
    } catch (err: unknown) {
      let errorMessage = 'An unexpected error occurred';
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      error.value = errorMessage;
      isLoading.value = false;
      showError(errorMessage);
    }
  } else {
    isLoading.value = false;
  }
};

onMounted(() => {
  loadUsers();
});

watch(() => props.isRandom, (newIsRandom) => {
  if (newIsRandom !== userStore.isRandomPage) {
    loadUsers();
  }
});
</script>

<style scoped>

.user-list-container {
    background-color: #f0f0f0;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.user-list-header {
    margin-bottom: 20px;
    text-align: center;
}

.filters {
    display: flex;
    justify-content: center;
    gap: 10px;
    margin-bottom: 20px;
}

.user-list {
    max-width: 1200px;
    margin: 0 auto;
    padding: 16px;
    display: table;
    border-collapse: collapse;
}

.user-row {
    display: table-row;
}

.user-row:nth-child(even) {
    background-color: #f8f9fa;
}

.user-row:hover {
    background-color: #f2f2f2;
}

.user-row > * {
    display: table-cell;
    padding: 12px;
    border-bottom: 1px solid #ddd;
}

.user-list.error {
    color: #ff4444;
    text-align: center;
    padding: 20px;
}

.search-input {
    display: block;
    width: 100%;
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 16px;
}

.search-input:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.3);
}

.user-list p {
    text-align: center;
    color: #666;
    font-size: 16px;
    margin: 20px 0;
}

@media (max-width: 768px) {
    .user-list {
        padding: 12px;
        display: block;
    }
    
    .user-list .user-row {
        display: block;
        margin-bottom: 16px;
        border: 1px solid #ddd;
        border-radius: 4px;
    }
    
    .user-list .user-row > * {
        display: block;
        border-bottom: none;
    }
}

</style>
