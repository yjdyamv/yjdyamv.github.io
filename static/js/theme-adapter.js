/**
 * theme-adapter.js
 * Purpose: 主题兼容性适配器，确保通用导航系统在不同Hugo主题中正常工作
 */

class ThemeAdapter {
  constructor() {
    this.theme = null;
    this.adapters = {
      'blowfish': this.adaptBlowfish.bind(this),
      'hugo-stack': this.adaptHugoStack.bind(this),
      'hugo-coder': this.adaptHugoCoder.bind(this),
      'papermod': this.adaptPaperMod.bind(this),
      'terminal': this.adaptTerminal.bind(this),
      'default': this.adaptDefault.bind(this)
    };
    
    this.init();
  }
  
  init() {
    this.detectTheme();
    this.applyAdaptations();
    this.setupThemeChangeListener();
  }
  
  detectTheme() {
    // 通过多种方式检测当前主题
    
    // 1. 检查HTML类名
    const htmlClasses = document.documentElement.className;
    const bodyClasses = document.body.className;
    
    const themePatterns = {
      'blowfish': /blowfish|blowfish-theme/i,
      'hugo-stack': /stack|theme-stack|hugo-theme-stack/i,
      'hugo-coder': /coder|theme-coder|hugo-coder/i,
      'papermod': /papermod|theme-papermod|hugo-papermod/i,
      'terminal': /terminal|theme-terminal|hugo-terminal/i
    };
    
    for (const [theme, pattern] of Object.entries(themePatterns)) {
      if (pattern.test(htmlClasses) || pattern.test(bodyClasses)) {
        this.theme = theme;
        console.log(`检测到主题: ${theme}`);
        return;
      }
    }
    
    // 2. 检查data-theme属性
    const dataTheme = document.documentElement.getAttribute('data-theme') || 
                     document.body.getAttribute('data-theme');
    
    if (dataTheme) {
      for (const theme of Object.keys(themePatterns)) {
        if (dataTheme.toLowerCase().includes(theme)) {
          this.theme = theme;
          console.log(`通过data-theme检测到主题: ${theme}`);
          return;
        }
      }
    }
    
    // 3. 检查CSS变量
    const styles = getComputedStyle(document.documentElement);
    const cssVars = {
      'blowfish': '--color-primary-500',
      'hugo-stack': '--stack-color',
      'hugo-coder': '--coder-color',
      'papermod': '--papermod-color'
    };
    
    for (const [theme, varName] of Object.entries(cssVars)) {
      try {
        const value = styles.getPropertyValue(varName);
        if (value && value.trim() !== '') {
          this.theme = theme;
          console.log(`通过CSS变量检测到主题: ${theme}`);
          return;
        }
      } catch (e) {
        // 忽略错误
      }
    }
    
    // 4. 默认主题
    this.theme = 'default';
    console.log('使用默认主题适配');
  }
  
  applyAdaptations() {
    const adapter = this.adapters[this.theme] || this.adapters.default;
    
    try {
      adapter();
      console.log(`已应用 ${this.theme} 主题适配`);
    } catch (error) {
      console.error(`应用 ${this.theme} 主题适配失败:`, error);
      this.adapters.default();
    }
    
    // 添加主题标识类
    document.documentElement.classList.add(`theme-${this.theme}`);
    document.documentElement.setAttribute('data-detected-theme', this.theme);
  }
  
  adaptBlowfish() {
    // Blowfish主题适配
    const style = document.createElement('style');
    style.id = 'blowfish-adapter';
    style.textContent = `
      /* Blowfish主题适配 */
      .theme-blowfish .universal-nav {
        font-family: var(--font-body), -apple-system, BlinkMacSystemFont, sans-serif;
      }
      
      .theme-blowfish .universal-nav .nav-link,
      .theme-blowfish .universal-nav .nav-parent {
        color: rgba(var(--color-neutral-700), 1);
        border-radius: var(--radius-md);
      }
      
      .theme-blowfish .universal-nav .nav-link:hover,
      .theme-blowfish .universal-nav .nav-parent:hover {
        background-color: rgba(var(--color-primary-100), 1);
        color: rgba(var(--color-primary-700), 1);
      }
      
      .theme-blowfish .universal-nav .nav-link.current,
      .theme-blowfish .universal-nav .nav-item.current > .nav-link {
        background-color: rgba(var(--color-primary-500), 0.1);
        color: rgba(var(--color-primary-600), 1);
        font-weight: 600;
      }
      
      .theme-blowfish .universal-nav .nav-submenu {
        background-color: rgba(var(--color-neutral-50), 1);
        border-color: rgba(var(--color-neutral-200), 1);
        box-shadow: var(--shadow-lg);
      }
      
      .dark.theme-blowfish .universal-nav .nav-link,
      .dark.theme-blowfish .universal-nav .nav-parent {
        color: rgba(var(--color-neutral-300), 1);
      }
      
      .dark.theme-blowfish .universal-nav .nav-link:hover,
      .dark.theme-blowfish .universal-nav .nav-parent:hover {
        background-color: rgba(var(--color-primary-900), 1);
        color: rgba(var(--color-primary-300), 1);
      }
      
      .dark.theme-blowfish .universal-nav .nav-submenu {
        background-color: rgba(var(--color-neutral-900), 1);
        border-color: rgba(var(--color-neutral-700), 1);
      }
      
      /* 集成Blowfish的移动端菜单 */
      .theme-blowfish .mobile-menu-button {
        color: rgba(var(--color-neutral-700), 1);
      }
      
      .dark.theme-blowfish .mobile-menu-button {
        color: rgba(var(--color-neutral-300), 1);
      }
      
      .theme-blowfish .mobile-menu {
        background-color: rgba(var(--color-neutral-50), 1);
      }
      
      .dark.theme-blowfish .mobile-menu {
        background-color: rgba(var(--color-neutral-900), 1);
      }
    `;
    
    document.head.appendChild(style);
    
    // 确保导航容器使用正确的类名
    this.ensureNavContainer('nav', 'header nav');
  }
  
  adaptHugoStack() {
    // Hugo Theme Stack适配
    const style = document.createElement('style');
    style.id = 'hugo-stack-adapter';
    style.textContent = `
      /* Hugo Stack主题适配 */
      .theme-hugo-stack .universal-nav {
        font-size: 0.95rem;
        font-weight: 500;
      }
      
      .theme-hugo-stack .universal-nav .nav-menu {
        gap: 0.5rem;
      }
      
      .theme-hugo-stack .universal-nav .nav-link,
      .theme-hugo-stack .universal-nav .nav-parent {
        padding: 0.5rem 0.75rem;
        border-radius: 0.25rem;
        color: var(--body-color);
      }
      
      .theme-hugo-stack .universal-nav .nav-link:hover,
      .theme-hugo-stack .universal-nav .nav-parent:hover {
        background-color: var(--light-gray);
        color: var(--link-color);
      }
      
      .theme-hugo-stack .universal-nav .nav-link.current {
        background-color: var(--light-gray);
        color: var(--link-color);
        font-weight: 600;
      }
      
      .theme-hugo-stack .universal-nav .nav-submenu {
        border-radius: 0.25rem;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }
      
      .dark.theme-hugo-stack .universal-nav .nav-link:hover,
      .dark.theme-hugo-stack .universal-nav .nav-parent:hover {
        background-color: rgba(255, 255, 255, 0.1);
      }
      
      .dark.theme-hugo-stack .universal-nav .nav-submenu {
        background-color: #2d2d2d;
        border-color: #404040;
      }
      
      /* Stack主题的移动端适配 */
      .theme-hugo-stack .mobile-menu-button {
        font-size: 1.25rem;
      }
    `;
    
    document.head.appendChild(style);
    
    // Stack主题通常将导航放在header > nav
    this.ensureNavContainer('nav', 'header nav');
  }
  
  adaptHugoCoder() {
    // Hugo Coder主题适配
    const style = document.createElement('style');
    style.id = 'hugo-coder-adapter';
    style.textContent = `
      /* Hugo Coder主题适配 */
      .theme-hugo-coder .universal-nav {
        font-family: 'SF Mono', Monaco, 'Cascadia Code', monospace;
        font-size: 0.9rem;
      }
      
      .theme-hugo-coder .universal-nav .nav-link,
      .theme-hugo-coder .universal-nav .nav-parent {
        padding: 0.5rem 1rem;
        border-radius: 0;
        border-bottom: 2px solid transparent;
        color: var(--primary);
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      
      .theme-hugo-coder .universal-nav .nav-link:hover,
      .theme-hugo-coder .universal-nav .nav-parent:hover {
        background: none;
        border-bottom-color: var(--primary);
        color: var(--primary);
      }
      
      .theme-hugo-coder .universal-nav .nav-link.current {
        background: none;
        border-bottom-color: var(--primary);
        color: var(--primary);
        font-weight: 600;
      }
      
      .theme-hugo-coder .universal-nav .nav-submenu {
        border-radius: 0;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      }
      
      .theme-hugo-coder .universal-nav .nav-submenu .nav-link {
        text-transform: none;
        letter-spacing: normal;
      }
      
      /* Coder主题的暗色模式 */
      .dark.theme-hugo-coder .universal-nav .nav-link,
      .dark.theme-hugo-coder .universal-nav .nav-parent {
        color: var(--primary);
      }
    `;
    
    document.head.appendChild(style);
    
    // Coder主题通常有特定的导航容器
    this.ensureNavContainer('.nav', 'header .nav');
  }
  
  adaptPaperMod() {
    // PaperMod主题适配
    const style = document.createElement('style');
    style.id = 'papermod-adapter';
    style.textContent = `
      /* PaperMod主题适配 */
      .theme-papermod .universal-nav {
        font-size: 0.9rem;
        font-weight: 500;
      }
      
      .theme-papermod .universal-nav .nav-link,
      .theme-papermod .universal-nav .nav-parent {
        padding: 0.5rem 0.75rem;
        border-radius: 0.25rem;
        color: var(--primary);
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      
      .theme-papermod .universal-nav .nav-link:hover,
      .theme-papermod .universal-nav .nav-parent:hover {
        background-color: var(--theme);
        color: var(--secondary);
      }
      
      .theme-papermod .universal-nav .nav-link.current {
        background-color: var(--theme);
        color: var(--secondary);
        font-weight: 600;
      }
      
      .theme-papermod .universal-nav .nav-submenu {
        border-radius: 0.25rem;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      }
      
      .theme-papermod .universal-nav .nav-submenu .nav-link {
        text-transform: none;
        letter-spacing: normal;
      }
      
      /* PaperMod移动端菜单 */
      .theme-papermod .mobile-menu-button {
        color: var(--primary);
      }
      
      .theme-papermod .mobile-menu {
        background-color: var(--entry);
      }
    `;
    
    document.head.appendChild(style);
    
    this.ensureNavContainer('#menu', 'header #menu');
  }
  
  adaptTerminal() {
    // Terminal主题适配
    const style = document.createElement('style');
    style.id = 'terminal-adapter';
    style.textContent = `
      /* Terminal主题适配 */
      .theme-terminal .universal-nav {
        font-family: 'Courier New', monospace;
        font-size: 0.9rem;
      }
      
      .theme-terminal .universal-nav .nav-link,
      .theme-terminal .universal-nav .nav-parent {
        padding: 0.5rem 1rem;
        border-radius: 0;
        color: var(--foreground);
        border: 1px solid transparent;
      }
      
      .theme-terminal .universal-nav .nav-link:hover,
      .theme-terminal .universal-nav .nav-parent:hover {
        background: none;
        border-color: var(--cyan);
        color: var(--cyan);
      }
      
      .theme-terminal .universal-nav .nav-link.current {
        background: none;
        border-color: var(--cyan);
        color: var(--cyan);
        font-weight: bold;
      }
      
      .theme-terminal .universal-nav .nav-submenu {
        border: 1px solid var(--cyan);
        background-color: var(--background);
        border-radius: 0;
        box-shadow: none;
      }
      
      /* Terminal主题的ASCII艺术风格 */
      .theme-terminal .nav-arrow {
        content: '>';
      }
      
      .theme-terminal .nav-item.expanded .nav-arrow {
        content: 'v';
      }
    `;
    
    document.head.appendChild(style);
    
    this.ensureNavContainer('.terminal-menu', 'header .terminal-menu');
  }
  
  adaptDefault() {
    // 默认适配，适用于大多数主题
    const style = document.createElement('style');
    style.id = 'default-adapter';
    style.textContent = `
      /* 默认主题适配 */
      .theme-default .universal-nav {
        font-family: -apple-system, BlinkMacSystemFont, sans-serif;
      }
      
      .theme-default .universal-nav .nav-link,
      .theme-default .universal-nav .nav-parent {
        color: #333;
      }
      
      .theme-default .universal-nav .nav-link:hover,
      .theme-default .universal-nav .nav-parent:hover {
        background-color: #f5f5f5;
        color: #007bff;
      }
      
      .theme-default .universal-nav .nav-link.current {
        background-color: #e3f2fd;
        color: #007bff;
        font-weight: 600;
      }
      
      .theme-default .universal-nav .nav-submenu {
        background-color: white;
        border: 1px solid #dee2e6;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      }
      
      .dark.theme-default .universal-nav .nav-link,
      .dark.theme-default .universal-nav .nav-parent {
        color: #e0e0e0;
      }
      
      .dark.theme-default .universal-nav .nav-link:hover,
      .dark.theme-default .universal-nav .nav-parent:hover {
        background-color: #2d2d2d;
        color: #4dabf7;
      }
      
      .dark.theme-default .universal-nav .nav-submenu {
        background-color: #2d2d2d;
        border-color: #404040;
      }
    `;
    
    document.head.appendChild(style);
    
    // 尝试找到现有的导航容器
    const selectors = [
      'header nav',
      '.site-nav',
      '.main-nav',
      '#navigation',
      '.navigation'
    ];
    
    for (const selector of selectors) {
      const existingNav = document.querySelector(selector);
      if (existingNav) {
        existingNav.classList.add('universal-nav');
        break;
      }
    }
  }
  
  ensureNavContainer(containerClass, fallbackSelector) {
    // 确保导航容器存在并正确配置
    
    // 检查是否已有通用导航容器
    let navContainer = document.querySelector('.universal-nav');
    
    if (!navContainer) {
      // 尝试使用主题特定的容器
      navContainer = document.querySelector(containerClass);
      
      if (!navContainer && fallbackSelector) {
        navContainer = document.querySelector(fallbackSelector);
      }
      
      if (navContainer) {
        navContainer.classList.add('universal-nav');
      } else {
        // 创建新的导航容器
        navContainer = document.createElement('nav');
        navContainer.className = 'universal-nav';
        
        // 插入到合适的位置
        const header = document.querySelector('header');
        if (header) {
          header.appendChild(navContainer);
        } else {
          document.body.insertBefore(navContainer, document.body.firstChild);
        }
      }
    }
    
    return navContainer;
  }
  
  setupThemeChangeListener() {
    // 监听主题变化（如果主题支持动态切换）
    
    // 监听data-theme属性变化
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && 
            (mutation.attributeName === 'class' || mutation.attributeName === 'data-theme')) {
          // 重新检测主题并应用适配
          const oldTheme = this.theme;
          this.detectTheme();
          
          if (oldTheme !== this.theme) {
            // 移除旧的适配样式
            const oldStyle = document.getElementById(`${oldTheme}-adapter`);
            if (oldStyle) {
              oldStyle.remove();
            }
            
            // 移除旧的主题类
            document.documentElement.classList.remove(`theme-${oldTheme}`);
            
            // 应用新的适配
            this.applyAdaptations();
            
            console.log(`主题已从 ${oldTheme} 切换到 ${this.theme}`);
            
            // 触发自定义事件
            this.dispatchThemeChangeEvent(this.theme);
          }
        }
      });
    });
    
    // 观察html和body元素的变化
    observer.observe(document.documentElement, { 
      attributes: true, 
      attributeFilter: ['class', 'data-theme'] 
    });
    
    observer.observe(document.body, { 
      attributes: true, 
      attributeFilter: ['class', 'data-theme'] 
    });
    
    // 监听暗色/亮色模式切换
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', (e) => {
      this.dispatchThemeChangeEvent(this.theme, { prefersDark: e.matches });
    });
  }
  
  dispatchThemeChangeEvent(theme, details = {}) {
    const event = new CustomEvent('themechanged', {
      detail: { 
        theme, 
        timestamp: new Date().toISOString(),
        ...details 
      }
    });
    
    window.dispatchEvent(event);
  }
  
  // 公共API
  getCurrentTheme() {
    return this.theme;
  }
  
  isTheme(themeName) {
    return this.theme === themeName;
  }
  
  getThemeInfo() {
    return {
      name: this.theme,
      isDark: document.documentElement.classList.contains('dark') || 
              window.matchMedia('(prefers-color-scheme: dark)').matches,
      timestamp: new Date().toISOString()
    };
  }
  
  injectStyles(css, id = 'custom-adapter') {
    // 注入自定义CSS样式
    const style = document.createElement('style');
    style.id = id;
    style.textContent = css;
    document.head.appendChild(style);
    
    return style;
  }
  
  destroy() {
    // 清理所有注入的样式
    const adapterStyles = document.querySelectorAll('style[id$="-adapter"]');
    adapterStyles.forEach(style => style.remove());
    
    // 移除主题类
    document.documentElement.classList.remove(`theme-${this.theme}`);
    document.documentElement.removeAttribute('data-detected-theme');
  }
}

// 自动初始化
document.addEventListener('DOMContentLoaded', () => {
  window.themeAdapter = new ThemeAdapter();
  
  // 全局API
  window.Theme = {
    getCurrent: () => window.themeAdapter.getCurrentTheme(),
    getInfo: () => window.themeAdapter.getThemeInfo(),
    is: (themeName) => window.themeAdapter.isTheme(themeName),
    injectStyles: (css, id) => window.themeAdapter.injectStyles(css, id)
  };
  
  // 监听主题变化事件
  window.addEventListener('themechanged', (e) => {
    console.log('主题已更改:', e.detail);
    
    // 可以在这里执行主题变化后的操作
    // 例如：重新初始化组件、更新样式等
  });
});

// 导出供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ThemeAdapter;
}