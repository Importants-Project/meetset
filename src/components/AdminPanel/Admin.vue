<template>
   <div class="admin">
      <Sidebar/>
      <div class="adminRightSide">
         <div v-if="$route.path === '/admin'">
            <Header title="İstifadəçilər"/>
         </div>

         <div v-if="$route.path === '/rooms'">
            <Header title="Otaqlar"/>
         </div>

         <div v-if="$route.path === '/settings'">
            <Header title="Tənzimləmələr"/>
         </div>

         <div v-if="$route.path === '/admin'">
            <Suspense>
               <template #default>
                  <User @success="download"/>
               </template>

               <template #fallback>Load...</template>
            </Suspense>

            <div class="loading-dots" v-if="clickLoadUser">
               <loading/>
            </div>
         </div>
         <div v-if="$route.path === '/rooms'">
            <Suspense>
               <template #default>
                  <Rooms @success="downloadRoom"/>
               </template>

               <template #fallback>Load...</template>
            </Suspense>

            <div class="loading-dots" v-if="clickLoadRoom">
               <loading/>
            </div>
         </div>

         <div v-if="$route.path === '/settings'">
            <Suspense>
               <template #default>
                  <Settings />
               </template>

               <template #fallback>Load...</template>
            </Suspense>


         </div>


      </div>

   </div>

</template>

<script>
import Sidebar from "./Sidebar.vue";
import User from "./User.vue";
import Header from "./Header.vue";
import Rooms from "./Rooms.vue";
import Settings from "./Settings.vue";

import {defineAsyncComponent} from "vue";
import Loading from "@/components/Loading.vue";

export default {
   components: {
      Sidebar,
      User,
      Header,
      Rooms,
      Settings,
      Loading,

   },

   data() {
      return {
         clickLoadUser: true,
         clickLoadRoom: true,
      }
   },

   methods: {
      download() {
         this.clickLoadUser = false
      },

      downloadRoom() {
         this.clickLoadRoom = false
      },


   },

   setup() {
      const Rooms = defineAsyncComponent({
         loader: () => import("./Rooms.vue"),
         delay: 1000,
         timeout: 3000,
         suspensible: true,
      });

      const User = defineAsyncComponent({
         loader: () => import("./User.vue"),
         delay: 1000,
         timeout: 3000,
         suspensible: true,
      });

      const Settings = defineAsyncComponent({
         loader: () => import("./Settings.vue"),
         delay: 1000,
         timeout: 3000,
         suspensible: true,
      });

      return {Rooms, User, Settings};
   },
};
</script>