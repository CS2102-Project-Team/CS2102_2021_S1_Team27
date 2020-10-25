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
                <el-table
                  :data = "pendingorders"
                  max-height="250"
                  border
                  empty-text= "empty"
                  :key = "pdTableKey"
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
                        prop = "ownerusername"
                        width = "150">
                    </el-table-column>
                    <el-table-column
                        label = "status"
                        prop = "status"
                        width = "130">
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
                            @click="acceptOrderBtn(scope.row, scope.$index)"
                            type = "text"
                            size = "small">
                            accept
                          </el-button>
                          <el-button
                            @click="declineOrderBtn(scope.row, scope.$index)"
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
                    <el-button type="text" @click="addPCBtn"
                      :disabled = "addedPetTypes.length === 3"
                      style="float: right; padding: 3px 0">
                      Add Pet Category
                    </el-button>
                </div>
                <!-- can add in max height for the table -->
                <el-table
                  :data = "petcategory"
                  border
                  max-height="250"
                  empty-text= "empty"
                  :key = "pcTableKey">
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
                            @click="updatePCBtn(scope.row, scope.$index)"
                            type="text"
                            size = "small">
                            update
                          </el-button>
                          <el-button
                            @click="deletePCBtn(scope.row, scope.$index)"
                            type="text"
                            size = "small">
                            delete
                          </el-button>
                        </template>
                    </el-table-column>
                </el-table>

                <el-dialog title="Update Pet Category" :visible.sync="updatePCFormVisible"
                  @close = "closeDialog"  >
                  <el-form :model="form" :rules="UpdatePCRules" ref="updatePC" class= "updatePC">
                    <el-form-item
                      label="Pet Type"
                      :label-width="formLabelWidth"
                      prop= "pettype"
                      >
                      <el-input v-model="form.pettype" :disabled = "true">
                      </el-input>
                    </el-form-item>
                    <el-form-item
                      label="Price"
                      :label-width="formLabelWidth"
                      prop = "price">
                      <el-input v-model.number="form.price"
                        type="number"
                        min="1"
                        step= "1"
                        autocomplete="off">
                      </el-input>
                    </el-form-item>
                  </el-form>
                  <div slot="footer" class="dialog-footer">
                    <el-button @click="closeDialog">Cancel</el-button>
                    <el-button type="primary"
                    @click="updatePCFormBtn">
                    Confirm
                    </el-button>
                  </div>
              </el-dialog>
              <el-dialog title="Delete Pet Category" :visible.sync="deletePCFormVisible"
                @close = "closeDialog">
                  <el-form :model="form" >
                    <el-form-item
                      label="Pet Type"
                      :label-width="formLabelWidth"
                      prop= "pettype">
                      <el-input v-model="form.pettype" :disabled="true">
                      </el-input>
                    </el-form-item>
                    <el-form-item
                      label="Price"
                      :label-width="formLabelWidth"
                      prop = "price">
                      <el-input v-model.number="form.price" :disabled="true">
                      </el-input>
                    </el-form-item>
                  </el-form>
                  <div slot="footer" class="dialog-footer">
                    <el-button @click="closeDialog">Cancel</el-button>
                    <el-button type="primary"
                    @click="deletePCFormBtn">
                    Confirm
                    </el-button>
                  </div>
              </el-dialog>
                <!-- Add pet category -->
                <el-dialog title="Add Pet Category" :visible.sync="addPCFormVisible"
                  @close = "closeDialog">
                  <el-form :model="form" :rules="AddPCRules" ref="addPC" class= "addPC">
                    <el-form-item label="Pet Type" :label-width="formLabelWidth" prop="pettype">
                      <el-select v-model="form.pettype" placeholder="Please choose the pet type">
                        <el-option
                          label="cat"
                          value="cat"
                          :disabled= "addedPetTypes.includes('cat')">
                          </el-option>
                        <el-option
                          label="dog"
                          value="dog"
                          :disabled= "addedPetTypes.includes('dog')">
                          </el-option>
                        <el-option
                          label="fish"
                          value="fish"
                          :disabled= "addedPetTypes.includes('fish')">
                          </el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="Price" :label-width="formLabelWidth" prop="price">
                      <el-input v-model.number="form.price"
                        type="number"
                        min="1"
                        step= "1"
                        autocomplete="off">
                      </el-input>
                    </el-form-item>
                  </el-form>
                  <div slot="footer" class="dialog-footer">
                    <el-button @click="addPCFormVisible = false">Cancel</el-button>
                    <el-button type="primary"
                    @click="addPCFormBtn">
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
  getCareTakerInfo, acceptOrder, addCareTakerPetCategory,
  updateCareTakerPetCategory, deleteCareTakerPetCategory,
} from '@/api/caretaker';
import FTsidebar from '../caretaker/component/FTsidebar';
import PTsidebar from '../caretaker/component/PTsidebar';

export default {
  components: { FTsidebar, PTsidebar },
  data() {
    const validatePrice = (rule, value, callback) => {
      const regExpPrice = /^[1-9]\d*$/;
      if (regExpPrice.test(value) === false || !value) {
        callback(new Error('Price must be a postive integer'));
      } else {
        callback();
      }
    };
    const validatePetType = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('Please choose a pet type'));
      } else {
        callback();
      }
    };
    return {
      isCareTaker: false,
      pendingorders: '',
      petcategory: '',
      isPartTime: false,
      type: '',
      rating: 0,
      addPCFormVisible: false,
      updatePCFormVisible: false,
      deletePCFormVisible: false,
      form: {
        pettype: '',
        price: 1,
        index: 0,
      },
      formLabelWidth: '120px',
      CTinforFetched: false,
      // use componentkey to re-render the table when there is a change in orders
      pdTableKey: 0,
      pcTableKey: 0,
      addedPetTypes: [],
      UpdatePCRules: {
        price: [
          { required: true, message: 'Please enter a price', trigger: 'blur' },
          { validator: validatePrice, trigger: 'blur' }],
      },
      AddPCRules: {
        pettype: [
          { required: true, message: 'Please choose a pet type', trigger: 'blur' },
          { validator: validatePetType, trigger: 'blur' }],
        price: [
          { required: true, message: 'Please enter a price', trigger: 'blur' },
          { validator: validatePrice, trigger: 'blur' }],
      },
    };
  },
  methods: {
    getCTInfo() {
      getCareTakerInfo().then((response) => {
        const { data } = response;
        this.type = data.type.trim();
        this.rating = data.rating.trim();
        if (this.rating < 0) {
          this.rating = 'no ratings yet';
        }
        this.pendingorders = data.pendingorders;
        this.petcategory = data.petcategory;
        this.addedPetTypes = this.petcategory.map((x) => x.pettype);
        this.isPartTime = this.type === 'part time';
        this.CTinforFetched = true;
        this.$store.commit('SET_ISPT', this.isPartTime);
        // this.logData();
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
    acceptOrderBtn(row, index) {
      const {
        startdate, enddate, ownerusername, petname,
      } = row;
      const accept = true;
      const data = {
        startdate, enddate, ownerusername, petname, accept,
      };

      acceptOrder(data).then(() => {
        // loading to false according to index
        // remove this entry from showing
        this.deleteRow(index, this.pendingorders);
        this.pdTableKey += 1;
        this.$message.success('accepted an order');
      }).catch((error) => {
        this.$message.error(error.response.data.error);
      });
    },
    declineOrderBtn(row, index) {
      const {
        startdate, enddate, ownerusername, petname,
      } = row;
      const accept = false;
      const data = {
        startdate, enddate, ownerusername, petname, accept,
      };

      acceptOrder(data).then(() => {
        // loading to false according to indexs
        // remove this entry from showing
        this.deleteRow(index, this.pendingorders);
        this.pdTableKey += 1;
        this.$message.success('accepted an order');
      }).catch((error) => {
        this.$message.error(error.response.data.error);
      });
    },
    deleteRow(index, data) {
      data.splice(index, 1);
    },
    addRow(index, tabledata, dataAdded) {
      tabledata.splice(index + 1, 0, dataAdded);
    },
    updatePCBtn(row, index) {
      this.form.pettype = row.pettype;
      this.form.price = row.price;
      this.form.index = index;
      this.updatePCFormVisible = true;
    },
    deletePCBtn(row, index) {
      this.form.pettype = row.pettype;
      this.form.price = row.price;
      this.form.index = index;
      this.deletePCFormVisible = true;
    },
    addPCBtn() {
      this.addedPetTypes = this.petcategory.map((x) => x.pettype);
      this.addPCFormVisible = true;
    },
    updatePCFormBtn() {
      this.$refs.updatePC.validate((valid) => {
        if (valid) {
          updateCareTakerPetCategory(this.form).then(() => {
            // loading to false according to indexs
            const { price, index } = this.form;
            this.$set(this.petcategory[index], 'price', price);
            this.pcTableKey += 1;
            this.$message.success('updated a pet category');
            this.closeDialog();
          }).catch((error) => {
            this.$message.error(error.response.data.error);
          });
        } else {
          this.$message.error('Error in validating input');
          return false;
        }
      });
    },
    deletePCFormBtn() {
      deleteCareTakerPetCategory(this.form).then(() => {
        // loading to false according to indexs
        const { index } = this.form;
        this.deleteRow(index, this.petcategory);
        this.addedPetTypes = this.petcategory.map((x) => x.pettype);
        this.pcTableKey += 1;
        this.$message.success('deleted a pet category');
        this.closeDialog();
      }).catch((error) => {
        this.$message.error(error.response.data.error);
      });
    },
    addPCFormBtn() {
      this.$refs.addPC.validate((valid) => {
        if (valid) {
          addCareTakerPetCategory(this.form).then(() => {
            // loading to false according to indexs
            const { pettype, price, index } = this.form;
            const data = { pettype, price };
            this.addRow(index, this.petcategory, data);
            this.addedPetTypes = this.petcategory.map((x) => x.pettype);
            this.pcTableKey += 1;
            this.$message.success('added a pet category');
            this.closeDialog();
          }).catch((error) => {
            // console.log(error);
            this.$message.error(error.response.data.error);
          });
        } else {
          this.$message.error('Error in validating input');
          return false;
        }
      });
    },
    closeDialog() {
      this.updatePCFormVisible = false;
      this.deletePCFormVisible = false;
      this.addPCFormVisible = false;
      this.form.pettype = '';
      this.form.price = 1;
      this.form.index = 0;
    },
    // logData() {
    //   console.log('pending orders');
    //   console.log(this.pendingorders);
    //   console.log('pet category');
    //   console.log(this.petcategory);
    // },
  },
  beforeMount() {
    this.getCTInfo();
  },
};

</script>

<style>

</style>
