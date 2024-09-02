<template>
  <v-container>
    <v-textarea 
      clearable 
      label="Label" 
      variant="outlined"
      class="textbox"
      bg-color="grey-lighten-2"
      color="black"
      v-model="transcript"  
    ></v-textarea>

    <v-btn 
      prepend-icon="mdi-microphone" 
      variant="outlined"
      @click="startRecording"> 
      Converter para Texto
    </v-btn>  
  </v-container>
</template>

<script setup lang="ts">
import axios from 'axios';
import { ref } from 'vue';

const transcript = ref(''); // State para armazenar o texto transcrito

// Função para iniciar a gravação de áudio
const startRecording = () => {
  navigator.mediaDevices.getUserMedia({ audio: true })
    .then(stream => {
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorder.start();

      const audioChunks: BlobPart[] = [];

      mediaRecorder.addEventListener("dataavailable", event => {
        audioChunks.push(event.data);
      });

      mediaRecorder.addEventListener("stop", () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        processAudioToText(audioBlob);
      });

      setTimeout(() => {
        mediaRecorder.stop();
      }, 5000); // Grava por 5 segundos
    });
};

// Função para processar o áudio e fazer a requisição à API Google Cloud Speech-to-Text
const processAudioToText = async (audioBlob: Blob) => {
  const apiKey = 'AIzaSyAfsRfMbKJw4veL9BlNiiR17WjyrN9BN0I';
  const reader = new FileReader();

  reader.onload = async () => {
    const audioBase64 = reader.result?.toString().split(',')[1];

    if (!audioBase64) {
      console.error('Erro ao converter áudio para base64.');
      return;
    }

    const requestData = {
      config: {
        encoding: 'LINEAR16',
        sampleRateHertz: 48000, // Ajustado para a taxa de amostragem correta
        languageCode: 'pt-BR',
      },
      audio: {
        content: audioBase64,
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
        transcript.value = response.data.results
          .map((result: any) => result.alternatives[0].transcript)
          .join('\n'); // Atualiza o textarea com o texto transcrito
      } else {
        console.warn('Nenhum resultado de reconhecimento foi retornado.');
        transcript.value = 'Nenhum texto reconhecido.';
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Erro durante o reconhecimento de fala:', error.message);
        if (error.response) {
          console.error('Detalhes do erro:', error.response.data);
        }
      } else {
        console.error('Erro inesperado:', error);
      }
    }
  };

  reader.readAsDataURL(audioBlob);
};

</script>

<style>
.textbox {
  margin-top: 20%;
}
</style>
