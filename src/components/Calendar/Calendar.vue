<template>
   <CalendarHeader/>

   <div class="calendar">
      <div class="container">
         <div class="flexCalendar">
            <div class='v-calendarAll'>
               <client-only>
                  <DatePicker
                     color="blue"
                     v-model.lazy="date"
                     mode="date"
                     locale="ru"
                     @dayclick="dayClicked"
                     :attributes="attrs"
                     title-position="left"
                     is-inline
                     :rows="2"
                     ref="datePicker"
                  />
               </client-only>
            </div>

            <div class="table-wrapper">
               <div class="loading-dots" v-if="loader">
                  <loading/>
               </div>

               <Table
                  @success="download"
                  :key="componentKey"
                  :itemLable="formattedDate"
                  :itemDate="selectedDay?.id"
               />
            </div>
         </div>
      </div>
   </div>
</template>

<script>
import {Calendar, DatePicker} from "v-calendar";
import CalendarHeader from "./CalendarHeader.vue";
import Table from "./CalendarTable.vue";
import moment from "moment";
import az from 'moment/locale/az'
import {ref} from "vue";
import Loading from "@/components/Loading.vue";

export default {
   components: {
      Loading,
      Calendar,
      DatePicker,
      CalendarHeader,
      Table,
   },
   data() {
      return {
         datePickerOptions: {
            monthNames: ["yanvar", "fevral", "mart", "aprel", "may", "iyun", "iyul", "avqust", "sentyabr", "oktyabr", "noyabr", "dekabr"],
            monthNamesShort: ["yan", "fev", "mart", "apr", "may", "iyun", "iyul", "avq", "sent", "okt", "noy", "dek"],
            dayNamesNarrow: ["Ba", "Ba.e", "Çə.a", "Çə", "Cü.a", "Cü", "Şə"]
         },
         selectedDay: {
            id: moment().format(),
            ariaLabel: moment().format("LL")
         },
         date: moment().format("LL"),
         dates: moment().format("LL"),
         loader: true,
         attrs: [
            {
               key: "today",
               highlight: true,
               // highlight: {
                  // color: 'transparent',
                  // fillMode: 'light',
                  // borderColor: 'red',
                  // class: 'today'
               // },
               dates: moment().format("LL"),
            },
            {
               dot: true,
               dates: [
                  moment().format("LL"), // Jan 1st
               ],
            },
            {
               dot: true,
               dates: [
                  moment().format("LL"), // Jan 1st
               ],
            },
            {
               dot: true,
               dates: [
                  moment().format("LL"), // Jan 1st
               ],
            },
         ],
         azWeeks: ['B.E', 'Ç.A', 'ÇƏR', 'C.A', 'CÜM', 'ŞƏN', 'BAZ'],
         azMonths: ['yan', 'fev', 'mart', 'aprel', 'may', 'iyun', 'iyul', 'avg', 'sent', 'okt', 'noy', 'dek']
      };
   },
   setup() {
      const componentKey = ref(0);

      return {componentKey};
   },
   methods: {
      datePickerMonth() {
         const datePicker = document.querySelectorAll('.v-calendarAll .vc-pane-container .vc-title');

         datePicker.forEach(item => {
            if (item.textContent.split(' ')[0] === 'январь') item.textContent = `Yanvar ${item.textContent.split(' ')[1]}`;
            if (item.textContent.split(' ')[0] === 'февраль') item.textContent = `Fevral ${item.textContent.split(' ')[1]}`;
            if (item.textContent.split(' ')[0] === 'март') item.textContent = `Mart ${item.textContent.split(' ')[1]}`;
            if (item.textContent.split(' ')[0] === 'апрель') item.textContent = `Aprel ${item.textContent.split(' ')[1]}`;
            if (item.textContent.split(' ')[0] === 'май') item.textContent = `May ${item.textContent.split(' ')[1]}`;
            if (item.textContent.split(' ')[0] === 'июнь') item.textContent = `Iyun ${item.textContent.split(' ')[1]}`;
            if (item.textContent.split(' ')[0] === 'июль') item.textContent = `Iyul ${item.textContent.split(' ')[1]}`;
            if (item.textContent.split(' ')[0] === 'август') item.textContent = `Avgust ${item.textContent.split(' ')[1]}`;
            if (item.textContent.split(' ')[0] === 'сентябрь') item.textContent = `Sentyabr ${item.textContent.split(' ')[1]}`;
            if (item.textContent.split(' ')[0] === 'октябрь') item.textContent = `Oktyabr ${item.textContent.split(' ')[1]}`;
            if (item.textContent.split(' ')[0] === 'ноябрь') item.textContent = `Noyabr ${item.textContent.split(' ')[1]}`;
            if (item.textContent.split(' ')[0] === 'декабрь') item.textContent = `Dekabr ${item.textContent.split(' ')[1]}`;
         })

         this.datePickerDay();

      },
      datePickerMonthDropdown() {
         const datePickerTitles = document.querySelectorAll('.vc-pane .vc-title');
         const months = document.querySelectorAll('.vc-popover-content-wrapper');

         datePickerTitles.forEach(title => {
            title.addEventListener('click', () => {
               months.forEach(month => {
                  [...month.querySelectorAll('.vc-nav-item')].forEach((item, i) => {
                     item.textContent = this.azMonths[i];
                  })
               })
            })
         })
      },
      datePickerDay() {
         const datePicker1 = document.querySelectorAll('.v-calendarAll .vc-pane')[0].querySelectorAll('.vc-weekday');
         const datePicker2 = document.querySelectorAll('.v-calendarAll .vc-pane')[1].querySelectorAll('.vc-weekday');

         datePicker1.forEach((item, i) => {
            item.textContent = this.azWeeks[i];
            item.classList.add('active');
         });

         datePicker2.forEach((item, i) => {
            item.textContent = this.azWeeks[i];
            item.classList.add('active');
         });
      },
      download() {
         this.loader = false
      },
      dayClicked(day) {
         this.selectedDay = day;
         this.componentKey += this.selectedDay.day;
         this.loader = true;
      },
   },
   mounted() {

      if(this.loader){
         document.getElementById("app").style.overflow='hidden'
      }



      const vcArrows = document.querySelectorAll('.vc-pane-container .vc-arrow');

      this.datePickerMonth();
      // this.datePickerMonthDropdown();
      this.datePickerDay();

      vcArrows.forEach(btn => {
         btn.addEventListener('click', () => {
            this.datePickerMonth();
            // this.datePickerMonthDropdown();

            // setTimeout(() => {
            // }, 300);
         })
      })
   },
   computed: {
      formattedDate() {
         moment.updateLocale('az', {
            months: [
               "Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun", "Iyul",
               "August", "Sentyabr", "Oktyabr", "Noyabr", "Decabr"
            ]
         });

         return moment(this.date).format("MMMM Do, YYYY");
      }
   }
}
</script>