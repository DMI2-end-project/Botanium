<script setup lang="ts">
import {inject, ref} from "vue";
import {useRouter} from "vue-router";
import PocketBase from "pocketbase";

const email = ref();
const password = ref();

const pb: PocketBase | undefined = inject('pb');
const router = useRouter();

const login = async () => {
  console.log('login', email.value, password.value);

  if (pb) {
    const authData = await pb.collection('person').authWithPassword(
        email.value,
        password.value,
    );

    if (pb.authStore.isValid) {
      console.log(pb.authStore.token);
      // console.log(pb.authStore.model.id);
      /*
      * TODO :
      *  - Stocker la connexion
      *  - Push to '/'
       */
      await router.push('/dashboard')
    }
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
