const FARBA = {
  WH: window.innerHeight,

  WW: document.documentElement.clientWidth,

  isTouch: 'ontouchstart' in window || navigator.msMaxTouchPoints,

  //lazy load для сторонних либ
  lazyLibraryLoad(scriptSrc, linkHref, callback) {
    let script;
    const domScript = document.querySelector(`script[src="${scriptSrc}"]`);
    const domLink = document.querySelector(`link[href="${linkHref}"]`);

    if (!domScript) {
      script = document.createElement("script");
      script.src = scriptSrc;
      document.querySelector("#wrapper").after(script);
    }

    if (linkHref !== "" && !domLink) {
      let style = document.createElement("link");
      style.href = linkHref;
      style.rel = "stylesheet";
      document.querySelector("link").before(style);
    }

    if (!domScript) {
      script.onload = callback;
    } else {
      domScript.onload = callback;
    }
  }
}



document.addEventListener('DOMContentLoaded', () => {

  (function() {
    let ornt = window.innerWidth > window.innerHeight ? 'land' : 'port'
    let prev = window.innerHeight;
    let vh = prev * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  
    window.addEventListener('load', () => {   
        setTimeout(()=>{ 
        let vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
      },1)
    });
  
    window.addEventListener('resize', () => {
      let current = window.innerWidth > window.innerHeight ? 'land' : 'port'
  
      let vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
        ornt = current
  
      if (ornt !== current) {      
        let vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
        ornt = current
      }
    });
  })();
  
  $(() => {
    gsap.registerPlugin(ScrollTrigger);
  
    // Нормализация скролла для Mac
    if (isMac()) {
      console.log('MAC');
      ScrollTrigger.normalizeScroll({
        allowNestedScroll: true,
        target: document.body
      });
    }

    function isMac() {
      return navigator.platform.indexOf('Mac') > -1;
    }

    // параллакс блока "Создатели"
    // const image = document.querySelector(".founders-image");
    // gsap.to(image, {
    //   yPercent: 15, // Изображение будет двигаться на 10% от своей высоты
    //   ease: "none", // Линейное движение
    //   scrollTrigger: {
    //     trigger: ".founders", // Элемент, который запускает анимацию
    //     start: "top top", // Начинаем анимацию, когда верх .founders достигает верха viewport
    //     end: "bottom top", // Заканчиваем, когда низ .founders достигает верха viewport
    //     scrub: true, // Плавная анимация при скролле
    //     // markers: true, // Раскомментировать для отладки
    //   }
    // });
  })

  // Глобальная переменная для отслеживания состояния попапа
  let isPopupOpen = false;

  // Функция для обработки изменения состояния истории
  function handlePopState(event) {
    if (isPopupOpen) {
      $.magnificPopup.close();
      isPopupOpen = false;
    }
  }

  // Добавляем обработчик события popstate
  window.addEventListener('popstate', handlePopState);

  // Обработчик закрытия попапа при нажатии Escape
  $(document).keydown(function(e) {
    if (e.keyCode === 27 && isPopupOpen) {
      history.back();
    }
  });
  
  // Открытие попапа
  $(document).on("click", ".mfp-link", function (e) {
    e.preventDefault();
    var clickedElement = $(this);
  
    // Проверяем, является ли элемент частью галереи
    if (clickedElement.hasClass('mfp-gallery-item')) {
      // Логика для открытия галереи
      var galleryItems = [];
      var uniqueIds = new Set(); // Для отслеживания уникальных data-id
      var isInSlider = clickedElement.closest('.swiper').length > 0;
  
      // Собираем все элементы галереи
      $(".mfp-gallery-item").each(function () {
        var $this = $(this);
        var $img = $this.find('img');
        var dataId = $img.attr('data-id');
        var itemIsInSlider = $this.closest('.swiper').length > 0;
  
        // Если элемент в слайдере, проверяем уникальность
        if (itemIsInSlider) {
          if (!uniqueIds.has(dataId)) {
            uniqueIds.add(dataId);
            galleryItems.push({
              src: $this.attr("data-href"),
              title: $this.find('.diploms-card-title').text().trim(),
              dataId: dataId
            });
          }
        } else {
          // Если элемент не в слайдере, добавляем его без проверки уникальности
          galleryItems.push({
            src: $this.attr("data-href"),
            title: $this.find('.diploms-card-title').text().trim(),
            dataId: dataId
          });
        }
      });
  
      // Находим индекс кликнутого элемента
      var index;
      if (isInSlider) {
        var clickedDataId = clickedElement.find('img').attr('data-id');
        index = galleryItems.findIndex(item => item.dataId === clickedDataId);
      } else {
        index = $(".mfp-gallery-item").index(clickedElement);
      }
  
      $.magnificPopup.open({
        items: galleryItems,
        type: 'image',
        gallery: {
          enabled: true,
          navigateByImgClick: true,
          preload: [0, 1],
          tCounter: '%curr% из %total%' // Локализация счетчика на русский язык
        },
        overflowY: "scroll",
        removalDelay: 300,
        mainClass: 'my-mfp-zoom-in',
        callbacks: {
          open: function () {
            setTimeout(function(){
              $('.mfp-wrap').addClass('not_delay');
              $('.mfp-popup').addClass('not_delay');
            }, 700);
            document.documentElement.style.overflow = 'hidden';
          },
          close: function() {
            document.documentElement.style.overflow = '';
          }
        }
      }, index);
    } else {
      // Логика для открытия обычного попапа
      $.magnificPopup.open({
        items: { src: clickedElement.attr("data-href") },
        type: "ajax",
        overflowY: "scroll",
        removalDelay: 300,
        mainClass: 'my-mfp-zoom-in',
        ajax: {
          tError: "Error. Not valid url",
        },
        callbacks: {
          open: function () {
            setTimeout(function(){
              $('.mfp-wrap').addClass('not_delay');
              $('.mfp-popup').addClass('not_delay');
            }, 700);
            document.documentElement.style.overflow = 'hidden';
            history.pushState({ popup: 'gallery' }, '');
            isPopupOpen = true;
          },
          close: function() {
            document.documentElement.style.overflow = '';
            isPopupOpen = false;
          }
        }
      });
    }
  
    return false;
  });

  // открытие меню в header
  (function() {
    const menuLinks = document.querySelectorAll('.header-nav > ul > li > a');
    const asideLinks = document.querySelectorAll('.menu-aside > ul > li > a');
    const mainSections = document.querySelectorAll('.menu-main-section');
    const menuMain = document.querySelector('.menu-main');
    const headerNavMenu = document.querySelector('.header-nav-menu-inner');
  
    let scrollOffset = parseInt(window.getComputedStyle(menuMain).marginTop, 10);
    let selectedIndex = null;
    let visibleSections = new Set();
  
    function smoothScroll(target, duration) {
      const targetPosition = target.offsetTop - scrollOffset;
      const startPosition = menuMain.scrollTop;
      const distance = targetPosition - startPosition;
      let startTime = null;
  
      function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const run = ease(timeElapsed, startPosition, distance, duration);
        menuMain.scrollTo(0, run);
        if (timeElapsed < duration) requestAnimationFrame(animation);
      }
  
      function ease(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
      }
  
      requestAnimationFrame(animation);
    }   
  
    function updateActiveLink() {
      let activeIndex;
  
      if (selectedIndex !== null && visibleSections.has(selectedIndex)) {
        activeIndex = selectedIndex;
      } else {
        activeIndex = Math.min(...visibleSections);
      }
  
      asideLinks.forEach((link, index) => {
        if (index === activeIndex) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
    }
  
    function scrollToActiveLink() {
      const activeLink = document.querySelector('.menu-aside > ul > li > a.active');
      if (activeLink) {
        const index = Array.from(asideLinks).indexOf(activeLink);
        selectedIndex = index;
        smoothScroll(mainSections[index], 500);
      } else {
        // Если нет активных ссылок, делаем активной первую и скроллим к ней
        asideLinks[0].classList.add('active');
        selectedIndex = 0;
        smoothScroll(mainSections[0], 500);
      }
    }
  
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const index = Array.from(mainSections).indexOf(entry.target);
        if (entry.isIntersecting) {
          visibleSections.add(index);
        } else {
          visibleSections.delete(index);
        }
      });
      if (selectedIndex === null) {
        updateActiveLink();
      }
    }, {
      root: menuMain,
      rootMargin: `-${scrollOffset}px 0px -${scrollOffset}px 0px`,
      threshold: 0.1
    });
  
    mainSections.forEach(section => observer.observe(section));
  
    asideLinks.forEach((link, index) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        selectedIndex = index;
        smoothScroll(mainSections[index], 500);
        updateActiveLink();
      });
    });
  
    menuMain.addEventListener('scroll', () => {
      if (menuMain.scrollTop === 0) {
        selectedIndex = null;
      }
      updateActiveLink();
    });

    menuLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        const parentLi = link.closest('li');
        const hasSubMenu = parentLi.querySelector('.header-nav-menu');
  
        if (parentLi.classList.contains('active')) {
          // Если элемент активен, предотвращаем стандартное действие и закрываем меню
          e.preventDefault();
          parentLi.classList.remove('active');
        } else if (hasSubMenu) {
          // Если элемент неактивен, но имеет подменю, открываем его
          e.preventDefault();
          // Закрываем все другие открытые меню
          menuLinks.forEach(otherLink => {
            otherLink.closest('li').classList.remove('active');
          });
          parentLi.classList.add('active');
          setTimeout(() => {
            scrollToActiveLink();
            updateActiveLink();
          }, 0);
        }
        // Если элемент неактивен и не имеет подменю, позволяем стандартный переход по ссылке
      });
    });
  
    document.addEventListener('click', (e) => {
      if (!headerNavMenu.contains(e.target) && !e.target.closest('.header-nav > ul > li > a')) {
        menuLinks.forEach(link => {
          link.closest('li').classList.remove('active');
        });
      }
    });
  
    window.addEventListener('resize', () => {
      scrollOffset = parseInt(window.getComputedStyle(menuMain).marginTop, 10);
      observer.disconnect();
      observer.rootMargin = `-${scrollOffset}px 0px -${scrollOffset}px 0px`;
      mainSections.forEach(section => observer.observe(section));
    });
  
    // Инициализация: установка selectedIndex на основе изначально активной ссылки
    const initialActiveLink = document.querySelector('.menu-aside > ul > li > a.active');
    if (initialActiveLink) {
      selectedIndex = Array.from(asideLinks).indexOf(initialActiveLink);
    }
  })();

  // создание мобильного меню и логика работы мобильного меню
  (function() {
    const headerNav = document.querySelector('.header-nav');
    const menuAside = document.querySelector('.menu-aside');
    const menuMain = document.querySelector('.menu-main');    

    if(!headerNav || !menuAside || !menuMain) return
 
    const mobileMenu = document.createElement('div');
    mobileMenu.className = 'header-nav-mobile-menu';
    headerNav.appendChild(mobileMenu);

    // создание menu items
    function createMenuItem(element, isSubmenu = false) {
      const item = document.createElement('a');
      item.className = 'mobile-menu-item';
      item.href = element.getAttribute('href');      
     
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = element.innerHTML;
      
      const icon = tempDiv.querySelector('.menu-aside-icon');
      if (icon) {
        item.appendChild(icon.cloneNode(true));
      }      
    
      tempDiv.querySelectorAll('br').forEach(br => br.replaceWith(' '));      
     
      const textSpan = document.createElement('span');
      textSpan.textContent = tempDiv.textContent.trim();
      item.appendChild(textSpan);
      
      if (isSubmenu) {
        item.classList.add('mobile-menu-submenu');
        const arrow = document.createElement('img');
        arrow.className = 'mobile-menu-arrow';
        arrow.src = '/images/svg/menu-arrow-right.svg';
        arrow.alt = 'Подменю';
        item.appendChild(arrow);
      }
      
      return item;
    }

    // заголовки и назад
    function createHeader(backText, titleElement, showBackButton = true) {
      const header = document.createElement('div');
      header.className = 'mobile-menu-header';
      header.innerHTML = `
        ${showBackButton ? `
          <div class="mobile-menu-back">
            <svg class="mobile-menu-arrow"><use xlink:href="svg/svg/symbols.svg#arrow-left"/></svg>
            <span>${backText}</span>
          </div>
        ` : ''}
        <div class="mobile-menu-close">
          <img src="/images/svg/close.svg" alt="Закрыть">
        </div>
      `;
      
      // создание title link
      const titleLink = document.createElement('a');
      titleLink.className = 'mobile-menu-title';
      titleLink.href = titleElement.getAttribute('href');      
    
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = titleElement.innerHTML;
      tempDiv.querySelectorAll('br').forEach(br => br.replaceWith(' '));
      titleLink.textContent = tempDiv.textContent.trim();
      
      header.insertBefore(titleLink, header.querySelector('.mobile-menu-close'));      
     
      const closeButton = header.querySelector('.mobile-menu-close');
      closeButton.addEventListener('click', closeMobileMenu);
      
      return header;
    }

    function closeMobileMenu() {
      mobileMenu.classList.remove('active');
      document.body.classList.remove('menu-open');
    }

    // создание пунктов меню первого уровня
    function generateInitialMenu() {
      mobileMenu.innerHTML = '';
      const header = createHeader('', { getAttribute: () => '#', innerHTML: 'Услуги' }, false);
      mobileMenu.appendChild(header);

      const asideItems = menuAside.querySelectorAll('ul > li > a');
      asideItems.forEach(item => {
        const menuItem = createMenuItem(item, true);
        mobileMenu.appendChild(menuItem);
        
        menuItem.addEventListener('click', (e) => {
          e.preventDefault();
          const sectionTitle = item.textContent.trim();
          generateSubmenu('Услуги', sectionTitle);
        });
      });
    }

    // создание пунктов меню второго уровня
    function generateSubmenu(backText, sectionTitle) {
      mobileMenu.innerHTML = '';
      const section = Array.from(menuMain.querySelectorAll('.menu-main-section')).find(
        section => {
          const titleElement = section.querySelector('.menu-main-title');
          const tempDiv = document.createElement('div');
          tempDiv.innerHTML = titleElement.innerHTML;
          tempDiv.querySelectorAll('br').forEach(br => br.replaceWith(' '));
          return tempDiv.textContent.trim() === sectionTitle;
        }
      );

      if (section) {
        const titleLink = section.querySelector('.menu-main-title');
        const header = createHeader(backText, titleLink);
        mobileMenu.appendChild(header);
        
        header.querySelector('.mobile-menu-back').addEventListener('click', () => {
          if (backText === 'Услуги') {
            generateInitialMenu();
          } else {
            generateSubmenu('Услуги', backText);
          }
        });

        const menuItems = section.querySelectorAll('.menu-main-section > ul > li > a');
        menuItems.forEach(item => {
          const hasSubmenu = item.nextElementSibling && item.nextElementSibling.tagName === 'UL';
          const menuItem = createMenuItem(item, hasSubmenu);
          mobileMenu.appendChild(menuItem);

          if (hasSubmenu) {
            menuItem.addEventListener('click', (e) => {
              e.preventDefault();
              generateSubSubmenu(sectionTitle, item);
            });
          }
        });
      }
    }

    // создание пунктов меню третьего уровня
    function generateSubSubmenu(backText, itemElement) {
      mobileMenu.innerHTML = '';
      const header = createHeader(backText, itemElement);
      mobileMenu.appendChild(header);
      
      header.querySelector('.mobile-menu-back').addEventListener('click', () => {
        generateSubmenu('Услуги', backText);
      });

      const subMenu = itemElement.nextElementSibling;
      const menuItems = subMenu.querySelectorAll('li > a');
      menuItems.forEach(item => {
        const menuItem = createMenuItem(item);
        mobileMenu.appendChild(menuItem);
      });
    }

    // инициализация mobile menu
    generateInitialMenu();

    // открытие/закрытие мобильного меню
    const menuToggle = document.querySelector('.header-nav > ul > li > a');
    menuToggle.addEventListener('click', (e) => {
      e.preventDefault();
      mobileMenu.classList.toggle('active');
      document.body.classList.toggle('menu-open');
    });
  })();

  // многоточие при переполнении текста в карточках
  (function() {
    function applyEllipsis() {
      // Проверяем ширину окна
      if (window.innerWidth <= 599) {
        // Если ширина меньше или равна 599px, удаляем многоточия и восстанавливаем оригинальный текст
        resetEllipsis();
        return;
      }
  
      const cards = document.querySelectorAll('.ui-ellipsis-card');
      if (cards.length === 0) return;
  
      cards.forEach(card => {
        const description = card.querySelector('.subcategory-card-description');
        if (!description) return;
  
        const originalText = description.getAttribute('data-original-text') || description.textContent;
        description.setAttribute('data-original-text', originalText);
  
        let words = originalText.split(' ');
        
        description.textContent = originalText;
  
        if (card.scrollHeight > card.clientHeight) {
          while (card.scrollHeight > card.clientHeight && words.length > 0) {
            words.pop();
            description.textContent = words.join(' ') + '...';
          }
  
          if (words.length < originalText.split(' ').length) {
            const nextWord = originalText.split(' ')[words.length];
            const testText = words.join(' ') + ' ' + nextWord;
            
            description.textContent = testText + '...';
            
            if (card.scrollHeight <= card.clientHeight) {
              words.push(nextWord);
            }
            
            description.textContent = words.join(' ') + '...';
          }
        }
      });
    }
  
    function resetEllipsis() {
      const descriptions = document.querySelectorAll('.ui-ellipsis-card .subcategory-card-description');
      descriptions.forEach(description => {
        const originalText = description.getAttribute('data-original-text');
        if (originalText) {
          description.textContent = originalText;
        }
      });
    }
  
    function handleResize() {
      if (window.innerWidth > 599) {
        applyEllipsis();
      } else {
        resetEllipsis();
      }
    }
  
    // Применяем эллипсис при загрузке страницы
    handleResize();
  
    // Добавляем обработчик события resize
    window.addEventListener('resize', handleResize);
  })();
  
  // отображение скрытых услуг, если больше 6
  // плавное
  // (function() {
  //   const subcategoryList = document.querySelectorAll('.subcategory-list .subcategory-card');
  //   const moreButton = document.querySelector('.subcategory-more');
  //   const moreCount = document.querySelector('.subcategory-more-count');
  //   const moreIcon = document.querySelector('.subcategory-more-icon');
    
  //   if (!moreButton || subcategoryList.length <= 6) return;

  //   const hiddenCards = subcategoryList.length - 6;
  //   let isExpanded = false;

  //   function getServiceWord(number) {
  //     const cases = [2, 0, 1, 1, 1, 2];
  //     const titles = ['услуга', 'услуги', 'услуг'];
  //     return titles[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5]];
  //   }

  //   function updateButtonText() {
  //     if (isExpanded) {
  //       moreButton.textContent = 'Свернуть';
  //       moreButton.appendChild(moreIcon);
  //       moreIcon.style.transform = 'rotate(180deg)';
  //     } else {
  //       moreButton.textContent = 'Еще ';
  //       moreButton.appendChild(moreCount);
  //       moreCount.textContent = hiddenCards;
  //       moreButton.appendChild(document.createTextNode(` ${getServiceWord(hiddenCards)} `));
  //       moreButton.appendChild(moreIcon);
  //       moreIcon.style.transform = 'rotate(0deg)';
  //     }
  //   }

  //   function toggleCards(show) {
  //     let delay = 0;
  //     const isMobile = window.innerWidth < 599;
      
  //     subcategoryList.forEach((card, index) => {
  //       if (index >= 6) {
  //         setTimeout(() => {
  //           if (isMobile) {
  //             card.style.display = show ? 'flex' : 'none';
  //           } else {
  //             card.style.display = show ? 'block' : 'none';
  //           }
            
  //           setTimeout(() => {
  //             card.style.opacity = show ? '1' : '0';
  //           }, 5);
  //         }, delay);
  //         delay += 3;
  //       }
  //     });
  //   }

  //   function init(show) {
  //     subcategoryList.forEach((card, index) => {
  //       if (index >= 6) {
  //         card.style.display = show ? 'block' : 'none';      
  //         card.style.opacity = show ? '1' : '0';
  //       }
  //     });
  //   }

  //   // Инициализация
  //   init(false);
  //   toggleCards(false);
  //   updateButtonText();

  //   moreButton.addEventListener('click', () => {
  //     isExpanded = !isExpanded;
  //     toggleCards(isExpanded);
  //     updateButtonText();
  //   });

  //   window.addEventListener('resize', () => {
  //     toggleCards(isExpanded);
  //   });

  // })();
  
  // отображение скрытых услуг, если больше 6
  // мгновенное
  (function() {
    const subcategoryList = document.querySelectorAll('.subcategory-list .subcategory-card');
    const moreButton = document.querySelector('.subcategory-more');
    const moreCount = document.querySelector('.subcategory-more-count');
    const moreIcon = document.querySelector('.subcategory-more-icon');
    
    if (!moreButton || subcategoryList.length <= 6) return;

    const hiddenCards = subcategoryList.length - 6;
    let isExpanded = false;

    function getServiceWord(number) {
      const cases = [2, 0, 1, 1, 1, 2];
      const titles = ['услуга', 'услуги', 'услуг'];
      return titles[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5]];
    }

    function updateButtonText() {
      if (isExpanded) {
        moreButton.textContent = 'Свернуть';
        moreButton.appendChild(moreIcon);
        moreIcon.style.transform = 'rotate(180deg)';
      } else {
        moreButton.textContent = 'Еще ';
        moreButton.appendChild(moreCount);
        moreCount.textContent = hiddenCards;
        moreButton.appendChild(document.createTextNode(` ${getServiceWord(hiddenCards)} `));
        moreButton.appendChild(moreIcon);
        moreIcon.style.transform = 'rotate(0deg)';
      }
    }

    function toggleCards() {
      subcategoryList.forEach((card, index) => {
        if (index >= 6) {
          card.classList.toggle('hidden');
        }
      });
    }

    function init() {
      subcategoryList.forEach((card, index) => {
        if (index >= 6) {
          card.classList.add('hidden');
        }
      });
    }

    // Инициализация
    init();
    updateButtonText();

    moreButton.addEventListener('click', () => {
      isExpanded = !isExpanded;
      toggleCards();
      updateButtonText();
    });

  })();

  // раскрытие текста в описании подкатегории
  // (function() {
  //   const textCollapsibles = document.querySelectorAll('.text-collapsible');
  
  //   textCollapsibles.forEach(collapsible => {
  //     const textBlock = collapsible.querySelector('.text-collapse');
  //     const expandButton = collapsible.querySelector('.text-expand');
  //     const buttonText = expandButton.childNodes[0];
  //     const buttonIcon = expandButton.querySelector('.text-expand-icon');

  //     if(!textBlock || !expandButton || !buttonText || !buttonIcon) return
  
  //     function toggleText() {
  //       if (textBlock.classList.contains('show')) {
  //         textBlock.style.maxHeight = null;
  //         textBlock.classList.remove('show');
  //         buttonText.textContent = 'Показать еще';
  //         expandButton.classList.remove('show');
  //         buttonIcon.style.transform = 'rotate(0deg)';
  //       } else {
  //         textBlock.classList.add('show');
  //         const textHeight = textBlock.scrollHeight;
  //         textBlock.style.maxHeight = textHeight + 'px';
  //         buttonText.textContent = 'Свернуть';
  //         expandButton.classList.add('show');
  //         buttonIcon.style.transform = 'rotate(180deg)';
  //       }
  //     }
  
  //     function handleClick(event) {
  //       if (window.innerWidth < 899) {
  //         if (event.target === expandButton || expandButton.contains(event.target)) {
  //           toggleText();
  //         }
  //       } else {
  //         if (event.target === textBlock || event.target === expandButton || expandButton.contains(event.target)) {
  //           toggleText();
  //         }
  //       }
  //     }
  
  //     collapsible.addEventListener('click', handleClick);
  
  //     // Обработка изменения размера окна
  //     window.addEventListener('resize', () => {
  //       if (window.innerWidth >= 899) {
  //         textBlock.style.maxHeight = null;
  //         textBlock.classList.remove('show');
  //         buttonText.textContent = 'Показать еще';
  //         expandButton.classList.remove('show');
  //         buttonIcon.style.transform = 'rotate(0deg)';
  //       }
  //     });
  //   });
  // })();

  // раскрытие текста в описании подкатегории
(function() {
  const textCollapsibles = document.querySelectorAll('.text-collapsible');

  textCollapsibles.forEach(collapsible => {
    const textBlock = collapsible.querySelector('.text-collapse');
    const expandButton = collapsible.querySelector('.text-expand');
    const buttonText = expandButton?.childNodes[0];
    const buttonIcon = expandButton?.querySelector('.text-expand-icon');

    if(!textBlock || !expandButton || !buttonText || !buttonIcon) return;

    function toggleText() {
      if (textBlock.classList.contains('show')) {
        textBlock.style.maxHeight = null;
        textBlock.classList.remove('show');
        buttonText.textContent = 'Показать еще';
        expandButton.classList.remove('show');
        buttonIcon.style.transform = 'rotate(0deg)';
      } else {
        textBlock.classList.add('show');
        const textHeight = getFullHeight(textBlock);
        textBlock.style.maxHeight = textHeight + 'px';
        buttonText.textContent = 'Свернуть';
        expandButton.classList.add('show');
        buttonIcon.style.transform = 'rotate(180deg)';
      }
    }

    function getFullHeight(element) {
      const style = window.getComputedStyle(element);
      const marginTop = parseFloat(style.marginTop);
      const marginBottom = parseFloat(style.marginBottom);
      
      let totalHeight = element.offsetHeight + marginTop + marginBottom;

      Array.from(element.children).forEach(child => {
        totalHeight += getFullHeight(child);
      });

      return totalHeight;
    }

    function handleClick(event) {
      // Проверяем, что клик произошел внутри .text-collapsible
      if (collapsible.contains(event.target)) {
        if (window.innerWidth < 899) {
          // На мобильных устройствах реагируем только на клик по кнопке
          if (event.target === expandButton || expandButton.contains(event.target)) {
            toggleText();
          }
        } else {
          // На десктопе реагируем на клик в любом месте .text-collapsible
          toggleText();
        }
      }
    }

    // Добавляем обработчик на весь документ
    document.addEventListener('click', handleClick);
  });
})();


  // слайдер фотографий услуги
  // (function() {
  //   if (!document.querySelector('.galley-slider')) return;
  
  //   // Функция для дублирования слайдов
  //   function handleSlides() {
  //     const slider = document.querySelector('.galley-slider .swiper-wrapper');
  //     const slides = slider.querySelectorAll('.swiper-slide');
  //     const slidesCount = slides.length;
  //     const desiredCount = 3;
  
  //     if (slidesCount === 1) {
  //       console.log("one photo only");
  //       const sliderInner = document.querySelector('.subcategory-gallery-inner');
  //       const sliderArrows = document.querySelector('.gallery-slider-arrows');
  //       const sliderTitle = document.querySelector('.subcategory-content-title__gallery');

  //       if(sliderArrows) {
  //         sliderArrows.style.display ='none';
  //       }

  //       if(sliderInner) {
  //         sliderInner.classList.add('subcategory-gallery-inner__single');
  //       }

  //       if(sliderTitle) {       
  //         sliderTitle.textContent = "Фотография процедуры";    
  //         sliderTitle.setAttribute("data-title", "Фотография процедуры");
  //       }
        
  //       return false;
  //     } else if (slidesCount < desiredCount) {
  //       for (let i = 0; i < desiredCount - slidesCount; i++) {
  //         slides.forEach(slide => {
  //           const clone = slide.cloneNode(true);
  //           slider.appendChild(clone);
  //         });
  //       }
  //     }
  //     return true;
  //   }  
 
  //   const shouldInitSwiper = handleSlides();
  
  //   // Инициализируем Swiper только если слайдов больше одного
  //   if (shouldInitSwiper) {
  //     var swiper = new Swiper('.galley-slider', {   
  //       grabCursor: true,     
  //       slidesPerView: 2,
  //       slidesPerGroup: 1,
  //       spaceBetween: 0,
  //       autoplay: false,
  //       loop: true,
  //       keyboard: {
  //         enabled: true,
  //         pageUpDown: false
  //       },
  //       navigation: {
  //         nextEl: ".slider-next",
  //         prevEl: ".slider-prew",
  //       },
  //       breakpoints: {             
  //         900: {
  //           slidesPerView: 3,       
  //           spaceBetween: 0,
  //           loop: true,
  //         },       
  //       }
  //     });  

  //     document.addEventListener('keydown', function(event) {
  //       if (event.key === 'ArrowLeft') {
  //         swiper.slidePrev();
  //       } else if (event.key === 'ArrowRight') {
  //         swiper.slideNext();
  //       }
  //     });
  //   }
  // })();
  // слайдер фотографий услуги
(function() {
  if (!document.querySelector('.galley-slider')) return;

  // Функция для обработки слайдов
  function handleSlides() {
    const slider = document.querySelector('.galley-slider .swiper-wrapper');
    const slides = slider.querySelectorAll('.swiper-slide');
    const slidesCount = slides.length;
    const sliderInner = document.querySelector('.subcategory-gallery-inner');
    const sliderArrows = document.querySelector('.gallery-slider-arrows');
    const sliderTitle = document.querySelector('.subcategory-content-title__gallery');

    if (slidesCount === 1) {
  
      if(sliderArrows) {
        sliderArrows.style.display = 'none';
      }
      if(sliderInner) {
        sliderInner.classList.add('subcategory-gallery-inner__single');
      }      
      return false;
    } else {
      // Убедимся, что у нас всегда есть хотя бы 4 слайда для корректной работы loop
      const minSlides = 4;
      if (slidesCount < minSlides) {
        const slidesToAdd = minSlides - slidesCount;
        for (let i = 0; i < slidesToAdd; i++) {
          slides.forEach(slide => {
            const clone = slide.cloneNode(true);
            slider.appendChild(clone);
          });
        }
      }
      // Восстановим отображение стрелок, если они были скрыты
      if(sliderArrows) {
        sliderArrows.style.display = '';
      }
     
      return true;
    }
  }  

  const shouldInitSwiper = handleSlides();

  // Инициализируем Swiper только если слайдов больше одного
  if (shouldInitSwiper) {
    var swiper = new Swiper('.galley-slider', {   
      grabCursor: true,     
      slidesPerView: 2,
      slidesPerGroup: 1,
      spaceBetween: 0,
      autoplay: false,
      loop: true,
      loopedSlides: 4, // Устанавливаем минимальное количество слайдов для loop
      keyboard: {
        enabled: true,
        pageUpDown: false
      },
      navigation: {
        nextEl: ".slider-next",
        prevEl: ".slider-prew",
      },
      breakpoints: {             
        900: {
          slidesPerView: 3,       
          spaceBetween: 0,
          loop: true,
        },       
      }
    });  

    document.addEventListener('keydown', function(event) {
      if (event.key === 'ArrowLeft') {
        swiper.slidePrev();
      } else if (event.key === 'ArrowRight') {
        swiper.slideNext();
      }
    });
  }
})();

  // фиксирование блока при прокрутке
  // (function() {
  //   if ($('.side-menu').length) {
  //     function handleScroll() {
  //       var windowWidth = $(window).width();
  //       var windowOffset = $(window).scrollTop();
  //       var floatOffset;
        
  //       if (windowWidth <= 899) {
  //         floatOffset = $('.side-spase').offset().top - (parseFloat($('.header').height()) * 1.5);
  //       } else {
  //         floatOffset = $('.side-spase').offset().top - parseFloat($('.side-wrapper').css('padding-top'));
  //       }
        
  //       var contentHeight = $('.side-wrapper').height();
  //       var floatHeight = $('.side-menu').outerHeight();
  //       var floatStop = floatOffset + contentHeight - floatHeight;

  //       if (windowWidth <= 899) {
  //         if (windowOffset > floatOffset && windowOffset < floatStop) {
  //           $('.side-menu').addClass('float').removeClass('flip-bottom');
  //           $('.header').addClass('header__light');
  //         } else {
  //           $('.side-menu').removeClass('float').addClass('flip-bottom');
  //           $('.header').removeClass('header__light');
  //           if (windowOffset < floatStop) {
  //             $('.side-menu').removeClass('flip-bottom');
  //           }
  //         }
  //       } else {
  //         if (windowOffset > floatOffset && windowOffset < floatStop) {
  //           $('.side-menu').addClass('float').removeClass('flip-bottom');
  //         } else {
  //           $('.side-menu').removeClass('float').addClass('flip-bottom');
  //           if (windowOffset < floatStop) {
  //             $('.side-menu').removeClass('flip-bottom');
  //           }
  //         }
  //         // Убираем класс header__light для больших разрешений
  //         $('.header').removeClass('header__light');
  //       }
  //     }

  //     // Вызываем функцию при прокрутке и изменении размера окна
  //     $(window).on('scroll resize', handleScroll);

  //     // Вызываем функцию сразу после загрузки страницы
  //     handleScroll();
  //   }
  // })();

  (function() {
    if ($('.side-menu').length) {
      function handleScroll() {
        var windowWidth = $(window).width();
        var windowOffset = $(window).scrollTop();
        var floatOffset;
        
        if (windowWidth <= 899) {
          floatOffset = $('.side-spase').offset().top - (parseFloat($('.header').height()) * 1.5);
        } else {
          floatOffset = $('.side-spase').offset().top - (parseFloat($('.side-wrapper').css('padding-top')) * 1.38);
        }
        
        var sideWrapper = $('.side-wrapper');
        var contentHeight = sideWrapper.height();
        var floatHeight = $('.side-menu').outerHeight();
        var sideWrapperBottom = sideWrapper.offset().top + contentHeight;
        var floatStop = sideWrapperBottom - floatHeight;
  
        if (windowWidth <= 899) {
          if (windowOffset > floatOffset && windowOffset < floatStop) {            
            $('.side-menu').addClass('float').removeClass('flip-bottom');
            $('.header').addClass('header__light');
          } else {
            $('.side-menu').removeClass('float');
            $('.header').removeClass('header__light');
            if (windowOffset >= floatStop) {
              $('.side-menu').addClass('flip-bottom');
            } else {
              $('.side-menu').removeClass('flip-bottom');
            }
          }
        } else {
          if (windowOffset > floatOffset && windowOffset < floatStop) {
            $('.side-menu').addClass('float').removeClass('flip-bottom');
          } else {
            $('.side-menu').removeClass('float');
            if (windowOffset >= floatStop) {
              $('.side-menu').addClass('flip-bottom');
            } else {
              $('.side-menu').removeClass('flip-bottom');
            }
          }
          // Убираем класс header__light для больших разрешений
          $('.header').removeClass('header__light');
        }
      }
  
      // Вызываем функцию при прокрутке и изменении размера окна
      $(window).on('scroll resize', handleScroll);
  
      // Вызываем функцию сразу после загрузки страницы
      handleScroll();
    }
  })();

  // меню навигации по тексту
  (function() {
    const menuItems = document.querySelectorAll('.item-menu');
    const menuList = document.querySelector('.side-navigation-list');
    const navigation = document.querySelector('.side-menu');    
    const header = document.querySelector('header');
  
    if(!menuItems.length && navigation) {
      navigation.classList.add('hidden');
    }
    
    if(!menuList) return;
  
    let isScrolling = false;
    let timeoutId;
  
    function getOffsetTop() {
      const headerHeight = header ? header.offsetHeight : 0;
      return window.innerWidth < 899 ? headerHeight * 3 : headerHeight * 1.2;
    }
  
    function getElementOffset(element) {
      const rect = element.getBoundingClientRect();
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      return rect.top + scrollTop;
    }
  
    function scrollToElement(element) {
      const offsetTop = getOffsetTop();
      const elementPosition = getElementOffset(element) - offsetTop;
  
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });
    }
  
    // menuItems.forEach((item, index) => {
    //   const li = document.createElement('li');
    //   li.classList.add('side-navigation-item');
      
    //   if (index === 0) {
    //     li.classList.add('active');
    //   }
      
    //   li.textContent = item.dataset.title || item.textContent;
  
    //   li.addEventListener('click', () => {
    //     isScrolling = true;
    //     clearTimeout(timeoutId);
        
    //     menuList.querySelectorAll('.side-navigation-item').forEach(el => el.classList.remove('active'));
    //     li.classList.add('active');
        
    //     scrollToElement(item);
        
    //     timeoutId = setTimeout(() => {
    //       isScrolling = false;
    //     }, 1000); // Время, достаточное для завершения прокрутки
    //   });
  
    //   menuList.appendChild(li);      
    // });      

    if (menuItems.length < 2) {
      navigation.classList.add('hidden');
    } else {
      menuItems.forEach((item, index) => {
        const li = document.createElement('li');
        li.classList.add('side-navigation-item');
        
        if (index === 0) {
          li.classList.add('active');
        }
        
        li.textContent = item.dataset.title || item.textContent;

        li.addEventListener('click', () => {
          isScrolling = true;
          clearTimeout(timeoutId);
          
          menuList.querySelectorAll('.side-navigation-item').forEach(el => el.classList.remove('active'));
          li.classList.add('active');
          
          scrollToElement(item);
          
          timeoutId = setTimeout(() => {
            isScrolling = false;
          }, 1000); // Время, достаточное для завершения прокрутки
        });

        menuList.appendChild(li);      
      });
    }

  
    let currentActive = menuList.querySelector('.active');
    const menuOffset = menuList.getBoundingClientRect().top;
    
    document.addEventListener('scroll', () => {
      if (isScrolling) return;
      
      const offsetTop = getOffsetTop();
      let nextIndex;
  
      menuItems.forEach((item, index) => {
        const itemTop = getElementOffset(item) - offsetTop;
        if (window.pageYOffset >= itemTop - 20) {
          nextIndex = index;
        }
      });
    
      if (nextIndex !== undefined) {
        menuList.querySelectorAll('.side-navigation-item').forEach((item, index) => {
          if (index === nextIndex) {
            item.classList.add('active');
          } else {
            item.classList.remove('active');
          }
        });
      }
    });
  })();


  // вставка текущего года в копирайт футера
  (function() {   
    const yearElement = document.querySelector('.footer-copy-txt-year');

    if (yearElement) {
      yearElement.textContent = `© ${new Date().getFullYear()},`;
    }
  
  })();

  // фиксированный заголовок
  (function() {
    const wrapper = document.querySelector('.sticky-wrapper');

    if(!wrapper) return;

    const stickyElem = wrapper.querySelector('.sticky-elem');
    const servicesPreviews = wrapper.querySelector('.services-previews');

    if(stickyElem && servicesPreviews) {
      let stickyElemOriginalTop = stickyElem.offsetTop;
      let stickyElemHeight = stickyElem.offsetHeight;
    
      function updateStickyElem() {
        const wrapperRect = wrapper.getBoundingClientRect();
        const wrapperTop = wrapperRect.top;
        const wrapperBottom = wrapperRect.bottom - stickyElemHeight;
        const servicesPreviewsRect = servicesPreviews.getBoundingClientRect();
    
        if (wrapperTop <= 0 && wrapperBottom > stickyElemHeight) {
          stickyElem.style.position = 'fixed';
          stickyElem.style.top = '0';
        } else if (wrapperBottom <= stickyElemHeight) {
          stickyElem.style.position = 'absolute';
          stickyElem.style.top = (wrapper.offsetHeight - stickyElemHeight) + 'px'; 
        } else {
          stickyElem.style.position = 'fixed';
        }

        // Check if the sticky element is hidden behind services-previews
        if (servicesPreviewsRect.top <= stickyElemHeight) {
          stickyElem.classList.add('hidden');
        } else {
          stickyElem.classList.remove('hidden');
        }
      }
    
      function resetStickyElem() {
        stickyElemOriginalTop = stickyElem.offsetTop;
        stickyElemHeight = stickyElem.offsetHeight;
        updateStickyElem();
      }  

      window.addEventListener('scroll', updateStickyElem);    

      window.addEventListener('resize', resetStickyElem);
    
      const resizeObserver = new ResizeObserver(entries => {
        for (let entry of entries) {
          resetStickyElem();
        }
      });
    
      resizeObserver.observe(wrapper);
      resizeObserver.observe(stickyElem);    

      resetStickyElem();
    }
  })(); 

  // смена цвета хедера при скролле
  (function() {
    const header = document.querySelector('.header');
    const blackHeaderBlocks = document.querySelectorAll('.black-header');
    
    function isHeaderMiddleCrossing(el) {
      const rect = el.getBoundingClientRect();
      const headerMiddle = header.offsetHeight / 2;
      return (
        rect.top <= headerMiddle &&
        rect.bottom >= headerMiddle
      );
    }
    
    function checkHeaderColor() {
      let shouldBeBlack = false;
      
      blackHeaderBlocks.forEach(block => {
        if (isHeaderMiddleCrossing(block)) {
          shouldBeBlack = true;
        }
      });
      
      if (shouldBeBlack) {
        header.classList.add('black');
      } else {
        header.classList.remove('black');
      }
    }
    
    window.addEventListener('scroll', checkHeaderColor);
    window.addEventListener('resize', checkHeaderColor);
    
    // Вызываем функцию сразу, чтобы установить начальное состояние
    checkHeaderColor();
  })();

  // плавный уход фона в прозрачность при скролле
  (function() {
    const uibg = document.querySelectorAll('.ui-fading-bg');

    if (uibg) {

      uibg.forEach((bg) => {
        const bgHeight = bg.offsetHeight;
      let lastScrollY = window.scrollY;

      function updateOpacity() {
        const scrollY = window.scrollY;
        // const scrollDiff = scrollY - lastScrollY;
        const opacity = Math.max(0, 1 - scrollY / bgHeight);

        bg.style.opacity = opacity;
        lastScrollY = scrollY;

        requestAnimationFrame(updateOpacity);
      }

      updateOpacity();
      })
      
    }
  })();

    // cookies
    // (function() {
    //   if (!document.querySelector('.cookie') || !document.querySelector('.cookie .ui-btn')) return
  
    //   const cookiesBlock = document.querySelector('.cookie');
    //   const closeBtn = document.querySelector('.cookie .ui-btn');
  
    //   closeBtn.addEventListener('click', closeCookiesBlock);
  
    //   function closeCookiesBlock() {
    //     cookiesBlock.classList.add('hidden');
    //   }
    // })();

    (function() {
      const cookiesBlock = document.querySelector('.cookie');
      const closeBtn = document.querySelector('.cookie .ui-btn');
      
      if (!cookiesBlock || !closeBtn) return;
    
      const cookieName = 'cookieConsent';
      const expirationDays = 2;
    
      function handleCookieConsent() {
        if (getCookie(cookieName) === '') {
          // Если cookie согласия нет, показываем уведомление
          cookiesBlock.classList.remove('hidden');
        } else {
          // Если cookie согласия есть, скрываем уведомление
          cookiesBlock.classList.add('hidden');
        }
      }
    
      closeBtn.addEventListener('click', closeCookiesBlock);
    
      function closeCookiesBlock() {
        cookiesBlock.classList.add('hidden');
        setCookie(cookieName, 'true', expirationDays);
      }
    
      // Функция для установки cookie
      function setCookie(name, value, days) {
        let expires = '';
        if (days) {
          const date = new Date();
          date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
          expires = '; expires=' + date.toUTCString();
        }
        document.cookie = name + '=' + (value || '') + expires + '; path=/';
      }
    
      // Функция для получения значения cookie
      function getCookie(name) {
        const nameEQ = name + '=';
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
          let c = ca[i];
          while (c.charAt(0) === ' ') c = c.substring(1, c.length);
          if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return '';
      }
    
      // Запускаем обработку при загрузке страницы
      handleCookieConsent();
    })();    
})