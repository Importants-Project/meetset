import {defineStore} from "pinia";
import axios from "axios";

if (localStorage.getItem("token")) {
   axios.defaults.headers.common[
      "Authorization"
      ] = `Bearer ${localStorage.getItem("token")}`;
}

export const usePersonStore = defineStore("person", {
   state: () => ({
      person: [],
      error: [],
      errorMsg: "",
      token: localStorage.getItem("token") || "",
   }),

   actions: {
      async fetchPerson() {
         try {
            await axios.get("users").then((res) => {
               const person = res.data;
               return (this.person = person);
            });
         } catch (error) {
            console.error(error);
         }
      },


      async createPerson(name, fin_code, position, email, password) {
         this.error = null;
         this.errorMsg = null;
         await axios
            .post("users/create", {
               name,
               fin_code,
               position,
               email,
               password
            })
            .then((res) => {
            })
            .catch((err) => {
               if (err.response.status === 422) {
                  this.errorMsg = err.response.data.message;

                  console.error(err.response);
               }
               console.error(err);
            });
      },

      async updatePerson(item) {
         this.error = null;
         this.errorMsg = null;
         await axios
            .post(`users/${item.id}/update`, {
               name: item.name,
               fin_code: item.fin_code,
               position: item.position,
               email: item.email,
               password: item.password,
            })
            .then((res) => {

               console.log(res);
            })
            .catch((err) => {

               if (err.response.status === 422) {
                  this.errorMsg = err.response.data.message;

                  console.error(err.response);
               }


               console.error(err);
            });
      },


      async deletePerson(id) {
         await axios
            .post(`users/${id}/delete`)
            .then((res) => {
               console.log(res);
            })
            .catch((err) => {
               console.error(err);
            });
      },
   },

   getters: {
      getPerson: (state) => state.person,
   },
});
