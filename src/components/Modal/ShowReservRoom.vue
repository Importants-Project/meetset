<template>
   <div class="modal-overlay">
      <div class="modal" @click.stop>
         <div class="modal__head">
            <h6 v-if="showDeleteButtons" class="modal__head-title">Otaq rezervasiyasını sil</h6>

            <h6 v-else-if="showEditButtons" class="modal__head-title">Otaq rezervasiyasını redaktə et</h6>

            <h6 v-else class="modal__head-title">Otaq rezervasiyasının detalları</h6>

            <span class="modal__head-close" @click="close">
                    <img
                       loading="lazy"
                       src="../../assets/images/svg/modalClose.svg"
                       alt="close_img"
                    />
                </span>
         </div>

         <div v-if="showDeleteButtons">
            <form class="modal__form" @submit.prevent="handleDelete(updateReservation)">

               <p class="modal__form-delete">
                  Bu otaq rezervasiyasını silmək istədiyinizə əminsinizmi?
               </p>

               <div v-if="showDeleteButtons" class="modal__form-group modal__flex">
                  <button
                     type="button"
                     class="submitWhite"
                     @click="close"
                     aria-label="Xeyr">
                     Xeyr
                  </button>
                  <button

                     type="submit"
                     class="submitWhite"
                     id="messg"
                     aria-label="Bəli"
                  >
                     <span>Bəli</span>

                  </button>
               </div>

            </form>
         </div>

         <div v-else>
            <form class="modal__form" @submit.prevent="updateHandler">

               <div class="modal__form-group">
                  <DatePicker
                     :popover="{ visibility: 'focus' }"
                     :min-date="new Date()"
                     :max-date="new Date(2030, 1, 4)"

                     ref="datePicker"
                     v-model.lazy="updateReservation.start_date"
                  >
                     <template #default="{ inputValue, inputEvents }">
                        <input class="input " placeholder="Tarix" :value="inputValue" v-on="inputEvents"/>
                        <img @click="$refs.datePicker.togglePopover()" class='input-icon'
                             src="../../assets/images/svg/calendar.svg" alt="input-icon"/>
                     </template>
                  </DatePicker>


                  <span
                     class="errorText"
                     v-for="error in v$.updateReservation.start_date.$errors"
                     :key="error.$uid"
                  >
                          {{ error.$message }}
                        </span>
               </div>

               <div class="modal__flex modal__form-group" style="margin-bottom: 30px">
                  <div class="input" style="margin-right: 10px">
                     <ejs-timepicker
                        v-model.lazy="updateReservation.start_time"
                        id="startPicker"
                        :change="onEnableEndTime"
                        :enabled="true"
                        :min="currentDateTime"
                        :openOnFocus="true"
                        :readonly="startRead"
                        :placeholder="waterMark"
                        :format="timeFormat"
                        :value="startVal"
                        :step="step"
                     ></ejs-timepicker>

                     <span
                        class="errorText"
                        v-for="error in v$.updateReservation.start_time.$errors"
                        :key="error.$uid"
                     >
                             Başlama vaxti boş ola bilməz error
                          </span>
                  </div>

                  <div class="input">
                     <ejs-timepicker
                        v-model.lazy="updateReservation.end_time"
                        id="endPicker"
                        :placeholder="waterMark"
                        :enabled="true"
                        :openOnFocus="true"
                        :readonly="endRead"
                        :min="min"
                        :step="step"
                        :format="timeFormat"
                        :value="endVal"
                        :change="changeValue"
                     ></ejs-timepicker>

                     <span
                        class="errorText"
                        v-for="error in v$.updateReservation.end_time.$errors"
                        :key="error.$uid"
                     >
                Bitmə vaxti boş ola bilməz
              </span>
                  </div>
               </div>

               <div class="modal__form-group">
                  <CustomSelect
                     :options="useStoreRoom.getRoom"
                     :default="updateReservation.room_id"
                     class="select"
                     @selectValue="chooseRoom"
                  />

                  <span
                     class="errorText"
                     v-for="error in v$.updateReservation.room_id.$errors"
                     :key="error.$uid"
                  >
              Otaq boş ola bilməz
            </span>
               </div>

               <div class="modal__form-group">
                  <label for="user" class="label">İclası təşkil edən şəxsin adı və soyadı</label>
                  <input
                     v-model.lazy="updateReservation.organizer_name"
                     class="input input__100"
                     id="user"
                     type="text"
                     maxlength="250"
                  />

                  <span
                     class="errorText"
                     v-for="error in v$.updateReservation.organizer_name.$errors"
                     :key="error.$uid"
                  >

              İclası təşkil edən şəxs boş ola bilməz
            </span>
               </div>

               <div class="modal__form-group">
                  <label for="emails" class="label">Dəvət ediləcək şəxslərin mail ünvanları</label>

                  <div class="tag-input input input__100 input__height-auto">
                     <div
                        v-for="(tag, index) in updateReservation.emails"
                        :key="tag"
                        class="tag-input__tag"
                     >
                        {{ tag }}
                        <button
                           aria-label="x"
                           @click="removeTag(index)"
                        >
                           x
                        </button>
                     </div>

                     <textarea
                        class="tag-input__text"
                        maxlength="50"
                        @keydown.enter="addTag"
                        @keydown.188="addTag"
                        @keyup.space="addTag"
                        @keydown.enter.prevent
                        @keydown.delete="removeLastTag"
                        @focusout="userStore.error = null"

                     />
                  </div>

                  <span class="errorText" v-if="emailLengthValid === false">
                  Mail boş ola bilməz
               </span>
                  <span class="errorText"
                        v-if="updateReservation.emails && updateReservation.emails.length && emailLengthType === false">
                  Maildə səhvlik var
               </span>

               </div>

               <div class="modal__form-group">
                  <input
                     class="input input__100"
                     id="title"
                     placeholder="Görüşün başlığı"
                     type="text"
                     maxlength="250"
                     v-model.lazy="updateReservation.title"
                  />

                  <span
                     class="errorText"
                     v-for="error in v$.updateReservation.title.$errors"
                     :key="error.$uid"
                  >
              Görüşlə başlığı boş ola bilməz
            </span>
               </div>

               <div class="modal__form-group">
            <textarea
               class="input input__100 input__height"
               placeholder="Görüşlə bağlı qeydlər"
               style="background: none;"
               v-model.lazy="updateReservation.comment"
               maxlength="500"

            />
               </div>

               <div v-if="showEditButtons" class="modal__form-group modal__flex">
                  <button
                     type="button"
                     class="submitWhite"
                     aria-label="Silmək"
                     @click="activeDelete"
                  >
                     Sil
                     <img
                        loading="lazy"
                        src="../../assets/images/svg/delet.svg"
                        alt="delet"
                     />
                  </button>
                  <button
                     type="submit"
                     class="submit"
                     id="messg"
                     aria-label="Yadda Saxla"
                  >
                     <span>Yadda saxla</span>
                  </button>
               </div>


            </form>

         </div>

      </div>
   </div>
   <div v-show="clickLoad" class="loading-dots">
      <loading/>
   </div>
</template>

<script>
import {useReservationStore} from "../../stores/reservations";
import {useRoomStore} from "../../stores/room";
import {TimePickerComponent} from "@syncfusion/ej2-vue-calendars";
import moment from "moment";
import {useVuelidate} from "@vuelidate/core";
import {required} from "@vuelidate/validators";
import CustomSelect from "@/components/Modal/Dropdown.vue";
import {DatePicker} from "v-calendar";
import Loading from "@/components/Loading.vue";

export default {
   props: ["item", "itemRoom"],
   components: {
      Loading,
      "ejs-timepicker": TimePickerComponent,
      CustomSelect,
      DatePicker,

   },


   data() {
      return {
         datePickerOptions: {
            monthNames: ["Yanvar", "Fevral", "Mart", "Aprel", "May", "İyun", "İyul", "Avqust", "Sentyabr", "Oktyabr", "Noyabr", "Dekabr"],
            dayNamesNarrow: ["Ba", "Ba.e", "Çə.a", "Çə", "Cü.a", "Cü", "Şə"]
         },
         clickLoad: false,
         updateReservation: {},
         updateReservationRoom: {},

         emailLengthValid: null,
         emailLengthType: null,

         showEditButtons: true,
         showDeleteButtons: false,
         timeFormat: "HH:mm",
         limit: 250,
         waterMark: "Saat",
         currentDateTime: new Date(),
         endEnable: false,
         startEnable: false,
         startRead: false,
         endRead: false,
         min: null,
         isStartTimeChange: true,
         step: 10,
         endVal: null,
         startVal: null,
      };
   },

   validations() {
      return {
         updateReservation: {
            end_time: {required},
            start_time: {required},
            organizer_name: {required},
            start_date: {required},
            room_id: {required},
            title: {required},
         },
      };
   },

   mounted() {
      this.updateReservation = JSON.parse(JSON.stringify(this.item));
      //Object.assign(this.updateReservation, this.item);
      Object.assign(this.updateReservationRoom, this.itemRoom);

      this.$refs.datePicker.$locale.monthNames = [...this.datePickerOptions.monthNames];
      this.$refs.datePicker.$locale.dayNamesNarrow = [...this.datePickerOptions.dayNamesNarrow];
   },
   methods: {

      chooseRoom(event) {
         this.updateReservation.room_id = event.id;
         // this.updateReservation.emails = [];
      },

      addTag(event) {

         let room = this.getRoom.find(
            (item) => item.id === this.updateReservation.room_id
         );

         if (room.capacity <= this.updateReservation.emails.length) {
            return;
         }

         let val = event.target.value.trim();

         if (this.updateReservation.emails.includes(val)) {
            return;
         }
         if (val.length > 0) {
            this.updateReservation.emails.push(val);
            event.target.value = "";
         }
      },

      removeTag(index) {
         this.updateReservation.emails.splice(index, 1);
      },
      removeLastTag(event) {
         if (event.target.value.length === 0) {
            this.removeTag(this.updateReservation.emails.length - 1);
         }
      },
      activeDelete() {
         this.showDeleteButtons = true;
         this.showEditButtons = false;
      },

      async handleDelete(item) {
         this.clickLoad = true;
         await this.userStore.deletReservation(item);
         await this.useStoreRoom.fetchRoom();
         this.clickLoad = false;
         this.emitter.emit("refresh");
         this.close()
         this.$toast.success(`Uğurla silindi`);
      },

      async updateHandler(e) {
         if (this.updateReservation.emails.length <= 0) {
            this.emailLengthValid = false;
         }

         if ((await this.v$.$validate()).valueOf() === false) {
            return
         }

         if (this.emailLengthValid === false || this.emailLengthType === false) {
            return
         }

         this.clickLoad = true;

         this.updateReservation.start_date = this.formattedDate;
         this.updateReservation.start_time = this.formattedTime;
         this.updateReservation.end_time = this.formattedEndTime;

         await this.userStore.updateReservation(this.updateReservation);
         await this.useStoreRoom.fetchRoom();
         this.emitter.emit("refresh");


         if (this.userStore.errorMsg) {
            this.clickLoad = false;
            this.$toast.error(this.userStore.errorMsg);
         }

         if (!this.userStore.error && !this.userStore.errorMsg && this.showEditButtons) {
            this.clickLoad = false;
            this.close();
            this.$toast.success(`Uğurla redaktə olundu`);
         }

         if (this.userStore.error) {
            this.clickLoad = false;
         }
      },

      close() {
         this.$emit("close-modal");
         this.userStore.errorMsg = "";
         this.userStore.error = [];
      },

      changeValue: function (args) {
         this.endVal = args.value;
      },

      onEnableEndTime: function (args) {
         let value;
         if (this.isStartTimeChange) {
            this.endEnable = true;
            this.endVal = null;
            value = new Date(args.value);
            value.setMinutes(value.getMinutes() + this.step);
            this.min = value;

         } else {
                       this.isStartTimeChange = true;
         }
      },
   },

   setup() {
      const userStore = useReservationStore();
      const useStoreRoom = useRoomStore();
      return {userStore, useStoreRoom, v$: useVuelidate()};
   },

   watch: {

         dateDifference(val) {
            if (val === true) {
               this.currentDateTime = new Date(2023, 1, 1, 0);
            } else {
               this.currentDateTime = new Date();
            }
         },


      'updateReservation.emails': {
         handler() {
            if (this.updateReservation.emails.length <= 0) {
               this.emailLengthValid = false;
            } else {
               this.emailLengthValid = true;
            }

            this.updateReservation.emails.forEach(email => {
               if (email.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
                  this.emailLengthType = true
               } else {
                  this.emailLengthType = false
               }
            })
         },
         deep: true
      }
   },

   computed: {
      dateDifference() {
         if (this.updateReservation.start_date && new Date()) {
            console.log('true')
            return this.updateReservation.start_date > new Date();
         }
      },

      startVal() {
         // Round the current time to the nearest 10-minute interval
         const currentMinute = this.currentDateTime.getMinutes();
         const roundedMinute = Math.ceil(currentMinute / 10) * 10;
         this.currentDateTime.setMinutes(roundedMinute);

         // Return the rounded time as the start value
         return this.updateReservation.start_time;
      },


      getRoom() {
         return this.useStoreRoom.getRoom;
      },

      formattedTime() {
         return moment(this.updateReservation.start_time, "H:mm").format("HH:mm");
      },
      formattedDate() {
         return moment(this.updateReservation.start_date,).format('YYYY-MM-DD');
      },

      formattedEndTime() {
         return moment(this.updateReservation.end_time, "H:mm").format("HH:mm");
      },
   },
};
</script>