<script setup>
import { ref } from "vue";

const username = ref("");
const password = ref("");
const confirmPassword = ref("");

const register = () => {
  if (password.value !== confirmPassword.value) {
    alert("Kata sandi tidak cocok!");
    return;
  }

  console.log("Registrasi dengan:", username.value, password.value);
  // Tambahkan logika registrasi ke backend di sini
};
</script>

<template>
  <div class="container">
    <!-- Bagian Kanan: Form Registrasi -->
    <div class="login-box">
      <h2>Buat Akun Baru</h2>
      <form @submit.prevent="register">
        <div class="input-group">
          <input type="text" v-model="username" placeholder="Nama Pengguna" />
        </div>
        <div class="input-group">
          <input type="password" v-model="password" placeholder="Kata Sandi" />
        </div>
        <div class="input-group">
          <input type="password" v-model="confirmPassword" placeholder="Konfirmasi Kata Sandi" />
        </div>
        <button type="submit">Daftar</button>
      </form>
      <p class="register-link">
        Sudah punya akun? <span>Masuk di sini</span>
      </p>
    </div>
  </div>
</template>

<style scoped>
.container {
  background-image: url(../assets/BG.png);
  background-size: cover;
  width: 100vw;
  height: 100vh;
  display: flex;
  /* align-items: center; */
  justify-content: right;
  text-align: center;
}
</style>