<template>
   <div class="container">
      <div class="main">
         <div class="login">
            <LoginBox/>
         </div>

         <div class="loginSecond__box">
            <p>Görüş və iclasların öncədən planlanması</p>
         </div>
      </div>
   </div>
</template>

<script>
import LoginBox from "./LoginBox.vue";

export default {
   components: {
      LoginBox,
   }
}
</script>