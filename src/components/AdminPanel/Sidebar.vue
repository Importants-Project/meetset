<template>
    <aside class="sidebar">
<!--       :src="useSetting.getSetting.logo"-->
        <img
           src="../../assets/images/logo/logo.png"
            alt="sidebar logo"
            class="sidebar__logo"
        />

        <div v-for="item in nav" :key="item.id">
            <router-link
                :class="['sidebar__item', { active: item.route === $route.path }]"
                :to="item.route"
            >
                <img loading="lazy"
                     class="sidebar__item-img"
                     :src="getImageUrl(item.img)"
                     :alt="item.name"
                />
                {{ item.name }}
            </router-link>
        </div>
        <span style="cursor:pointer" @click="logout()" class="sidebar__item">
              <img loading="lazy"
                   class="sidebar__item-img"
                   src="../../assets/images/svg/exit.svg"
                   alt="exit"
              />
            Çıxış
        </span>

        <router-view/>
    </aside>

    <div v-show="clickLoad" class="loading-dots">
        <loading/>
    </div>
</template>

<script>
import {useUserStore} from "../../stores/auth";
import {useSettingStore} from "../../stores/setting";
import {onMounted} from "vue";
import Loading from "@/components/Loading.vue";

export default {
    setup() {
        const userStore = useUserStore();
        const useSetting = useSettingStore();

        onMounted(() => {
            useSetting.fetchSetting();
        });
        const getImageUrl = (name) => {
            return new URL(`../../assets/images/svg/${name}`, import.meta.url).href;
        };

        return {getImageUrl, userStore, useSetting};
    },

    computed() {
        return this.nav.find((item) => item.id === selected.value);
    },

    components:{
        Loading
    },

    data() {
        return {
            logo: '/src/assets/images/logo/whiteLogo.png',
            selected: 1,
            clickLoad:false,
            nav: [
                {
                    id: "1",
                    name: "İstifadəçilər",
                    route: "/admin",
                    img: "profile.svg",
                },
                {
                    id: "2",
                    name: "Otaqlar",
                    route: "/rooms",
                    img: "rooms.svg",
                },
                {
                    name: "Tənzimləmələr",
                    route: "/settings",
                    img: "settings.svg",
                },
            ],
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
    },
};
</script>