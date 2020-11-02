<template>
  <div class = "main">
  <!-- <el-container
    v-show="CTAvblFetched"
    style="height: 100%; width:100%; border: 1px solid #eee"
    > -->
  <el-container
    style="height: 100%; width:100%; border: 1px solid #eee"
    >
    <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
       <PTsidebar />
    </el-aside>
    <el-container>
        <el-main>
            <el-card class="ptct_avbl">
                <div slot="header" class="clearfix">
                    <span>My Current Avaliability</span>
                </div>
                <el-calendar>
                  <template
                    slot="dateCell"
                    slot-scope="{data}">
                        <div class="calendar-day">{{ data.day.split('-').slice(2).join('-') }}</div>
                        <p v-if="isAvbl(data.day)"
                          :class = "isAvbl(data.day) ? 'isAvbl' : ''"
                          >
                          available
                        </p>
                        <!-- <div v-if="data.day.split('-').slice(1)[0] == value" >
                        </div> -->
                  </template>
                </el-calendar>
            </el-card>
            <el-card class="ptct_addavbl">
                <div slot="header" class="clearfix">
                    <span>Add Avaliability</span>
                </div>
                <!-- can add in max height for the table -->
                <el-date-picker
                  v-model="dates"
                  type="daterange"
                  range-separator="To"
                  start-placeholder="Start date"
                  end-placeholder="End date"
                  value-format = "yyyy-MM-dd"
                  :picker-options= "pickerOptions"
                  style="float: center;">
                </el-date-picker>

                  <el-button type="primary" @click="addAvblBtn"
                      :disabled = "dates === ''"
                      style="float: right;">
                      Add
                    </el-button>

                <el-dialog title="Add Availability" :visible.sync="addAvblVisible"
                  @close = "closeDialog"  >
                  <el-form :model="data" ref="addavbl" class= "addavbl">
                    <el-form-item
                      label="Start Date"
                      :label-width="formLabelWidth"
                      prop= "startdate"
                      >

                      <el-input v-model="data.startdate" :disabled = "true">
                      </el-input>
                    </el-form-item>
                    <el-form-item
                      label="End Date"
                      :label-width="formLabelWidth"
                      prop= "enddate"
                      >
                      <el-input v-model="data.enddate" :disabled = "true">
                      </el-input>
                    </el-form-item>
                  </el-form>
                  <div slot="footer" class="dialog-footer">
                    <el-button @click="closeDialog">Cancel</el-button>
                    <el-button type="primary"
                    @click="addAvblDialogBtn">
                      Confirm
                    </el-button>
                  </div>
              </el-dialog>
            </el-card>
        </el-main>
    </el-container>
    </el-container>
  </div>
</template>

<script>

import {
  getCareTakerAvaliablity, updateCareTakerAvaliablity,
} from '@/api/caretaker';
import lang from 'element-ui/lib/locale/lang/en';
import locale from 'element-ui/lib/locale';
import PTsidebar from './component/PTsidebar.vue';

locale.use(lang);

export default {
  components: { PTsidebar },
  data() {
    // eslint-disable-next-line no-var
    var vm = this;
    return {
      avblArray: [],
      CTAvblFetched: false,
      addAvblVisible: false,
      formLabelWidth: '120px',
      // use componentkey to re-render the table when there is a change in orders
      avblTableKey: 0,
      dates: '',
      data: {
        startdate: '',
        enddate: '',
      },
      pickerOptions: {
        disabledDate(time) {
          const oneDay = 1000 * 3600 * 24;

          function parseDate(date) {
            const mm = date.getMonth() + 1; // getMonth() is zero-based
            const dd = date.getDate();

            return [date.getFullYear(),
              (mm > 9 ? '' : '0') + mm,
              (dd > 9 ? '' : '0') + dd,
            ].join('-');
          }
          const date = parseDate(time);
          // console.log(date);
          return (time.getTime() + oneDay < Date.now())
            || (vm.avblArray === [] ? false : vm.avblArray.includes(date))
            || (time.getTime() + oneDay > Date.now() + 365 * 2 * oneDay);
        },
      },
    };
  },
  methods: {
    getCTAvbl() {
      getCareTakerAvaliablity().then((response) => {
        const { data } = response;
        this.avblArray = data;
        this.CTAvblFetched = true;
        this.avblTableKey += 1;
        // console.log(this.avblArray);
      }).catch((error) => {
        this.$message.error(error.response.data.error);
      });
    },
    addAvblBtn() {
      this.addAvblVisible = true;
      const [startdate, enddate] = this.dates;
      this.data.startdate = startdate;
      this.data.enddate = enddate;
    },
    addAvblDialogBtn() {
      updateCareTakerAvaliablity(this.data).then(() => {
        getCareTakerAvaliablity().then((response) => {
          const { data } = response;
          this.avblArray = data;
          this.CTAvblFetched = true;
          this.avblTableKey += 1;
          // console.log(this.avblArray);
          this.$message.success('successfully added availability');
        }).catch((error) => {
          this.$message.error(error.response.data.error);
        });
        this.closeDialog();
      }).catch((error) => {
        // console.log(error);
        this.$message.error(error.response.data.error);
      });
    },
    isAvbl(day) {
      return this.avblArray.includes(day);
    },
    closeDialog() {
      this.addAvblVisible = false;
    },
  },
  beforeMount() {
    this.getCTAvbl();
  },
};

</script>

<style>
  .isAvbl {
    color:#009E60;
  }
</style>
