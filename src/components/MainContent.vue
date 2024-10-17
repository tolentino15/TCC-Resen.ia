<template>
  <v-sheet :elevation="5" color="#6A6969" class="textbox">
    <v-container class="cont">
      <!-- Chat Area -->
      <div class="chat-area">
        <div v-for="(message, index) in messages" :key="index" class="message-box">
          <div :class="message.role === 'user' ? 'user-message' : 'gpt-message'">
            {{ message.text }}
          </div>
        </div>
      </div>

      <!-- Record and Transcribe Area -->
      <v-btn
        prepend-icon="mdi-microphone"
        variant="outlined"
        class="record-btn"
        :disabled="isProcessing"
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
import { GoogleGenerativeAI } from '@google/generative-ai';

const transcript = ref('');
const isRecording = ref(false);
const isProcessing = ref(false);
const messages = ref([]);
const mediaRecorder = ref(null);

const genAI = new GoogleGenerativeAI(process.env.VITE_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

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


const processAudioToText = async (base64Audio) => {
  const apiKey = import.meta.env.VITE_GOOGLE_TRANSCRIPTION_API_KEY;
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

      messages.value.push({ role: 'user', text: transcript.value });

      const geminiReply = await callGeminiApi(transcript.value);

      messages.value.push({ role: 'gpt', text: geminiReply });
    } else {
      transcript.value = 'Nenhum texto reconhecido.';
    }
  } catch (error) {
    console.error('Erro ao transcrever o áudio:', error);
  } finally {
    isProcessing.value = false;
  }
};

const callGeminiApi = async (message) => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  try {
    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: message }],
        },
      ],
      generationConfig: {
        maxOutputTokens: 100,
      },
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Erro ao chamar a API do Gemini:', error.response ? error.response.data : error.message);
    return 'Erro ao gerar resposta.';
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

.chat-area {
  height: 400px;
  overflow-y: scroll;
  padding: 16px;
  background-color: #f5f5f5;
  border-radius: 8px;
  margin-bottom: 16px;
}

.message-box {
  margin-bottom: 16px;
}

.user-message {
  background-color: #e1f5fe;
  color: #0277bd;
  padding: 10px;
  border-radius: 8px;
  text-align: right;
}

.gpt-message {
  background-color: #e0e0e0;
  color: #333;
  padding: 10px;
  border-radius: 8px;
  text-align: left;
}

.record-btn {
  background-color: #20232A;
  position: absolute;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
}
</style>
