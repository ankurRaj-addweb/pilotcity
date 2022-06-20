<template>
     <v-row justify="center">
                            <v-dialog
                              v-model="dialog"
                              max-width="540px"
                              hide-overlay
                              transition="fab-transition"
          
                            >
                              <template v-slot:activator="{ on, attrs }">
                                <v-btn
                                  large
                                  text
                                  class="text-capitalize primary--text mt-3"
                                  v-bind="attrs"
                                  v-on="on"
                                >
                                  Forget Password
                                </v-btn>
                              </template>
                              <v-card>
                                <v-spacer />
                                <v-btn dark icon @click="dialog = false" right>
                                  <v-icon color="red">mdi-close</v-icon>
                                </v-btn>
                                <div class="text-center">
                                  <h2 class="mb-2">Forgot Password</h2>
                                  <p>
                                    We will send a password reset link to the
                                    email address of the connected account.
                                  </p>
                                </div>
                                  <!-- <ValidationObserver v-slot="{ ResetPass }" key="reset"> -->
                                <v-form >
                                  <ValidationProvider v-slot="{ errors }" rules="required|email"> 
                                  <v-text-field 
                                    v-model="ResetPassword"
                                    label="Enter your email address"
                                    name="email"
                                     :rules="errors"
                                    prepend-inner-icon="mdi-email"
                                    type="text"
                                    class="rounded-0"
                                    outlined
                                  ></v-text-field>
                                  </ValidationProvider>

                                  <v-btn
                                   :disabled="
                              ResetPassword.length === 0"
                                    class="text-capitalize"
                                    
                                    color="primary"
                                    x-large
                                    block
                                    
                                  @click="ResetPass()">
                                    <sync-loader
                                      class="px-8"
                                      :loading="loading"
                                      color="white"
                                    ></sync-loader>
                                  
                                    {{loading != true ? 'Reset Password':''}}
                                  </v-btn>
                                </v-form>
                                  <!-- </ValidationObserver> -->
                              </v-card>
                            </v-dialog>
                          </v-row>
</template>

<script>
import axios from "axios";
import SyncLoader from "vue-spinner/src/SyncLoader.vue";
import { ValidationProvider,extend  } from 'vee-validate';  
import { required, email, } from "vee-validate/dist/rules";
extend("email", {
  ...email,
  message: "The email field must be a valid email",
  
});

extend("required", {
  ...required,
  message: "This field is required",
});
export default {
    data (){
        return{
             
               showError: true,
      errormessage: "",
      message: "",
      ResetMessage: false,
      dialog: false,
      loading: false,
      snackbar: false,
      UserEmail: "",
      ResetPassword: "",
      UserPassword:''
        }
    },
    components:{SyncLoader,
    ValidationProvider}
    ,
    methods:{
          ResetPass() 
    {
      const put = this;
      put.loading = true;
      
      axios
        .post(
          `${process.env.VUE_APP_LOGIN_API}/auth0/change-password`,
          {
            email: this.ResetPassword,
          }
        )
        .then(function (response) {
          if (response.status == 200) {
            console.log(response.data);
            put.message = response.data.message;
            put.loading = false;
            put.snackbar = true;
            setTimeout(() => {
              put.$router.push({ path: "/dashboard" });
            }, 400);
          }
        })
        .catch(() => {
          put.errormessage = "Wrong email or password";
          setTimeout(() => {
            put.loading = false;
            put.snackbar = true;
          }, 200);
          put.snackbar = false;
        });
    },
    }
}
</script>