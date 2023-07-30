<template>
   <div class="adminHeader">
      <h1 class="adminHeader__title">{{ title }}</h1>

      <div class="adminHeader__modules flex">
         <div
            v-if="$route.name !== 'Rooms' && $route.name !== 'Settings'"
            class="adminHeader__modules-users modalButton"
            @click="openModal"
         >
            <span>İstifadəçi əlavə et</span>

            <img
               loading="lazy"
               class=""
               src="../../assets/images/svg/blackPulus.svg"
               alt="blackPulus"
            />
         </div>
         <div
            v-if="$route.name !== 'User' && $route.name !== 'Settings'"
            @click="openModalRoom"
            class="adminHeader__modules-rooms modalButton"
         >
            <span>Otaq yarat</span>
            <img
               loading="lazy"
               src="../../assets/images/svg/pulus.svg"
               alt="pulus"
            />
         </div>

         <div class="header" style="padding: 0; display: block">
            <div
               class="submitWhite flex center__flex"
               @click.stop="hideDropdown = true"
            >
               {{ userStore.getUser.name }}
               <img
                  loading="lazy"
                  class="fix__img"
                  src="../../assets/images/svg/dropdown.svg"
                  alt="dropdown"
               />
            </div>

            <ul v-if="hideDropdown" class="dropDown" @click="logout()">
               <li class="dropDown__item" >
                  <img
                     loading="lazy"
                     src="../../assets/images/svg/exitBold.svg"
                     alt="exit"
                  />
                  Çıxış
               </li>
            </ul>
         </div>
      </div>
   </div>
   <div v-show="clickLoad" class="loading-dots">
      <loading/>
   </div>

   <Suspense>
      <template #default>
         <CreateModalRoom
            v-if="showModalRoom"
            @close-modal="closeModal"
         />
      </template>

      <template #fallback>Load...</template>
   </Suspense>

   <Suspense>
      <template #default>
         <CreateModalUser
            v-if="showModalUser"
            @close-modal="closeModal"
         />
      </template>

      <template #fallback>Load...</template>
   </Suspense>
</template>

<script>
import CreateModalUser from "./AdminModal/user/CreateModalUser.vue";
import CreateModalRoom from "./AdminModal/room/CreateModalRoom.vue";
import {useUserStore} from "../../stores/auth";
import {onMounted, defineAsyncComponent, ref} from "vue";
import Loading from "@/components/Loading.vue";

export default {
   props: ["title"],

   data() {
      return {
         clickLoad: false
      }
   },

   components: {
      Loading,
      CreateModalUser,
      CreateModalRoom,
   },

   mounted() {
      document.querySelector("body").addEventListener("click", this.closeDropDown);
   },
   beforeDestroy() {
      document.querySelector("body").removeEventListener("click", this.closeDropDown);
   },

   methods: {
      openModal() {
         this.showModalUser = true;
         document.body.style.overflow = 'hidden';
      },
      openModalRoom() {
         this.showModalRoom = true;
         document.body.style.overflow = 'hidden';
      },
      closeModal() {
         this.showModalUser = false;
         this.showModalRoom = false;
         document.body.style.overflow = '';
      },
      async logout() {
         this.clickLoad = true

         await this.userStore.signOut();


         if (this.userStore.token) {
            this.clickLoad = false
            this.$router.push("/");
         }
      },

      closeDropDown() {
         this.hideDropdown = false;
      },
   },
   setup() {
      onMounted(() => {
         userStore.fetchUser();
      });

      const CreateModalRoom = defineAsyncComponent({
         loader: () =>
            import(
               "../../components/AdminPanel/AdminModal/room/CreateModalRoom.vue"
               ),
         delay: 1000,
         timeout: 3000,
         suspensible: true,
      });

      const CreateModalUser = defineAsyncComponent({
         loader: () =>
            import(
               "../../components/AdminPanel/AdminModal/user/CreateModalUser.vue"
               ),
         delay: 1000,
         timeout: 3000,
         suspensible: true,
      });

      const showModalRoom = ref(false);
      const showModalUser = ref(false);
      const hideDropdown = ref(false);

      const userStore = useUserStore();
      return {
         userStore,
         CreateModalRoom,
         hideDropdown,
         showModalUser,
         CreateModalUser,
         showModalRoom,
      };
   },
};
</script>
