<template>
   <div class="login__box">
      <img loading="lazy"
           :src="useSetting.getSetting.logo"
           alt="meet-set logoin"
           class="login__box-img"
      />

      <form action="" class="login__box-form" @submit.prevent="login">
         <input
            type="text"
            class="input"
            placeholder="İstifadəçi adı vəya mail"
            v-model.trim="email"
         />

         <span
            class="errorText"
            v-for="error in v$.email.$errors"
            :key="error.$uid"
         >
       {{
               error.$message === 'Value is not a valid email address' ? 'Mail düzgün qeyid olunmayıb' : 'Mail boş ola bilməz'
            }}
      </span>
         <div class="formBox">
            <input
               v-if="passwordShow"
               v-model.trim.lazy="password"
               type="password"
               class="input"
               placeholder="Şifrə "
            />

            <input
               v-else
               v-model.trim.lazy="password"
               type="text"
               class="input"
               placeholder="Şifrə "
            />

            <div @click="showPass()">
               <img loading="lazy"

                    v-if="passwordShow"
                    class="formBox__img"
                    src="../assets/images/svg/passwordEye.svg"
                    alt="meetSet Icon"
               />

               <img loading="lazy"
                    v-else
                    class="formBox__img"
                    src="../assets/images/svg/passwordShowEye.svg"
                    alt="meetSet Icon"
               />
            </div>
         </div>

         <div

            v-for="error in v$.password.$errors"
            :key="error.$uid"
         >

<span class="errorText" v-if="error.$message === 'This field should be at least 6 characters long'">
            Şifrə min 6 simvol olmalıdır
</span>


            <span v-else></span>

            <span class="errorText" v-if="error.$message === 'Value is required'">
           Şifrə boş ola bilməz
</span>

            <span v-else></span>


         </div>

         <span class="errorText" v-if="userStore.error"
         >Email və ya şifrə yanlışdır</span
         >


         <input type="submit" class="submit" value="Daxil ol "/>
      </form>


   </div>
   <div v-show="clickLoad" class="loading-dots">
      <loading/>
   </div>
</template>


<script>
import {useSettingStore} from "../stores/setting";
import {useUserStore} from "../stores/auth";
import {useVuelidate} from "@vuelidate/core";
import {required, email, minLength} from "@vuelidate/validators";
import Loading from "@/components/Loading.vue";
import {onMounted} from "vue";

export default {
   components: {Loading},
   data() {
      return {
         email: "",
         password: "",
         passwordShow: true,
         clickLoad: false,
      };
   },
   methods: {
      async login() {
         const result = await this.v$.$validate();
         if (result) {
            this.clickLoad = true

            await this.userStore.signIn(this.email, this.password);

            const user = this.userStore.user;
            if (this.userStore.error) {
               this.clickLoad = false;
            }
            if (!this.userStore.error) {
               this.clickLoad = false;
               if (user.role === 1)
                  window.location.href = "/admin";
               else
                  window.location.href = "/calendar";
            }
         }
      },

      showPass() {
         this.passwordShow = !this.passwordShow;
      },
   },

   validations() {
      return {
         email: {required, email},
         password: {required, minLength: minLength(6)},
      };
   },


  async mounted() {
     this.clickLoad = true;

     try {
         await  this.useSetting.fetchSetting();
         this.clickLoad = false;

      }catch (err){
         console.log(err)
      }
   },
   setup() {
      const useSetting = useSettingStore();
      const userStore = useUserStore();

      return {userStore, useSetting, v$: useVuelidate()};
   },
};
</script>


