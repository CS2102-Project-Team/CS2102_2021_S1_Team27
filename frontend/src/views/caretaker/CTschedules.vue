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
            <el-card class="ct_orders">
                <div slot="header" class="clearfix">
                    <span>Current and Future Orders</span>
                </div>
                <!-- added in max height for the table -->
                <el-table
                  :data = "orders"
                  max-height="500"
                  border
                  empty-text= "empty"
                  :key = "ordersTableKey"
                  >
                    <el-table-column
                        fixed
                        label = "start date"
                        prop = "startdate"
                        width = "100">
                    </el-table-column>
                    <el-table-column
                        fixed
                        label = "end date"
                        prop = "enddate"
                        width = "100">
                    </el-table-column>
                    <el-table-column
                        label = "status"
                        prop = "status"
                        width = "130">
                    </el-table-column>
                    <el-table-column
                        label = "pet name"
                        prop = "petname"
                        width = "120">
                    </el-table-column>
                    <el-table-column
                        label = "pet owner"
                        prop = "ownerusername"
                        width = "150">
                    </el-table-column>
                    <el-table-column
                        label = "special requirement"
                        prop = "specialrequirement"
                        width = "300">
                    </el-table-column>
                    <el-table-column
                        label = "pet type"
                        prop = "petcategory"
                        width = "100">
                    </el-table-column>
                    <el-table-column
                        label = "delivery mode"
                        prop = "deliverymode"
                        width = "150">
                    </el-table-column>
                    <el-table-column
                        fixed = "right"
                        label = "action"
                        width = "100">
                        <template slot-scope="scope">
                          <el-button
                            v-if = "scope.row.status.trim() === 'Pending Payment'"
                            @click="paymentReceivedBtn(scope.row)"
                            type = "text"
                            size = "small">
                            Payment Received
                          </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-card>

                <el-dialog title="Confirm Payment Received"
                  :visible.sync="paymentReceivedDialogVisible"
                  @close = "closeDialog"  >
                  <el-form :model="data" ref="paymentReceivedDialog" class= "paymentReceivedDialog">
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
                    <el-form-item
                      label="Pet Name"
                      :label-width="formLabelWidth"
                      prop= "petname"
                      >
                      <el-input v-model="data.petname" :disabled = "true">
                      </el-input>
                    </el-form-item>
                    <el-form-item
                      label="Pet Owner"
                      :label-width="formLabelWidth"
                      prop= "ownerusername"
                      >
                      <el-input v-model="data.ownerusername" :disabled = "true">
                      </el-input>
                    </el-form-item>
                  </el-form>
                  <div slot="footer" class="dialog-footer">
                    <el-button @click="closeDialog">Cancel</el-button>
                    <el-button type="primary"
                    @click="paymentReceivedDialogBtn">
                      Confirm
                    </el-button>
                  </div>
              </el-dialog>
        </el-main>
    </el-container>
    </el-container>
  </div>
</template>

<script>
import {
  getCareTakerOrders, updateCareTakerOrdersPayment,
} from '@/api/caretaker';
import FTsidebar from './component/FTsidebar.vue';
import PTsidebar from './component/PTsidebar.vue';

export default {
  components: { FTsidebar, PTsidebar },
  data() {
    return {
      isPartTime: this.$store.getters.isPartTime,
      orders: [],
      paymentReceivedDialogVisible: false,
      data: {
        startdate: '',
        enddate: '',
        pettype: '',
        ownerusername: '',
      },
      formLabelWidth: '120px',
      CTinforFetched: false,
      // use componentkey to re-render the table when there is a change in orders
      ordersTableKey: 0,
    };
  },
  methods: {
    getCTOrders() {
      getCareTakerOrders(false).then((response) => {
        const { data } = response;
        this.orders = data;
        this.CTinforFetched = true;
      }).catch((error) => {
        this.$message.error(error.response.data.error);
      });
    },
    paymentReceivedBtn(row) {
      this.data.startdate = row.startdate;
      this.data.enddate = row.enddate;
      this.data.pettype = row.pettype;
      this.data.ownerusername = row.ownerusername;
      this.paymentReceivedDialogVisible = true;
    },
    paymentReceivedDialogBtn() {
      // eslint-disable-next-line consistent-return
      updateCareTakerOrdersPayment(this.data).then(() => {
        // loading to false according to indexs
        getCareTakerOrders(true).then((response) => {
          const { data } = response;
          this.orders = data;
          this.$message.success('payment received');
          this.closeDialog();
        }).catch((error) => {
          this.$message.error(error.response.data.error);
        });
      }).catch((error) => {
        this.$message.error(error.response.data.error);
      });
    },
    closeDialog() {
      this.paymentReceivedDialogVisible = false;
      this.data.startdate = '';
      this.data.enddate = '';
      this.data.pettype = '';
      this.data.ownerusername = '';
    },
    // logData() {
    //   console.log('pending orders');
    //   console.log(this.pendingorders);
    //   console.log('pet category');
    //   console.log(this.petcategory);
    // },
  },
  beforeMount() {
    this.getCTOrders();
  },
};

</script>

<style>

</style>
