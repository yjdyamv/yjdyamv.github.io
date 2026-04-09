/**
 * theme-persistence.js
 * Purpose: 保存用户选择的主题模式（亮色/暗色）
 * 在本地存储中保存用户偏好，提供一致的主题体验
 */

class ThemePersistence {
  constructor() {
    this.storageKey = 'blog-theme-preference';
    this.themeAttribute = 'data-theme';
    this.autoSwitchEnabled = true;
    
    this.init();
  }
  
  init() {
    // 检查是否应该禁用自动切换
    this.checkAutoSwitchPreference();
    
    // 应用保存的主题
    this.applySavedTheme();
    
    // 监听主题切换事件
    this.setupEventListeners();
    
    // 监听系统主题变化
    this.setupSystemThemeListener();
  }
  
  checkAutoSwitchPreference() {
    // 从URL参数检查
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('no-auto-theme')) {
      this.autoSwitchEnabled = false;
      localStorage.setItem('auto-theme-disabled', 'true');
    }
    
    // 从本地存储检查
    if (localStorage.getItem('auto-theme-disabled') === 'true') {
      this.autoSwitchEnabled = false;
    }
  }
  
  applySavedTheme() {
    const savedTheme = this.getSavedTheme();
    
    if (savedTheme) {
      // 应用保存的主题
      this.setTheme(savedTheme);
    } else if (this.autoSwitchEnabled) {
      // 使用系统主题或默认主题
      this.applySystemTheme();
    }
  }
  
  getSavedTheme() {
    try {
      return localStorage.getItem(this.storageKey);
    } catch (e) {
      console.warn('无法访问本地存储:', e);
      return null;
    }
  }
  
  saveTheme(theme) {
    try {
      localStorage.setItem(this.storageKey, theme);
      
      // 触发自定义事件
      this.dispatchThemeChangeEvent(theme);
    } catch (e) {
      console.warn('无法保存主题到本地存储:', e);
    }
  }
  
  setTheme(theme) {
    // 验证主题值
    const validThemes = ['light', 'dark'];
    if (!validThemes.includes(theme)) {
      console.warn(`无效的主题值: ${theme}`);
      return;
    }
    
    // 设置data-theme属性
    document.documentElement.setAttribute(this.themeAttribute, theme);
    
    // 更新meta theme-color
    this.updateThemeColor(theme);
    
    // 保存到本地存储
    this.saveTheme(theme);
  }
  
  updateThemeColor(theme) {
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      // 根据主题设置不同的主题色
      const colors = {
        light: '#ffffff',
        dark: '#1a1a1a'
      };
      metaThemeColor.setAttribute('content', colors[theme] || colors.light);
    }
  }
  
  applySystemTheme() {
    if (!this.autoSwitchEnabled) return;
    
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const systemTheme = prefersDark ? 'dark' : 'light';
    
    this.setTheme(systemTheme);
  }
  
  setupEventListeners() {
    // 监听博客主题切换按钮（如果存在）
    this.setupThemeToggleListener();
    
    // 监听存储变化（其他标签页修改主题）
    window.addEventListener('storage', (e) => {
      if (e.key === this.storageKey) {
        this.setTheme(e.newValue);
      }
    });
    
    // 提供全局API
    window.ThemeManager = {
      setTheme: (theme) => this.setTheme(theme),
      getTheme: () => this.getCurrentTheme(),
      toggleTheme: () => this.toggleTheme(),
      enableAutoSwitch: () => this.enableAutoSwitch(),
      disableAutoSwitch: () => this.disableAutoSwitch()
    };
  }
  
  setupThemeToggleListener() {
    // 查找主题切换按钮
    const themeToggles = document.querySelectorAll('[data-theme-toggle]');
    
    themeToggles.forEach(toggle => {
      toggle.addEventListener('click', (e) => {
        e.preventDefault();
        this.toggleTheme();
      });
    });
    
    // 如果博客使用特定的类名
    const blogThemeToggles = document.querySelectorAll('.appearance-switcher, [data-appearance-switcher]');
    blogThemeToggles.forEach(toggle => {
      toggle.addEventListener('click', () => {
        // 延迟执行以确保主题已切换
        setTimeout(() => {
          const currentTheme = this.getCurrentTheme();
          this.saveTheme(currentTheme);
        }, 100);
      });
    });
  }
  
  setupSystemThemeListener() {
    if (!this.autoSwitchEnabled) return;
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleSystemThemeChange = (e) => {
      // 只在没有手动设置主题时跟随系统
      if (!this.getSavedTheme()) {
        this.applySystemTheme();
      }
    };
    
    // 添加监听器
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleSystemThemeChange);
    } else {
      // 兼容旧浏览器
      mediaQuery.addListener(handleSystemThemeChange);
    }
  }
  
  getCurrentTheme() {
    return document.documentElement.getAttribute(this.themeAttribute) || 'light';
  }
  
  toggleTheme() {
    const currentTheme = this.getCurrentTheme();
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    this.setTheme(newTheme);
    
    // 添加切换动画类
    document.documentElement.classList.add('theme-transition');
    setTimeout(() => {
      document.documentElement.classList.remove('theme-transition');
    }, 300);
  }
  
  enableAutoSwitch() {
    this.autoSwitchEnabled = true;
    localStorage.removeItem('auto-theme-disabled');
    this.applySystemTheme();
  }
  
  disableAutoSwitch() {
    this.autoSwitchEnabled = false;
    localStorage.setItem('auto-theme-disabled', 'true');
  }
  
  dispatchThemeChangeEvent(theme) {
    const event = new CustomEvent('themechange', {
      detail: { theme }
    });
    window.dispatchEvent(event);
  }
  
  // 工具方法：创建主题切换按钮
  createThemeToggleButton() {
    const button = document.createElement('button');
    button.className = 'theme-toggle-button';
    button.setAttribute('aria-label', '切换主题');
    button.innerHTML = `
      <span class="theme-icon light-icon">☀️</span>
      <span class="theme-icon dark-icon">🌙</span>
    `;
    
    button.addEventListener('click', () => this.toggleTheme());
    
    // 更新按钮状态
    const updateButton = () => {
      const theme = this.getCurrentTheme();
      button.setAttribute('data-theme', theme);
      button.setAttribute('aria-pressed', theme === 'dark');
    };
    
    updateButton();
    window.addEventListener('themechange', updateButton);
    
    return button;
  }
}

// 自动初始化
document.addEventListener('DOMContentLoaded', () => {
  // 添加主题切换过渡样式
  const style = document.createElement('style');
  style.textContent = `
    .theme-transition * {
      transition: background-color 0.3s ease, 
                  border-color 0.3s ease, 
                  color 0.3s ease !important;
    }
    
    .theme-toggle-button {
      background: none;
      border: 1px solid rgba(var(--color-neutral-300), 1);
      border-radius: 50%;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-size: 1.2rem;
      transition: all 0.3s ease;
    }
    
    .theme-toggle-button:hover {
      transform: scale(1.1);
      border-color: rgba(var(--color-primary-500), 1);
    }
    
    .theme-toggle-button[data-theme="dark"] .light-icon {
      display: none;
    }
    
    .theme-toggle-button[data-theme="light"] .dark-icon {
      display: none;
    }
    
    .dark .theme-toggle-button {
      border-color: rgba(var(--color-neutral-600), 1);
    }
  `;
  document.head.appendChild(style);
  
  // 初始化主题持久化
  window.themePersistence = new ThemePersistence();
  
  // 可选：自动添加主题切换按钮到特定位置
  const autoAddButton = () => {
    const header = document.querySelector('header');
    if (header && !document.querySelector('.theme-toggle-button')) {
      const button = window.themePersistence.createThemeToggleButton();
      header.appendChild(button);
    }
  };
  
  // 延迟添加，确保DOM完全加载
  setTimeout(autoAddButton, 500);
});

// 导出供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ThemePersistence;
}