<template>
  <div class="modal-overlay">
    <div class="modal modal__user" @click.stop>
      <div class="modal__head">
        <h6 class="modal__head-title">İstifadəçi yarat</h6>
        <span class="modal__head-close" @click="close()"
          ><img
            loading="lazy"
            src="../../../../assets/images/svg/modalClose.svg"
            alt="modalClose"
        /></span>
      </div>
      <form class="modal__form" @submit.prevent="addPerson">
        <div class="modal__form-group">
          <input
            class="input input__100"
            v-model.trim="name"
            maxlength="250"
            placeholder="Ad, soyad"
            type="text"
          />

          <span
            class="errorText"
            v-for="error in v$.name.$errors"
            :key="error.$uid"
          >
            Ad boş ola bilməz
          </span>
        </div>

        <div class="modal__form-group">
          <input
            class="input input__100"
            v-model.trim="fin_code"
            placeholder="FİN nömrə"
            maxlength="7"
            type="text"
          />
          <span
            class="errorText"
            v-for="error in v$.fin_code.$errors"
            :key="error.$uid"
          >
            Fin boş ola bilməz
          </span>
        </div>

        <div class="modal__form-group">
          <input
            class="input input__100"
            placeholder="Əməkdaşı olduğu şöbə"
            type="text"
            maxlength="250"
            v-model.trim="position"
          />

          <span
            class="errorText"
            v-for="error in v$.position.$errors"
            :key="error.$uid"
          >
            Vəzifə boş ola bilməz
          </span>
        </div>

        <div class="modal__form-group">
          <input
            class="input input__100"
            v-model.trim="email"
            placeholder="Mail"
            maxlength="250"
            type="text"
            autocomplete="off"
          />
            <span class="errorText" v-if="userStore.errorMsg">Email mövcuddur</span>

          <span
            class="errorText"
            v-for="error in v$.email.$errors"
            :key="error.$uid"
          >
            {{error.$message === 'Value is required' ? 'Mail boş ola bilməz' : 'Mail səhvlik var'}}
          </span>
        </div>

        <div class="modal__form-group">
          <input
            v-if="passwordShow"
            class="input input__100"
            placeholder="Şifrə"
            v-model.trim="password"
            maxlength="64"
            type="text"
          />

          <input
            v-else
            class="input input__100"
            placeholder="Şifrə"
            maxlength="64"
            v-model.trim="password"
            type="password"
          />

          <div class="modal__form-img" @click="showPass()">
            <img
              loading="lazy"
              v-if="passwordShow"
              class="formBox__img"
              src="../../../../assets/images/svg/passwordShowEye.svg"
              alt="meetSet Icon"
            />

            <img
              loading="lazy"
              v-else
              class="formBox__img"
              src="../../../../assets/images/svg/passwordEye.svg"
              alt="meetSet Icon"
            />
          </div>

          <span
            class="errorText"
            v-for="error in v$.password.$errors"
            :key="error.$uid"
          >
            {{error.$message === 'Value is required' ? 'Şifrə boş ola bilməz' : 'Şifrə min 6 simvol olmalıdır'}}
          </span>
        </div>
        <div class="modal__form-group modal__flex">
          <button type="button" class="submitWhite" @click="close">İmtina</button>

          <button
            class="submit"
            aria-label="Əlavə et"
            type="submit"
            placeholder="Görüşlə bağlı qeydlər"
          >
            <span>Əlavə et</span>
          </button>
        </div>
      </form>


    </div>

     <div v-show="clickLoad" class="loading-dots">
        <loading/>
     </div>
  </div>

</template>

<script>
import { usePersonStore } from "../../../../stores/user";
import { useVuelidate } from "@vuelidate/core";
import { required, minLength ,email } from "@vuelidate/validators";
import { ref } from "vue";
import Loading from "@/components/Loading.vue";
export default {
  components: {Loading},
  data() {
    return {
      name: "",
      email: "",
      password: "",
      fin_code: "",
      position: "",
      clickLoad: false,
    };
  },
  methods: {
    async addPerson(event) {
      const result = await this.v$.$validate();


      if (result) {
        this.clickLoad = true;

        await this.userStore.createPerson(
          this.name,
          this.fin_code,
          this.position,
          this.email,
          this.password
        );
        await this.userStore.fetchPerson();

          if (this.userStore.errorMsg) {
              this.clickLoad = false;
          }

          if (!this.userStore.error && !this.userStore.errorMsg) {

              this.clickLoad = false;
              this.$toast.success(`Istifadəçi uğurla yarandıldı`);
              this.name = "";
              this.fin_code = "";
              this.position = "";
              this.email = "";
              this.userStore.errorMsg = "";
              this.userStore.error = "";
              this.password = "";
              this.$emit("close-modal");

              this.v$.$reset();
          }
      }
    },
    showPass() {
      this.passwordShow = !this.passwordShow;
    },

    close() {
      this.$emit("close-modal");
    },
  },

  validations() {
    return {
      name: { required },
      email: { required,email },
      password: { required,minLength: minLength(6)},
      fin_code: { required },
      position: { required },
    };
  },

  setup() {
    const userStore = usePersonStore();
    const passwordShow = ref(false);

    return { userStore, passwordShow, v$: useVuelidate() };
  },
};
</script>
