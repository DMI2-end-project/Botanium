<script setup lang="ts">
import {ref} from "vue";
import {useRouter} from "vue-router";
import {DatabaseManagerInstance} from "../common/DatabaseManager";
import {useMainStore} from "../stores/mainStore";
import {getSocket, connectClient} from "../client";
import {ROLE} from "../common/Constants";

const email = ref();
const password = ref();

const router = useRouter();
const pb = DatabaseManagerInstance.pb;

const store = useMainStore();

// TODO : roomId from classroom

const socket = getSocket();
const login = async () => {
  try {
    await store.fetchRoles();

    const authData = await pb.collection('person').authWithPassword(
        email.value,
        password.value,
    );

    if (pb.authStore.isValid) {
      store.roomId = '2023';
      store.roleId = pb.authStore.model?.role;

      switch (store.role) {
        case ROLE.TEACHER:
          await connectClient();
          await router.push({
            name: 'Dashboard'
          });
          break;
        case ROLE.STUDENT:
          await connectClient();
        case ROLE.PARENT:
          await router.push({
            name: 'Home'
          });
          break;
      }
    }
  } catch (e) {
    console.log('error', e)
  }
}

</script>
<template>
  <div>
    <h1>Login</h1>
    <form @submit.prevent="login">
      <label for="email">Adresse email :</label>
      <input type="email" name="email" v-model="email" autocomplete="email">
      <label for="password">Mot de passe :</label>
      <input type="password" name="password" v-model="password" autocomplete="password">
      <button type="submit">Se connecter</button>
    </form>
  </div>
</template>
<style scoped>

</style>
