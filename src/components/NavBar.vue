<template>
  <nav class="navbar">
    <div class="logo">
      <router-link to="/">DUCK TEL</router-link>
    </div>
    <div class="menu">
      <router-link to="/mypage" v-if="isLoggedIn">마이페이지</router-link>
      <button @click="handleAuth">{{ isLoggedIn ? "로그아웃" : "로그인" }}</button>
    </div>
  </nav>
</template>

<script>
import api from "../api";

export default {
  name: "NavBar",
  data() {
    return {
      isLoggedIn: false
    };
  },
  created() {
    this.checkLoginStatus();
  },
  watch: {
    '$route'() {
      this.checkLoginStatus();
    }
  },
  methods: {
    checkLoginStatus() {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        this.isLoggedIn = false;
        return;
      }

      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const now = Math.floor(Date.now() / 1000);

        this.isLoggedIn = payload.exp && payload.exp > now;
      } catch (err) {
        console.warn("JWT 디코딩 실패:", err);
        this.isLoggedIn = false;
      }
    },
    handleAuth() {
      if (this.isLoggedIn) {
        this.logout();
      } else {
        this.$router.push("/login");
      }
    },
    logout() {
      const loginType = localStorage.getItem("loginType");

      if (!loginType) {
        console.error("로그아웃 실패: 로그인 타입이 없습니다");
        return;
      }

      api.post("/api/auth/logout", { loginType }, { withCredentials: true }) // ✅ loginType 포함
          .then(response => {
            console.log("로그아웃 성공:", response.data);

            localStorage.removeItem("accessToken");
            localStorage.removeItem("loginType");

            this.isLoggedIn = false;
            this.$router.push("/");
          })
          .catch(error => {
            console.error("로그아웃 실패:", error.response?.data?.message || error.message);
          });
    }
  }
};
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background: #007bff;
  color: white;
}

.logo {
  flex: 1; 
  text-align: center;
  font-size: 1.5rem;
  font-weight: bold;
}

.logo a {
  color: white;
  text-decoration: none;
}

.menu {
  display: flex;
  gap: 15px;
  align-items: center;
}

.menu a, .menu button {
  color: white;
  text-decoration: none;
  background: none;
  border: none;
  font-size: 1rem;
  cursor: pointer;
}

.menu button {
  padding: 8px 12px;
  background-color: white;
  color: #007bff;
  border-radius: 5px;
}

.menu button:hover {
  background-color: #0056b3;
  color: white;
}
</style>