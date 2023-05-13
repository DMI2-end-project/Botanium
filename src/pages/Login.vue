<script setup lang="ts">
import {onBeforeMount, onMounted, ref} from "vue";
import {useRouter} from "vue-router";
import {getSocket, connectClient} from "../client";
import {DatabaseManagerInstance} from "../common/DatabaseManager";
import {ROLE} from "../common/Constants";
import {useMainStore} from "../stores/mainStore";

const email = ref();
const password = ref();

const router = useRouter();
const pb = DatabaseManagerInstance.pb;
const socket = getSocket();

const store = useMainStore();

const login = async () => {
  try {
    store.roles = await DatabaseManagerInstance.fetchRoles();

    const authData = await pb.collection('person').authWithPassword(
      email.value,
      password.value,
    );

    if (pb.authStore.isValid) {
      let classRoom = undefined; // TODO add active=true state in request
      store.roleId = pb.authStore.model?.role;

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
  <div class="bg-green-medium w-full h-full">
    <h1>Login</h1>
    <form @submit.prevent="login">
      <label for="email">Adresse email :</label>
      <input type="email" name="email" v-model="email" autocomplete="email">
      <label for="password">Mot de passe :</label>
      <input type="password" name="password" v-model="password" autocomplete="password">
      <button type="submit" class="bg-secondary">Se connecter</button>
    </form>
  </div>
</template>
<style scoped>

</style>
