<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import Hive from "./components/Hive.vue";
import CorrectGuesses from "./components/CorrectGuesses.vue";
import Progress from "./components/Progress.vue";
import YesterdaysAnswers from "./components/YesterdaysAnswers.vue";
import Info from "./components/Info.vue";
import GameWon from "./components/GameWon.vue";
import allAnswers from "../data/allAnswers.json";
import { useMainStore } from "./store";
import { InfoFilled, Calendar, Sunny, Moon } from "@element-plus/icons-vue";

const store = useMainStore();
const showYesterdaysAnswers = ref(false);
const showInfo = ref(false);
const zindex = ref(0);
const gameWonModalShown = ref(false); // only show gameWon modal once
let timer: any;

const darkmode = ref(store.theme === "dark");

const onToggleDarkMode = () => {
  if (darkmode.value === true) {
    store.theme = "dark";
    document.documentElement.classList.add("dark");
  } else {
    store.theme = "light";
    document.documentElement.classList.remove("dark");
  }
};

const showGameWonModal = computed(
  () => store.getProgressPercentage === 100 && gameWonModalShown.value === false
);

let showMigrationModal = ref(false);
const checkUrl = () => {
  showMigrationModal.value = window.location.href.includes(
    "beach-litriochta.netlify.app"
  );
};

const onOpenCorrectGuesses = () => {
  // without clearing timer, if user toggles correct guesses quickly, it will fade to background after timeout
  clearTimeout(timer);
  zindex.value = -1;
};

const onCloseCorrectGuesses = () => {
  timer = setTimeout(() => {
    zindex.value = 0;
  }, 2000);
};

onMounted(onToggleDarkMode);
onMounted(checkUrl);

store.startGame({ allAnswers });
// TODO: extra not in spellingbee: track scores across days
// TODO: add shake animation on incorrect submission?
// https://www.reddit.com/r/webdev/comments/su6y4r/what_animations_are_used_in_wordle/
// need setTimeout to wait for animation before removing guess
</script>

<template>
  <el-dialog v-model="showMigrationModal" title="url migration / ag bogadh url">
    <div>
      <p>
        Ní oibreoidh an url
        <a href="https://beach-litriochta.netlify.app"
          >https://beach-litriochta.netlify.app</a
        >
        ón tseachtain seo chugainn. Bain úsáid as
        <a href="https://beach-litriochta.pages.dev"
          >https://beach-litriochta.pages.dev</a
        >
        ina ionad le do thoil. Gabh mo leithscéal as ucht an bhfógra déanach!
      </p>
      <p>
        The
        <a href="https://beach-litriochta.netlify.app"
          >https://beach-litriochta.netlify.app</a
        >
        url will not work from next week. Please use
        <a href="https://beach-litriochta.pages.dev"
          >https://beach-litriochta.pages.dev</a
        >
        instead. Sorry for the short notice!
      </p>
    </div>
  </el-dialog>
  <el-dialog
    v-model="showGameWonModal"
    @closed="gameWonModalShown = true"
    :title="`${$t('Congratulations')}!`">
    <GameWon />
  </el-dialog>
  <el-dialog v-model="showYesterdaysAnswers" :title="$t('Yesterdays Answers')">
    <YesterdaysAnswers />
  </el-dialog>
  <el-dialog v-model="showInfo" :title="$t('How to play')">
    <Info />
  </el-dialog>
  <div class="common-layout fireworks">
    <div class="beforeFireworks" v-if="showGameWonModal" />
    <div class="afterFireworks" v-if="showGameWonModal" />
    <el-header height="2em" id="title-header">
      <h2>
        <strong> Beach Litríochta </strong>
        <span> {{ store.getGameDateString }} </span>
      </h2>
    </el-header>
    <el-menu mode="horizontal" :ellipsis="false">
      <el-menu-item index="1" @click="showInfo = true">
        <el-tooltip :content="$t('Info')" placement="top">
          <el-icon class="menu-icon">
            <InfoFilled />
          </el-icon>
        </el-tooltip>
        <span class="responsive-menu-text">{{ $t("Info") }}</span>
      </el-menu-item>
      <el-menu-item index="2" @click="showYesterdaysAnswers = true">
        <el-tooltip :content="$t('Yesterdays Answers')" placement="top">
          <el-icon class="menu-icon">
            <Calendar />
          </el-icon>
        </el-tooltip>
        <span class="responsive-menu-text">{{ $t("Yesterdays Answers") }}</span>
      </el-menu-item>
      <el-menu-item index="3">
        <el-select-v2
          style="margin-top: 10px; width: 6em"
          v-model="$i18n.locale"
          :options="['ga', 'en'].map((v) => ({ value: v, label: v }))"
          placeholder="Please select" />
      </el-menu-item>
      <el-menu-item index="4">
        <el-switch
          v-model="darkmode"
          @change="onToggleDarkMode"
          class="darkmode-switch"
          style="--el-switch-on-color: $bl-green"
          inline-prompt
          size="large"
          :active-icon="Sunny"
          :inactive-icon="Moon" />
      </el-menu-item>
    </el-menu>
    <Progress />
    <CorrectGuesses
      @open="onOpenCorrectGuesses"
      @close="onCloseCorrectGuesses" />
    <Hive :ZIndex="zindex" />
  </div>
</template>

<style lang="scss">
@import "element-plus/dist/index.css";
@import "element-plus/theme-chalk/dark/css-vars.css";
@import "./assets/styles/fireworks.scss";
@import "./assets/styles/_variables.scss";

* {
  // stop double tap zoom on safari. often double tap keys in game.
  // TODO: register multiple click events when holding down button?
  // https://stackoverflow.com/a/53236027/6305204
  touch-action: manipulation;
  // https://stackoverflow.com/a/66103439/6305204
  -webkit-tap-highlight-color: transparent;
}

// https://element-plus.org/en-US/guide/theming.html#by-css-variable
:root {
  --el-color-success: $bl-green;
  --el-primary-color: $bl-green;
}

html {
  box-sizing: border-box;
}
*,
*:before,
*:after {
  box-sizing: inherit;
}

// don't allow words to be split. split on space between words
div {
  white-space: pre-wrap;
  word-break: break-word;
}

.darkmode-switch {
  margin-top: 5px;
}

h2 span {
  color: #bebebe;
  font-weight: lighter;
}

.main-container {
  padding-top: 3em;
}

.common-layout {
  max-width: 1000px;
  margin: auto;
}

.el-header h2 {
  padding: 0;
  margin: 0;
}
.el-menu--horizontal {
  border-top: solid 1px var(--el-menu-border-color);
  justify-content: space-between;
  .el-menu-item {
    padding: 0;
  }
  .el-menu-item.is-active {
    color: $bl-green !important;
    border-bottom-color: currentcolor;
  }
}
.is-focused {
  border-color: $bl-green !important;
}
.is-selected {
  color: $bl-green !important;
  &::after {
    color: $bl-green;
    background-color: $bl-green !important;
  }
}
.el-dialog {
  width: 80%;
}
.el-table {
  --el-table-header-bg-color: unset;
}
.el-message--success {
  --el-message-bg-color: unset;
  --el-message-text-color: unset;
  background-color: lighten($bl-green, 50) !important;
  color: $bl-green !important;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 40px;
  padding: 0 10px;

  // account for 10px padding on either side of #app
  max-width: calc(100% - 20px);
  max-height: 100vh;
  #title-header {
    margin: 0;
    padding: 0;
    overflow: hidden;
  }
}

// pangram highlight used in multiple components
.pangram {
  font-weight: bold;
}

.toast-message {
  max-width: 80%;
  margin: 0, 1em;
  margin-top: 25vh;
}

html.dark {
  header strong {
    color: $bl-green;
  }
  .pangram {
    color: $bl-green;
  }
}

@media only screen and (max-width: 700px) {
  #app {
    margin-top: 10px;
  }
  .responsive-menu-text {
    display: none;
  }
  .menu-icon {
    margin: 19px 5px;
  }
}
</style>
