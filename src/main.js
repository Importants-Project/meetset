import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import 'v-calendar/dist/style.css';
import {registerLicense} from '@syncfusion/ej2-base';
import Toaster from "@meforma/vue-toaster";
import axios from "axios";

import '../node_modules/@syncfusion/ej2-base/styles/material.css';
import '../node_modules/@syncfusion/ej2-inputs/styles/material.css';
import '../node_modules/@syncfusion/ej2-popups/styles/material.css';
import '../node_modules/@syncfusion/ej2-lists/styles/material.css';
import "../node_modules/@syncfusion/ej2-vue-calendars/styles/material.css";
import './assets/main.scss';
import mitt from 'mitt';
import 'normalize.css';


const pinia = createPinia()

axios.defaults.baseURL = 'https://meetset.al.ventures/api/'
registerLicense("Mgo+DSMBaFt/QHRqVVhlX1pAaV5AQmFJfFBmRGlceVRwfUU3HVdTRHRcQl5iSn5Sc01nXHZfc3Q=;Mgo+DSMBPh8sVXJ0S0J+XE9BdVRGQmJLYVF2R2BJflR1cl9GaUwgOX1dQl9gSX1SdUViXHdadX1WQmA=;ORg4AjUWIQA/Gnt2VVhkQlFac1xJWXxIfEx0RWFab196cVNMYFVBNQtUQF1hSn5Qd0ZjWHpWdHFcQ2Bc;MTMwODg4MUAzMjMwMmUzNDJlMzBiNVExaXBWb2VtNkNoQzdXMDk4M2JLc2VKOEgyd2Nid2RvM2VDWHA5VHdZPQ==;MTMwODg4MkAzMjMwMmUzNDJlMzBNbGE0ekY0ZWU2Vlc5UDJXMzJjV1prRWhvUVVteUxJMCt4anFrVGlTT3J3PQ==;NRAiBiAaIQQuGjN/V0Z+WE9EaFpBVmdWf1FpR2NbfE5xflBAalxYVAciSV9jS31TdURgWX5beHBTRmheUQ==;MTMwODg4NEAzMjMwMmUzNDJlMzBMaEc0V0lWMnlyZ0RRMVhYVmY5L0JDaHhSZjhjY0hEWVpDK01tcHBMUk1zPQ==;MTMwODg4NUAzMjMwMmUzNDJlMzBoSHRFSU9vajY0UEg5cmkwVnRDRDNYbHk4bUZNZFNBRzF0U25WajRoNlA4PQ==;Mgo+DSMBMAY9C3t2VVhkQlFac1xJWXxIfEx0RWFab196cVNMYFVBNQtUQF1hSn5Qd0ZjWHpWdHJUQ2Fc;MTMwODg4N0AzMjMwMmUzNDJlMzBNai91OUs0TUxadWh6clR1VXJ5S29rQXdMLzNTRVJhQ3JLRVFEbXZFVit3PQ==;MTMwODg4OEAzMjMwMmUzNDJlMzBWa2hKaEpsajNTRGJaV1V0amZlMkZKclBHaCtLRzRxMXQ0cTcvWk1kQjRzPQ==;MTMwODg4OUAzMjMwMmUzNDJlMzBMaEc0V0lWMnlyZ0RRMVhYVmY5L0JDaHhSZjhjY0hEWVpDK01tcHBMUk1zPQ==")

const emitter = mitt();

const app = createApp(App).use(pinia).use(router).use(Toaster);

app.config.globalProperties.emitter = emitter;
app.mount("#app")

