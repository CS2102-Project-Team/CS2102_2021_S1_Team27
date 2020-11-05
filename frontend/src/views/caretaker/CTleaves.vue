<template>
  <div class = "main">
  <!-- <el-container
    v-show="CTLeavesFetched"
    style="height: 100%; width:100%; border: 1px solid #eee"
    > -->
  <el-container
    style="height: 100%; width:100%; border: 1px solid #eee"
    >
    <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
       <FTsidebar />
    </el-aside>
    <el-container>
        <el-main>
            <!-- ftct means full-time caretaker -->
            <el-card class="ftct_leaves">
                <div slot="header" class="clearfix">
                    <span>My Leave Applications</span>
                </div>
                <!-- added in max height for the table -->
                <el-table
                  :data = "leavesapplied"
                  max-height="250"
                  border
                  empty-text= "empty"
                  :key = "leaveTableKey"
                  >
                    <el-table-column
                        label = "start date"
                        prop = "startdate"
                        sortable
                        >
                    </el-table-column>
                    <el-table-column
                        label = "end date"
                        prop = "enddate"
                        sortable
                        >
                    </el-table-column>
                    <el-table-column
                        label = "status"
                        prop = "status"
                        sortable
                        >
                    </el-table-column>
                </el-table>
            </el-card>
            <el-card class="ftct_applyleaves">
                <div slot="header" class="clearfix">
                    <span>Apply Leaves</span>
                    <!-- <el-button type="text" @click="addPCBtn"
                      :disabled = "addedPetTypes.length === 3"
                      style="float: right; padding: 3px 0">
                      Add Pet Category
                    </el-button> -->
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

                  <el-button type="primary" @click="addLeaveBtn"
                      :disabled = "dates === ''"
                      style="float: right;">
                      Apply
                    </el-button>

                <el-dialog title="Apply for leaves" :visible.sync="applyLeaveVisible"
                  @close = "closeDialog"  >
                  <el-form :model="data" ref="applyLeaves" class= "applyLeaves">
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
                    @click="addLeaveDialogBtn">
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
// NOTE the way how addedPetTypes is maintained is very bad(dependent on a lot of functions)
// whether addPetCategory button is disabled is also very dependent on addedPetTypes(length === 3)
// will see how
// TODO add Loading signs for all buttons
import {
  getCareTakerLeaves, updateCareTakerLeaves,
} from '@/api/caretaker';
import lang from 'element-ui/lib/locale/lang/en';
import locale from 'element-ui/lib/locale';
import FTsidebar from './component/FTsidebar.vue';

locale.use(lang);

export default {
  components: { FTsidebar },
  data() {
    // eslint-disable-next-line no-var
    // var vm = this;
    return {
      leavesapplied: [],
      CTLeavesFetched: false,
      applyLeaveVisible: false,
      formLabelWidth: '120px',
      // use componentkey to re-render the table when there is a change in orders
      leaveTableKey: 0,
      dates: [],
      data: {
        startdate: '',
        enddate: '',
      },
      pickerOptions: {
        disabledDate(time) {
          const oneDay = 1000 * 3600 * 24;

          // console.log(date);
          return (time.getTime() + oneDay < Date.now());
          // || (vm.leavesapplied === [] ? false : vm.leavesapplied.includes(date));
        },
      },
    };
  },
  methods: {
    getCTLeaves() {
      getCareTakerLeaves().then((response) => {
        const { data } = response;
        this.leavesapplied = data;
        this.CTLeavesFetched = true;
        this.leaveTableKey += 1;
        // console.log(this.leavesapplied);
      }).catch((error) => {
        this.$message.error(error.response.data.error);
      });
    },
    addLeaveBtn() {
      this.applyLeaveVisible = true;
      const [startdate, enddate] = this.dates;
      this.data.startdate = startdate;
      this.data.enddate = enddate;
    },
    addLeaveDialogBtn() {
      updateCareTakerLeaves(this.data).then(() => {
        getCareTakerLeaves().then((response) => {
          const { data } = response;
          this.leavesapplied = data;
          this.CTLeavesFetched = true;
          this.leaveTableKey += 1;
          this.$message.success('successfully applied a leave');
        }).catch((error) => {
          this.$message.error(error.response.data.error);
        });
        this.closeDialog();
      }).catch((error) => {
        // console.log(error);
        this.$message.error(error.response.data.error);
      });
    },
    closeDialog() {
      this.applyLeaveVisible = false;
    },
    // logData() {
    //   console.log('pending orders');
    //   console.log(this.pendingorders);
    //   console.log('pet category');
    //   console.log(this.petcategory);
    // },
  },
  beforeMount() {
    this.getCTLeaves();
  },
};

</script>

<style>

</style>
