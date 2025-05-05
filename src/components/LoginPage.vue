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
    <!-- Kiri: Gambar & Branding -->
    <div class="left-panel">
      <div class="branding">
        <h1>Nick Nie<br />Hidroponik</h1>
        <img src="/assets/illustration.png" alt="Hidroponik" />
      </div>
    </div>

    <!-- Kanan: Form -->
    <div class="right-panel">
      <div class="login-box">
        <h2>Masuk ke akun Anda</h2>
        <form @submit.prevent="login">
          <div class="input-group">
            <input type="text" v-model="username" placeholder="Nama Pengguna" />
          </div>
          <div class="input-group">
            <input
              type="password"
              v-model="password"
              placeholder="Kata Sandi"
            />
            <div class="forgot">Lupa kata sandi?</div>
          </div>
          <button type="submit">Masuk</button>
        </form>
        <p class="register-link">Belum punya akun? <span>Daftar akun</span></p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  height: 100vh;
  width: 100vw;
  font-family: "Poppins", sans-serif;
}

.left-panel {
  flex: 1;
  background-color: #f0f9e8;
  display: flex;
  align-items: center;
  justify-content: center;
}

.left-panel .branding h1 {
  font-size: 2rem;
  color: #a4d04c;
  text-align: center;
  margin-bottom: 1.5rem;
}

.left-panel img {
  max-width: 100%;
  height: auto;
}

.right-panel {
  flex: 1;
  background-color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-box {
  width: 100%;
  max-width: 360px;
  text-align: center;
}

.login-box h2 {
  font-size: 1.5rem;
  font-weight: bold;
  color: #3b5f3b;
  margin-bottom: 2rem;
}

.input-group {
  margin-bottom: 1.25rem;
  position: relative;
}

.input-group input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #c8c8c8;
  border-radius: 9999px;
  font-size: 1rem;
  outline: none;
}

.input-group .forgot {
  font-size: 0.8rem;
  color: #9cc317;
  text-align: right;
  margin-top: 0.25rem;
  cursor: pointer;
}

button[type="submit"] {
  width: 100%;
  padding: 0.75rem;
  background-color: #9cc317;
  color: white;
  font-weight: bold;
  border: none;
  border-radius: 9999px;
  font-size: 1rem;
  margin-top: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button[type="submit"]:hover {
  background-color: #7ca711;
}

.register-link {
  margin-top: 1rem;
  font-size: 0.85rem;
  color: #333;
}

.register-link span {
  font-weight: bold;
  color: #9cc317;
  cursor: pointer;
}
</style>
