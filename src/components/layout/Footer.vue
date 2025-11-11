<template>
  <el-footer class="footer">
    <div class="footer-content">
      <p>&copy; 2024 E-Shop. All rights reserved.</p>
      <el-space wrap>
        <el-link href="#" :underline="false">About</el-link>
        <el-divider direction="vertical" />
        <el-link href="#" :underline="false">Contact</el-link>
        <el-divider direction="vertical" />
        <el-link href="#" :underline="false">Privacy Policy</el-link>
        <el-divider direction="vertical" />
        <el-link href="#" :underline="false">Terms of Service</el-link>
      </el-space>
    </div>
  </el-footer>
</template>

<style scoped>
.footer {
  background: var(--footer-bg);
  color: white;
  padding: 2rem 0;
  margin-top: auto;
  height: auto;
}

.footer-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
  text-align: center;
}

.footer-content p {
  margin-bottom: 1rem;
}

:deep(.el-link) {
  color: white;
}

:deep(.el-link:hover) {
  color: var(--youdao-blue-lighter);
}

:deep(.el-divider--vertical) {
  background-color: rgba(255, 255, 255, 0.3);
}
</style>
