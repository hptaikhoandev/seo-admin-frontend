<script lang="ts">
import { defineComponent, ref, type Ref, computed } from 'vue';


export default defineComponent({
  name: 'HdsdPage',
  components: {
    //
  },
  data() {
    return {
      pdfUrl: './src/assets/pdf/hdsd.pdf' + '#view=FitH&navpanes=0',
      loading: ref(false),
    };
  },

  mounted() {
    // 
  },
  created() {
    //

  },
  computed: {
    //
  },
  watch: {
    //
  },
  methods: {
    //
  }
});

</script>
<template>
    <v-row>
      <v-col cols="12">
        <iframe 
          :src="pdfUrl" 
          width="100%" 
          height="750px" 
          style="border: none;"
        >
        </iframe>
      </v-col>
    </v-row>
</template>

<style>
.custom-spacing .v-label {
  margin-bottom: 25px;
}

</style>
