<script setup lang="ts">
import {ref} from "vue";
import {useRouter} from "vue-router";
import {DatabaseManagerInstance} from "../common/DatabaseManager";
import {useStore} from "../stores/main";
import {socket} from "../client";
import GAMEROLE from "../constants/GAMEROLE";
import ROLE from "../constants/ROLE";

const email = ref();
const password = ref();

const router = useRouter();
const pb = DatabaseManagerInstance.pb;

const store = useStore();

const roomId = 2023

const login = async () => {
  console.log('login', email.value, password.value);

  try {
    const authData = await pb.collection('person').authWithPassword(
        email.value,
        password.value,
    );
    console.log('pb.authStore', pb.authStore, authData)
    if (pb.authStore.isValid) {
      console.log('role', store.role);

      switch (store.role) {
        case ROLE.TEACHER:
          await socket.connect();
          await socket.emit('join', {
            roomId,
            role: GAMEROLE.GAME_MASTER
          });
          await router.push('/dashboard');
          break;
        case ROLE.STUDENT:
          await socket.connect();
          await socket.emit('join', {
            roomId,
            role: GAMEROLE.GAMER
          });
          await router.push('/');
          break;
        case ROLE.PARENT:
          await router.push('/carnet');
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