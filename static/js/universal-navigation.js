/**
 * universal-navigation.js
 * Purpose: 通用导航系统，支持多级菜单和主题兼容性
 * 可以从配置文件生成导航，支持父目录、子菜单、响应式设计
 */

class UniversalNavigation {
  constructor(options = {}) {
    this.options = {
      configPath: '/config/navigation.json',
      containerSelector: 'header nav, .site-nav, .main-nav',
      mobileMenuButton: '.mobile-menu-button, .nav-toggle',
      theme: 'auto',
      ...options
    };
    
    this.config = null;
    this.navContainer = null;
    this.mobileMenu = null;
    this.isMobile = false;
    this.state = {
      expandedMenus: new Set(),
      currentPath: window.location.pathname
    };
    
    this.init();
  }
  
  async init() {
    // 检测当前主题
    await this.detectTheme();
    
    // 加载配置
    await this.loadConfig();
    
    // 初始化DOM
    this.initContainers();
    
    // 生成导航
    this.generateNavigation();
    
    // 设置事件监听
    this.setupEventListeners();
    
    // 恢复状态
    this.restoreState();
    
    // 初始响应式检查
    this.checkResponsive();
  }
  
  async detectTheme() {
    // 自动检测主题
    if (this.options.theme === 'auto') {
      // 通过CSS类名检测常见主题
      const themeIndicators = {
        'blowfish': document.querySelector('.blowfish-theme, [data-theme="blowfish"]'),
        'hugo-stack': document.querySelector('.stack-theme, .theme-stack'),
        'hugo-coder': document.querySelector('.coder-theme, .theme-coder'),
        'papermod': document.querySelector('.papermod-theme, .theme-papermod')
      };
      
      for (const [theme, element] of Object.entries(themeIndicators)) {
        if (element) {
          this.options.theme = theme;
          console.log(`检测到主题: ${theme}`);
          break;
        }
      }
      
      // 默认使用blowfish（当前主题）
      if (!this.options.theme || this.options.theme === 'auto') {
        this.options.theme = 'blowfish';
      }
    }
  }
  
  async loadConfig() {
    try {
      // 尝试从现有DOM中读取菜单配置
      this.config = this.extractConfigFromDOM();
      
      if (this.config.main.length > 0) {
        console.log('从现有DOM提取导航配置成功');
        return;
      }
      
      // 如果无法从DOM提取，使用简单配置
      this.config = this.getSimpleConfig();
      console.log('使用简单导航配置');
      
    } catch (error) {
      console.error('加载导航配置失败:', error);
      this.config = this.getSimpleConfig();
    }
  }
  
  extractConfigFromDOM() {
    const config = {
      main: [],
      auxiliary: [],
      quick: [],
      footer: [],
      mobile: []
    };
    
    // 尝试从现有导航中提取配置
    const existingNav = document.querySelector('nav, .nav, .navigation');
    if (existingNav) {
      const links = existingNav.querySelectorAll('a');
      links.forEach((link, index) => {
        const name = link.textContent.trim();
        const url = link.getAttribute('href');
        
        if (name && url) {
          config.main.push({
            name: name,
            url: url,
            weight: index * 10,
            icon: this.guessIcon(name)
          });
        }
      });
    }
    
    return config;
  }
  
  guessIcon(name) {
    // 根据名称猜测图标
    const iconMap = {
      '博客': '📝',
      '文章': '📝',
      '标签': '🏷️',
      '分类': '📂',
      '友链': '👥',
      '音乐': '🎵',
      '工具': '🛠️',
      '关于': '👤',
      '项目': '🚀',
      '搜索': '🔍',
      'GitHub': '🐙',
      '首页': '🏠'
    };
    
    return iconMap[name] || '🔗';
  }
  
  getSimpleConfig() {
    // 简单配置，只包含基本链接
    return {
      main: [
        { name: "博客", pageRef: "posts", weight: 10, icon: "📝" },
        { name: "标签", pageRef: "tags", weight: 20, icon: "🏷️" },
        { name: "分类", pageRef: "categories", weight: 30, icon: "📂" },
        { name: "友链", pageRef: "friends", weight: 40, icon: "👥" }
      ],
      auxiliary: [],
      quick: [],
      footer: [],
      mobile: []
    };
  }
  

  
  getDefaultConfig() {
    // 从现有菜单配置生成默认配置
    // 实际使用中会从现有菜单自动生成
    return {
      main: [],
      auxiliary: [],
      quick: [],
      footer: [],
      mobile: []
    };
  }
  
  initContainers() {
    // 查找或创建导航容器
    this.navContainer = document.querySelector(this.options.containerSelector);
    
    if (!this.navContainer) {
      // 创建新的导航容器
      this.navContainer = document.createElement('nav');
      this.navContainer.className = 'universal-nav';
      this.navContainer.setAttribute('role', 'navigation');
      this.navContainer.setAttribute('aria-label', '主要导航');
      
      // 插入到页面中
      const header = document.querySelector('header');
      if (header) {
        header.appendChild(this.navContainer);
      } else {
        document.body.insertBefore(this.navContainer, document.body.firstChild);
      }
    }
    
    // 创建移动端菜单按钮（如果不存在）
    this.createMobileMenuButton();
    
    // 创建移动端菜单容器
    this.createMobileMenu();
  }
  
  createMobileMenuButton() {
    let button = document.querySelector(this.options.mobileMenuButton);
    
    if (!button) {
      button = document.createElement('button');
      button.className = 'mobile-menu-button';
      button.setAttribute('aria-label', '打开导航菜单');
      button.setAttribute('aria-expanded', 'false');
      button.innerHTML = '☰';
      
      // 插入到导航容器附近
      if (this.navContainer.parentNode) {
        this.navContainer.parentNode.insertBefore(button, this.navContainer);
      }
    }
    
    this.mobileMenuButton = button;
  }
  
  createMobileMenu() {
    this.mobileMenu = document.createElement('div');
    this.mobileMenu.className = 'mobile-menu';
    this.mobileMenu.setAttribute('aria-hidden', 'true');
    
    document.body.appendChild(this.mobileMenu);
  }
  
  generateNavigation() {
    // 清空现有内容
    this.navContainer.innerHTML = '';
    this.mobileMenu.innerHTML = '';
    
    // 生成主导航
    this.generateMainNavigation();
    
    // 生成移动端导航
    this.generateMobileNavigation();
    
    // 生成辅助导航（如果配置了）
    this.generateAuxiliaryNavigation();
    
    // 生成快速链接（如果配置了）
    this.generateQuickLinks();
  }
  
  generateMainNavigation() {
    if (!this.config.main || this.config.main.length === 0) return;
    
    const ul = document.createElement('ul');
    ul.className = 'nav-menu main-menu';
    
    // 按权重排序
    const sortedItems = [...this.config.main].sort((a, b) => (a.weight || 50) - (b.weight || 50));
    
    // 构建菜单树
    const menuTree = this.buildMenuTree(sortedItems);
    
    // 生成菜单HTML
    menuTree.forEach(item => {
      const li = this.createMenuItem(item, 'main');
      ul.appendChild(li);
    });
    
    this.navContainer.appendChild(ul);
  }
  
  buildMenuTree(items) {
    const tree = [];
    const itemMap = new Map();
    
    // 第一遍：创建所有项并建立映射
    items.forEach(item => {
      const menuItem = { ...item, children: [] };
      itemMap.set(item.name, menuItem);
    });
    
    // 第二遍：建立父子关系
    items.forEach(item => {
      const menuItem = itemMap.get(item.name);
      
      if (item.parent) {
        const parent = itemMap.get(item.parent);
        if (parent) {
          parent.children.push(menuItem);
          parent.hasChildren = true;
        } else {
          // 父项不存在，作为顶级项
          tree.push(menuItem);
        }
      } else {
        // 没有父项，作为顶级项
        tree.push(menuItem);
      }
    });
    
    // 按权重排序子项
    tree.forEach(item => {
      if (item.children.length > 0) {
        item.children.sort((a, b) => (a.weight || 50) - (b.weight || 50));
      }
    });
    
    // 按权重排序顶级项
    tree.sort((a, b) => (a.weight || 50) - (b.weight || 50));
    
    return tree;
  }
  
  createMenuItem(item, type = 'main') {
    const li = document.createElement('li');
    li.className = `nav-item ${type}-item`;
    
    if (item.hidden) {
      li.style.display = 'none';
    }
    
    // 检查是否是当前页面
    const isCurrent = this.isCurrentPage(item);
    if (isCurrent) {
      li.classList.add('current');
    }
    
    // 创建链接或父目录
    if (item.hasChildren) {
      this.createParentMenuItem(li, item, type);
    } else {
      this.createLinkMenuItem(li, item, type);
    }
    
    // 添加子菜单（如果有）
    if (item.children && item.children.length > 0) {
      this.createSubmenu(li, item.children, type);
    }
    
    return li;
  }
  
  createParentMenuItem(li, item, type) {
    const button = document.createElement('button');
    button.className = 'nav-parent';
    button.setAttribute('aria-expanded', 'false');
    button.setAttribute('aria-haspopup', 'true');
    
    // 添加图标
    if (item.icon) {
      const iconSpan = document.createElement('span');
      iconSpan.className = 'nav-icon';
      iconSpan.textContent = this.getIcon(item.icon);
      button.appendChild(iconSpan);
    }
    
    // 添加文本
    const textSpan = document.createElement('span');
    textSpan.className = 'nav-text';
    textSpan.textContent = item.name;
    button.appendChild(textSpan);
    
    // 添加下拉箭头
    const arrowSpan = document.createElement('span');
    arrowSpan.className = 'nav-arrow';
    arrowSpan.textContent = '▾';
    button.appendChild(arrowSpan);
    
    // 添加描述（作为title属性）
    if (item.description) {
      button.setAttribute('title', item.description);
    }
    
    li.appendChild(button);
    
    // 点击事件
    button.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggleSubmenu(li);
    });
    
    // 键盘导航
    button.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.toggleSubmenu(li);
      } else if (e.key === 'Escape') {
        this.closeSubmenu(li);
      }
    });
  }
  
  createLinkMenuItem(li, item, type) {
    const a = document.createElement('a');
    a.className = 'nav-link';
    
    // 设置链接属性
    if (item.url) {
      a.href = item.url;
    } else if (item.pageRef) {
      a.href = this.getPageUrl(item.pageRef);
    } else {
      a.href = '#';
      a.classList.add('no-link');
    }
    
    if (item.target) {
      a.target = item.target;
    }
    
    if (item.rel) {
      a.rel = item.rel;
    }
    
    // 添加图标
    if (item.icon) {
      const iconSpan = document.createElement('span');
      iconSpan.className = 'nav-icon';
      iconSpan.textContent = this.getIcon(item.icon);
      a.appendChild(iconSpan);
    }
    
    // 添加文本
    const textSpan = document.createElement('span');
    textSpan.className = 'nav-text';
    textSpan.textContent = item.name;
    a.appendChild(textSpan);
    
    // 添加描述（作为title属性）
    if (item.description) {
      a.setAttribute('title', item.description);
    }
    
    // 如果是当前页面，添加aria-current
    if (this.isCurrentPage(item)) {
      a.setAttribute('aria-current', 'page');
    }
    
    li.appendChild(a);
  }
  
  createSubmenu(li, children, type) {
    const submenu = document.createElement('ul');
    submenu.className = `nav-submenu ${type}-submenu`;
    submenu.setAttribute('role', 'menu');
    submenu.setAttribute('aria-hidden', 'true');
    
    children.forEach(child => {
      const childLi = this.createMenuItem(child, `${type}-child`);
      submenu.appendChild(childLi);
    });
    
    li.appendChild(submenu);
    
    // 如果父项默认展开，打开子菜单
    const parentItem = children[0]?.__parent;
    if (parentItem?.expanded) {
      this.openSubmenu(li);
    }
  }
  
  generateMobileNavigation() {
    if (!this.config.mobile || this.config.mobile.length === 0) {
      // 使用主导航作为移动端导航
      this.config.mobile = [...this.config.main];
    }
    
    const sortedItems = [...this.config.mobile].sort((a, b) => (a.weight || 50) - (b.weight || 50));
    const menuTree = this.buildMenuTree(sortedItems);
    
    const ul = document.createElement('ul');
    ul.className = 'mobile-nav-menu';
    
    menuTree.forEach(item => {
      const li = this.createMenuItem(item, 'mobile');
      ul.appendChild(li);
    });
    
    this.mobileMenu.appendChild(ul);
    
    // 添加关闭按钮
    const closeButton = document.createElement('button');
    closeButton.className = 'mobile-menu-close';
    closeButton.setAttribute('aria-label', '关闭菜单');
    closeButton.innerHTML = '×';
    closeButton.addEventListener('click', () => this.closeMobileMenu());
    
    this.mobileMenu.appendChild(closeButton);
  }
  
  generateAuxiliaryNavigation() {
    if (!this.config.auxiliary || this.config.auxiliary.length === 0) return;
    
    const container = document.querySelector('.auxiliary-nav, .sidebar, aside') || this.createAuxiliaryContainer();
    
    const ul = document.createElement('ul');
    ul.className = 'auxiliary-menu';
    
    const sortedItems = [...this.config.auxiliary].sort((a, b) => (a.weight || 50) - (b.weight || 50));
    
    sortedItems.forEach(item => {
      const li = this.createMenuItem(item, 'auxiliary');
      ul.appendChild(li);
    });
    
    container.appendChild(ul);
  }
  
  createAuxiliaryContainer() {
    const container = document.createElement('aside');
    container.className = 'auxiliary-nav';
    container.setAttribute('role', 'complementary');
    container.setAttribute('aria-label', '辅助导航');
    
    // 插入到主要内容之前或之后
    const main = document.querySelector('main');
    if (main) {
      main.parentNode.insertBefore(container, main.nextSibling);
    } else {
      document.body.appendChild(container);
    }
    
    return container;
  }
  
  generateQuickLinks() {
    if (!this.config.quick || this.config.quick.length === 0) return;
    
    const container = document.querySelector('.quick-links, .homepage .links') || this.createQuickLinksContainer();
    
    const ul = document.createElement('ul');
    ul.className = 'quick-links-menu';
    
    const sortedItems = [...this.config.quick].sort((a, b) => (a.weight || 50) - (b.weight || 50));
    
    sortedItems.forEach(item => {
      const li = this.createMenuItem(item, 'quick');
      ul.appendChild(li);
    });
    
    container.appendChild(ul);
  }
  
  createQuickLinksContainer() {
    const container = document.createElement('div');
    container.className = 'quick-links';
    
    // 插入到首页的合适位置
    const homepage = document.querySelector('.homepage, .hero-section');
    if (homepage) {
      homepage.appendChild(container);
    }
    
    return container;
  }
  
  getPageUrl(pageRef) {
    // 简单的页面引用到URL映射
    const pageMap = {
      'posts': '/posts/',
      'tags': '/tags/',
      'categories': '/categories/',
      'friends': '/友链/',
      'music': '/音乐/',
      'about': '/about/',
      'projects': '/projects/',
      'search': '/search/',
      'archives': '/archives/'
    };
    
    return pageMap[pageRef] || `/${pageRef}/`;
  }
  
  getIcon(iconName) {
    // 简单的图标映射
    const iconMap = {
      'github': '🐙',
      'rss': '📡',
      'search': '🔍',
      'home': '🏠',
      'posts': '📝',
      'tags': '🏷️',
      'categories': '📂',
      'about': '👤',
      'projects': '🚀',
      'music': '🎵',
      'friends': '👥',
      'tools': '🛠️'
    };
    
    return iconMap[iconName] || iconName;
  }
  
  isCurrentPage(item) {
    const currentPath = this.state.currentPath;
    
    if (item.url) {
      return currentPath === item.url || 
             currentPath === new URL(item.url, window.location.origin).pathname;
    } else if (item.pageRef) {
      const pageUrl = this.getPageUrl(item.pageRef);
      return currentPath === pageUrl || 
             currentPath.startsWith(pageUrl);
    }
    
    return false;
  }
  
  toggleSubmenu(li) {
    const isExpanded = li.classList.contains('expanded');
    
    if (isExpanded) {
      this.closeSubmenu(li);
    } else {
      this.openSubmenu(li);
    }
  }
  
  openSubmenu(li) {
    li.classList.add('expanded');
    const button = li.querySelector('.nav-parent');
    const submenu = li.querySelector('.nav-submenu');
    
    if (button) {
      button.setAttribute('aria-expanded', 'true');
    }
    
    if (submenu) {
      submenu.setAttribute('aria-hidden', 'false');
    }
    
    // 保存状态
    const itemName = li.querySelector('.nav-text')?.textContent;
    if (itemName) {
      this.state.expandedMenus.add(itemName);
      this.saveState();
    }
  }
  
  closeSubmenu(li) {
    li.classList.remove('expanded');
    const button = li.querySelector('.nav-parent');
    const submenu = li.querySelector('.nav-submenu');
    
    if (button) {
      button.setAttribute('aria-expanded', 'false');
    }
    
    if (submenu) {
      submenu.setAttribute('aria-hidden', 'true');
    }
    
    // 更新状态
    const itemName = li.querySelector('.nav-text')?.textContent;
    if (itemName) {
      this.state.expandedMenus.delete(itemName);
      this.saveState();
    }
  }
  
  toggleMobileMenu() {
    const isOpen = this.mobileMenu.getAttribute('aria-hidden') === 'false';
    
    if (isOpen) {
      this.closeMobileMenu();
    } else {
      this.openMobileMenu();
    }
  }
  
  openMobileMenu() {
    this.mobileMenu.setAttribute('aria-hidden', 'false');
    this.mobileMenuButton.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }
  
  closeMobileMenu() {
    this.mobileMenu.setAttribute('aria-hidden', 'true');
    this.mobileMenuButton.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
  
  setupEventListeners() {
    // 移动端菜单按钮
    if (this.mobileMenuButton) {
      this.mobileMenuButton.addEventListener('click', () => this.toggleMobileMenu());
    }
    
    // 窗口大小变化
    window.addEventListener('resize', () => this.checkResponsive());
    
    // 点击外部关闭菜单
    document.addEventListener('click', (e) => {
      if (!this.navContainer.contains(e.target) && !this.mobileMenu.contains(e.target)) {
        this.closeAllSubmenus();
      }
    });
    
    // 键盘快捷键
    document.addEventListener('keydown', (e) => {
      // ESC关闭所有菜单
      if (e.key === 'Escape') {
        this.closeAllSubmenus();
        this.closeMobileMenu();
      }
      
      // Alt+N聚焦导航
      if (e.altKey && e.key === 'n') {
        e.preventDefault();
        this.focusNavigation();
      }
    });
    
    // 触摸手势（移动端）
    if ('ontouchstart' in window) {
      let touchStartX = 0;
      let touchStartY = 0;
      
      document.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
      });
      
      document.addEventListener('touchend', (e) => {
        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;
        const diffX = touchStartX - touchEndX;
        const diffY = touchStartY - touchEndY;
        
        // 从左向右滑动打开菜单
        if (diffX < -50 && Math.abs(diffY) < 30) {
          this.openMobileMenu();
        }
        
        // 从右向左滑动关闭菜单
        if (diffX > 50 && Math.abs(diffY) < 30) {
          this.closeMobileMenu();
        }
      });
    }
  }
  
  closeAllSubmenus() {
    const expandedItems = this.navContainer.querySelectorAll('.nav-item.expanded');
    expandedItems.forEach(item => this.closeSubmenu(item));
  }
  
  focusNavigation() {
    const firstLink = this.navContainer.querySelector('a, button');
    if (firstLink) {
      firstLink.focus();
    }
  }
  
  checkResponsive() {
    const wasMobile = this.isMobile;
    this.isMobile = window.innerWidth <= 768;
    
    if (wasMobile !== this.isMobile) {
      // 响应式变化处理
      if (this.isMobile) {
        this.navContainer.classList.add('mobile-view');
      } else {
        this.navContainer.classList.remove('mobile-view');
        this.closeMobileMenu();
      }
    }
  }
  
  saveState() {
    if (!this.options.persistState) return;
    
    try {
      const state = {
        expandedMenus: Array.from(this.state.expandedMenus),
        theme: this.options.theme
      };
      
      localStorage.setItem('navigation_state', JSON.stringify(state));
    } catch (error) {
      console.warn('无法保存导航状态:', error);
    }
  }
  
  restoreState() {
    if (!this.options.persistState) return;
    
    try {
      const saved = localStorage.getItem('navigation_state');
      if (saved) {
        const state = JSON.parse(saved);
        
        if (state.expandedMenus) {
          state.expandedMenus.forEach(menuName => {
            const menuItem = this.findMenuItemByName(menuName);
            if (menuItem) {
              this.openSubmenu(menuItem);
            }
          });
        }
      }
    } catch (error) {
      console.warn('无法恢复导航状态:', error);
    }
  }
  
  findMenuItemByName(name) {
    const items = this.navContainer.querySelectorAll('.nav-item');
    
    for (const item of items) {
      const text = item.querySelector('.nav-text')?.textContent;
      if (text === name) {
        return item;
      }
    }
    
    return null;
  }
  
  // 公共API
  refresh() {
    this.generateNavigation();
  }
  
  updateConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };
    this.refresh();
  }
  
  addMenuItem(section, item) {
    if (!this.config[section]) {
      this.config[section] = [];
    }
    
    this.config[section].push(item);
    this.refresh();
  }
  
  removeMenuItem(section, itemName) {
    if (this.config[section]) {
      this.config[section] = this.config[section].filter(item => item.name !== itemName);
      this.refresh();
    }
  }
  
  destroy() {
    // 清理事件监听器
    if (this.mobileMenuButton) {
      this.mobileMenuButton.removeEventListener('click', this.toggleMobileMenu);
    }
    
    // 移除创建的DOM元素
    if (this.mobileMenu && this.mobileMenu.parentNode) {
      this.mobileMenu.parentNode.removeChild(this.mobileMenu);
    }
    
    // 清理状态
    this.state.expandedMenus.clear();
  }
}

// 自动初始化
document.addEventListener('DOMContentLoaded', () => {
  // 延迟初始化，确保主题完全加载
  setTimeout(() => {
    window.universalNavigation = new UniversalNavigation({
      persistState: true,
      theme: 'auto'
    });
    
    // 全局API
    window.Navigation = {
      refresh: () => window.universalNavigation.refresh(),
      addItem: (section, item) => window.universalNavigation.addMenuItem(section, item),
      removeItem: (section, name) => window.universalNavigation.removeMenuItem(section, name),
      toggleMenu: () => window.universalNavigation.toggleMobileMenu(),
      openMenu: () => window.universalNavigation.openMobileMenu(),
      closeMenu: () => window.universalNavigation.closeMobileMenu()
    };
  }, 100);
});

// 导出供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
  module.exports = UniversalNavigation;
}