<template>
  <div class="user-card" @click="handleClick">
    <div class="avatar">
      <img :src="user.picture.thumbnail" :alt="`${user.name.first}'s avatar`" />
    </div>
    <div class="info">
      <div class="name-container">
        <h2 class="name">{{ formattedName }}</h2>
        <p class="gender">{{ user.gender }}</p>
        <p class="address">{{ user.location.country }}</p>
      </div>
      <div class="contact-container">
        <p class="email">
          <a :href="`mailto:${user.email}`">{{ user.email }}</a>
        </p>
        <p class="phone">{{ user.phone }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import type { IUser } from '../types/types';

interface Props {
  user: IUser;
  isRandom: boolean;
}

const props = defineProps<Props>();

const router = useRouter();

const formattedName = computed(() => {
  return `${props.user.name.title}. ${props.user.name.last} (${props.user.name.first})`;
});

const handleClick = () => {
  router.push({
    name: 'UserProfile',
    params: { id: props.user._id },
    state: { isRandom: props.isRandom }
  });
};
</script>

<style scoped>
.user-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);
  padding: 20px;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 20px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  max-width: 100%;
  width: 90%;
  margin: 12px auto;
  cursor: pointer;
}

.user-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.12);
}

.avatar {
  flex-shrink: 0;
}

.avatar img {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #e0e0e0;
}

.info {
  flex: 1;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 10px;
}

.name-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.name {
  font-size: 1.25rem;
  font-weight: 600;
  color: #222;
  margin: 0 0 4px;
}

.gender {
  font-size: 0.95rem;
  color: #666;
  text-transform: capitalize;
}

.address {
  font-size: 0.95rem;
  color: #999;
}

.contact-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-end;
  text-align: right;
}

.email,
.phone {
  margin: 3px 0;
  font-size: 0.9rem;
  color: #555;
}

.email a {
  color: #1e88e5;
  text-decoration: none;
  word-break: break-all;
}

.email a:hover {
  text-decoration: underline;
}

.favorite-button {
  padding: 8px 16px;
  border: 1px solid #ccc;
  border-radius: 6px;
  background: #fff;
  cursor: pointer;
  margin: 8px 0;
  transition: all 0.2s ease-in-out;
}

.favorite-button.active {
  background: #fff7d6;
  border-color: #ffc107;
  color: #ff9800;
}

.favorite-button:hover {
  background: #f5f5f5;
}

.favorite-button:hover.active {
  background: #ffe9aa;
}

/* Responsive */
@media (max-width: 600px) {
  .user-card {
    flex-direction: column;
    align-items: flex-start;
    padding: 16px;
  }

  .info {
    flex-direction: column;
    align-items: flex-start;
  }

  .contact-container {
    align-items: flex-start;
    text-align: left;
  }

  .name {
    font-size: 1.1rem;
  }

  .avatar img {
    width: 64px;
    height: 64px;
  }
}

</style>
