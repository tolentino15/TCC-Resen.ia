<template>
    <main>


        <v-card>

            Config

        </v-card>

    <v-card>
    <v-tabs
      v-model="tab"
      bg-color="#20232A"
    >
      <v-tab value="one">Item One</v-tab>
      <v-tab value="two">Item Two</v-tab>
      <v-tab value="three">Item Three</v-tab>
    </v-tabs>

    <v-card-text>
      <v-tabs-window v-model="tab">
        <v-tabs-window-item value="one">
          One
        </v-tabs-window-item>

        <v-tabs-window-item value="two">
          Two
        </v-tabs-window-item>

        <v-tabs-window-item value="three">
          Three
        </v-tabs-window-item>
      </v-tabs-window>
    </v-card-text>
  </v-card>

</main>
</template>

<script >
    export default {
    data: () => ({
      tab: null,
    }),
    }
</script>