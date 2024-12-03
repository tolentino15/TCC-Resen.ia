<template>
  <v-app>
    <v-app-bar title="RESEN.IA" class="AppBar"></v-app-bar>

    <v-navigation-drawer permanent class="NavBar">
      <v-list-item subtitle="MENU"></v-list-item>
      <v-divider></v-divider>
      <v-list-item link @click="goToHome" title="Início"></v-list-item>
      <v-list-item link @click="goToFeedbacks" title="Feedbacks"></v-list-item>
      <v-list-item link @click="goToConfig" title="Configurações"></v-list-item>
    </v-navigation-drawer>

    <v-main>
      <router-view />
    </v-main>

    
    
  </v-app>

</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const goToHome = () => {
  router.push({ name: 'home' });
};

const goToFeedbacks = () => {
  router.push({ name: 'feedbacks' });
};

const goToConfig = () => {
  router.push({ path: 'config' }); 
};
</script>


<style>

.AppBar{

  background-color: #20232A !important;
  color: white !important;
}

.NavBar{

  background-color: #20232A !important;
  color: white !important;
  width: 130px !important;

}

</style>