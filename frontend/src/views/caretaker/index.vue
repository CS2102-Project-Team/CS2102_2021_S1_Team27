<template>
  <div class = "main">
  <el-container style="height: 100%; width:100%; border: 1px solid #eee">
    <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
        <el-menu >
        <el-menu-item index="1">
            <template slot="title"><i class="el-icon-message"></i>Care Taker Home</template>
        </el-menu-item>
        <el-menu-item index="2">
            <template slot="title"><i class="el-icon-menu"></i>View My Schedule</template>
        </el-menu-item>
        <el-menu-item index="3">
            <template slot="title"><i class="el-icon-setting"></i>View My Orders</template>
        </el-menu-item>
        <el-menu-item index="4">
            <template slot="title"><i class="el-icon-setting"></i>Apply For Leaves</template>
        </el-menu-item>
        <el-menu-item index="5">
            <template slot="title"><i class="el-icon-setting"></i>View My Statistics</template>
        </el-menu-item>
        </el-menu>
    </el-aside>
    <el-container>
        <el-main>
            <!-- ct refers to care taker -->
            <el-card class="ct_info">
                <div slot="header" class="clearfix">
                    <span>Care Taker Information</span>
                </div>
                <div class="ct_info_body">
                    <el-row>
                        <el-col>
                            <span>
                                {{'Type: '+ this.type}}
                            </span>
                        </el-col>
                        <el-col>
                            <span>
                                {{'Rating: '+ this.rating}}
                            </span>
                        </el-col>
                    </el-row>
                </div>
            </el-card>
            <!-- ptct means part-time caretaker -->
            <el-card class="ptct_orders" v-show="isPartTime">
                <div slot="header" class="clearfix">
                    <span>Pending Orders</span>
                </div>
                <!-- added in max height for the table -->
                <el-table :data = "pendingorders" max-height="250" border>
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
                        label = "pet name"
                        prop = "petname"
                        width = "120">
                    </el-table-column>
                    <el-table-column
                        label = "pet owner"
                        prop = "petownerusername"
                        width = "150">
                    </el-table-column>
                    <el-table-column
                        label = "status"
                        prop = "status"
                        width = "120">
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
                            @click="acceptOrder(scope.row, scope.$index)"
                            type = "text"
                            size = "small">
                            accept
                          </el-button>
                          <el-button
                            @click="declineOrder(scope.row, scope.$index)"
                            type = "text"
                            size = "small">
                            decline
                          </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-card>
            <el-card class="ptct_petcategory" v-show="isPartTime">
                <div slot="header" class="clearfix">
                    <span>Pet Category</span>
                    <el-button type="text" @click="addPetCategoryFormVisible = true">
                      Add Pet Category
                    </el-button>
                </div>
                <!-- can add in max height for the table -->
                <el-table :data = "petcategory" border>
                    <el-table-column
                        label = "pet type"
                        prop = "pettype"
                        >
                    </el-table-column>
                    <el-table-column
                        label = "price(S$)"
                        prop = "price"
                        >
                    </el-table-column>
                    <el-table-column
                        fixed = "right"
                        label = "action"
                        width = "100">
                        <template slot-scope="scope">
                          <el-button
                            @click="updatePetCategory(scope.row, scope.$index)"
                            type = "text"
                            size = "small">
                            update
                          </el-button>
                          <el-button
                            @click="deletePetCategory(scope.row, scope.$index)"
                            type = "text"
                            size = "small">
                            delete
                          </el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <!-- TODO Update pet category -->

                <!-- Add pet category -->
                <!-- TODO: Only show the pet types not declared -->
                <el-dialog title="Add Pet Category" :visible.sync="addPetCategoryFormVisible">
                  <el-form :model="form">
                    <el-form-item label="Pet Type" :label-width="formLabelWidth">
                      <el-select v-model="form.pettype" placeholder="Please choose the pet type">
                        <el-option label="区域一" value="shanghai"></el-option>
                        <el-option label="区域二" value="beijing"></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="Price" :label-width="formLabelWidth">
                      <el-input v-model="form.price"
                        type="number"
                        min="1"
                        step= "1"
                        autocomplete="off">
                      </el-input>
                    </el-form-item>
                  </el-form>
                  <div slot="footer" class="dialog-footer">
                    <el-button @click="addPetCategoryFormVisible = false">Cancel</el-button>
                    <el-button type="primary"
                    @click="addPetCategoryFormVisible = false">
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
import { getCareTakerInfo } from '@/api/caretaker';

export default {
  data() {
    return {
      pendingorders: '',
      petcategory: '',
      isCareTaker: false,
      type: '',
      rating: 0,
      isPartTime: true,
      addPetCategoryFormVisible: false,
      form: {
        pettype: '',
        price: 0,
      },
      formLabelWidth: '120px',
    };
  },
  methods: {
    getCTInfo() {
      getCareTakerInfo().then((response) => {
        const { data } = response;
        this.type = data.type.trim();
        this.rating = data.rating.trim();
        this.pendingorders = data.pendingorders;
        this.petcategory = data.petcategory;
        this.isPartTime = this.type === 'part time';
      }).catch((error) => {
        // if user is not a caretaker yet
        if (error.response.status === 521) {
          // redirect to the apply to be user page
          this.$router.push('/caretaker/CTapply');
        } else {
          this.$message.error(error.response.data.error);
        }
      });
    },
    acceptOrder(row, index) {

    },
    declineOrder(row, index) {

    },
  },
  beforeMount() {
    this.getCTInfo();
  },
};

</script>

<style>

</style>
