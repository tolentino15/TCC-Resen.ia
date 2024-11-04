<template>
  <v-sheet :elevation="5" color="#20232A" class="textbox">
    <v-container class="cont">
      <!-- Área de Chat -->
      <div class="chat-area">
        <div v-for="(message, index) in messages" :key="index" class="message-box">
          <div :class="message.role === 'user' ? 'user-message' : 'gpt-message'">
            {{ message.text }}
          </div>
        </div>
      </div>

      <!-- Botão de Gravação -->
      <v-btn
        prepend-icon="mdi-microphone"
        color="green"
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
      languageCode: 'en-US',
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
      console.log("Transcrição recebida:", transcript.value);

      messages.value.push({ role: 'user', text: transcript.value });

      const geminiReply = await callGeminiApi(transcript.value);

      messages.value.push({ role: 'AI', text: geminiReply });
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
    const prompt = `Você é um amigo próximo do usuário e vai conversar de forma descontraída sobre o dia a dia em inglês. Mantenha o tom amigável e, de tempos em tempos, troque o contexto da conversa para mantê-la dinâmica. Durante a conversa, avalie o nível de inglês do usuário de maneira sutil e, ao final, forneça um feedback completo e construtivo sobre o nível de inglês, destacando pontos fortes e áreas para melhorar, em português. Se o usuário perguntar algo relacionado a vocabulário ou gramática, diga de maneira sutil que não entendeu e peça para a pessoa repetir. Nunca corrija o usuário diretamente durante a conversa. Sempre mantenha o tom de uma conversa entre amigos, e sempre em inglês.`
    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: `${prompt}
${message}` }],
        },
      ],
      generationConfig: {
        maxOutputTokens: 100,
      },
    });

    // Verificar se o usuário deseja encerrar a conversa
    const lowerCaseMessage = message.toLowerCase();
    if (lowerCaseMessage.includes("bye") || lowerCaseMessage.includes("goodbye") || lowerCaseMessage.includes("see you") || lowerCaseMessage.includes("farewell")) {
      const feedback = generateFeedback(messages.value);
      return feedback;
    }

    const result = await chat.sendMessage(message);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Erro ao chamar a API do Gemini:', error.response ? error.response.data : error.message);
    return 'Erro ao gerar resposta.';
  }
};

const generateFeedback = (conversationHistory) => {
  let feedback = 'Obrigado pela conversa! Aqui está um feedback sobre o seu nível de inglês: ';
  let totalMessages = 0;
  let vocabularyErrors = 0;
  let grammarErrors = 0;
  let fluency = 0;

  conversationHistory.forEach((message) => {
    if (message.role === 'user') {
      totalMessages++;
      // Análise fictícia para avaliação do nível do inglês
      if (message.text.includes('mistake') || message.text.includes('wrong')) {
        vocabularyErrors++;
      }
      if (message.text.includes('error') || message.text.includes('incorrect')) {
        grammarErrors++;
      }
      fluency += Math.min(message.text.length, 5); // Avaliação fictícia de fluência
    }
  });

  feedback += `Você trocou aproximadamente ${totalMessages} mensagens comigo. Notei que há alguns erros de vocabulário em ${vocabularyErrors} de suas mensagens, e erros gramaticais em ${grammarErrors} delas. Além disso, sua fluência está em um nível consistente, mas há espaço para aprimorar as estruturas das frases e expandir o uso de expressões. `;
  feedback += 'Continue praticando, e lembre-se que a prática constante leva à perfeição. Parabéns pelo seu progresso até agora, e não desista!';

  return feedback;
};
</script>

<style scoped>
/* Container principal do chat */
.textbox {
  position: absolute;
  top: 140px;
  left: 150px;
  right: 16px;
  bottom: 16px;
  margin: 0;
  padding: 16px;
  background-color: #20232A;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.2);
}

.cont {
  display: flex;
  flex-direction: column;
  height: 100%;
}

/* Área de mensagens */
.chat-area {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  background-color: grey;
  border-radius: 8px;
  margin-bottom: 16px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
}

.message-box {
  margin-bottom: 12px;
  display: flex;
  align-items: center;
}

.user-message {
  background-color: #0277bd;
  color: white;
  padding: 12px 16px;
  border-radius: 8px;
  max-width: 80%;
  margin-left: auto;
  font-weight: bold;
}

.gpt-message {
  background-color: white;
  color: #333;
  padding: 12px 16px;
  border-radius: 8px;
  max-width: 80%;
  margin-right: auto;
}

/* Botão de gravação */
.record-btn {
  background-color: #4CAF50;
  color: white;
  font-weight: bold;
  border-radius: 8px;
  height: 48px;
  margin-top: 16px;
  align-self: center;
}
</style>
