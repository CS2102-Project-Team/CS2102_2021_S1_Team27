<template>
  <div class = "main">
  <el-container
    v-show="CTinforFetched"
    style="height: 100%; width:100%; border: 1px solid #eee"
    >
    <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
       <PTsidebar v-show="isPartTime" />
       <FTsidebar v-show="!isPartTime" />
    </el-aside>
    <el-container>
        <el-main>
            <el-card class="ct_stats">
                <div slot="header" class="clearfix">
                    <span>Care Taker Statistics</span>
                </div>
                <div class="ct_stats_body">
                    <el-row>
                        <el-col class = "text item">
                            <span>
                                {{'Total pet day for this month: '+ this.petday}}
                            </span>
                        </el-col>
                        <el-col class = "text item">
                            <span>
                                {{'Expected salary for this month: S$'+ this.salary}}
                            </span>
                        </el-col>
                    </el-row>
                </div>
            </el-card>
        </el-main>
    </el-container>
    </el-container>
  </div>
</template>

<script>
import {
  getCareTakerStats,
} from '@/api/caretaker';
import FTsidebar from './component/FTsidebar.vue';
import PTsidebar from './component/PTsidebar.vue';

export default {
  components: { FTsidebar, PTsidebar },
  data() {
    return {
      isPartTime: this.$store.getters.isPartTime,
      petday: '',
      salary: '',
      CTinforFetched: false,
    };
  },
  methods: {
    getCTStats() {
      getCareTakerStats().then((response) => {
        const { data } = response;
        this.petday = data.petday;
        this.salary = data.salary;
        if (!this.salary) {
          this.salary = 0;
        }
        this.CTinforFetched = true;
      }).catch((error) => {
        this.$message.error(error.response.data.error);
      });
    },
  },
  beforeMount() {
    this.getCTStats();
  },
};

</script>

<style scoped>
  .text {
    font-size: 14px;
  }

  .item {
    padding: 18px 0;
  }
  .ct_stats {
    width: 480px;
    /* float: center; */
  }
</style>
