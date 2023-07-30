<template>
   <div class="modal-overlay">
      <div class="modal modal__room" @click.stop>
         <div class="modal__head">
            <h6 class="modal__head-title">Otaq əlavə et</h6>
            <span class="modal__head-close" @click="closeModal"
            ><img
               loading="lazy"
               src="../../../../assets/images/svg/modalClose.svg"
               alt="close"
            /></span>
         </div>

         <form action="" class="modal__form" @submit.prevent="addRoom">
            <div class="modal__form-group">
               <input
                  class="input input__100"
                  placeholder="Otaqın adı"
                  maxlength="30"
                  type="text"
                  v-model.lazy="name"
               />

               <span class="errorText" v-if="userStore.errorMsg">Bu adda artıx otaq var</span>

               <span
                  class="errorText"
                  v-for="error in v$.name.$errors"
                  :key="error.$uid"
               >
            Ad boş ola bilməz
          </span>
            </div>

            <div class="modal__form-group">
               <input
                  v-model.lazy="capacity"
                  maxlength="2"
                  class="input input__100"
                  placeholder="İşçi tutumu (nəfər)"
                  @input="onIpAddressInput"
                  type="text"
               />
               <span
                  class="errorText"
                  v-for="error in v$.capacity.$errors"
                  :key="error.$uid"
               >
            İşçi tutumu boş ola bilməz
          </span>
            </div>

            <div class="modal__form-group">
               <input
                  v-model.lazy="address"
                  class="input input__100"
                  min="1"
                  max="9999"
                  placeholder="Yerləşdiyi bina"
                  type="text"
               />

               <span
                  class="errorText"
                  v-for="error in v$.address.$errors"
                  :key="error.$uid"
               >
            Yerləşdiyi bina boş ola bilməz
          </span>

            </div>

            <div class="modal__form-group">
               <input
                  maxlength="2"
                  v-model.lazy="floor"
                  class="input input__100"
                  placeholder="Yerləşdiyi mərtəbə"
                  @input="onIpAddressInput"
                  type="text"
               />
               <span
                  class="errorText"
                  v-for="error in v$.floor.$errors"
                  :key="error.$uid"
               >
          Yerləşdiyi mərtəbə boş ola bilməz
        </span>
            </div>

            <div class="modal__form-group modal__flex">
               <button
                  aria-label="İmtina"
                  type="button"
                  class="submitWhite"
                  @click="$emit('close-modal')"
               >
                  İmtina et
               </button>

               <button aria-label="Əlavə et" class="submit" type="submit">
                  <span>Əlavə et</span>
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
import {useRoomStore} from "../../../../stores/room";
import {useVuelidate} from "@vuelidate/core";
import {required} from "@vuelidate/validators";
import Loading from "@/components/Loading.vue";

export default {
   components: {Loading},
   methods: {
      closeModal() {
         this.$emit('close-modal');
         document.body.style.overflow = ''
      },

      onIpAddressInput(event) {
         const numericRegex = /[^0-9.]/g;
         event.target.value = event.target.value.replace(numericRegex, '');
      },
      async addRoom() {
         const result = await this.v$.$validate();
         if (result) {
            this.clickLoad = true;

            await this.userStore.createRoom(
               this.name,
               this.capacity,
               this.address,
               this.floor
            );
            await this.userStore.fetchRoom();


            if (this.userStore.errorMsg) {
               this.clickLoad = false;
            }

            if (!this.userStore.error && !this.userStore.errorMsg) {
               this.clickLoad = false;

               this.name = "";
               this.capacity = "";
               this.address = "";
               this.floor = "";
               this.$toast.success(`Otaq uğurla yaradıldı`);
               this.userStore.errorMsg = "";
               this.userStore.error = "";
               this.v$.$reset();
               this.$emit("close-modal");
            }
         }
      },
   },

   data() {
      return {
         name: "",
         capacity: "",
         address: "",
         floor: "",
         clickLoad: false,
      };
   },

   validations() {
      return {
         name: {required},
         capacity: {required},
         address: {required},
         floor: {required}
      };
   },

   setup() {
      const userStore = useRoomStore();
      return {userStore, v$: useVuelidate()};
   },
};
</script>
