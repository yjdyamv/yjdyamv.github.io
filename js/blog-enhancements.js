/**
 * blog-enhancements.js
 * Purpose: 博客增强功能集成脚本
 * 集成所有优化功能：导航、主题持久化、阅读进度、目录等
 */

class BlogEnhancements {
  constructor() {
    this.modules = {
      navigation: null,
      theme: null,
      readingProgress: null,
      toc: null,
      themeAdapter: null
    };
    
    this.config = {
      enableNavigation: true,
      enableThemePersistence: true,
      enableReadingProgress: true,
      enableTOC: true,
      enableThemeAdapter: true,
      debug: false
    };
    
    this.init();
  }
  
  async init() {
    // 加载配置
    await this.loadConfig();
    
    // 初始化模块
    await this.initModules();
    
    // 设置全局API
    this.setupGlobalAPI();
    
    // 记录初始化完成
    this.log('博客增强功能已初始化');
  }
  
  async loadConfig() {
    try {
      // 尝试从配置文件加载
      const response = await fetch('/config/enhancements.json');
      if (response.ok) {
        const config = await response.json();
        this.config = { ...this.config, ...config };
        this.log('从配置文件加载设置');
      }
    } catch (error) {
      // 使用默认配置
      this.log('使用默认配置');
    }
  }
  
  async initModules() {
    // 按顺序初始化模块
    
    // 1. 主题适配器（最先初始化）
    if (this.config.enableThemeAdapter) {
      await this.initThemeAdapter();
    }
    
    // 2. 主题持久化
    if (this.config.enableThemePersistence) {
      await this.initThemePersistence();
    }
    
    // 3. 导航系统（暂时禁用，确保编译通过）
    // if (this.config.enableNavigation) {
    //   await this.initNavigation();
    // }
    
    // 4. 阅读进度
    if (this.config.enableReadingProgress) {
      await this.initReadingProgress();
    }
    
    // 5. 目录导航
    if (this.config.enableTOC) {
      await this.initTOC();
    }
    
    // 6. 友链右对齐
    this.alignFriendsLink();
  }
  
  async initThemeAdapter() {
    if (typeof ThemeAdapter !== 'undefined') {
      this.modules.themeAdapter = new ThemeAdapter();
      this.log('主题适配器已初始化');
    } else {
      // 动态加载
      await this.loadScript('/js/theme-adapter.js');
      this.modules.themeAdapter = new ThemeAdapter();
    }
  }
  
  async initThemePersistence() {
    if (typeof ThemePersistence !== 'undefined') {
      this.modules.theme = new ThemePersistence();
      this.log('主题持久化已初始化');
    } else {
      await this.loadScript('/js/theme-persistence.js');
      this.modules.theme = new ThemePersistence();
    }
  }
  
  async initNavigation() {
    if (typeof UniversalNavigation !== 'undefined') {
      this.modules.navigation = new UniversalNavigation({
        persistState: true,
        theme: 'auto'
      });
      this.log('通用导航已初始化');
    } else {
      await Promise.all([
        this.loadScript('/js/universal-navigation.js'),
        this.loadStyle('/css/universal-navigation.css')
      ]);
      this.modules.navigation = new UniversalNavigation({
        persistState: true,
        theme: 'auto'
      });
    }
  }
  
  async initReadingProgress() {
    // 只在文章页面初始化
    if (!this.isArticlePage()) return;
    
    if (typeof ReadingProgress !== 'undefined') {
      this.modules.readingProgress = new ReadingProgress();
      this.log('阅读进度指示器已初始化');
    } else {
      await Promise.all([
        this.loadScript('/js/reading-progress.js'),
        this.loadStyle('/css/reading-progress.css')
      ]);
      this.modules.readingProgress = new ReadingProgress();
    }
  }
  
  async initTOC() {
    // 只在文章页面初始化
    if (!this.isArticlePage()) return;
    
    // 检查是否已有目录（可能是主题自带的）
    const existingTOC = document.querySelector('.table-of-contents, .toc-container, .blowfish-toc');
    if (existingTOC) {
      this.log('主题目录已存在，跳过自定义目录');
      return;
    }
    
    if (typeof TOCNavigation !== 'undefined') {
      this.modules.toc = new TOCNavigation();
      this.log('目录导航已初始化');
    } else {
      await Promise.all([
        this.loadScript('/js/toc-navigation.js'),
        this.loadStyle('/css/toc-navigation.css')
      ]);
      this.modules.toc = new TOCNavigation();
    }
  }
  
  async loadScript(url) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = url;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }
  
  async loadStyle(url) {
    return new Promise((resolve, reject) => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = url;
      link.onload = resolve;
      link.onerror = reject;
      document.head.appendChild(link);
    });
  }
  
  isArticlePage() {
    return document.body.classList.contains('article-page') || 
           window.location.pathname.includes('/posts/') ||
           document.querySelector('article, .post-content, .article-content');
  }
  
  setupGlobalAPI() {
    window.BlogEnhancements = {
      // 配置管理
      getConfig: () => ({ ...this.config }),
      updateConfig: (newConfig) => {
        this.config = { ...this.config, ...newConfig };
        this.log('配置已更新');
      },
      
      // 模块访问
      getModule: (name) => this.modules[name],
      
      // 功能控制
      enableFeature: (feature) => {
        if (this.config[`enable${feature}`] !== undefined) {
          this.config[`enable${feature}`] = true;
          this.log(`已启用功能: ${feature}`);
        }
      },
      
      disableFeature: (feature) => {
        if (this.config[`enable${feature}`] !== undefined) {
          this.config[`enable${feature}`] = false;
          this.log(`已禁用功能: ${feature}`);
        }
      },
      
      // 重新初始化
      reinit: async () => {
        this.log('重新初始化所有模块...');
        await this.initModules();
      },
      
      // 调试
      debug: (enabled) => {
        this.config.debug = enabled;
        this.log(`调试模式: ${enabled ? '开启' : '关闭'}`);
      }
    };
  }
  
  log(message) {
    if (this.config.debug) {
      console.log(`[BlogEnhancements] ${message}`);
    }
  }
  
  error(message, error) {
    console.error(`[BlogEnhancements] ${message}`, error);
  }
  
  // 销毁所有模块
  destroy() {
    Object.values(this.modules).forEach(module => {
      if (module && typeof module.destroy === 'function') {
        module.destroy();
      }
    });
    
    this.modules = {};
    this.log('所有模块已销毁');
  }
}

// 自动初始化
document.addEventListener('DOMContentLoaded', () => {
  // 延迟初始化，确保页面完全加载
  setTimeout(() => {
    window.blogEnhancements = new BlogEnhancements();
  }, 100);
});

// 导出供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
  module.exports = BlogEnhancements;
}