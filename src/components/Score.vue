<template>
  <transition name="fade" mode="out-in">
    <div class="score capture-flag" v-if="showCapture" key="flag">
      <h2>You have captured the flag!</h2>
    </div>
    <div class="score" v-else key="score">
      <div class="score-title" v-if="points" >Your score: <span>{{ flags.length }} x 🏳️</span></div>
      <div class="score-points" v-if="points">
        <i-count-up
          :start="points"
          :end="points"
          :decimals="0"
          :duration="5"
          :options="options"
        ></i-count-up>
      </div>
    </div>
  </transition>
</template>

<script>
import config from 'config/config.js';
import store from 'store';
import delay from 'nanodelay';

import ICountUp from 'vue-countup-v2';


export default {
  components: {
    ICountUp
  },
  data() {
    return {
      showCapture: false,
      flags: store.user.flags,
      options: {
        useEasing: false,
        useGrouping: false,
        separator: ',',
        decimal: '.',
        prefix: '',
        suffix: '',
      },
    }
  },
  props: ['counter'],
  computed: {
    points() {
      return _.floor(store.user.points);
    },
  },
  mounted() {
    store.captureFlag = this.captureFlag;
  },
  watch: {
    counter(newFlags, oldFlags) {
      if((newFlags > oldFlags) && !store.firstLoad) this.captureFlag();
    },
  },
  methods: {
    captureFlag() {
      this.showCapture = true;
      delay(3000).then(() => { this.showCapture = false })
    },
  },
};
</script>

<style lang="scss" scoped>
  .fade-enter-active {
    transition: opacity .5s
  }

  .fade-enter, .fade-leave-to {
    opacity: 0
  }

  .capture-flag {
    background-image: radial-gradient(ellipse farthest-side at 50% 0%, #2da04d, rgba(178,0,0,0));
    h2 {
      font-size: 28px;
      text-transform: uppercase;
    }
  }

  .score {
    position: absolute;
    top: 0;
    color: #fff;
    width: 450px;
    left: 50%;
    transform: translate(-50%);
    text-align: center;
    padding: 20px 20px 50px;

    &-title {
      color: #555;
      font-size: 12px;
      span {
        color: #eee;
      }
    }

    &-points {
      font-size: 34px;
      padding: 5px;
    }
  }
</style>