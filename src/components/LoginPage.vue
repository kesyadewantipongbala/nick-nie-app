<script setup>
import { ref } from "vue";

const username = ref("");
const password = ref("");

const login = () => {
  console.log("Login dengan:", username.value, password.value);
  // Tambahkan logika autentikasi ke backend di sini
};
</script>

<template>
  <div class="container">
      <!-- Bagian Kanan: Form Login -->
      <div class="login-box">
        <h2>Masuk ke akun Anda</h2>
        <form @submit.prevent="login">
          <div class="input-group">
            <input type="text" v-model="username" placeholder="Nama Pengguna" />
          </div>
          <div class="input-group">
            <input type="password" v-model="password" placeholder="Kata Sandi" />
          </div>
          <p class="forgot-password">Lupa kata sandi?</p>
          <button type="submit">Masuk</button>
        </form>
        <p class="register-link">
          Belum punya akun? <span>Daftar akun</span>
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
