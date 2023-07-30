import {defineStore} from "pinia";
import axios from "axios";

if (localStorage.getItem("token")) {
   axios.defaults.headers.common[
      "Authorization"
      ] = `Bearer ${localStorage.getItem("token")}`;
}

export const useRoomStore = defineStore("rooms", {
   state: () => ({
      rooms: [],
      error: [],
      errorMsg: "",
      token: localStorage.getItem("token") || "",
   }),

   actions: {
      async fetchRoom() {
         try {
            await axios
               .get("rooms")
               .then((res) => {
                  return this.rooms = res.data;
               });
         } catch (error) {
            console.error(error);
         }
      },

      async createRoom(name, capacity, address, floor) {
         this.error = null;
         this.errorMsg = null;
         await axios
            .post("rooms/create", {
               name,
               capacity,
               address,
               floor,
            })
            .then((res) => {
            })
            .catch((err) => {
               if (err.response.status === 422) {
                  this.error = err.response.data.errors;
                  this.errorMsg = err.response.data.message;
                  console.error(err.response.data.message);
               }
            });
      },

      async updateRoom(item) {
         this.error = null;
         this.errorMsg = null;
         await axios
            .post(`rooms/${item.id}/update`, {
               name: item.name,
               capacity: item.capacity,
               address: item.address,
               floor: item.floor,
            })
            .then((res) => {
            }).catch((err) => {
               if (err.response.status === 422) {
                  this.errorMsg = err.response.data.message;

                  console.error(err.response);
               }
            });
      },

      async deleteRoom(id) {
         await axios
            .post(`rooms/${id}/delete`)
            .then((res) => {
            })
            .catch((err) => {
               console.error(err);
            });
      },
   },

   getters: {
      getRoom: (state) => state.rooms,
   },
});
