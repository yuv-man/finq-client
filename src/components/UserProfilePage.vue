
<template>
  <div class="user-page">
    <h1>User Profile</h1>
    <div v-if="!user" class="user-page">
      User not found
    </div>
    <div v-else class="user-content">
      <img :src="user.picture.large" :alt="user.name.first" />
      <div class="user-info">
        <div class="user-name-container">
          <div v-if="isEditing" class="save-user-input">
            <input 
              class="user-name-input" 
              type="text" 
              v-model="name" 
            />
            <div class="save-user-buttons">
              <button @click="saveEdit">Save</button>
              <button @click="cancelEdit">Cancel</button>
            </div>
          </div>
          <div v-else class="user-name">
            <p style="margin-right: 10px">{{ name }}</p>
            <img :src="editIcon" alt="edit" @click="startEdit" />
          </div>
          <p>{{ user.dob.age }} years old | {{ formattedDate }} | {{ user.gender }}</p>
        </div>
        <div class="user-details">
          <p>{{ user.email }}</p>
          <p>{{ user.phone }}</p>
          <p>{{ user.location.city }}, {{ user.location.state }}, {{ user.location.country }}</p> 
        </div>
        <div class="buttons">
          <div class="save-button" v-if="isRandom" @click="saveUser">Save</div>
          <div class="edit-button" v-if="!isRandom" @click="editUser">Edit</div>
          <div class="delete-button" @click="deleteUser">Delete</div>
          <div class="back-button" @click="goBack">Back</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import type { IUser } from '../types/types';
import { useUserStore } from '../store/userStore';
import { userAPI } from '../services/api';
import { useAppToast } from '../composables/useToast';
import editIcon from '../assets/icons/edit.svg';

// Route and router
const route = useRoute();
const router = useRouter();

// Store
const { users, removeUser, setUsers, isRandomPage } = useUserStore();
const { showSuccess, showError } = useAppToast();

// Reactive state
const isEditing = ref(false);
const name = ref('');

// Computed
const user = computed(() => {
  const userId = route.params.id as string;
  return users.find(u => u._id === userId);
});

const isRandom = computed(() => {
  return isRandomPage;
});

const formattedDate = computed(() => {
  if (!user.value) return '';
  return new Date(user.value.dob.date).toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
});

// Methods
const startEdit = () => {
  if (user.value) {
    name.value = `${user.value.name.first} ${user.value.name.last}`;
    isEditing.value = true;
  }
};

const saveEdit = () => {
  if (user.value) {
    editUser();
  }
};

const editUser = () => {
  if (!user.value) return;
  
  const updatedUser: IUser = {
    ...user.value,
    name: {
      title: user.value.name.title,
      first: name.value.split(' ')[0],
      last: name.value.split(' ')[1]
    }
  };
  
  const updatedUsers = users.map(u => u._id === user.value!._id ? updatedUser : u);
  setUsers(updatedUsers);
  isEditing.value = false;
  
  userAPI.updateUser(user.value._id, updatedUser);
  showSuccess('User updated successfully');
};

const saveUser = () => {
  if (!user.value) return;
  
  userAPI.saveUser(user.value);
  showSuccess('User saved successfully');
};

const deleteUser = () => {
  if (!user.value) return;
  
  if (!isRandom.value && user.value._id) {
    userAPI.deleteUser(user.value._id);
  } 
  
  removeUser(user.value._id);
  showSuccess('User deleted successfully');
  
  setTimeout(() => {
    goBack();
  }, 1000);
};

const cancelEdit = () => {
  if (user.value) {
    name.value = `${user.value.name.first} ${user.value.name.last}`;
  }
  isEditing.value = false;
};

const goBack = () => {
  router.go(-1);
};

// Initialize name when user is available
onMounted(() => {
  if (user.value) {
    name.value = `${user.value.name.first} ${user.value.name.last}`;
  }
});
</script>

<style scoped>
.user-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 24px;
  box-sizing: border-box;
  background-color: #f9fafc;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #333;
}

h1 {
  font-size: 2rem;
  margin-bottom: 24px;
  color: #2e5bc4;
}

.user-content {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.05);
  padding: 24px;
  max-width: 600px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.user-content img {
  border-radius: 50%;
  width: 120px;
  height: 120px;
  object-fit: cover;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.user-info {
  width: 100%;
  text-align: center;
}

.user-name-container {
  margin-bottom: 16px;
}

.user-name {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 1.25rem;
  font-weight: 600;
}

.user-name img {
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.user-name-input {
  padding: 10px 14px;
  border: 2px solid #ccc;
  border-radius: 8px;
  font-size: 16px;
  width: 100%;
  max-width: 320px;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.user-name-input:focus {
  border-color: #366ada;
  box-shadow: 0 0 0 3px rgba(54, 106, 218, 0.2);
  outline: none;
}

.save-user-buttons {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 12px;
  flex-wrap: wrap;
}

.save-user-buttons button {
  padding: 10px 18px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 90px;
}

.save-user-buttons button:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
}

.save-user-buttons button:active {
  transform: translateY(0);
}

.save-user-buttons button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.user-details {
  margin: 16px 0;
  line-height: 1.6;
  font-size: 15px;
}

.buttons {
  display: flex;
  justify-content: center;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 20px;
}

.save-button,
.edit-button,
.delete-button,
.back-button {
  padding: 10px 18px;
  border-radius: 6px;
  color: white;
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.save-button {
  background-color: #28a745;
}

.save-button:hover {
  background-color: #218838;
}

.edit-button {
  background-color: #007bff;
}

.edit-button:hover {
  background-color: #0069d9;
}

.delete-button {
  background-color: #dc3545;
}

.delete-button:hover {
  background-color: #c82333;
}

.back-button {
  background-color: #6c757d;
}

.back-button:hover {
  background-color: #5a6268;
}

@media (max-width: 768px) {
  .user-page {
    padding: 16px;
  }

  .save-user-buttons {
    flex-direction: column;
    width: 100%;
  }

  .save-user-buttons button {
    width: 100%;
    max-width: 240px;
  }

  .buttons {
    flex-direction: column;
    align-items: center;
    width: 100%;
  }

  .buttons > div {
    width: 30%;
    text-align: center;
  }
}
</style>
