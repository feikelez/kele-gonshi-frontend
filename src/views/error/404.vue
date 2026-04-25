<template>
  <div class="not-found">
    <div class="not-found-content">
      <div class="error-code gradient-text">404</div>
      <h1>页面走丢了</h1>
      <p>抱歉，您访问的页面不存在或已被移除</p>
      <router-link to="/" class="home-btn">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          <polyline points="9,22 9,12 15,12 15,22"/>
        </svg>
        返回首页
      </router-link>
    </div>
    <div class="not-found-bg">
      <div class="shape shape-1"></div>
      <div class="shape shape-2"></div>
      <div class="shape shape-3"></div>
    </div>
  </div>
</template>

<style scoped>
.not-found {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%);
  position: relative;
  overflow: hidden;
}

.not-found-content {
  text-align: center;
  position: relative;
  z-index: 1;
}

.error-code {
  font-size: 160px;
  font-weight: 800;
  line-height: 1;
  margin-bottom: 16px;
  letter-spacing: -8px;
}

.not-found-content h1 {
  font-size: 32px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 12px;
}

.not-found-content p {
  font-size: 16px;
  color: var(--text-muted);
  margin-bottom: 32px;
}

.home-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 14px 28px;
  background: var(--primary-gradient);
  color: white;
  font-size: 16px;
  font-weight: 600;
  border-radius: var(--radius-md);
  transition: all var(--transition-normal);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.home-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
}

.home-btn svg {
  width: 20px;
  height: 20px;
}

.not-found-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.shape {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.4;
}

.shape-1 {
  width: 400px;
  height: 400px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  top: -100px;
  left: -100px;
}

.shape-2 {
  width: 300px;
  height: 300px;
  background: linear-gradient(135deg, #f093fb, #f5576c);
  bottom: -50px;
  right: -50px;
}

.shape-3 {
  width: 200px;
  height: 200px;
  background: linear-gradient(135deg, #4fd1c5, #38b2ac);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
