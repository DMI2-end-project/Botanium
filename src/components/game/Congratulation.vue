<script setup lang="ts">
import {computed} from "vue";
import {loadFull} from "tsparticles";

import {useGameStore} from "../../stores/gameStore";
import {useMainStore} from "../../stores/mainStore";
import {AUDIO, COLOR, ROLE, SIZE} from "../../common/Constants";
import {GameMasterManagerInstance} from "../../common/GameMasterManager"
import {AudioManagerInstance} from "../../common/AudioManager";
import RoundButton from "../common/RoundButton.vue";
import RoundItemVue from "../common/RoundItem.vue";

import Trophy from "./../../assets/svg/ico-trophy.svg?component";
import Arrow from "./../../assets/svg/ico-arrow.svg?component";

const mainStore = useMainStore();
const gameStore = useGameStore();

const particlesInit = async (engine: any) => {
  await loadFull(engine);
};

const particlesLoaded = async (container: any) => {
  console.log("Particles container loaded", container);
};

if (mainStore.role === ROLE.TEACHER) {
  AudioManagerInstance.play(AUDIO.VICTORY);
}

const currentSection = computed<any>(() => {
  return gameStore.data?.gameSequences[gameStore.currentSequence];
});

const text = () => {
  if (!currentSection.value.congratulation && gameStore.currentSequence < gameStore.data?.gameSequences.length - 1) {
    gameStore.currentSequence += 1;
    /*
    while (!this.currentSection.gamemaster && this.gameStore.currentSequence < this.data?.gameSequences.length && this.mainStore.role === ROLE.TEACHER) {
          this.gameStore.currentSequence += 1;
          console.log('currentSequence', this.gameStore.currentSequence);
        }

    return currentSection?.gamemaster.instruction;
     */
  }
  return gameStore.data?.gameSequences[gameStore.currentSequence].congratulation?.text
}

const next = () => {
  GameMasterManagerInstance.backChapter();
}

const options = {
  fullScreen: {
    zIndex: 1
  },
  emitters: [
    {
      position: {
        x: 0,
        y: 30
      },
      rate: {
        quantity: 5,
        delay: 0.15
      },
      particles: {
        move: {
          direction: "top-right",
          outModes: {
            top: "none",
            left: "none",
            default: "destroy"
          }
        }
      }
    },
    {
      position: {
        x: 100,
        y: 30
      },
      rate: {
        quantity: 5,
        delay: 0.15
      },
      particles: {
        move: {
          direction: "top-left",
          outModes: {
            top: "none",
            right: "none",
            default: "destroy"
          }
        }
      }
    }
  ],
  particles: {
    color: {
      value: [
        "#fb6f4a",
        "#2BD885",
        "#e8ada4",
        "#9b85ff",
        "#edbd56",
        "#85a754",
        "#fefbe9"
      ]
    },
    move: {
      decay: 0.05,
      direction: "top",
      enable: true,
      gravity: {
        enable: true
      },
      outModes: {
        top: "none",
        default: "destroy"
      },
      speed: {
        min: 20,
        max: 70
      }
    },
    number: {
      value: 0
    },
    opacity: {
      value: 1
    },
    rotate: {
      value: {
        min: 0,
        max: 360
      },
      direction: "random",
      animation: {
        enable: true,
        speed: 30
      }
    },
    tilt: {
      direction: "random",
      enable: true,
      value: {
        min: 0,
        max: 360
      },
      animation: {
        enable: true,
        speed: 30
      }
    },
    size: {
      value: {
        min: 0,
        max: 7
      },
      animation: {
        enable: true,
        startValue: "min",
        count: 1,
        speed: 16,
        sync: true
      }
    },
    roll: {

      enable: true,
      speed: {
        min: 5,
        max: 15
      }
    },
    wobble: {
      distance: 30,
      enable: true,
      speed: {
        min: -7,
        max: 7
      }
    },
    shape: {
      type: [
        "circle",
      ],
      options: {
        polygon: [
          {
            sides: 5
          },
          {
            sides: 6
          }
        ]
      }
    }
  }
};

</script>

<template>
  <div class="relative flex flex-col items-center text-beige text-center -mt-16">
    <Particles class="fixed top-0 left-0 right-0 bottom-0"
               id="tsparticles"
               :particlesInit="particlesInit"
               :particlesLoaded="particlesLoaded"
               :options="options"
    />
    <RoundItemVue :size="SIZE.LG" :color="COLOR.YELLOW" class="absolute translate-y-1/2">
      <Trophy class="w-14 aspect-square"/>
    </RoundItemVue>
    <div
        class="w-full min-h-[200px] max-h-[300px] flex flex-col justify-center items-center gap-6 bg-green rounded-md p-10 pt-20">
      <h1>Incroyable !</h1>
      <p>{{ text() }}</p>
    </div>
    <RoundButton v-if="mainStore.role === ROLE.TEACHER" @click="next" :color="gameStore.data?.colorButton"
                 class="mt-8 text-lg font-bold">
      <Arrow class="rotate-180"/>
    </RoundButton>
  </div>
</template>
