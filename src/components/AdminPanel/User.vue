<template>
   <div class="user">
      <div class="user__item" v-for="item in userStore?.getPerson" :key="item.id">
         <div class="user__info">
            <img
               loading="lazy"
               src="../../assets/images/svg/user.svg"
               class="user__info-img"
               alt="user"
            />
            <div class="user__info-box">
               <h2 class="user__info-title name">{{ item.name }}</h2>
               <span class="user__info-subtitle">{{ item.position }}</span>
            </div>
         </div>

         <div class="user__info">
            <div class="user__info-box email">
               <span class="user__info-subtitle email">Mail</span>
               <h2 class="user__info-title emailName">{{ item.email }}</h2>
            </div>

            <div class="user__info">
               <div class="user__info-edit" @click="handleUpdate(item)">
                  Redaktə et
               </div>
               <div
                  class="user__info-remove"
                  @click="deleteUser(item.id)"
               >
                  Sil
               </div>
            </div>
         </div>
      </div>

      <Suspense v-if="showDeletButtons">
         <template #default>
            <div class="modal-overlay">
               <div class="modal modal__remove" @click.stop>
                  <div class="modal__head" v-show="showDeletButtons">
                     <h6 class="modal__head-title">İstifadəçini sil</h6>
                  </div>
                  <form class="modal__form" @submit.prevent="handleDelete(id)">
                     <p class="modal__form-delete">
                        Bu istifadəçini silmək istədiyinizə əminsinizmi?
                     </p>

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

      <Suspense v-if="showUpdateModalUser">
         <template #default>
            <UpdateModalUser
               :item="updateDataPerson"
               v-if="showUpdateModalUser"
               @close-modal="showUpdateModalUser = false"
            />
         </template>

         <template #fallback>Load...</template>
      </Suspense>
   </div>

</template>

<script>
import {ref, defineAsyncComponent, onMounted} from "vue";
import {usePersonStore} from "../../stores/user";

import UpdateModalUser from "./AdminModal/user/UpdateModalUser.vue";
import Loading from "@/components/Loading.vue";

export default {
   components: {
      Loading,
      UpdateModalUser,
   },
   data() {
      return {
         updateDataPerson: {},
         showDeletButtons: false,
         clickLoad: false,
         id: "",

      };
   },

   methods: {
      deleteUser(id) {
         this.showDeletButtons = true;
         this.id = id;
         document.body.style.overflow = 'hidden'
      },

      refusal() {
         this.showDeletButtons = false;
         document.body.style.overflow = '';
      },

      handleUpdate(item) {
         this.showUpdateModalUser = true;
         this.updateDataPerson = item;
         document.body.style.overflow = 'hidden'
      },

      async handleDelete(id) {
         this.clickLoad = true;

         await this.userStore.deletePerson(id);
         await this.userStore.fetchPerson();
         this.showDeletButtons = false;
         this.clickLoad = false;
         this.$toast.success(`Istifadəçi uğurla silindi`);
         document.body.style.overflow = ''
      },
   },

  async mounted() {
     await this.userStore.fetchPerson();
     this.$emit("success");

   },

   setup() {
      const UpdateModalUser = defineAsyncComponent({
         loader: () => import("../../components/AdminPanel/AdminModal/user/UpdateModalUser.vue"),
         delay: 1000,
         timeout: 3000,
         suspensible: true,
      });


      const showUpdateModalUser = ref(false);

      const userStore = usePersonStore();

      return {userStore, showUpdateModalUser, UpdateModalUser};
   },
};
</script>
