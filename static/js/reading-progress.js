/**
 * reading-progress.js
 * Purpose: 显示文章阅读进度指示器
 * 在文章页面顶部显示阅读进度条，增强用户体验
 */

class ReadingProgress {
  constructor(options = {}) {
    this.options = {
      height: '4px',
      color: 'var(--color-primary-500)',
      backgroundColor: 'var(--color-neutral-200)',
      position: 'fixed',
      zIndex: 1000,
      ...options
    };
    
    this.progressBar = null;
    this.articleElement = null;
    this.isInitialized = false;
    
    this.init();
  }
  
  init() {
    // 只在文章页面显示
    if (!this.isArticlePage()) return;
    
    this.createProgressBar();
    this.setupEventListeners();
    this.isInitialized = true;
    
    // 初始更新
    this.updateProgress();
  }
  
  isArticlePage() {
    // 检查是否在文章页面
    return document.body.classList.contains('article-page') || 
           window.location.pathname.includes('/posts/');
  }
  
  createProgressBar() {
    // 创建进度条容器
    this.progressBar = document.createElement('div');
    this.progressBar.className = 'reading-progress';
    this.progressBar.style.cssText = `
      position: ${this.options.position};
      top: 0;
      left: 0;
      width: 100%;
      height: ${this.options.height};
      background-color: ${this.options.backgroundColor};
      z-index: ${this.options.zIndex};
      transition: transform 0.2s ease;
      transform: translateY(-100%);
    `;
    
    // 创建进度指示器
    const progressIndicator = document.createElement('div');
    progressIndicator.className = 'reading-progress-indicator';
    progressIndicator.style.cssText = `
      width: 0%;
      height: 100%;
      background-color: ${this.options.color};
      transition: width 0.3s ease;
      border-radius: 0 2px 2px 0;
    `;
    
    this.progressBar.appendChild(progressIndicator);
    document.body.appendChild(this.progressBar);
    
    // 显示进度条
    setTimeout(() => {
      this.progressBar.style.transform = 'translateY(0)';
    }, 100);
  }
  
  setupEventListeners() {
    // 监听滚动事件（使用节流优化性能）
    let ticking = false;
    const update = () => {
      this.updateProgress();
      ticking = false;
    };
    
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    }, { passive: true });
    
    // 监听窗口大小变化
    window.addEventListener('resize', () => {
      this.updateProgress();
    }, { passive: true });
    
    // 监听文章内容变化（用于SPA或动态加载）
    const observer = new MutationObserver(() => {
      this.updateProgress();
    });
    
    // 观察文章内容区域
    const article = document.querySelector('article') || document.querySelector('.article-content');
    if (article) {
      observer.observe(article, { 
        childList: true, 
        subtree: true,
        characterData: true
      });
    }
  }
  
  updateProgress() {
    if (!this.progressBar) return;
    
    const article = this.getArticleElement();
    if (!article) return;
    
    const articleRect = article.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // 计算文章在视口中的位置
    const articleTop = article.offsetTop;
    const articleHeight = article.offsetHeight;
    const articleBottom = articleTop + articleHeight;
    
    // 计算阅读进度
    let progress = 0;
    
    if (scrollTop >= articleTop) {
      const scrolled = scrollTop - articleTop;
      const visible = Math.min(windowHeight, articleHeight);
      progress = Math.min(100, (scrolled / (articleHeight - visible)) * 100);
    }
    
    // 更新进度条
    const indicator = this.progressBar.querySelector('.reading-progress-indicator');
    if (indicator) {
      indicator.style.width = `${progress}%`;
      
      // 添加完成状态
      if (progress >= 99.5) {
        this.progressBar.classList.add('completed');
      } else {
        this.progressBar.classList.remove('completed');
      }
    }
    
    // 触发自定义事件
    this.dispatchProgressEvent(progress);
  }
  
  getArticleElement() {
    if (this.articleElement) return this.articleElement;
    
    // 尝试多种选择器找到文章内容
    const selectors = [
      'article',
      '.article-content',
      '.post-content',
      '.page-main',
      'main'
    ];
    
    for (const selector of selectors) {
      const element = document.querySelector(selector);
      if (element) {
        this.articleElement = element;
        return element;
      }
    }
    
    return null;
  }
  
  dispatchProgressEvent(progress) {
    const event = new CustomEvent('readingprogress', {
      detail: { progress: Math.round(progress) }
    });
    window.dispatchEvent(event);
  }
  
  destroy() {
    if (this.progressBar && this.progressBar.parentNode) {
      this.progressBar.parentNode.removeChild(this.progressBar);
    }
    
    this.progressBar = null;
    this.articleElement = null;
    this.isInitialized = false;
  }
}

// 自动初始化
document.addEventListener('DOMContentLoaded', () => {
  // 延迟初始化，确保DOM完全加载
  setTimeout(() => {
    window.readingProgress = new ReadingProgress();
    
    // 可选：监听进度事件
    window.addEventListener('readingprogress', (e) => {
      // console.log(`阅读进度: ${e.detail.progress}%`);
      
      // 可以在进度达到特定值时触发其他操作
      if (e.detail.progress > 50) {
        // 例如：显示相关文章推荐
      }
    });
  }, 300);
});

// 导出供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ReadingProgress;
}