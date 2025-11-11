<template>
  <el-footer class="footer">
    <div class="footer-content">
      <p>&copy; 2024 E-Shop. 保留所有权利。</p>
      <el-space wrap>
        <el-link href="#" :underline="false">关于我们</el-link>
        <el-divider direction="vertical" />
        <el-link href="#" :underline="false">联系我们</el-link>
        <el-divider direction="vertical" />
        <el-link href="#" :underline="false">隐私政策</el-link>
        <el-divider direction="vertical" />
        <el-link href="#" :underline="false">服务条款</el-link>
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
