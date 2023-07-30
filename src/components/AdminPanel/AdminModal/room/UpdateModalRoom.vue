<template>
   <div class="modal-overlay">
      <div class="modal modal__room" @click.stop>
         <div class="modal__head">
            <h6 class="modal__head-title">Otağı redaktə et</h6>
            <span class="modal__head-close" @click="close()">
          <img
             loading="lazy"
             src="../../../../assets/images/svg/modalClose.svg"
             alt=""
          /></span>
         </div>

         <form action="" class="modal__form" @submit.prevent="uppdateHandler">
            <div class="modal__form-group">
               <input
                  v-model.lazy="updateDataRoom.name"
                  class="input input__100"
                  placeholder="Otaqın adı"
                  maxlength="30"
                  type="text"
               />
               <span class="errorText" v-if="userStore.errorMsg">Otaq mövcuddur</span>

               <span
                  class="errorText"
                  v-for="error in v$.updateDataRoom.name.$errors"
                  :key="error.$uid"
               >
            Otaq boş ola bilməz
          </span>
            </div>

            <div class="modal__form-group">
               <input
                  v-model.lazy="updateDataRoom.capacity"
                  class="input input__100"
                  maxlength="2"
                  @input="onIpAddressInput"
                  placeholder="İşçi tutumu (nəfər)"
                  type="text"
               />

               <span
                  class="errorText"
                  v-for="error in v$.updateDataRoom.capacity.$errors"
                  :key="error.$uid"
               >
            İşçi tutumu ola bilməz
          </span>
            </div>

            <div class="modal__form-group">
               <input
                  v-model.lazy="updateDataRoom.address"
                  class="input input__100"
                  max="9999"
                  min="1"
                  placeholder="Yerləşdiyi bina"
                  type="text"
               />

               <span
                  class="errorText"
                  v-for="error in v$.updateDataRoom.address.$errors"
                  :key="error.$uid"
               >
            Yerləşdiyi bina boş ola bilməz
          </span>
            </div>

            <div class="modal__form-group">
               <input
                  v-model.lazy="updateDataRoom.floor"
                  class="input input__100"
                 maxlength="2"
                  @input="onIpAddressInput"
                  placeholder="Yerləşdiyi mərtəbə"
                  type="text"
               />

               <span
                  class="errorText"
                  v-for="error in v$.updateDataRoom.floor.$errors"
                  :key="error.$uid"
               >
            Yerləşdiyi mərtəbə ola bilməz
          </span>

            </div>

            <div class="modal__form-group modal__flex">
               <button
                  aria-label="İmtina"
                  type="button"
                  class="submitWhite"
                  @click="close()"
               >
                  İmtina et
               </button>
               <!-- @click="handleUpdate(item)" -->

               <button
                  class="submit"
                  type="submit"
                  aria-label="Yadda saxla"
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
import {useRoomStore} from "../../../../stores/room";
import {useVuelidate} from "@vuelidate/core";

import {required} from "@vuelidate/validators";
import Loading from "@/components/Loading.vue";

export default {
   components: {Loading},
   setup() {
      const userStore = useRoomStore();
      return {userStore, v$: useVuelidate()};
   },
   props: ["item"],
   data() {
      return {
         updateDataRoom: {},
         clickLoad: false,
      };
   },

   validations() {
      return {
         updateDataRoom: {
            name: {required},
            capacity: {required},
            address: {required},
            floor: {required}
         },
      };
   },

   mounted() {
      Object.assign(this.updateDataRoom, this.item);
   },

   methods: {



      onIpAddressInput(event) {
         const numericRegex = /[^0-9.]/g;
         event.target.value = event.target.value.replace(numericRegex, '');
      },
         async uppdateHandler() {
         const result = await this.v$.$validate();
         if (result) {
            this.clickLoad = true;
            await this.userStore.updateRoom(this.updateDataRoom);
            await this.userStore.fetchRoom();

            if (this.userStore.errorMsg) {
               this.clickLoad = false;
            }


            if (!this.userStore.error && !this.userStore.errorMsg) {

               this.$toast.success(`Otaq uğurla redaktə olundu`);
               this.clickLoad = false;
               this.userStore.errorMsg = "";
               this.userStore.error = "";
               this.$emit("close-modal");
            }
         }
      },

      close() {
         this.$emit("close-modal");
         this.userStore.errorMsg = "";
         document.body.style.overflow = '';
      },
   },
};
</script>
