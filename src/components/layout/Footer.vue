<template>
  <footer class="footer">
    <div class="container">
      <p>&copy; 2024 E-Shop. All rights reserved.</p>
      <div class="links">
        <a href="#">About</a>
        <a href="#">Contact</a>
        <a href="#">Privacy Policy</a>
        <a href="#">Terms of Service</a>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background: #34495e;
  color: white;
  padding: 2rem 0;
  margin-top: auto;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
  text-align: center;
}

.links {
  margin-top: 1rem;
  display: flex;
  justify-content: center;
  gap: 2rem;
}

.links a {
  color: white;
  text-decoration: none;
}

.links a:hover {
  text-decoration: underline;
}
</style>
