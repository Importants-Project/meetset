<template>
   <div class="modal-overlay">
      <div class="modal modal__user" @click.stop>
         <div class="modal__head">
            <h6 class="modal__head-title">İstifadəçini redaktə et</h6>
            <span class="modal__head-close" @click="close()"
            ><img src="../../../../assets/images/svg/modalClose.svg" alt="modalClose"
            /></span>
         </div>
         <form action="" class="modal__form" @submit.prevent="uppdateHandler">
            <div class="modal__form-group">
               <input
                  class="input input__100"
                  v-model.trim="updateDataPerson.name"
                  placeholder="Ad, soyad"
                  maxlength="250"
                  type="text"
               />

               <span
                  class="errorText"
                  v-for="error in v$.updateDataPerson.name.$errors"
                  :key="error.$uid"
               >
            Ad boş ola bilməz
          </span>
            </div>

            <div class="modal__form-group">
               <input
                  class="input input__100"
                  v-model.trim="updateDataPerson.fin_code"
                  placeholder="FİN nömrə"
                  maxlength="7"
                  type="text"
               />

               <span
                  class="errorText"
                  v-for="error in v$.updateDataPerson.fin_code.$errors"
                  :key="error.$uid"
               >
            Fin boş ola bilməz
          </span>
            </div>

            <div class="modal__form-group">
               <input
                  class="input input__100"
                  placeholder="Əməkdaşı olduğu şöbə"
                  type="text"
                  maxlength="250"
                  v-model.lazy="updateDataPerson.position"
               />
               <span
                  class="errorText"
                  v-for="error in v$.updateDataPerson.position.$errors"
                  :key="error.$uid"
               >
            Vəzifə boş ola bilməz
          </span>
            </div>

            <div class="modal__form-group">
               <input
                  class="input input__100"
                  v-model.trim="updateDataPerson.email"
                  placeholder="Mail"
                  maxlength="250"
                  type="text"
               />

               <span
                  class="errorText"
                  v-for="error in v$.updateDataPerson.email.$errors"
                  :key="error.$uid"
               >
       {{ error.$message === 'Value is not a valid email address' ? 'Mail düzgün qeyid olunmayıb' : 'Mail boş ola bilməz' }}
          </span>

               <span class="errorText" v-if="userStore.errorMsg">Email mövcuddur</span>

            </div>

            <div class="modal__form-group">
               <input
                  v-if="passwordShow"
                  class="input input__100"
                  placeholder="Şifrə"
                  maxlength="64"
                  v-model.trim="updateDataPerson.password"
                  type="text"
               />

               <input
                  v-else
                  class="input input__100"
                  placeholder="Şifrə"
                  maxlength="64"
                  v-model.trim="updateDataPerson.password"
                  type="password"

               />

               <div class="modal__form-img" @click="showPass()">
                  <img
                     v-if="passwordShow"
                     class="formBox__img"
                     src="../../../../assets/images/svg/passwordShowEye.svg"
                     alt="meetSet Icon"
                  />

                  <img
                     v-else
                     class="formBox__img"
                     src="../../../../assets/images/svg/passwordEye.svg"
                     alt="meetSet Icon"
                  />
               </div>

               <span
                  class="errorText"
                  v-for="error in v$.updateDataPerson.password.$errors"
                  :key="error.$uid"
               >
             Şifrə min 6 simvol olmalıdır
          </span>
            </div>

            <div class="modal__form-group modal__flex">
               <button aria-label="İmtina" type="button" class="submitWhite" @click="close()">
                  İmtina et
               </button>
               <button
                  aria-label="Yadda Saxla"
                  class="submit"
                  type="submit"
                  placeholder="Görüşlə bağlı qeydlər"
               >
                  <span>Yadda saxla</span>
               </button>
            </div>
         </form>


      </div>
      <div v-show="clickLoad" class="loading-dots">
         <loading/>
      </div>
   </div>

</template>

<script>
import {usePersonStore} from "../../../../stores/user";
import {ref} from "vue";
import {storeToRefs} from "pinia";
import {useVuelidate} from "@vuelidate/core";
import {required, email, minLength} from "@vuelidate/validators";
import Loading from "@/components/Loading.vue";

export default {
   components: {Loading},
   props: ["item"],

   data() {
      return {
         updateDataPerson: {},
         clickLoad: false,
      };
   },

   validations() {
      return {
         updateDataPerson: {
            name: {required},
            email: {email, required},
            password: {minLength: minLength(6)},
            fin_code: {required},
            position: {required},
         },
      };
   },

   methods: {
      async uppdateHandler() {
         const result = await this.v$.$validate();

         if (result) {
            this.clickLoad = true;
            await this.userStore.updatePerson(this.updateDataPerson);
            await this.userStore.fetchPerson();
            if (this.userStore.errorMsg) this.clickLoad = false;

            if (!this.userStore.error && !this.userStore.errorMsg) {
               this.clickLoad = false;

               this.$toast.success(`Istifadəçi redaktə edildi`);
               this.userStore.errorMsg = "";
               this.userStore.error = [];

               this.$emit("close-modal");

               document.body.style.overflow = '';
            }
         }
      },

      showPass() {
         this.passwordShow = !this.passwordShow;
      },

      close() {
         this.$emit("close-modal");
         document.body.style.overflow = ''
         this.userStore.errorMsg = "";
         this.userStore.error = "";
      },
   },

   mounted() {
      Object.assign(this.updateDataPerson, this.item);
   },

   setup() {
      const userStore = usePersonStore();
      const passwordShow = ref(false);

      return {userStore, passwordShow, v$: useVuelidate()};
   },
};
</script>
