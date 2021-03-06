<template>
  <div class="leaderboard" v-if="users.length" :class="{'leaderboard-dashboard': dashboard }">
    <h2>Leaderboard</h2>
     <transition-group name="flip-list" tag="ul" class="leaderboard--users">
      <li class="leader" v-for="(item, index) in users" v-bind:key="index">
        <div v-bind:class="item.class" v-bind:style="{ color: item.owner }">
          <span class="leader-number">#{{ index + 1 }}</span>
          <span class="leader-owner">{{ item.name }}</span>
          <span class="leader-points">
            <i-count-up
              :start="item.time"
              :end="item.time"
              :decimals="0"
              :duration="timer"
              :options="options"
            ></i-count-up>
      </span>
        </div>
      </li>
    </transition-group>
  </div>
</template>

<script>
import config from 'config/config.js';
import store from 'store';
import _ from 'lodash';


import ICountUp from 'vue-countup-v2';


export default {
  components: {
    ICountUp,
  },
  data () {
    return {
      users: [],
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
  props: {
    timer: Number,
    size: Number,
    dashboard: Boolean,
  },
  created() {
    this.fetchData('leaderboard');
    setInterval(() => this.fetchData('leaderboard'), config.timeout);
  },
  methods: {
    fetchData(url, options = {}) {
      return fetch(`${config.url}/v1/${url}/`, options)
        .catch((val) => console.log(val))
        .then(res => res.json())
        .then(this.updateLeaders);
    },
    updateLeaders(leaders) {
      if (!this.dashboard) store.user.points = _.get(_.find(leaders, { owner: store.user.color }), 'time', 0);

      this.users = _(leaders)
        .slice(0, this.size)
        .map((value, key) => {
          value.time = _.floor(value.time);
          value.class = `leader-index-${key + 1}`;
        
          return value;
        }).value();
    }
  }
};
</script>


<style lang="scss" scoped>
  .flip-list-move {
    transition: transform 1s;
  }

  .leaderboard {
    position: absolute;
    top: 20px;
    right: 20px;
    color: #fff;
    min-width: 200px;

    &--users {
      margin-top: 10px;
    }
    
    h2 {
      text-align: center;
    }

    .leader {
      display: table;
      font-weight: normal;
      font-size: 12px;
      line-height: 1.3;

      span {
        display: table-cell;
        width: 100%;
      }

      &-owner {
        text-align: left;
        overflow: hidden;
        min-width: 150px;
      }
      &-points {
        text-align: right;
      }
      &-number {
        padding-right: 10px;
      }
    }

    @for $i from 1 through 10 {
      .leader-index-#{$i} {
        opacity: 1.1 - 0.1 * $i;
      }
    } 

    &.leaderboard-dashboard {
      h2 {
        margin-bottom: 2rem;
      }
      .leaderboard--users {
        padding: 0 4rem;
      }
      .leader {
        font-size: 1rem;
        width: 100%;
        &-number {
          width: 40px;
        }
        &-owner {
          padding: 0 20px;
        }
      }
    }
  }
</style>