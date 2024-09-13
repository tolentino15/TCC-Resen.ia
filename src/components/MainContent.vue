<template>
  <v-container>
    <v-textarea
      clearable
      label="Texto Transcrito"
      variant="outlined"
      class="textbox"
      bg-color="grey-lighten-2"
      color="black"
      v-model="transcript"
      readonly
    ></v-textarea>

    <v-btn
      prepend-icon="mdi-microphone"
      variant="outlined"
      @click="isRecording ? stopRecording() : startRecording()"
    >
      {{ isRecording ? 'Parar Gravação' : 'Iniciar Gravação' }}
    </v-btn>
  </v-container>
</template>

<script setup>
import axios from 'axios';
import { ref } from 'vue';

// State para armazenar o texto transcrito e o estado da gravação
const transcript = ref('');
const isRecording = ref(false); 
const mediaRecorder = ref(null); 

// Função para converter Blob de áudio para Base64
const audioBlobToBase64 = (blob) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const arrayBuffer = reader.result;
      const base64Audio = btoa(
        new Uint8Array(arrayBuffer).reduce(
          (data, byte) => data + String.fromCharCode(byte),
          ''
        )
      );
      resolve(base64Audio);
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(blob);
  });
};

const startRecording = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder.value = new MediaRecorder(stream);
    mediaRecorder.value.start();
    isRecording.value = true;

    mediaRecorder.value.addEventListener('dataavailable', async (event) => {
      const audioBlob = event.data;
      const base64Audio = await audioBlobToBase64(audioBlob);

      // Processar o áudio para transcrição
      await processAudioToText(base64Audio);
    });
  } catch (error) {
    console.error('Erro ao acessar o microfone:', error);
  }
};

const stopRecording = () => {
  if (mediaRecorder.value) {
    mediaRecorder.value.stop();
    isRecording.value = false;
  }
};

// Função para enviar o áudio para o Google Cloud Speech-to-Text
const processAudioToText = async (base64Audio) => {
  const apiKey = '*API KEY*';
  const requestData = {
    config: {
      encoding: 'WEBM_OPUS',
      sampleRateHertz: 48000,
      languageCode: 'pt-BR',
    },
    audio: {
      content: base64Audio,
    },
  };

  try {
    const response = await axios.post(
      `https://speech.googleapis.com/v1/speech:recognize?key=${apiKey}`,
      requestData,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.data && response.data.results && response.data.results.length > 0) {
      transcript.value = response.data.results[0].alternatives[0].transcript;
    } else {
      transcript.value = 'Nenhum texto reconhecido.';
    }
  } catch (error) {
    console.error('Erro ao transcrever o áudio:', error);
  }
};
</script>

<style>
.textbox {
  margin-top: 20%;
}
</style>
