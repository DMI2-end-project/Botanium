<template>
  <header class="flex items-center justify-between fixed z-50 w-full p-4">
    <RoundButton v-if="!logBookStore.isClosable" :color="COLOR.YELLOW"
                 @click="router.push({name: mainStore.role === ROLE.STUDENT ? 'Home' : 'Dashboard'})">
      <Home/>
    </RoundButton>
    <RoundButton v-if="logBookStore.isClosable" :color="COLOR.RED" @click="closeElements">
      <Cross/>
    </RoundButton>
    <Info class="z-10" :key="logBookStore.currentStep" :audio-path="getAudio()" :text="getInstruction()"/>
    <button @click="disconnect" class="block">Déconnexion</button>
  </header>
  <main class="w-screen h-screen bg-cover bg-texture-green">

    <!--The <slot> element is a slot outlet that indicates where the "VIEW" content should be rendered.-->
    <slot></slot>
  </main>
</template>

<script lang="ts">
import {defineComponent} from 'vue'
import {useRouter} from "vue-router";
import {getSocket} from "../client";
import {useMainStore} from "../stores/mainStore";
import {useLogBookStore} from "../stores/logBookStore";
import {DatabaseManagerInstance} from "../common/DatabaseManager";
import {useGameStore} from "../stores/gameStore";
import RoundButton from "../components/common/RoundButton.vue";
import Info from "../components/common/Info.vue";
import {COLOR, LOGBOOK_STEP, ROLE} from "../common/Constants";
import Home from "../assets/svg/ico-home.svg?component";
import Speaker from "../assets/svg/ico-speaker.svg?component";
import Cross from "../assets/svg/ico-cross.svg?component";

export default defineComponent({
  name: 'LogBookLayout',
  components: {
    RoundButton,
    Info,
    Home,
    Speaker,
    Cross
  },
  data() {
    return {
      mainStore: useMainStore(),
      logBookStore: useLogBookStore(),
      gameStore: useGameStore(),
      router: useRouter(),
      socket: getSocket(),
      pb: DatabaseManagerInstance.pb
    }
  },
  computed: {
    COLOR() {
      return COLOR
    },
    ROLE() {
      return ROLE
    }
  },
  methods: {
    DatabaseManagerInstance() {
      return DatabaseManagerInstance
    },
    disconnect() {
      this.socket.disconnect();
      this.pb.authStore.clear();
      this.mainStore.reset();
      this.gameStore.reset();
      this.router.push({
        name: 'Login'
      });
    },
    closeElements() {
      this.logBookStore.closeElements = true
      this.logBookStore.isClosable = false
    },
    getInstruction() {
      switch (this.logBookStore.currentStep) {
        case LOGBOOK_STEP.OPEN_BOOK:
          return 'Commence par ouvrir le carnet de bord';
        case LOGBOOK_STEP.SELECT_ACTION:
          return 'Clique sur un élément';
        case LOGBOOK_STEP.ADD_PAGE:
          return 'Ajoute une page au carnet de bord pour commencer !';
        case LOGBOOK_STEP.SELECT_PAGE:
          return 'Choisis une page parmi les trois présentées';
          break;
        case LOGBOOK_STEP.ADD_PHOTO:
          return 'Très bon choix ! Commençons par ajouter une photo.';
          break;
        case LOGBOOK_STEP.WRITE_OR_DRAW:
          return 'Tu souhaites écrire ou dessiner ?';
          break;
        case LOGBOOK_STEP.DRAW:
          return 'C’est parti, dessine ce que tu souhaites nous montrer !';
          break;
        case LOGBOOK_STEP.WRITE:
          return 'Super ! Et si on écrivait quelque chose ?';
          break;
        case LOGBOOK_STEP.SELECT_STICKER:
          return 'Choisis un autocollant !'
          break;
        case LOGBOOK_STEP.SIGN_DRAW:
          return 'Tu peux maintenant signer ton dessin';
          break;
        case LOGBOOK_STEP.SIGN_WRITE:
          return 'Qui a vécu ce souvenir au jardin ?';
          break;
        default:
          return '';
          break;
      }
    },
    getAudio() {
      switch (this.logBookStore.currentStep) {
        case LOGBOOK_STEP.ADD_PAGE:
          return '/audio/add-page-V1.mp3';
          break;
        case LOGBOOK_STEP.SELECT_PAGE:
          return '/audio/page-choice-V1.mp3';
          break;
        case LOGBOOK_STEP.ADD_PHOTO:
          return '/audio/add-photo-V1.mp3';
          break;
        case LOGBOOK_STEP.WRITE_OR_DRAW:
          return '/audio/write-or-draw-V1.mp3';
          break;
        case LOGBOOK_STEP.DRAW:
          return '/audio/draw-V1.mp3';
          break;
        case LOGBOOK_STEP.WRITE:
          return '/audio/write-V1.mp3';
          break;
        case LOGBOOK_STEP.SIGN_DRAW:
          return '/audio/signature-drawing-V1.mp3';
          break;
        case LOGBOOK_STEP.SIGN_WRITE:
          return '/audio/signature-writing-V1.mp3';
          break;
        default:
          return '/audio/add-page-V1.mp3';
          break;
      }
    }
  }
});
</script>

<style lang="scss" scoped>

</style>
