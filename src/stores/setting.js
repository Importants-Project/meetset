import {defineStore} from "pinia";
import axios from "axios";

if (localStorage.getItem("token")) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${localStorage.getItem("token")}`;
}

export const useSettingStore = defineStore("setting", {
    state: () => ({
        setting: [],
        error: [],
        errorMsg: "",
        token: localStorage.getItem("token") || "",
    }),

    actions: {
        async fetchSetting() {
            try {
                await axios.get(`setting`)
                    .then((res) => {
                        const setting = res.data;
                        this.setting = setting;
                        return setting
                    });
            } catch (error) {
                console.error(error);
            }
        },

        async updateSetting(data) {
            this.error = null;
            this.errorMsg = null;
            await axios.post(`setting/update`, data)
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
    },

    getters: {
        getSetting: (state) => state.setting,
    },
});
