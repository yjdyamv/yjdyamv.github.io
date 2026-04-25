/**
 * toc-navigation.js
 * Purpose: 生成文章目录导航，增强长文章阅读体验
 * 自动提取文章标题，创建可点击的目录，支持滚动高亮
 */

class TOCNavigation {
  constructor(options = {}) {
    this.options = {
      containerSelector: '.article-content, article, .post-content',
      tocContainer: null,
      headingSelector: 'h2, h3, h4',
      scrollOffset: 20,
      smoothScroll: true,
      showLevel: 3,
      collapseDepth: 3,
      ...options
    };
    
    this.tocElement = null;
    this.headings = [];
    this.activeItem = null;
    this.observer = null;
    
    this.init();
  }
  
  init() {
    // 只在文章页面生成目录
    if (!this.shouldGenerateTOC()) return;
    
    // 收集标题
    this.collectHeadings();
    
    // 如果没有足够的标题，不生成目录
    if (this.headings.length < 2) return;
    
    // 创建目录容器
    this.createTOCContainer();
    
    // 生成目录
    this.generateTOC();
    
    // 设置交互
    this.setupInteractions();
    
    // 设置滚动监听
    this.setupScrollObserver();
  }
  
  shouldGenerateTOC() {
    // 检查是否在文章页面
    const isArticlePage = document.body.classList.contains('article-page') || 
                         window.location.pathname.includes('/posts/');
    
    // 检查是否已有目录
    const existingTOC = document.querySelector('.table-of-contents, .toc-container');
    
    return isArticlePage && !existingTOC;
  }
  
  collectHeadings() {
    const container = document.querySelector(this.options.containerSelector);
    if (!container) return;
    
    const headingElements = container.querySelectorAll(this.options.headingSelector);
    
    this.headings = Array.from(headingElements)
      .filter(heading => {
        return heading.checkVisibility ? heading.checkVisibility() : heading.getBoundingClientRect().width > 0 && heading.getBoundingClientRect().height > 0;
      })
      .map((heading, index) => {
        // 确保标题有ID
        let id = heading.id;
        if (!id) {
          id = this.generateHeadingId(heading, index);
          heading.id = id;
        }
        
        return {
          element: heading,
          id: id,
          text: heading.textContent.trim(),
          level: parseInt(heading.tagName.substring(1)),
          index: index
        };
      });
  }
  
  generateHeadingId(heading, index) {
    const text = heading.textContent.trim()
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s-]/gu, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    return text || `heading-${index}`;
  }
  
  createTOCContainer() {
    // 创建目录容器
    this.tocElement = document.createElement('div');
    this.tocElement.className = 'toc-navigation';
    
    // 添加标题
    const title = document.createElement('div');
    title.className = 'toc-title';
    title.textContent = '目录';
    title.innerHTML = `
      <span>📑 目录</span>
      <button class="toc-toggle" aria-label="折叠/展开目录">▼</button>
    `;
    
    this.tocElement.appendChild(title);
    
    // 添加目录列表容器
    const listContainer = document.createElement('div');
    listContainer.className = 'toc-list-container';
    this.tocElement.appendChild(listContainer);
    
    // 插入到页面中
    const insertPoint = this.options.tocContainer || 
                       document.querySelector('.article-sidebar') ||
                       document.querySelector('article') ||
                       document.body;
    
    if (insertPoint) {
      insertPoint.insertBefore(this.tocElement, insertPoint.firstChild);
    }
  }
  
  generateTOC() {
    const listContainer = this.tocElement.querySelector('.toc-list-container');
    const list = document.createElement('ul');
    list.className = 'toc-list';
    
    let currentLevel = 0;
    let listStack = [list];
    
    this.headings.forEach(heading => {
      // 跳过超过显示层级的标题
      if (heading.level > this.options.showLevel) return;
      
      // 处理层级嵌套
      while (currentLevel < heading.level - 1) {
        const newList = document.createElement('ul');
        const lastItem = listStack[listStack.length - 1].lastElementChild;
        if (lastItem) {
          lastItem.appendChild(newList);
        }
        listStack.push(newList);
        currentLevel++;
      }
      
      while (currentLevel > heading.level - 1) {
        listStack.pop();
        currentLevel--;
      }
      
      // 创建列表项
      const listItem = document.createElement('li');
      listItem.className = `toc-item toc-level-${heading.level}`;
      
      const link = document.createElement('a');
      link.href = `#${heading.id}`;
      link.textContent = heading.text;
      link.className = 'toc-link';
      link.dataset.headingId = heading.id;
      
      // 添加标题级别指示器
      const levelIndicator = document.createElement('span');
      levelIndicator.className = 'toc-level-indicator';
      levelIndicator.textContent = '—'.repeat(heading.level - 1);
      
      link.prepend(levelIndicator);
      listItem.appendChild(link);
      listStack[listStack.length - 1].appendChild(listItem);
    });
    
    listContainer.appendChild(list);
    
    // 添加折叠/展开功能
    this.setupCollapsibleTOC();
  }
  
  setupCollapsibleTOC() {
    const toggleButton = this.tocElement.querySelector('.toc-toggle');
    const listContainer = this.tocElement.querySelector('.toc-list-container');
    
    if (toggleButton && listContainer) {
      let isCollapsed = false;
      
      toggleButton.addEventListener('click', () => {
        isCollapsed = !isCollapsed;
        listContainer.style.display = isCollapsed ? 'none' : 'block';
        toggleButton.textContent = isCollapsed ? '▶' : '▼';
        toggleButton.setAttribute('aria-expanded', !isCollapsed);
      });
      
      // 默认展开
      listContainer.style.display = 'block';
      toggleButton.setAttribute('aria-expanded', 'true');
    }
  }
  
  setupInteractions() {
    // 平滑滚动
    const links = this.tocElement.querySelectorAll('.toc-link');
    
    links.forEach(link => {
      link.addEventListener('click', (e) => {
        if (this.options.smoothScroll) {
          e.preventDefault();
          
          const targetId = link.getAttribute('href').substring(1);
          const targetElement = document.getElementById(targetId);
          
          if (targetElement) {
            this.scrollToElement(targetElement);
            
            // 更新URL哈希（不触发滚动）
            history.pushState(null, null, `#${targetId}`);
          }
        }
      });
    });
    
    // 添加键盘导航支持
    this.tocElement.addEventListener('keydown', (e) => {
      const activeLink = this.tocElement.querySelector('.toc-link:focus');
      
      if (!activeLink) return;
      
      const links = Array.from(this.tocElement.querySelectorAll('.toc-link'));
      const currentIndex = links.indexOf(activeLink);
      
      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          if (currentIndex > 0) {
            links[currentIndex - 1].focus();
          }
          break;
          
        case 'ArrowDown':
          e.preventDefault();
          if (currentIndex < links.length - 1) {
            links[currentIndex + 1].focus();
          }
          break;
          
        case 'Home':
          e.preventDefault();
          links[0].focus();
          break;
          
        case 'End':
          e.preventDefault();
          links[links.length - 1].focus();
          break;
      }
    });
  }
  
  scrollToElement(element) {
    const offset = this.options.scrollOffset;
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;
    
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }
  
  setupScrollObserver() {
    if (!this.headings.length) return;
    
    // 使用Intersection Observer监听标题进入视口
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.setActiveItem(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-10% 0px -60% 0px',
        threshold: 0
      }
    );
    
    // 观察所有标题
    this.headings.forEach(heading => {
      this.observer.observe(heading.element);
    });
  }
  
  setActiveItem(headingId) {
    // 移除之前的活动状态
    if (this.activeItem) {
      this.activeItem.classList.remove('active');
    }
    
    // 设置新的活动状态
    const activeLink = this.tocElement.querySelector(`.toc-link[data-heading-id="${headingId}"]`);
    if (activeLink) {
      activeLink.classList.add('active');
      this.activeItem = activeLink;
      
      // 确保活动项在视口中可见（如果目录可滚动）
      this.scrollToActiveItem(activeLink);
    }
  }
  
  scrollToActiveItem(activeLink) {
    const tocContainer = this.tocElement.querySelector('.toc-list-container');
    if (!tocContainer || tocContainer.scrollHeight <= tocContainer.clientHeight) {
      return;
    }
    
    const linkRect = activeLink.getBoundingClientRect();
    const containerRect = tocContainer.getBoundingClientRect();
    
    if (linkRect.top < containerRect.top) {
      // 向上滚动
      tocContainer.scrollTop += linkRect.top - containerRect.top - 10;
    } else if (linkRect.bottom > containerRect.bottom) {
      // 向下滚动
      tocContainer.scrollTop += linkRect.bottom - containerRect.bottom + 10;
    }
  }
  
  destroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
    
    if (this.tocElement && this.tocElement.parentNode) {
      this.tocElement.parentNode.removeChild(this.tocElement);
    }
    
    this.tocElement = null;
    this.headings = [];
    this.activeItem = null;
    this.observer = null;
  }
}

// 自动初始化
document.addEventListener('DOMContentLoaded', () => {
  // 延迟初始化，确保内容加载完成
  setTimeout(() => {
    window.tocNavigation = new TOCNavigation();
  }, 500);
});

