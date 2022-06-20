<template>
  <v-app>
    <v-container fluid>
      <v-row no-gutters>
        <div class="d-flex img-size">
          <v-img src="@/assets/pioletcity.png"></v-img>
        </div>

        <v-col
          cols="12"
          lg="5"
          class="login-part d-flex align-center justify-center"
        >
          <v-row no-gutters class="align-start">
            <v-col
              cols="12"
              class="login-part d-flex align-center justify-center flex-column"
            >
              <div class="login-wrapper pt-md-4 pt-0">
                <h1>Login</h1>
                  <v-container>
                    <v-row class="flex-column">
                      <!-- <ValidationObserver v-slot="{ login }" key="login"> -->
                      <v-form > 
                        <v-col>
                          <ValidationProvider v-slot="{ errors }" rules="required|email"> 
                          <v-text-field
                            v-model="UserEmail"
                            :rules="errors"
                           prepend-inner-icon="mdi-email"
                            label="Email Address"
                            required
                          ></v-text-field>
                          </ValidationProvider>
                           <ValidationProvider v-slot="{ errors }" rules="required|min:6"> 
                          <v-text-field
                            v-model="UserPassword"
                            :rules="errors"
                            prepend-inner-icon="mdi-lock"
                            :type="passwordShow?'text':'password'"
                            label="Password"
                            :append-icon="passwordShow ? 'mdi-eye':'mdi-eye-off'"
                            @click:append="passwordShow = !passwordShow"
                            hint="At least 6 characters"
                            
                          ></v-text-field>
                           </ValidationProvider>
                        </v-col>
                        <v-col class="d-flex justify-space-between">
                          <v-btn
                            class="text-capitalize"
                            large
                            :loading="loading"
                            :disabled="
                              UserPassword.length === 0 ||
                              UserEmail.length === 0
                            "
                            color="primary"
                            @click="login"
                          >
                            Login</v-btn
                          >
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

<ResetPassword></ResetPassword>
                        </v-col>
                      </v-form>
                      <!-- </ValidationObserver> -->
                    </v-row>
                   
                  </v-container>
               
              </div>
            </v-col>
            <v-col cols="12" class="d-flex justify-center"> </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
    <v-snackbar   top right :color = "message !='' ? 'green':'red'" v-model="snackbar">
      {{ message !=''? message : errormessage }}
    </v-snackbar>
  </v-app>
</template>

<script>
import axios from "axios";
import SyncLoader from "vue-spinner/src/SyncLoader.vue";
import { ValidationProvider,extend  } from 'vee-validate';  
import { required, email,min } from "vee-validate/dist/rules";
import ResetPassword from "./ResetPassword.vue"
extend("email", {
  ...email,
  message: "The email field must be a valid email",
  
});

extend("required", {
  ...required,
  message: "This field is required",
});
extend("min", {
  ...min,
  message: "Min 6 characters",
  
});
export default {
  name: "Login",
  components: {
    SyncLoader,
    ValidationProvider,
    ResetPassword 
  },
  
  data() {
    return {
      showError: true,
      passwordShow:false,
      errormessage: "",
      message: "",
      ResetMessage: false,
      dialog: false,
      token: [],
      loading: false,
      snackbar: false,
      UserEmail: "",
      ResetPassword: "",
      UserPassword:'',
       passRules: [
        (v) => !!v || "Password is required",
        (v) => v.length >= 6 || "Min 6 characters",
      ],
       emailRules: [
        (v) => !!v || "E-mail is required",
        (v) => /.+@.+/.test(v) || "E-mail must be valid",
      ],
    };
  },
  
  methods: {
    
    login() 
    {

      const put = this;
      put.loading = true;
      axios
        .post(
          `${process.env.VUE_APP_LOGIN_API}/auth0/sign-in`,
          {
            type: "email_signin",
            email: this.UserEmail,
            password: this.UserPassword,
          }
        )
        .then(function (response) {
          if (response.status == 200) {
            put.token.push(response.data.data);
            axios
              .post(
                `${process.env.VUE_APP_LOGIN_API}/auth0/verify-jwt`,
                {
                  token: put.token[0].access_token,
                }
              )
              .then(function (response) {

                if (
                  response.data.roles.findIndex(
                    (obj) => obj.name === "Admin"
                  ) != -1
                ) {
                  if (!put.$store.getters.getAuth) {
                    put.$store.commit("toggleAuth");
                  }
                  put.$router.push({ path: "/dashboard" });
                  localStorage.setItem("UserToken", JSON.stringify(put.token));
                }
              })
              .catch(() => console.log("error.message"));
          }
        })
        .catch((error) => {
          put.errormessage = "Wrong email or password";
          setTimeout(() => {
            put.loading = false;
            put.snackbar = true;
          }, 200);
          put.snackbar = false;
          console.log(error);
        });
    },
  },
};
</script>

<style src="./Login.scss" lang="scss"/>
