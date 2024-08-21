import { SpeechClient } from '@google-cloud/speech';

// Configura o caminho para o arquivo JSON da conta de serviço
const client = new SpeechClient({
  keyFilename: './resenia-tcc.json', // Substitua pelo caminho real do seu arquivo JSON
});

export default client;
