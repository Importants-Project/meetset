<template>
   <header class="header">
      <div class="container">
         <a href="/">
            <img loading="lazy"
                 class="header__img"
                 src="../assets/images/logo/logo.png"
                 alt="logo"
            />
         </a>
         <div v-if="userStore.token !== ''" style="position: relative">
            <div class="submitWhite flex center__flex" @click.stop="hideDropdown=true">
               {{ userStore.getUser.name }}
               <img loading="lazy"
                    class="fix__img"
                    src="../assets/images/svg/dropdown.svg"
                    alt="dropdown"
               />
            </div>

            <ul v-if='hideDropdown' class="dropDown" @click="logout()">
               <li class="dropDown__item">
                  <img loading="lazy"
                       src="../assets/images/svg/exitBold.svg"
                       alt="exit"> Çıxış
               </li>
            </ul>


         </div>

      </div>
   </header>


   <div style="background:#F8FAFC">
      <img class="notFound" src="../assets/images/notFound.jpg" alt="notFound"/>

   </div>

   <div v-show="clickLoad" class="loading-dots">
      <loading/>
   </div>
</template>


<script>
import ReserveRoom from "../components/Modal/ReserveRoom.vue";
import {onMounted, defineAsyncComponent} from "vue";
import {useUserStore} from "@/stores/auth";
import Loading from "@/components/Loading.vue";

export default {
   components: {Loading, ReserveRoom},
   data() {
      return {
         hideDropdown: false,
         clickLoad: false
      };
   },

   methods: {
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
      }
   },

   mounted() {
      document.querySelector("body").addEventListener("click", this.closeDropDown);


   },
   beforeDestroy() {
      document.querySelector("body").removeEventListener("click", this.closeDropDown)
   },

   setup() {
      onMounted(() => {
         userStore.fetchUser();
      });


      const userStore = useUserStore();
      return {userStore};
   },
};
</script>