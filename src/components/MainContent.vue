<template>
    <v-sheet
    :elevation="5"
     color="#6A6969"
     class="textbox"
    >
  <v-container class="cont">
    <v-textarea
      clearable
      auto-grow
      variant="solo"
      bg-color="grey-lighten-2"
      color="black"
      v-model="transcript"
      readonly
    ></v-textarea>

      <v-btn
      prepend-icon="mdi-microphone"
      variant="outlined"
      class="record-btn"
      @click="isRecording ? stopRecording() : startRecording()"
      >
      {{ isRecording ? 'Parar Gravação' : 'Iniciar Gravação' }}

  <v-progress-circular
      
      v-if="isProcessing"
      :width="3"
      color="white"
      indeterminate
    ></v-progress-circular>

    </v-btn>

   
  
  </v-container>
  </v-sheet>
</template>

<script setup>
import axios from 'axios';
import { ref } from 'vue';

const transcript = ref('');
const isRecording = ref(false);
const isProcessing = ref(false);
const gptResponse = ref(''); // To store GPT response
const mediaRecorder = ref(null);

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

// Call GPT API after transcribing text
const callGPTApi = async (userInput) => {
  const gptApiKey = '*GPT API KEY*'; // Your GPT API key here
  const requestData = {
    model: 'gpt-4', // Specify the model
    messages: [
      { role: 'system', content: 'You are a helpful assistant.' },
      { role: 'user', content: userInput },
    ],
  };

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      requestData,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${gptApiKey}`,
        },
      }
    );

    gptResponse.value = response.data.choices[0].message.content; // Store GPT response
  } catch (error) {
    console.error('Erro ao acessar o GPT API:', error);
  }
};

// Transcribe audio and then send the transcript to GPT
const processAudioToText = async (base64Audio) => {
  const apiKey = 'AIzaSyAfsRfMbKJw4veL9BlNiiR17WjyrN9BN0I'; // Add your Google API key here
  const requestData = {
    config: {
      encoding: 'WEBM_OPUS',
      sampleRateHertz: 48000,
      languageCode: 'pt-BR', // Set the language of the input
    },
    audio: {
      content: base64Audio,
    },
  };

  try {
    isProcessing.value = true;
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
      
      // After transcribing, call GPT API with the transcribed text
      await callGPTApi(transcript.value);
    } else {
      transcript.value = 'Nenhum texto reconhecido.';
    }
  } catch (error) {
    console.error('Erro ao transcrever o áudio:', error);
  } finally {
    isProcessing.value = false;
  }
};
</script>

<style>
.textbox {
  position: absolute;
  top: 140px; 
  left: 150px;
  right: 16px;
  bottom: 16px;
  margin: 0;
  padding: 16px;
  box-sizing: border-box;
  background-color: #6A6969;
}


.cont {
  height: 100%;
  position: relative;
}

.record-btn {
  background-color: #20232A;
  position: absolute;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
}

</style>