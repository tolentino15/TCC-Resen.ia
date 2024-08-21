<template>


<v-container>

  <v-textarea 
    clearable 
    label="Label" 
    variant="outlined"
    class="textbox"
    bg-color="grey-lighten-2"
    color="black"
    ></v-textarea>

    <v-btn 
    prepend-icon="mdi-microphone" 
    variant="outlined">

      Converter para Texto

    </v-btn>  

</v-container>



</template>

<script setup lang="ts">
//
</script>

<style>

.textbox{
  margin-top: 20%;
}

</style>