<template>
    <v-container class="feedback-container">
      <!-- Cabeçalho da Página -->
      <div class="header d-flex align-center mb-6">
        <v-avatar size="80">
          <img :src="user.profilePhoto" alt="Profile Photo" />
        </v-avatar>
        <div class="ml-4">
          <h2>{{ user.name }}</h2>
          <p class="subtitle">Feedback detalhado sobre sua última avaliação</p>
        </div>
      </div>
  
      <!-- Sessão de Avaliação Geral -->
      <v-card flat class="feedback-card">
        <v-card-text>
          <h3>Nível de Inglês: {{ feedback.overallLevel }}</h3>
          <p>{{ feedback.overallComment }}</p>
        </v-card-text>
      </v-card>
  
      <!-- Sessão de Análise Detalhada -->
      <v-card flat class="feedback-card" v-for="section in feedback.details" :key="section.title">
        <v-card-title class="section-title">{{ section.title }}</v-card-title>
        <v-card-text>
          <p>{{ section.comment }}</p>
          <v-progress-linear :value="section.score" color="#20232A" height="8"></v-progress-linear>
        </v-card-text>
      </v-card>
  
      <!-- Sessão de Sugestões -->
      <v-card flat class="feedback-card">
        <v-card-title class="section-title">Sugestões para Melhoria</v-card-title>
        <v-card-text>
          <ul>
            <li v-for="suggestion in feedback.suggestions" :key="suggestion">{{ suggestion }}</li>
          </ul>
        </v-card-text>
      </v-card>
    </v-container>
  </template>
  
  <script>
  export default {
    data() {
      return {
        user: {
          profilePhoto: 'https://example.com/photo.jpg', // URL da foto de perfil
          name: 'Natalia',
        },
        feedback: {
          overallLevel: 'Intermediário',
          overallComment: 'Você está progredindo bem! Sua fluência e compreensão estão melhorando.',
          details: [
            {
              title: 'Fluência',
              comment: 'Sua fluência é consistente, mas ocasionalmente hesitante em tópicos complexos.',
              score: 70, // Percentual para progresso
            },
            {
              title: 'Vocabulário',
              comment: 'Seu vocabulário está bem desenvolvido, mas pode ser expandido com expressões idiomáticas.',
              score: 65,
            },
            {
              title: 'Pronúncia',
              comment: 'Sua pronúncia é clara, mas algumas palavras complexas precisam de prática.',
              score: 75,
            },
            {
              title: 'Compreensão Auditiva',
              comment: 'Você entende bem diálogos simples, mas sente dificuldade em conversas mais rápidas.',
              score: 60,
            },
          ],
          suggestions: [
            'Pratique expressões idiomáticas e conectores para melhorar a fluência.',
            'Expanda seu vocabulário com palavras mais complexas.',
            'Treine sua pronúncia com palavras mais difíceis e de sotaques variados.',
            'Ouça mais conteúdos em inglês com velocidades e sotaques diferentes para melhorar a compreensão auditiva.',
          ],
        },
      };
    },
  };
  </script>
  
  <style scoped>
  /* Container principal da página */
  .feedback-container {
    max-width: 800px;
    margin: auto;
  }
  
  /* Estilos do cabeçalho da página */
  .header {
    border-bottom: 2px solid #20232A;
    padding-bottom: 16px;
  }
  
  h2 {
    font-weight: bold;
    font-size: 24px;
    color: #20232A;
  }
  
  .subtitle {
    font-size: 16px;
    color: #666;
  }
  
  /* Cartões de Feedback */
  .feedback-card {
    background-color: #f9f9f9;
    padding: 16px;
    margin-top: 16px;
    border-radius: 8px;
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  }
  
  /* Título das Seções de Feedback */
  .section-title {
    color: #20232A;
    font-weight: bold;
  }
  
  /* Progress bar */
  .v-progress-linear {
    margin-top: 8px;
    border-radius: 4px;
  }
  </style>
  