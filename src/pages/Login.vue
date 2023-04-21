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
      let classRoom = undefined; // TODO add active=true state in request
      store.roleId = pb.authStore.model?.role;
      console.log('login role', pb.authStore.model?.role, store.roleId)

      switch (store.role) {
        case ROLE.TEACHER:
          classRoom = await pb.collection('classroom').getFirstListItem(`owner="${pb.authStore.model?.id}"`);
          store.roomId = classRoom?.id;
          await connectClient();
          await router.push({
            name: 'Dashboard'
          });
          break;
        case ROLE.STUDENT:
          classRoom = await pb.collection('classroom').getFirstListItem(`students.id="${pb.authStore.model?.id}"`);
          store.roomId = classRoom?.id;
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
      <button type="submit" class="bg-secondary">Se connecter</button>
    </form>
    <h1>h1 title</h1>
    <h2>h2 title</h2>
    <h3>h3 title</h3>
    <h4>h4 title</h4>
    <p class="bold">p.bold text</p>
    <p>p text</p>
    <a href="#">a link</a>
  </div>
</template>
<style scoped>

</style>
