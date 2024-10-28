<template>
  <v-container class="settings-container">
    <!-- Avatar e Nome do Usuário -->
    <div class="profile-header d-flex align-center mb-6">
      <v-avatar size="100">
        <img :src="user.profilePhoto" alt="Profile Photo" />
      </v-avatar>
      <h2 class="ml-4">{{ user.name }}</h2>
    </div>

    <!-- Abas de Navegação -->
    <v-tabs v-model="tab" class="custom-tabs">
      <v-tab v-for="(label, index) in tabLabels" :key="index" :value="label.value" class="tab">
        <span>{{ label.text }}</span>
      </v-tab>
    </v-tabs>

    <!-- Conteúdo das Abas -->
    <div v-if="tab === 'perfil'" class="tab-content">
      <v-card flat class="profile-card">
        <v-card-text>
          <!-- Botão para alterar foto -->
          <v-btn color="#20232A" class="mb-4" @click="selectPhoto">ALTERAR FOTO</v-btn>
          <input
            ref="fileInput"
            type="file"
            accept="image/*"
            @change="onFileChange"
            style="display: none;"
          />

          <!-- Formulário de edição de informações -->
          <v-form @submit.prevent="saveChanges">
            <v-text-field
              label="Nome"
              v-model="editableUser.name"
              :rules="[rules.required]"
              outlined
              class="form-field"
            ></v-text-field>

            <v-text-field
              label="Email"
              v-model="editableUser.email"
              :rules="[rules.required, rules.email]"
              outlined
              class="form-field"
            ></v-text-field>

            <v-text-field
              label="Endereço"
              v-model="editableUser.address"
              outlined
              class="form-field"
            ></v-text-field>

            <!-- Botão para Salvar Alterações -->
            <v-btn color="success" type="submit" class="save-btn">SALVAR ALTERAÇÕES</v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </div>

    <!-- Aba Chat -->
    <div v-else-if="tab === 'chat'" class="tab-content">
      <v-card flat class="profile-card">
        <v-card-text>
          <h3>Configurações de Chat</h3>
          <p>Aqui você pode ajustar as configurações do chat.</p>
        </v-card-text>
      </v-card>
    </div>

    <!-- Aba Feedbacks -->
    <div v-else-if="tab === 'feedbacks'" class="tab-content">
      <v-card flat class="profile-card">
        <v-card-text>
          <h3>Configurações de Feedbacks</h3>
          <p>Veja e gerencie os feedbacks recebidos.</p>
        </v-card-text>
      </v-card>
    </div>

    <!-- Aba Suporte -->
    <div v-else-if="tab === 'suporte'" class="tab-content">
      <v-card flat class="profile-card">
        <v-card-text>
          <h3>Configurações de Suporte</h3>
          <p>Entre em contato com o suporte para mais assistência.</p>
          <v-btn color="#20232A" class="contact-support-btn">Contato Suporte</v-btn>
        </v-card-text>
      </v-card>
    </div>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      tab: 'perfil',
      tabLabels: [
        { text: 'PERFIL', value: 'perfil' },
        { text: 'CHAT', value: 'chat' },
        { text: 'FEEDBACKS', value: 'feedbacks' },
        { text: 'SUPORTE', value: 'suporte' },
      ],
      user: {
        profilePhoto: 'https://example.com/photo.jpg', // URL da foto de perfil
        name: 'Natalia',
        email: 'natalia@example.com',
        address: 'Rua Exemplo, 123',
      },
      editableUser: {
        profilePhoto: 'https://example.com/photo.jpg',
        name: 'Natalia',
        email: 'natalia@example.com',
        address: 'Rua Exemplo, 123',
      },
      rules: {
        required: v => !!v || 'Campo obrigatório',
        email: v => /.+@.+\..+/.test(v) || 'E-mail inválido',
      },
    };
  },
  methods: {
    selectPhoto() {
      this.$refs.fileInput.click();
    },
    onFileChange(e) {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.editableUser.profilePhoto = e.target.result;
          this.user.profilePhoto = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    },
    saveChanges() {
      this.user = { ...this.user, ...this.editableUser };
    },
  },
  watch: {
    user(newVal) {
      this.editableUser = { ...newVal };
    },
  },
};
</script>

<style scoped>
/* Container principal da página */
.settings-container {
  max-width: 800px;
  margin: auto;
}

/* Estilos do cabeçalho do perfil */
.profile-header {
  border-bottom: 2px solid #20232A;
  padding-bottom: 16px;
}

h2 {
  font-weight: bold;
  font-size: 24px;
  color: #20232A;
}

/* Estilos das abas */
.custom-tabs {
  margin-top: 24px;
  border-bottom: 2px solid #E0E0E0;
}

.tab {
  color: #20232A;
  font-weight: bold;
  font-size: 16px;
  padding: 12px 16px;
  text-transform: uppercase;
}

.tab.v-tab--active {
  color: #20232A;
  border-bottom: 2px solid #20232A;
}

/* Conteúdo de cada aba */
.tab-content {
  margin-top: 24px;
}

/* Estilos do formulário e do cartão de perfil */
.profile-card {
  background-color: #f9f9f9;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
}

/* Campos do formulário */
.form-field {
  background-color: #f0f0f0;
  border-radius: 4px;
  margin-bottom: 16px;
}

/* Botão de alteração de foto */
.v-btn {
  font-weight: bold;
  border-radius: 6px;
}

/* Botão Salvar Alterações */
.save-btn {
  background-color: #4caf50;
  color: white;
  font-weight: bold;
  width: 100%;
  border-radius: 6px;
}

/* Botão de Contato com o Suporte */
.contact-support-btn {
  font-weight: bold;
  border-radius: 6px;
  margin-top: 16px;
  color: white;
  background-color: #20232A;
}
</style>
