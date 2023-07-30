<template>
   <div class="user">
      <div class="user__item" v-for="item in userStore?.getRoom" :key="item?.id">
         <div class="user__info">
            <img
               loading="lazy"
               src="../../assets/images/svg/user.svg"
               class="user__info-img"
               alt="user"
            />
            <div class="user__info-box">
               <h2 class="user__info-title name">{{ item.name }}</h2>
               <span class="user__info-subtitle">{{ item.capacity }} nəfər</span>
            </div>
         </div>

         <div class="user__info">
            <div class="user__info-box email">
               <span class="user__info-subtitle email">Otaqın detalları</span>
               <h2 class="user__info-title emailName">
                  Bina {{ item.address }} / Mərtəbə {{ item.floor }} / Otaq
                  {{ item.name }}
               </h2>
            </div>

            <div class="user__info">
               <div class="user__info-edit" @click="handleUpdate(item)">
                  Redaktə et
               </div>
               <div
                  class="user__info-remove"
                  @click="deleteModal(item.id)"
               >
                  Sil
               </div>
            </div>
         </div>
      </div>


      <Suspense v-if="showDeletButtons">
         <template #default>
            <div
               class="modal-overlay"
            >
               <div class="modal modal__remove" @click.stop>
                  <div class="modal__head" v-show="showDeletButtons">
                     <h6 class="modal__head-title">Otağı sil</h6>
                  </div>

                  <form class="modal__form" @submit.prevent="handleDelete(id)">
                     <div>
                        <p class="modal__form-delete">
                           Bu otağı silmək istədiyinizə əminsinizmi?
                        </p>
                     </div>

                     <div class="modal__form-group modal__flex">
                        <button
                           aria-label="Imtina et"
                           type="button"
                           class="submitWhite"
                           @click="refusal"
                        >
                           Xeyr
                        </button>

                        <button
                           aria-label="Sil"
                           type="submit"
                           class="submitWhite"
                           id="messg"
                        >
                           <span>Bəli</span>

                        </button>
                     </div>
                  </form>


               </div>
               <div v-show="clickLoad" class="loading-dots">
                  <loading/>
               </div>

            </div>


         </template>

         <template #fallback>Load...</template>
      </Suspense>

      <Suspense v-if="showUpdateModalRoom">
         <template #default>
            <UpdateModalRoom
               :item="updateDataRoom"
               v-show="showUpdateModalRoom"
               @close-modal="showUpdateModalRoom = false"
            />
         </template>

         <template #fallback>Load...</template>
      </Suspense>
   </div>
</template>

<script>
import {ref, defineAsyncComponent, onMounted} from "vue";
import {useRoomStore} from "../../stores/room";
import UpdateModalRoom from "./AdminModal/room/UpdateModalRoom.vue";
import Loading from "@/components/Loading.vue";

export default {
   components: {
      Loading,
      UpdateModalRoom,
   },

   data() {
      return {
         updateDataRoom: {},
         showDeletButtons: false,
         clickLoad: false,
         id: "",
      };
   },

   async mounted() {

      await this.userStore.fetchRoom();
      this.$emit("success");

   },

   methods: {
      refusal() {
         this.showDeletButtons = false;
         document.body.style.overflow = '';
      },
      deleteModal(id) {
         this.showDeletButtons = true;
         this.id = id;
         document.body.style.overflow = 'hidden';
      },
      handleUpdate(item) {
         this.showUpdateModalRoom = true;
         this.updateDataRoom = item;
         document.body.style.overflow = 'hidden'
      },

      async handleDelete(id) {
         this.clickLoad = true;

         await this.userStore.deleteRoom(id);
         await this.userStore.fetchRoom();
         this.showDeletButtons = false;
         this.clickLoad = false;
         this.$toast.success(`Otaq uğurla silindi`);
         document.body.style.overflow = ''
      },
   },

   setup() {
      const userStore = useRoomStore();
      const UpdateModalRoom = defineAsyncComponent({
         loader: () =>
            import(
               "../../components/AdminPanel/AdminModal/room/UpdateModalRoom.vue"
               ),
         delay: 1000,
         timeout: 3000,
         suspensible: true,
      });


      const showUpdateModalRoom = ref(false);
      return {userStore, showUpdateModalRoom, UpdateModalRoom};
   },
};
</script>
