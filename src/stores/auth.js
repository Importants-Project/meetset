import {defineStore} from "pinia";
import axios from "axios";

if (localStorage.getItem("token")) {
   axios.defaults.headers.common["Authorization"] = `Bearer ${localStorage.getItem("token")}`;
}

export const useUserStore = defineStore("user", {
   state: () => ({
      user: [],
      error: '',
      token: localStorage.getItem("token") || "",
   }),

   actions: {
      async fetchUser() {
         try {
            await axios
               .get("auth/user")
               .then((res) => {
                  console.log(res);

                  const user = res.data.user;
                  return (this.user = user);
               });
         } catch (error) {
            console.error(error);
         }
      },

      async signIn(email, password) {
         return await axios.post("auth/login", {email, password})
            .then((res) => {
               const token = res.data.token;
               const user = res.data.user;

               this.token = token;
               localStorage.setItem("token", token);
               localStorage.setItem("user", JSON.stringify(user));
               this.user = user;
               this.error = null;
            })
            .catch((err) => {
               if (err.response.status === 422) {
                  this.error = err.response.data.message;
               }
               console.error(err);
            });
      },

      async signOut() {
         await axios.post("auth/logout",
            {}, {
               headers: {
                  Authorization: 'Bearer ' + this.token
               }
            }
         )
            .then((res) => {
               delete axios.defaults.headers.common["Authorization"];
               localStorage.removeItem("token");
               localStorage.removeItem("user");
            })
            .catch((err) => {
               if (err.response.status === 422) {
                  this.error = err.response.data.message;
               }
               console.error(err);
            });
      },
   },

   getters: {
      getUser(state) {
         return state.user;
      },
   },
});
