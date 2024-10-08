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

  $(".ui-select, .ui-checkbox, .ui-radio").styler();

  // кастомный селект
  (function() {
    const selects = document.querySelectorAll('.custom-select');
    
    if (selects.length === 0) return;

    const main = document.querySelector('.main');
    if (!main) return;

    // Создаем общий оверлей
    const overlay = document.createElement('div');
    overlay.classList.add('select-overlay');
    main.parentNode.insertBefore(overlay, main.nextSibling);

    selects.forEach((select, index) => {
      const header = select.querySelector('.select-header');
      const headerChecked = select.querySelector('.select-header-checked');
      const options = select.querySelector('.select-options');
      
      if (!options) return;
      
      const firstOption = options.querySelector('input[type="radio"]');

      // Создаем мобильную версию options
      const mobileOptions = options.cloneNode(true);
      mobileOptions.classList.add('select-options-mobile');
      mobileOptions.id = `select-options-mobile-${index}`;
      
      // Добавляем мобильные опции после main
      main.parentNode.insertBefore(mobileOptions, overlay);

      function updateCheckedState(selectedInput) {
        [options, mobileOptions].forEach(optionsElem => {
          optionsElem.querySelectorAll('input[type="radio"]').forEach(input => {
            const label = input.closest('label');
            if (input.value === selectedInput.value) {
              label.classList.add('checked');
              headerChecked.textContent = label.textContent.trim();
            } else {
              label.classList.remove('checked');
            }
          });
        });
      }

      // Устанавливаем первый пункт выбранным по умолчанию
      firstOption.checked = true;
      updateCheckedState(firstOption);

      function isMobile() {
        return window.innerWidth <= 599;
      }

      function getActiveOptions() {
        return isMobile() ? mobileOptions : options;
      }

      function openSelect() {
        const activeOptions = getActiveOptions();
        activeOptions.style.display = 'block';
        if (isMobile()) {
          overlay.style.display = 'block';
          document.body.classList.add('modal-open');
        }
      }

      function closeSelect() {
        options.style.display = 'none';
        mobileOptions.style.display = 'none';
        overlay.style.display = 'none';
        document.body.classList.remove('modal-open');
      }

      // Открытие/закрытие селекта
      header.addEventListener('click', function(e) {
        e.stopPropagation();
        closeAllSelects();
        if (getActiveOptions().style.display !== 'block') {
          openSelect();
        }
      });

      // Обработка выбора опции
      [options, mobileOptions].forEach(optionsElem => {
        optionsElem.addEventListener('change', function(e) {
          if (e.target.type === 'radio') {
            updateCheckedState(e.target);
            closeSelect();
          }
        });
      });

      // Предотвращаем закрытие при клике на опции
      [options, mobileOptions].forEach(optionsElem => {
        optionsElem.addEventListener('click', function(e) {
          e.stopPropagation();
        });
      });
    });

    function closeAllSelects() {
      selects.forEach(select => {
        const options = select.querySelector('.select-options');
        const mobileOptions = document.getElementById(`select-options-mobile-${Array.from(selects).indexOf(select)}`);
        if (options) options.style.display = 'none';
        if (mobileOptions) mobileOptions.style.display = 'none';
      });
      overlay.style.display = 'none';
      document.body.classList.remove('modal-open');
    }

    // Закрытие селекта при клике вне его
    document.addEventListener('click', closeAllSelects);

    // Закрытие при клике на оверлей
    overlay.addEventListener('click', closeAllSelects);

    // Обновление отображения при изменении размера окна
    window.addEventListener('resize', function() {
      if (isMobile()) {
        selects.forEach((select, index) => {
          const options = select.querySelector('.select-options');
          const mobileOptions = document.getElementById(`select-options-mobile-${index}`);
          if (options) options.style.display = 'none';
          if (mobileOptions && mobileOptions.style.display === 'block') {
            overlay.style.display = 'block';
            document.body.classList.add('modal-open');
          }
        });
      } else {
        selects.forEach((select, index) => {
          const mobileOptions = document.getElementById(`select-options-mobile-${index}`);
          if (mobileOptions) mobileOptions.style.display = 'none';
        });
        overlay.style.display = 'none';
        document.body.classList.remove('modal-open');
      }
    });
  })();

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

    // Анимация блока "expertise-achievements" 
    function createAnimation() {
      const expertiseBlock = document.querySelector(".expertise-achievements");
      if(!expertiseBlock) return;
      
      // Проверяем ширину экрана
      if (window.innerWidth >= 899) {     
        if (!ScrollTrigger.getById("expertiseAnimation")) {
          gsap.to(expertiseBlock, {
            x: '-100%', // Двигаем блок влево на 100% его ширины
            ease: "none",
            scrollTrigger: {
              id: "expertiseAnimation", // Уникальный идентификатор для ScrollTrigger
              trigger: expertiseBlock,
              start: "bottom bottom",
              end: "bottom top",
              scrub: true,
              toggleActions: "play reverse play reverse",
            }
          });
        }
      } else {
        const trigger = ScrollTrigger.getById("expertiseAnimation");
        if (trigger) {
          trigger.kill();
        }
        // Сбрасываем положение блока
        gsap.set(expertiseBlock, { x: 0 });
      }
    }

    // Создаем анимацию при загрузке страницы
    createAnimation();

    // Обновляем анимацию при изменении размера окна с использованием debounce
    window.addEventListener('resize', createAnimation);

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

  // Функция для создания и отображения прелоадера
  function showPreloader() {
    var preloaderHtml = `
        <div class="custom-preloader">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="12" y1="2" x2="12" y2="6"></line>
                <line x1="12" y1="18" x2="12" y2="22"></line>
                <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
                <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
                <line x1="2" y1="12" x2="6" y2="12"></line>
                <line x1="18" y1="12" x2="22" y2="12"></line>
                <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
                <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
            </svg>
        </div>
    `;
    $('body').append(preloaderHtml);
  };

  // Функция для скрытия прелоадера
  function hidePreloader() {
    $('.custom-preloader').remove();
  };

  // Глобальная переменная для отслеживания состояния попапа
  let isPopupOpen = false;

  // Функция для обработки изменения состояния истории
  function handlePopState(event) {
    if ($.magnificPopup.instance.isOpen) {
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
    var customBackground = clickedElement.data('background');

    // Показываем прелоадер
    showPreloader();
  
  
    // Проверяем, является ли элемент видео
  if (clickedElement.hasClass('mfp-link-video')) {
    let videoSrc = clickedElement.attr("data-href");   
    let videoFileName = clickedElement.attr("data-video-title");

    // Добавляем параметры автовоспроизведения к URL видео
    if (videoSrc.includes('?')) {
      videoSrc += '&autoplay=1&mute=1';
    } else {
      videoSrc += '?autoplay=1&mute=1';
    }
    // Логика для открытия видео попапа
    $.magnificPopup.open({
      items: {
        src: $('<div class="mfp-video-popup">'+
               '<div class="mfp-video-wrapper">'+
               '<iframe src="' + videoSrc + '" frameborder="0" allowfullscreen allow="autoplay"></iframe>'+
               '<div class="mfp-video-title">' + videoFileName + '</div>'+
               '</div>'+
               '</div>'),
        type: 'inline'
      },
      type: 'inline',
      closeBtnInside: true,
      removalDelay: 300,
      mainClass: 'my-mfp-zoom-in',
      callbacks: {
        open: function () {
          setTimeout(function(){
            $('.mfp-wrap').addClass('not_delay');
            $('.mfp-popup').addClass('not_delay');
            hidePreloader();          
          }, 700);
          document.documentElement.style.overflow = 'hidden';
          history.pushState({ popup: 'video' }, '');
          isPopupOpen = true;
        },
        close: function() {
          document.documentElement.style.overflow = '';
          isPopupOpen = false;
        }
      }
    });
  } else if (clickedElement.hasClass('mfp-gallery-item')) {
      // // Логика для открытия галереи
      // var galleryItems = [];
      // var uniqueIds = new Set(); // Для отслеживания уникальных data-id
      // var isInSlider = clickedElement.closest('.swiper').length > 0;
  
      // // Собираем все элементы галереи
      // $(".mfp-gallery-item").each(function () {
      //   var $this = $(this);
      //   var $img = $this.find('img');
      //   var dataId = $img.attr('data-id');
      //   var itemIsInSlider = $this.closest('.swiper').length > 0;
  
      //   // Если элемент в слайдере, проверяем уникальность
      //   if (itemIsInSlider) {
      //     if (!uniqueIds.has(dataId)) {
      //       uniqueIds.add(dataId);
      //       galleryItems.push({
      //         src: $this.attr("data-href"),
      //         title: $this.find('.diploms-card-title').text().trim(),
      //         dataId: dataId
      //       });
      //     }
      //   } else {
      //     // Если элемент не в слайдере, добавляем его без проверки уникальности
      //     galleryItems.push({
      //       src: $this.attr("data-href"),
      //       title: $this.find('.diploms-card-title').text().trim(),
      //       dataId: dataId
      //     });
      //   }
      // });
  
      // // Находим индекс кликнутого элемента
      // var index;
      // if (isInSlider) {
      //   var clickedDataId = clickedElement.find('img').attr('data-id');
      //   index = galleryItems.findIndex(item => item.dataId === clickedDataId);
      // } else {
      //   index = $(".mfp-gallery-item").index(clickedElement);
      // }
  
      // $.magnificPopup.open({
      //   items: galleryItems,
      //   type: 'image',
      //   gallery: {
      //     enabled: true,
      //     navigateByImgClick: true,
      //     preload: [0, 1],
      //     tCounter: '%curr% из %total%' // Локализация счетчика на русский язык
      //   },
      //   overflowY: "scroll",
      //   removalDelay: 300,
      //   mainClass: 'my-mfp-zoom-in',
      //   callbacks: {
      //     open: function () {
      //       setTimeout(function(){
      //         $('.mfp-wrap').addClass('not_delay');
      //         $('.mfp-popup').addClass('not_delay');
      //         hidePreloader();          
      //       }, 700);
      //       document.documentElement.style.overflow = 'hidden';
      //       history.pushState({ popup: 'gallery' }, '');
      //       isPopupOpen = true;
      //     },
      //     close: function() {
      //       document.documentElement.style.overflow = '';
      //       isPopupOpen = false;
      //     },
      //     imageLoadComplete: function() {
      //       // Скрываем прелоадер после загрузки изображения
      //       hidePreloader();
      //     },
      //     beforeChange: function() {
      //       // Показываем прелоадер перед сменой изображения
      //       showPreloader();
      //     }
      //   }
      // }, index);

       // Логика для открытия галереи
    var galleryItems = [];
    var galleryGroup = clickedElement.data('gallery-group');
    var isInSlider = clickedElement.closest('.swiper').length > 0;

    // Собираем все элементы галереи с тем же gallery-group
    $('.mfp-gallery-item[data-gallery-group="' + galleryGroup + '"]').each(function () {
      var $this = $(this);
      var $img = $this.find('img');
      var dataId = $img.attr('data-id');
      var itemIsInSlider = $this.closest('.swiper').length > 0;

      // Для элементов в слайдере проверяем уникальность по data-id
      if (itemIsInSlider) {
        if (!galleryItems.some(item => item.dataId === dataId)) {
          galleryItems.push({
            src: $this.attr("data-href"),
            title: $this.find('.diploms-card-title').text().trim(),
            dataId: dataId
          });
        }
      } else {
        // Для элементов не в слайдере добавляем без проверки
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
      index = $('.mfp-gallery-item[data-gallery-group="' + galleryGroup + '"]').index(clickedElement);
    }

    $.magnificPopup.open({
      items: galleryItems,
      type: 'image',
      gallery: {
        enabled: true,
        navigateByImgClick: true,
        preload: [0, 1],
        tCounter: '%curr% из %total%'
      },
      overflowY: "scroll",
      removalDelay: 300,
      mainClass: 'my-mfp-zoom-in',
      callbacks: {
        open: function () {
          setTimeout(function(){
            $('.mfp-wrap').addClass('not_delay');
            $('.mfp-popup').addClass('not_delay');
            hidePreloader();          
          }, 700);
          document.documentElement.style.overflow = 'hidden';
          history.pushState({ popup: 'gallery' }, '');
          isPopupOpen = true;
        },
        close: function() {
          document.documentElement.style.overflow = '';
          isPopupOpen = false;
        },
        imageLoadComplete: function() {
          hidePreloader();
        },
        beforeChange: function() {
          showPreloader();
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
            setTimeout(function(){
              hidePreloader();                         
            }, 100);

            // Применяем кастомный фон, если он задан
          if (customBackground) {
            $('.mfp-bg').css('background-color', customBackground);
          }
                               
          },
          close: function() {
            document.documentElement.style.overflow = '';
            isPopupOpen = false;
            if (this.cleanupFunction) {
              this.cleanupFunction();
              this.cleanupFunction = null;
            }  
            
            // Сбрасываем фон при закрытии попапа
          $('.mfp-bg').css('background-color', '');
          }          
        }
      });
    }
  
    return false;
  });

  // открытие меню в header
  // (function() {
  //   const menuLinks = document.querySelectorAll('.header-nav > ul > li > a');
  //   const asideLinks = document.querySelectorAll('.menu-aside > ul > li > a');
  //   const mainSections = document.querySelectorAll('.menu-main-section');
  //   const menuMain = document.querySelector('.menu-main');
  //   const headerNavMenu = document.querySelector('.header-nav-menu-inner');
  
  //   let scrollOffset = parseInt(window.getComputedStyle(menuMain).marginTop, 10);
  //   let selectedIndex = null;
  //   let visibleSections = new Set();
  
  //   function smoothScroll(target, duration) {
  //     const targetPosition = target.offsetTop - scrollOffset;
  //     const startPosition = menuMain.scrollTop;
  //     const distance = targetPosition - startPosition;
  //     let startTime = null;
  
  //     function animation(currentTime) {
  //       if (startTime === null) startTime = currentTime;
  //       const timeElapsed = currentTime - startTime;
  //       const run = ease(timeElapsed, startPosition, distance, duration);
  //       menuMain.scrollTo(0, run);
  //       if (timeElapsed < duration) requestAnimationFrame(animation);
  //     }
  
  //     function ease(t, b, c, d) {
  //       t /= d / 2;
  //       if (t < 1) return c / 2 * t * t + b;
  //       t--;
  //       return -c / 2 * (t * (t - 2) - 1) + b;
  //     }
  
  //     requestAnimationFrame(animation);
  //   }   
  
  //   function updateActiveLink() {
  //     let activeIndex;
    
  //     if (selectedIndex !== null && visibleSections.has(selectedIndex)) {
  //       activeIndex = selectedIndex;
  //     } else if (visibleSections.size > 0) {
  //       activeIndex = Math.min(...visibleSections);
  //     } else {
  //       activeIndex = 0; // Если нет видимых секций, выбираем первый элемент
  //     }
    
  //     let hasActiveLink = false;
  //     asideLinks.forEach((link, index) => {
  //       if (index === activeIndex) {
  //         link.classList.add('active');
  //         hasActiveLink = true;
  //       } else {
  //         link.classList.remove('active');
  //       }
  //     });
    
  //     // Если после обхода нет активных ссылок, делаем активной первую
  //     if (!hasActiveLink) {
  //       asideLinks[0].classList.add('active');
  //     }
  //   }
  
  //   function scrollToActiveLink() {
  //     const activeLink = document.querySelector('.menu-aside > ul > li > a.active');
  //     if (activeLink) {
  //       const index = Array.from(asideLinks).indexOf(activeLink);
  //       selectedIndex = index;
  //       smoothScroll(mainSections[index], 500);
  //     } else {
  //       // Если нет активных ссылок, делаем активной первую и скроллим к ней
  //       asideLinks[0].classList.add('active');
  //       selectedIndex = 0;
  //       smoothScroll(mainSections[0], 500);
  //     }
  //     updateActiveLink(); // Добавляем вызов updateActiveLink() здесь
  //   }
  
  //   const observer = new IntersectionObserver((entries) => {
  //     entries.forEach(entry => {
  //       const index = Array.from(mainSections).indexOf(entry.target);
  //       if (entry.isIntersecting) {
  //         visibleSections.add(index);
  //       } else {
  //         visibleSections.delete(index);
  //       }
  //     });
  //     if (selectedIndex === null) {
  //       updateActiveLink();
  //     }
  //   }, {
  //     root: menuMain,
  //     rootMargin: `-${scrollOffset}px 0px -${scrollOffset}px 0px`,
  //     threshold: 0.1
  //   });
  
  //   mainSections.forEach(section => observer.observe(section));
  
  //   asideLinks.forEach((link, index) => {
  //     link.addEventListener('click', (e) => {
  //       e.preventDefault();
  //       selectedIndex = index;
  //       smoothScroll(mainSections[index], 500);
  //       updateActiveLink();
  //     });
  //   });
  
  //   menuMain.addEventListener('scroll', () => {
  //     if (menuMain.scrollTop === 0) {
  //       selectedIndex = null;
  //     }
  //     updateActiveLink();
  //   });

  //   menuLinks.forEach(link => {
  //     link.addEventListener('click', (e) => {
  //       const parentLi = link.closest('li');
  //       const hasSubMenu = parentLi.querySelector('.header-nav-menu');
    
  //       if (parentLi.classList.contains('active')) {
  //         // Если элемент активен, предотвращаем стандартное действие и закрываем меню
  //         e.preventDefault();
  //         parentLi.classList.remove('active');
  //       } else if (hasSubMenu) {
  //         // Если элемент неактивен, но имеет подменю, открываем его
  //         e.preventDefault();
  //         // Закрываем все другие открытые меню
  //         menuLinks.forEach(otherLink => {
  //           otherLink.closest('li').classList.remove('active');
  //         });
  //         parentLi.classList.add('active');
  //         setTimeout(() => {
  //           scrollToActiveLink();
  //         }, 0);
  //       }
  //       // Если элемент неактивен и не имеет подменю, позволяем стандартный переход по ссылке
  //     });
  //   });
  
  //   document.addEventListener('click', (e) => {
  //     if (!headerNavMenu.contains(e.target) && !e.target.closest('.header-nav > ul > li > a')) {
  //       menuLinks.forEach(link => {
  //         link.closest('li').classList.remove('active');
  //       });
  //     }
  //   });
  
  //   window.addEventListener('resize', () => {
  //     scrollOffset = parseInt(window.getComputedStyle(menuMain).marginTop, 10);
  //     observer.disconnect();
  //     observer.rootMargin = `-${scrollOffset}px 0px -${scrollOffset}px 0px`;
  //     mainSections.forEach(section => observer.observe(section));
  //   });
  
  //   // Инициализация: установка selectedIndex на основе изначально активной ссылки
  //   const initialActiveLink = document.querySelector('.menu-aside > ul > li > a.active');
  //   if (initialActiveLink) {
  //     selectedIndex = Array.from(asideLinks).indexOf(initialActiveLink);
  //   }
  // })();

      // открытие меню в header
(function() {
  const menuLinks = document.querySelectorAll('.header-nav > ul > li > a');
  const menuStates = new Map(); // Для хранения состояния каждого меню

  menuLinks.forEach(link => {
    const parentLi = link.closest('li');
    const headerNavMenu = parentLi.querySelector('.header-nav-menu-inner');
    
    if (!headerNavMenu) return; // Пропускаем, если нет подменю

    const menuMain = headerNavMenu.querySelector('.menu-main');
    const asideLinks = headerNavMenu.querySelectorAll('.menu-aside-nav > ul > li > a');
    const mainSections = headerNavMenu.querySelectorAll('.menu-main-section');

    if(!menuMain) return;
    

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

      // Проверяем, достиг ли скролл нижней границы
      const isAtBottom = menuMain.scrollHeight - menuMain.scrollTop === menuMain.clientHeight;

      if (isAtBottom) {
        // Если скролл достиг нижней границы, выбираем последний пункт меню
        activeIndex = asideLinks.length - 1;
      } else if (selectedIndex !== null && visibleSections.has(selectedIndex)) {
        activeIndex = selectedIndex;
      } else if (visibleSections.size > 0) {
        activeIndex = Math.min(...visibleSections);
      } else {
        activeIndex = 0;
      }

      let hasActiveLink = false;
      asideLinks.forEach((link, index) => {
        if (index === activeIndex) {
          link.classList.add('active');
          hasActiveLink = true;
        } else {
          link.classList.remove('active');
        }
      });

      if (!hasActiveLink && asideLinks.length) {
        asideLinks[0].classList.add('active');
      }

      // Сохраняем состояние меню
      menuStates.set(parentLi, activeIndex);
    }

    function scrollToActiveLink() {
      // Восстанавливаем состояние меню, если оно было сохранено
      if (menuStates.has(parentLi)) {
        selectedIndex = menuStates.get(parentLi);
      }

      const activeLink = headerNavMenu.querySelector('.menu-aside-nav > ul > li > a.active');

      if(!activeLink) return;

      if (activeLink) {
        const index = Array.from(asideLinks).indexOf(activeLink);
        selectedIndex = index;
      } else if (selectedIndex === null) {
        selectedIndex = 0;
      }

      smoothScroll(mainSections[selectedIndex], 500);
      updateActiveLink();
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

    link.addEventListener('click', (e) => {
      const hasSubMenu = parentLi.querySelector('.header-nav-menu');

      if (parentLi.classList.contains('active')) {
        e.preventDefault();
        parentLi.classList.remove('active');
      } else if (hasSubMenu) {
        e.preventDefault();
        // Закрываем все другие открытые меню
        menuLinks.forEach(otherLink => {
          otherLink.closest('li').classList.remove('active');
        });
        parentLi.classList.add('active');
        document.querySelector('.wrapper').classList.add('non-scroll')
        setTimeout(() => {
          scrollToActiveLink();
        }, 0);
      }
    });

    document.addEventListener('click', (e) => {
      if (!headerNavMenu.contains(e.target) && !e.target.closest('.header-nav > ul > li > a')) {
        parentLi.classList.remove('active');
        document.querySelector('.wrapper').classList.remove('non-scroll')
      }
    });

    window.addEventListener('resize', () => {
      scrollOffset = parseInt(window.getComputedStyle(menuMain).marginTop, 10);
      observer.disconnect();
      observer.rootMargin = `-${scrollOffset}px 0px -${scrollOffset}px 0px`;
      mainSections.forEach(section => observer.observe(section));
    });

    // Инициализация: установка selectedIndex на основе изначально активной ссылки
    const initialActiveLink = headerNavMenu.querySelector('.menu-aside-nav > ul > li > a.active');
    if (initialActiveLink) {
      selectedIndex = Array.from(asideLinks).indexOf(initialActiveLink);
      menuStates.set(parentLi, selectedIndex);
    }
  });
})();


  // создание мобильного меню и логика работы мобильного меню
  (function() {
    const headerNav = document.querySelector('.header-nav');
    const menuAside = document.querySelector('.menu-aside-nav');
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
    // const menuToggle = document.querySelector('.header-nav > ul > li > a');
    // menuToggle.addEventListener('click', (e) => {
    //   e.preventDefault();
    //   mobileMenu.classList.toggle('active');
    //   document.body.classList.toggle('menu-open');
    // });
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

  // отображение скрытых решений, если больше 9
  // мгновенное
  (function() {
    const subcategoryList = document.querySelectorAll('.problems-selection-list .problems-selection');
    const moreButton = document.querySelector('.subcategory-more');
    const moreCount = document.querySelector('.subcategory-more-count');
    const moreIcon = document.querySelector('.subcategory-more-icon');
    
    if (!moreButton || subcategoryList.length <= 9) return;

    const hiddenCards = subcategoryList.length - 9;
    let isExpanded = false;

    function getServiceWord(number) {
      const cases = [2, 0, 1, 1, 1, 2];
      const titles = ['решение', 'решения', 'решений'];
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
        if (index >= 9) {
          card.classList.toggle('hidden');
        }
      });
    }

    function init() {
      subcategoryList.forEach((card, index) => {
        if (index >= 9) {
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

    // Проверка фактической высоты текстового блока для того, чтобы вычислять добавлять полупрозрачнгость в конце или нет    
    function getActualHeight(element) {
      const originalStyle = element.style.cssText;
      element.style.maxHeight = 'none';
      element.style.overflow = 'visible';
      const height = element.scrollHeight;
      element.style.cssText = originalStyle;
      
      return height;
    }
 
    const fulllHeight = getActualHeight(textBlock);
    const actualHeight = parseFloat(window.getComputedStyle(textBlock).getPropertyValue('max-height')); 

    if(fulllHeight <= actualHeight) {
      textBlock.classList.add('not-collapse');
      expandButton.classList.add('hidden');
    }
  
  });
})();


  // слайдер фотографий услуги оригинал
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

  // слайдер фотографий услуги 2 варинат
  // (function() {
  //   if (!document.querySelector('.galley-slider')) return;

  //   // Функция для обработки слайдов
  //   function handleSlides() {
  //     const slider = document.querySelector('.galley-slider .swiper-wrapper');
  //     const slides = slider.querySelectorAll('.swiper-slide');
  //     const slidesCount = slides.length;
  //     const sliderInner = document.querySelector('.subcategory-gallery-inner');
  //     const sliderArrows = document.querySelector('.gallery-slider-arrows');  

  //     if (slidesCount === 1) {
    
  //       if(sliderArrows) {
  //         sliderArrows.style.display = 'none';
  //       }
  //       if(sliderInner) {
  //         sliderInner.classList.add('subcategory-gallery-inner__single');
  //       }      
  //       return false;
  //     } else {
  //       // Убедимся, что у нас всегда есть хотя бы 4 слайда для корректной работы loop
  //       const minSlides = 4;
  //       if (slidesCount < minSlides) {
  //         const slidesToAdd = minSlides - slidesCount;
  //         for (let i = 0; i < slidesToAdd; i++) {
  //           slides.forEach(slide => {
  //             const clone = slide.cloneNode(true);
  //             slider.appendChild(clone);
  //           });
  //         }
  //       }
  //       // Восстановим отображение стрелок, если они были скрыты
  //       if(sliderArrows) {
  //         sliderArrows.style.display = '';
  //       }
      
  //       return true;
  //     }
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
  //       // loop: true,
  //       loopedSlides: 4, // Устанавливаем минимальное количество слайдов для loop
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

  // слайдер фотографий услуги 3 варинат
  (function() {
    if (!document.querySelector('.galley-slider')) return;
  
    // Функция для обработки слайдов
    function handleSlides() {
      const slider = document.querySelector('.galley-slider .swiper-wrapper');
      const slides = slider.querySelectorAll('.swiper-slide');
      const slidesCount = slides.length;
      const sliderInner = document.querySelector('.subcategory-gallery-inner');
      const sliderArrows = document.querySelector('.gallery-slider-arrows');  
  
      if (slidesCount === 1) {
        if(sliderArrows) {
          sliderArrows.style.display = 'none';
        }
        if(sliderInner) {
          sliderInner.classList.add('subcategory-gallery-inner__single');
        }      
        return 1;
      } else if (slidesCount === 2) {
        if(sliderArrows) {
          sliderArrows.style.display = 'none';
        }
        if(sliderInner) {
          sliderInner.classList.add('subcategory-gallery-inner__pair');
        }
        return 2;
      } else {
        if(sliderArrows) {
          sliderArrows.style.display = '';
        }
        if(sliderInner) {
          sliderInner.classList.remove('subcategory-gallery-inner__single', 'subcategory-gallery-inner__pair');
        }
        return slidesCount; // Возвращаем точное количество слайдов
      }
    }  
  
    const slidesCount = handleSlides();
  
    let swiperConfig;
  
    if (slidesCount >= 3) {
      // Конфигурация для 3 и более слайдов
      swiperConfig = {
        grabCursor: true,     
        slidesPerView: 2,
        slidesPerGroup: 1,
        spaceBetween: 0,
        autoplay: false,
        loop: true,
        loopedSlides: 3, // Минимальное количество слайдов для зацикливания
        keyboard: {
          enabled: true,
          pageUpDown: false
        },
        navigation: {
          nextEl: ".gallery-slider-arrows .slider-next",
          prevEl: ".gallery-slider-arrows .slider-prew",
        },
        breakpoints: {             
          900: {
            slidesPerView: 3,       
            spaceBetween: 0,
            loop: true,
          },       
        }
      };
  
      // Если слайдов ровно 3, добавляем копии для корректного зацикливания
      if (slidesCount === 3) {
        const slider = document.querySelector('.galley-slider .swiper-wrapper');
        const slides = slider.querySelectorAll('.swiper-slide');
        slides.forEach(slide => {
          const clone = slide.cloneNode(true);
          slider.appendChild(clone);
        });
      }
    } else if (slidesCount === 2) {
      // Конфигурация для 2 слайдов
      swiperConfig = {
        grabCursor: true,     
        slidesPerView: 1.2,
        slidesPerGroup: 1,
        spaceBetween: 0,
        autoplay: false,
        loop: false,
        keyboard: {
          enabled: true,
          pageUpDown: false
        },
        navigation: {
          nextEl: ".gallery-slider-arrows .slider-next",
          prevEl: ".gallery-slider-arrows .slider-prew",
        },
        breakpoints: {
          600: {
            slidesPerView: 1.4,
          },
          900: {
            slidesPerView: 1.3,
          },
        }
      };
    } else {
      // Конфигурация для 1 слайда
      swiperConfig = {
        grabCursor: true,     
        slidesPerView: 1,
        slidesPerGroup: 1,
        spaceBetween: 0,
        autoplay: false,
        loop: false,
        keyboard: {
          enabled: true,
          pageUpDown: false
        },
        navigation: {
          nextEl: ".slider-next",
          prevEl: ".slider-prew",
        }
      };
    }
  
    var swiper = new Swiper('.galley-slider', swiperConfig);  
  
    document.addEventListener('keydown', function(event) {
      if (event.key === 'ArrowLeft') {
        swiper.slidePrev();
      } else if (event.key === 'ArrowRight') {
        swiper.slideNext();
      }
    });
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
        
        // if (windowWidth <= 899) {
        //   floatOffset = $('.side-spase').offset().top - (parseFloat($('.header').height()) * 1.5);
        // } else {
        //   floatOffset = $('.side-spase').offset().top - (parseFloat($('.side-wrapper').css('padding-top')) * 1.28);
        // }

        if (windowWidth <= 899) {
          floatOffset = $('.side-spase').offset().top - (parseFloat($('.header').height()) * 1.5);
        } else {
          floatOffset = $('.side-spase').offset().top - (parseFloat($('.header').height()) * 1.116);
        }
        
        var sideWrapper = $('.side-wrapper');
        var contentHeight = sideWrapper.height();
        var floatHeight = $('.side-menu').outerHeight();
        var sideWrapperBottom = sideWrapper.offset().top + contentHeight;
        var floatStop = sideWrapperBottom - floatHeight;

        if (windowWidth <= 899) {
          floatStop = sideWrapperBottom - floatHeight - (parseFloat($('.header').height()) * 1.5);
        } else {
          floatStop = sideWrapperBottom - floatHeight - (parseFloat($('.header').height()) * 1.09) + parseFloat($('.side-wrapper').css('padding-bottom'));
        }
  
        if (windowWidth <= 899) {
          if (windowOffset > floatOffset && windowOffset < floatStop) {            
            $('.side-menu').addClass('float').removeClass('flip-bottom');
            if (!$('.side-menu').hasClass('black')) {
              $('.header').addClass('header__light');
              $('.header').removeClass('header__dark');
            } else {
              $('.header').addClass('header__dark');
              $('.header').removeClass('header__light');
            }          
          } else {
            $('.side-menu').removeClass('float');
            $('.header').removeClass('header__light');
            $('.header').removeClass('header__dark');
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
          $('.header').removeClass('header__dark');
        }
      }
  
      // Вызываем функцию при прокрутке и изменении размера окна
      $(window).on('scroll resize', handleScroll);
  
      // Вызываем функцию сразу после загрузки страницы
      handleScroll();
    }
  })();

  // прилипание информационного блока при прокрутке
   (function() {
    if ($('.side-info').length) {
      function handleScroll() {
        let windowWidth = $(window).width();
        let windowOffset = $(window).scrollTop();
        let floatOffset;

        if (windowWidth >= 900) {
          floatOffset = $('.side-spase').offset().top - (parseFloat($('.header').height()) * 1.116);       
        
          let contentHeight = $('.side-wrapper').height();
          let floatHeight = $('.side-info').outerHeight();
          let floatStop = floatOffset + contentHeight - floatHeight;
          
          if (windowOffset > floatOffset && windowOffset < floatStop) {
            $('.side-info').addClass('float').removeClass('flip-bottom');
          } else {
            $('.side-info').removeClass('float').addClass('flip-bottom');
            if (windowOffset < floatStop) {
              $('.side-info').removeClass('flip-bottom');
            }
          }
        } else {
          $('.side-info').removeClass('float').removeClass('flip-bottom');
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
      return window.innerWidth < 899 ? headerHeight * 3 : headerHeight * 1.11;
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

    // // смена цвета хедера при скролле
    // (function() {
    //   const header = document.querySelector('.side-menu');
    //   const blackHeaderBlocks = document.querySelectorAll('.white-header');
      
    //   function isHeaderMiddleCrossing(el) {
    //     const rect = el.getBoundingClientRect();
    //     const headerMiddle = header.offsetHeight / 2;
    //     return (
    //       rect.top <= headerMiddle &&
    //       rect.bottom >= headerMiddle
    //     );
    //   }
      
    //   function checkHeaderColor() {
    //     let shouldBeBlack = false;
        
    //     blackHeaderBlocks.forEach(block => {
    //       if (isHeaderMiddleCrossing(block)) {
    //         shouldBeBlack = true;
    //       }
    //     });
        
    //     if (shouldBeBlack) {
    //       header.classList.add('black');
    //     } else {
    //       header.classList.remove('black');
    //     }
    //   }
      
    //   window.addEventListener('scroll', checkHeaderColor);
    //   window.addEventListener('resize', checkHeaderColor);
      
    //   // Вызываем функцию сразу, чтобы установить начальное состояние
    //   checkHeaderColor();
    // })();
    // смена цвета хедера и бокового меню при скролле
(function() {
  const header = document.querySelector('.header');
  const sideMenu = document.querySelector('.side-menu');
  const blackHeaderBlocks = document.querySelectorAll('.black-header');
  const whiteHeaderBlocks = document.querySelectorAll('.white-header');

  if(!sideMenu) return;
  
  function isHeaderBottomCrossing(el) {
    const rect = el.getBoundingClientRect();
    const headerBottom = header.offsetHeight;
    return (
      rect.top <= headerBottom &&
      rect.bottom >= headerBottom
    );
  }
  
  function isSideMenuBottomCrossingWhiteHeader(sideMenu, whiteHeader) {
    const sideMenuRect = sideMenu.getBoundingClientRect();
    const whiteHeaderRect = whiteHeader.getBoundingClientRect();
    return (
      sideMenuRect.bottom >= whiteHeaderRect.top &&
      sideMenuRect.bottom <= whiteHeaderRect.bottom
    );
  }
  
  function checkHeaderColor() {
    let shouldHeaderBeBlack = false;
    
    blackHeaderBlocks.forEach(block => {
      if (isHeaderBottomCrossing(block)) {
        shouldHeaderBeBlack = true;
      }
    });
    
    if (shouldHeaderBeBlack) {
      header.classList.add('black');
    } else {
      header.classList.remove('black');
    }
  }
  
  function checkSideMenuColor() {
    let shouldSideMenuBeBlack = false;
    
    whiteHeaderBlocks.forEach(block => {
      if (isSideMenuBottomCrossingWhiteHeader(sideMenu, block)) {
        shouldSideMenuBeBlack = true;
      }
    });
    
    if (shouldSideMenuBeBlack) {
      sideMenu.classList.add('black');
    } else {
      sideMenu.classList.remove('black');
    }
  }
  
  function checkColors() {
    checkHeaderColor();
    checkSideMenuColor();
  }
  
  window.addEventListener('scroll', checkColors);
  window.addEventListener('resize', checkColors);
  
  // Вызываем функцию сразу, чтобы установить начальное состояние
  checkColors();
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

  // бургер-меню
  // (function() {
  //   const header = document.querySelector('.header')
  //   const burger = document.querySelector('.header-burger');
  //   const burgerBtnIcon = document.querySelector('.header-burger span');
  //   const menu = document.querySelector('.header-burger-menu');

  //   if(!burger || !burgerBtnIcon || !menu) return;

  //   burger.addEventListener('click', () => {
  //     burgerBtnIcon.classList.toggle('active');
  //     menu.classList.toggle('show');

  //     if(menu.classList.contains('show')) {
  //       document.body.classList.add('menu-open');
  //     } else {
  //       document.body.classList.remove('menu-open');
  //     }
  //     // document.body.classList.toggle('menu-open');
  //     header.classList.toggle('hidden');
  //   });

  //   const menuList = document.querySelectorAll('.header-burger-menu-wrapper > ul > li');

  //   menuList.forEach((menuListItem) => {
  //     menuListItem.addEventListener('click', () => {
  //       // Если кликнутый элемент уже активен, просто делаем его неактивным
  //       if (menuListItem.classList.contains('active')) {
  //         menuListItem.classList.remove('active');
  //       } else {
  //         // Иначе, сначала удаляем класс 'active' у всех элементов
  //         menuList.forEach((item) => {
  //           item.classList.remove('active');
  //         });
  //         // Затем добавляем класс 'active' только к кликнутому элементу          
  //         menuListItem.classList.add('active');
  //       }
  //     })
  //   })
  // })();

  // бургер-меню
// (function() {
//   const header = document.querySelector('.header')
//   const burger = document.querySelector('.header-burger');
//   const burgerBtnIcon = document.querySelector('.header-burger span');
//   const menu = document.querySelector('.header-burger-menu');

//   if(!burger || !burgerBtnIcon || !menu) return;

//   burger.addEventListener('click', () => {
//     burgerBtnIcon.classList.toggle('active');
//     menu.classList.toggle('show');

//     if(menu.classList.contains('show')) {
//       document.body.classList.add('menu-open');
//     } else {
//       document.body.classList.remove('menu-open');
//     }
//     header.classList.toggle('hidden');
//   });

//   const menuList = document.querySelectorAll('.header-burger-menu-wrapper > ul > li');

//   menuList.forEach((menuListItem) => {
//     menuListItem.addEventListener('click', () => {
//       if (menuListItem.classList.contains('active')) {
//         // Если кликнутый элемент уже активен, делаем его неактивным
//         menuListItem.classList.remove('active');
//         menuList.forEach((item) => {
//           item.classList.remove('hidden-tablet');
//         });
//       } else {
//         // Иначе, обрабатываем клик на неактивный элемент
//         menuList.forEach((item) => {
//           if (item === menuListItem) {
//             item.classList.add('active');
//             item.classList.remove('hidden-tablet');
//           } else {
//             item.classList.remove('active');
//             item.classList.add('hidden-tablet');
//           }
//         });
//       }
//     })
//   })

//   const subMenuList = document.querySelectorAll('.header-burger-menu-wrapper > ul > li > ul > li');

//   subMenuList.forEach((menuListItem) => {
//     menuListItem.addEventListener('click', (ev) => {   
//       ev.stopPropagation();

//       if (menuListItem.classList.contains('active')) {
//         // Если кликнутый элемент уже активен, делаем его неактивным
//         menuListItem.classList.remove('active');
//         subMenuList.forEach((item) => {
//           item.classList.remove('hidden-tablet');
//         });
//       } else {
//         // Иначе, обрабатываем клик на неактивный элемент
//         subMenuList.forEach((item) => {
//           if (item === menuListItem) {
//             item.classList.add('active');
//             item.classList.remove('hidden-tablet');
//           } else {
//             item.classList.remove('active');
//             item.classList.add('hidden-tablet');
//           }
//         });
//       }
//     })
//   })

//   const subSubMenuList = document.querySelectorAll('.header-burger-menu-wrapper > ul > li > ul > li > ul > li');

//   subSubMenuList.forEach((menuListItem) => {
//     menuListItem.addEventListener('click', (ev) => {   
//       ev.stopPropagation();

//       if (menuListItem.classList.contains('active')) {
//         // Если кликнутый элемент уже активен, делаем его неактивным
//         menuListItem.classList.remove('active');
//         subSubMenuList.forEach((item) => {
//           item.classList.remove('hidden-tablet');
//         });
//       } else {
//         // Иначе, обрабатываем клик на неактивный элемент
//         subSubMenuList.forEach((item) => {
//           if (item === menuListItem) {
//             item.classList.add('active');
//             item.classList.remove('hidden-tablet');
//           } else {
//             item.classList.remove('active');
//             item.classList.add('hidden-tablet');
//           }
//         });
//       }
//     })
//   })

// })();

// бургер-меню
(function() {
  const header = document.querySelector('.header')
  const burger = document.querySelector('.header-burger');
  const burgerBtnIcon = document.querySelector('.header-burger span');
  const menu = document.querySelector('.header-burger-menu');
  const closeButton = document.querySelector('.header-burger-menu-head .close');

  if(!burger || !burgerBtnIcon || !menu || !closeButton) return;

  function checkMenuState() {
    const isAnyMenuItemOpen = document.querySelector('.header-burger-menu-wrapper > ul > li.active') ||
                              document.querySelector('.header-burger-menu-wrapper > ul > li > ul > li.active') ||
                              document.querySelector('.header-burger-menu-wrapper > ul > li > ul > li > ul > li.active');

    const menuLogo = document.querySelector('.header-burger-menu-head .header-logo');
    
    if(!menuLogo) return;
    
    if (isAnyMenuItemOpen) {
      menuLogo.classList.add('hidden');
    } else {
      menuLogo.classList.remove('hidden');
    }
  }

  function closeMenu() {  
    burgerBtnIcon.classList.remove('active');
    menu.classList.remove('show');
    document.body.classList.remove('menu-open');
    header.classList.remove('hidden');
  
    // Сбрасываем все активные состояния и убираем класс hidden-tablet
    const allMenuItems = document.querySelectorAll('.header-burger-menu-wrapper ul li');
    allMenuItems.forEach(item => {
      item.classList.remove('active');
      item.classList.remove('hidden-tablet');
    });
  
    // checkMenuState();
  }

  burger.addEventListener('click', () => {
    burgerBtnIcon.classList.toggle('active');
    menu.classList.toggle('show');

    if(menu.classList.contains('show')) {
      document.body.classList.add('menu-open');
    } else {
      document.body.classList.remove('menu-open');
    }
    header.classList.toggle('hidden');
    checkMenuState();
  });

  // Добавляем обработчик для кнопки закрытия
  closeButton.addEventListener('click', closeMenu);

  const menuList = document.querySelectorAll('.header-burger-menu-wrapper > ul > li');

  menuList.forEach((menuListItem) => {
    menuListItem.addEventListener('click', (ev) => {
      if(ev.target.tagName === 'A'  && ev.target.nextElementSibling && ev.target.nextElementSibling.tagName === 'UL') {
        ev.preventDefault();
      }

      if(ev.target.tagName === 'A' && !ev.target.nextElementSibling) return    

      if (menuListItem.classList.contains('active')) {
        menuListItem.classList.remove('active');
        menuList.forEach((item) => {
          item.classList.remove('hidden-tablet');
        });
      } else {
        menuList.forEach((item) => {
          if (item === menuListItem) {
            item.classList.add('active');
            item.classList.remove('hidden-tablet');
          } else {
            item.classList.remove('active');
            item.classList.add('hidden-tablet');
          }
        });
      }
      checkMenuState();
    })
  })

  const subMenuList = document.querySelectorAll('.header-burger-menu-wrapper > ul > li > ul > li');

  subMenuList.forEach((menuListItem) => {
    menuListItem.addEventListener('click', (ev) => {   
      ev.stopPropagation();

      if(ev.target.tagName === 'A'  && ev.target.nextElementSibling && ev.target.nextElementSibling.tagName === 'UL') {
        ev.preventDefault();
      }

      if(ev.target.tagName === 'A' && !ev.target.nextElementSibling) return

      if (menuListItem.classList.contains('active')) {
        menuListItem.classList.remove('active');
        subMenuList.forEach((item) => {
          item.classList.remove('hidden-tablet');
        });
      } else {
        subMenuList.forEach((item) => {
          if (item === menuListItem) {
            item.classList.add('active');
            item.classList.remove('hidden-tablet');
          } else {
            item.classList.remove('active');
            item.classList.add('hidden-tablet');
          }
        });
      }
      checkMenuState();
    })
  })

  const subSubMenuList = document.querySelectorAll('.header-burger-menu-wrapper > ul > li > ul > li > ul > li');

  subSubMenuList.forEach((menuListItem) => {
    menuListItem.addEventListener('click', (ev) => {   
      ev.stopPropagation();

      if(ev.target.tagName === 'A' && ev.target.nextElementSibling && ev.target.nextElementSibling.tagName === 'UL') {
        ev.preventDefault();
      }

      if(ev.target.tagName === 'A' && !ev.target.nextElementSibling) return

      if (menuListItem.classList.contains('active')) {
        menuListItem.classList.remove('active');
        subSubMenuList.forEach((item) => {
          item.classList.remove('hidden-tablet');
        });
      } else {
        subSubMenuList.forEach((item) => {
          if (item === menuListItem) {
            item.classList.add('active');
            item.classList.remove('hidden-tablet');
          } else {
            item.classList.remove('active');
            item.classList.add('hidden-tablet');
          }
        });
      }
      checkMenuState();
    })
  })

  // Проверяем начальное состояние меню
  checkMenuState();
})();

  // важная новость
  (function() {
    function adjustHeaderTop() {
      const importantNew = document.querySelector('.important-new');
      const header = document.querySelector('.header');
      const wrapper = document.querySelector('.wrapper');
  
      if (importantNew && header && wrapper && importantNew.classList.contains('show')) {
        wrapper.classList.add('important');
        const importantNewHeight = importantNew.offsetHeight;
        header.style.top = `${importantNewHeight}px`;
      }

      const close = document.querySelector('.important-new-close');

      if(close) {    
        close.addEventListener('click', () => {
          importantNew.classList.remove('show');
          wrapper.classList.remove('important');
          header.style.top = `0px`;
        })
      }
    }    
  
    adjustHeaderTop();    
   
    window.addEventListener('resize', adjustHeaderTop);
    
  })();

  // поиск
  (function() {
    const trigger = document.querySelector('.header-search');
    const searchMenu = document.querySelector('.search');

    if(!trigger || !searchMenu) return;

    trigger.addEventListener('click', () => {
      searchMenu.classList.add('show');

      document.body.classList.add('menu-open');

      const close = document.querySelector('.search-close');

      if(close) {
        close.addEventListener('click', () => {
          searchMenu.classList.remove('show');
          document.body.classList.remove('menu-open');
        })        
      }      
    })

    const searchContainers = document.querySelectorAll('.search-field');

    searchContainers.forEach(container => {
      const searchInput = container.querySelector('.search-input');
      const searchRemove = container.querySelector('.search-remove');

      if (!searchInput || !searchRemove) return;

      function toggleRemoveButton() {
        if (searchInput.value.length > 0) {
          searchRemove.classList.add('show');
        } else {
          searchRemove.classList.remove('show');
        }
      }

      // Отслеживаем ввод
      searchInput.addEventListener('input', toggleRemoveButton);
      searchInput.addEventListener('change', toggleRemoveButton);
      searchInput.addEventListener('keyup', toggleRemoveButton);

      // Обработка клика по кнопке удаления
      searchRemove.addEventListener('click', () => {
        searchInput.value = '';
        toggleRemoveButton();
      });

      toggleRemoveButton();
    });
  })();
  
  // слайдер до/после
  (function() {
    const container = document.getElementById('beforeAfterSlider');
    const handle = document.getElementById('sliderHandle');

    if(!container || !handle) return;

    const afterImage = container.querySelector('.comparison-image__after');

    let isDragging = false;
    let isLargeScreen = window.innerWidth >= 600;

    const getPercentage = (clientX) => {
        const containerRect = container.getBoundingClientRect();
        let percentage = ((clientX - containerRect.left) / containerRect.width) * 100;
        if (isLargeScreen) {
            percentage = Math.min(Math.max(percentage, 0), 50);
        } else {
            percentage = Math.min(Math.max(percentage, 0), 100);
        }
        return percentage;
    };

    const updateSliderPosition = (percentage) => {
        handle.style.left = `${percentage}%`;
        afterImage.style.clipPath = `inset(0 0 0 ${percentage}%)`;
    };

    const onStart = (event) => {
        isDragging = true;
        event.preventDefault();
    };

    const onMove = (event) => {
        if (!isDragging) return;
        const clientX = event.type.includes('mouse') ? event.clientX : event.touches[0].clientX;
        updateSliderPosition(getPercentage(clientX));
        event.preventDefault();
    };

    const onEnd = () => {
        isDragging = false;
    };

    // Mouse Events
    handle.addEventListener('mousedown', onStart);
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onEnd);

    // Touch Events
    handle.addEventListener('touchstart', onStart);
    document.addEventListener('touchmove', onMove);
    document.addEventListener('touchend', onEnd);

    // Prevent text selection
    container.addEventListener('selectstart', (e) => e.preventDefault());

    // Function to set initial slider position based on screen width
    const setInitialPosition = () => {
        isLargeScreen = window.innerWidth >= 600;
        if (isLargeScreen) {
            updateSliderPosition(33);
        } else {
            updateSliderPosition(50);
        }
    };

    // Set initial position on load
    setInitialPosition();

    // Update position and constraints on window resize
    window.addEventListener('resize', () => {
        setInitialPosition();
        // If the handle is beyond the new limit after resizing to a large screen, adjust it
        if (isLargeScreen) {
            const currentPosition = parseFloat(handle.style.left);
            if (currentPosition > 50) {
                updateSliderPosition(50);
            }
        }
    });
  })();

  // аккордеон "медицинский подход"
  (function() {
    const accordItems = document.querySelectorAll('.medical-accordion-item');

    accordItems.forEach((item) => {
      item.addEventListener('click', () => {
        accordItems.forEach(el => {
          el.classList.remove('opened');
        })      
        item.classList.toggle('opened');
      })
    })
  })();

   

  // слайдер аппараты
  // (function () {
  //   if (!document.querySelector(".devices-category-slider")) return;

  //   // Функция для обработки слайдов
  //   function handleSlides() {
  //     const sliderWrapper = document.querySelector('.devices-category-slider-wrapper');
  //     const slider = document.querySelector('.devices-category-slider .swiper-wrapper');
  //     const slides = slider.querySelectorAll('.swiper-slide');
  //     const slidesCount = slides.length;
  //     const navigation = document.querySelectorAll('.devices-slider-arrow');

  //     // Добавляем или убираем класс 'wide' в зависимости от количества слайдов
  //     if (slidesCount > 2) {
  //       sliderWrapper.classList.add('wide');
  //       navigation.forEach(nav => nav.style.display = '');
  //     } else {
  //       sliderWrapper.classList.remove('wide');
  //       navigation.forEach(nav => nav.style.display = 'none');
  //     }

  //     // Если слайдов меньше 8 и больше 2, добавляем копии для корректного зацикливания
  //     if (slidesCount > 2 && slidesCount < 8) {
  //       const slidesToAdd = 8 - slidesCount;
  //       for (let i = 0; i < slidesToAdd; i++) {
  //         const clone = slides[i % slidesCount].cloneNode(true);
  //         slider.appendChild(clone);
  //       }
  //     }

  //     return slidesCount;
  //   }

  //   const originalSlidesCount = handleSlides();

  //   const swiperConfig = {
  //     grabCursor: true,
  //     slidesPerView: 1.7,
  //     slidesPerGroup: 1,
  //     spaceBetween: 0,
  //     loop: originalSlidesCount > 2,
  //     loopedSlides: 3,
  //     navigation: {
  //       nextEl: ".devices-slider-arrow.slider-next",
  //       prevEl: ".devices-slider-arrow.slider-prew",
  //     },
  //     on: {
  //       init: function(swiper) {
  //         if (originalSlidesCount <= 4) {
  //           swiper.params.slidesPerView = originalSlidesCount;
  //         }
  //       }
  //     },
  //     breakpoints: {
  //       600: {
  //         slidesPerView: 2.5,
  //         slidesPerGroup: 1,
  //         loopedSlides: 3,
  //       },
  //       900: {
  //         slidesPerView: 4,
  //         slidesPerGroup: 1,
  //         loopedSlides: 3,
  //       },
  //     }
  //   };

  //   var swiper = new Swiper('.devices-category-slider', swiperConfig);
  // })();


    // слайдер аппараты
  (function () {
    const sliders = document.querySelectorAll(".devices-category-slider");
    if (sliders.length === 0) return;

    // Функция для обработки слайдов
    function handleSlides(slider) {
      const deviceCategory = slider.closest('.devices-category');
      const sliderWrapper = slider.closest('.devices-category-slider-wrapper');
      const slides = slider.querySelectorAll('.swiper-slide');
      const slidesCount = slides.length;
      const navigation = deviceCategory.querySelector('.devices-slider-arrows');

      // Добавляем или убираем класс 'wide' в зависимости от количества слайдов
      if (slidesCount > 2) {
        sliderWrapper.classList.add('wide');
        // navigation.classList.remove('hidden-tablet');
        navigation.style.display = ''
      } else {
        sliderWrapper.classList.remove('wide');
        // navigation.classList.add('hidden-tablet');
        navigation.style.display = 'none'
      }

      // Если слайдов меньше 8 и больше 2, добавляем копии для корректного зацикливания
      if (slidesCount > 2 && slidesCount < 8) {
        const slidesToAdd = 8 - slidesCount;
        for (let i = 0; i < slidesToAdd; i++) {
          const clone = slides[i % slidesCount].cloneNode(true);
          slider.querySelector('.swiper-wrapper').appendChild(clone);
        }
      }

      return slidesCount;
    }

    sliders.forEach((slider) => {
      const originalSlidesCount = handleSlides(slider);
      const deviceCategory = slider.closest('.devices-category');

      const swiperConfig = {
        grabCursor: true,
        slidesPerView: 1.7,
        slidesPerGroup: 1,
        spaceBetween: 0,
        loop: originalSlidesCount > 2,
        loopedSlides: 3,
        navigation: {
          nextEl: deviceCategory.querySelector(".devices-slider-arrow.slider-next"),
          prevEl: deviceCategory.querySelector(".devices-slider-arrow.slider-prew"),
        },
        on: {
          init: function(swiper) {
            if (originalSlidesCount <= 4) {
              swiper.params.slidesPerView = originalSlidesCount;
            }
          }
        },
        breakpoints: {
          600: {
            slidesPerView: 2.5,
            slidesPerGroup: 1,
            loopedSlides: 3,
          },
          900: {
            slidesPerView: 4,
            slidesPerGroup: 1,
            loopedSlides: 3,
          },
        }
      };

      new Swiper(slider, swiperConfig);
    });
  })();

  // слайдер до/после
  (function () {
    if (!document.querySelector(".demonstration-slider")) return;

    var swiper = new Swiper(".demonstration-slider", {
      grabCursor: true,
      slidesPerView: 1.28,
      slidesPerGroup: 1,
      spaceBetween: 0,  
      loop: true,
      navigation: {
        nextEl: ".demonstration-nav .slider-next",
        prevEl: ".demonstration-nav .slider-prew",
      },
      breakpoints: {
        600: {
          slidesPerView: 1,
          spaceBetween: 20,
          autoplay: false,
          loop: false,
        },
        900: {
          slidesPerView: 1.337        
        },       
      },
    });
  })();

  // слайдер специалисты
  (function () {
    if (!document.querySelector(".specialists-slider")) return;
  
    var swiper = new Swiper(".specialists-slider", {
      grabCursor: true,
      slidesPerView: 1.026,
      slidesPerGroup: 1,
      spaceBetween: 0,  
      loop: true,
      loopedSlides: 5, // Добавлено для обеспечения зацикливания
      navigation: {
        nextEl: ".specialists-nav .slider-next",
        prevEl: ".specialists-nav .slider-prew",
      },
      breakpoints: {
        600: {
          slidesPerView: 2.062,
        },
        900: {
          slidesPerView: 5,
          loop: true,
          loopedSlides: 5, // Добавлено для обеспечения зацикливания
        },       
      },
      on: {
        beforeInit: function () {
          let numSlides = this.wrapperEl.querySelectorAll('.swiper-slide').length;
          let sliderWrapper = this.el.closest('.specialists-slider-wrapper');

          // Добавляем класс 'wide', если слайдов 3 или больше
          if (numSlides >= 3) {
            sliderWrapper.classList.add('wide');
          } else {
            sliderWrapper.classList.remove('wide');
          }
          
          if (numSlides < 5 && numSlides >= 3) {
            let originalSlides = Array.from(this.wrapperEl.children);
            let slidesToAdd = 5 - numSlides;
            for (let i = 0; i < slidesToAdd; i++) {
              originalSlides.forEach(slide => {
                this.wrapperEl.appendChild(slide.cloneNode(true));
              });
            }
          }

          if (numSlides === 2) {
            sliderWrapper.classList.add('pair');
            this.params.breakpoints[900].slidesPerView = 2.5;
            this.params.breakpoints[600].slidesPerView = 1.96;
          } else {
            sliderWrapper.classList.remove('pair');
          }
        }
      }
    });
  })();

  // Показать/скрыть контент в карточках отзывов
  (function() {
    const reviewCards = document.querySelectorAll('.collapsed-card');

  reviewCards.forEach(card => {
    const desktopCollapse = card.querySelector('.card-collapse-desktop');
    const mobileCollapse = card.querySelector('.card-collapse-mobile');
    // const tabletExpandBtn = card.querySelector('.text-expand.hidden-desktop.hidden-mobile');
    // const mobileExpandBtn = card.querySelector('.text-expand.hidden-desktop.hidden-tablet.visible-mobile');
    const tabletExpandBtn = card.querySelector('.text-expand__tablet');
    const mobileExpandBtn = card.querySelector('.text-expand__mobile');

    function toggleExpand(element, button) {
      element.classList.toggle('show');
      if (button) {
        button.classList.toggle('show');
        const span = button.querySelector('span');
        span.textContent = element.classList.contains('show') ? 'Скрыть' : 'Показать еще';
      }
    }

    function checkOverflow(element) {
      return element.scrollHeight > element.clientHeight;
    }

    function handleDesktopOverflow() {
      if (desktopCollapse && window.innerWidth >= 900) {
        if (checkOverflow(desktopCollapse)) {
          desktopCollapse.classList.add('has-overflow');
        } else {
          desktopCollapse.classList.remove('has-overflow');
        }
      }
    }

    function handleResize() {
      const width = window.innerWidth;
      if (width >= 900) {
        if (desktopCollapse) {
          desktopCollapse.onclick = () => toggleExpand(desktopCollapse);
        }
        if (tabletExpandBtn) {
          tabletExpandBtn.onclick = null;
        }
        if (mobileExpandBtn) {
          mobileExpandBtn.onclick = null;
        }
        handleDesktopOverflow();
      } else if (width >= 600 && width < 900) {
        if (desktopCollapse) {
          desktopCollapse.onclick = null;
        }
        if (tabletExpandBtn) {
          tabletExpandBtn.onclick = () => toggleExpand(desktopCollapse, tabletExpandBtn);
        }
        if (mobileExpandBtn) {
          mobileExpandBtn.onclick = null;
        }
      } else {
        if (desktopCollapse) {
          desktopCollapse.onclick = null;
        }
        if (tabletExpandBtn) {
          tabletExpandBtn.onclick = null;
        }
        if (mobileExpandBtn) {
          mobileExpandBtn.onclick = () => toggleExpand(mobileCollapse, mobileExpandBtn);
        }
      }
    }

    handleResize();
    window.addEventListener('resize', handleResize);

    // Запустим проверку переполнения после загрузки всех изображений
    window.addEventListener('load', handleDesktopOverflow);
  });
  })();

  // Проврка на количество карточек на странице "наши клиники"
  (function() {
    const cards = document.querySelectorAll('.clinics-preview-wrapper');

    if(!cards.length) return;

    if(cards.length <= 2) {
      console.log('remove lg-4 and change on lg-6');
      cards.forEach(card => {
        card.classList.add('col-lg-6');
        card.classList.remove('col-lg-4');
      })
    } else {
      cards.forEach(card => {
        card.classList.add('col-lg-4');
        card.classList.remove('col-lg-6');
      })
    }
  })();
 
})