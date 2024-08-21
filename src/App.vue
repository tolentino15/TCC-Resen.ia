<template>
  <v-app>
    <v-app-bar title="RESEN.IA" class="AppBar"></v-app-bar>

    <v-navigation-drawer permanent class="NavBar">
      <v-list-item subtitle="MENU"></v-list-item>
      <v-divider></v-divider>
      <v-list-item link title="Início"></v-list-item>
      <v-list-item link title="Feedbacks"></v-list-item>
      <v-list-item link title="Produtos"></v-list-item>
    </v-navigation-drawer>

    <router-view />
    
  </v-app>

</template>

<script lang="ts" setup>



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