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
  // Открытие попапа
  $(document).on("click", ".mfp-link", function () {
    var a = $(this);
    $.magnificPopup.open({
      items: { src: a.attr("data-href") },
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
          },700);
  
          document.documentElement.style.overflow = 'hidden'
        },
  
        close: function() {
          document.documentElement.style.overflow = ''
        }
      }
    });
    return false;
  });

  // открытие меню в header  
  (function() {
    const menuLinks = document.querySelectorAll('.header-nav > ul > li > a');
    const asideLinks = document.querySelectorAll('.menu-aside > ul > li > a');
    const mainSections = document.querySelectorAll('.menu-main-section');
    const menuMain = document.querySelector('.menu-main');
    const headerNavMenu = document.querySelector('.header-nav-menu-inner');

    if(!menuMain || !headerNavMenu) return
  
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
  
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const index = Array.from(mainSections).indexOf(entry.target);
        if (entry.isIntersecting) {
          visibleSections.add(index);
        } else {
          visibleSections.delete(index);
        }
      });
      updateActiveLink();
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
  
    // Открытие меню
    menuLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        const parentLi = link.closest('li');
        const hasSubMenu = parentLi.querySelector('.header-nav-menu');
  
        if (hasSubMenu) {
          e.preventDefault();
          menuLinks.forEach(otherLink => {
            otherLink.closest('li').classList.remove('active');
          });
          parentLi.classList.toggle('active');

          document.querySelector('.wrapper').classList.add('non-scroll');
        }
      });
    });
  
    // Закрытие меню при клике вне .header-nav-menu-inner
    document.addEventListener('click', (e) => {
      if (!headerNavMenu.contains(e.target) && !e.target.closest('.header-nav > ul > li > a')) {
        menuLinks.forEach(link => {
          link.closest('li').classList.remove('active');
          document.querySelector('.wrapper').classList.remove('non-scroll');
        });
      }
    });

    // закрытие по esc
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        // Закрываем меню
        menuLinks.forEach(link => {
          link.closest('li').classList.remove('active');
          document.querySelector('.wrapper').classList.remove('non-scroll');
        });
      }
    });
    
  
    window.addEventListener('resize', () => {
      scrollOffset = parseInt(window.getComputedStyle(menuMain).marginTop, 10);
      observer.disconnect();
      observer.rootMargin = `-${scrollOffset}px 0px -${scrollOffset}px 0px`;
      mainSections.forEach(section => observer.observe(section));
    });
  })();
  
  // отображение скрытых услуг, если больше 6
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

    function toggleCards(show) {
      let delay = 0;
      const isMobile = window.innerWidth < 599;
      
      subcategoryList.forEach((card, index) => {
        if (index >= 6) {
          setTimeout(() => {
            if (isMobile) {
              card.style.display = show ? 'flex' : 'none';
            } else {
              card.style.display = show ? 'block' : 'none';
            }
            
            setTimeout(() => {
              card.style.opacity = show ? '1' : '0';
            }, 50);
          }, delay);
          delay += 100;
        }
      });
    }

    function init(show) {
      subcategoryList.forEach((card, index) => {
        if (index >= 6) {
          card.style.display = show ? 'block' : 'none';      
          card.style.opacity = show ? '1' : '0';
        }
      });
    }

    // Инициализация
    init(false);
    toggleCards(false);
    updateButtonText();

    moreButton.addEventListener('click', () => {
      isExpanded = !isExpanded;
      toggleCards(isExpanded);
      updateButtonText();
    });

    window.addEventListener('resize', () => {
      toggleCards(isExpanded);
    });

  })();

  // раскрытие текста в описании подкатегории
  (function() {
    const textCollapsibles = document.querySelectorAll('.text-collapsible');
  
    textCollapsibles.forEach(collapsible => {
      const textBlock = collapsible.querySelector('.text-collapse');
      const expandButton = collapsible.querySelector('.text-expand');
      const buttonText = expandButton.childNodes[0];
      const buttonIcon = expandButton.querySelector('.text-expand-icon');

      if(!textBlock || !expandButton || !buttonText || !buttonIcon) return
  
      function toggleText() {
        if (textBlock.classList.contains('show')) {
          textBlock.style.maxHeight = null;
          textBlock.classList.remove('show');
          buttonText.textContent = 'Показать еще';
          expandButton.classList.remove('show');
          buttonIcon.style.transform = 'rotate(0deg)';
        } else {
          textBlock.classList.add('show');
          const textHeight = textBlock.scrollHeight;
          textBlock.style.maxHeight = textHeight + 'px';
          buttonText.textContent = 'Свернуть';
          expandButton.classList.add('show');
          buttonIcon.style.transform = 'rotate(180deg)';
        }
      }
  
      function handleClick(event) {
        if (window.innerWidth < 899) {
          if (event.target === expandButton || expandButton.contains(event.target)) {
            toggleText();
          }
        } else {
          if (event.target === textBlock || event.target === expandButton || expandButton.contains(event.target)) {
            toggleText();
          }
        }
      }
  
      collapsible.addEventListener('click', handleClick);
  
      // Обработка изменения размера окна
      window.addEventListener('resize', () => {
        if (window.innerWidth >= 899) {
          textBlock.style.maxHeight = null;
          textBlock.classList.remove('show');
          buttonText.textContent = 'Показать еще';
          expandButton.classList.remove('show');
          buttonIcon.style.transform = 'rotate(0deg)';
        }
      });
    });
  })();

  // слайдер фотографий услуги
  (function() {
    if (!document.querySelector('.galley-slider')) return;
  
    // Функция для дублирования слайдов
    function handleSlides() {
      const slider = document.querySelector('.galley-slider .swiper-wrapper');
      const slides = slider.querySelectorAll('.swiper-slide');
      const slidesCount = slides.length;
      const desiredCount = 3;
  
      if (slidesCount === 1) {
        console.log("one photo only");
        const sliderInner = document.querySelector('.subcategory-gallery-inner');
        const sliderArrows = document.querySelector('.gallery-slider-arrows');
        const sliderTitle = document.querySelector('.subcategory-content-title__gallery');

        if(sliderArrows) {
          sliderArrows.style.display ='none';
        }

        if(sliderInner) {
          sliderInner.classList.add('subcategory-gallery-inner__single');
        }

        if(sliderTitle) {       
          sliderTitle.textContent = "Фотография процедуры";    
          sliderTitle.setAttribute("data-title", "Фотография процедуры");
        }
        
        return false;
      } else if (slidesCount < desiredCount) {
        for (let i = 0; i < desiredCount - slidesCount; i++) {
          slides.forEach(slide => {
            const clone = slide.cloneNode(true);
            slider.appendChild(clone);
          });
        }
      }
      return true;
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
          floatOffset = $('.side-spase').offset().top - parseFloat($('.side-wrapper').css('padding-top'));
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

    if(!menuItems.length && navigation) {
      navigation.classList.add('hidden');
    }
    
    if(!menuList) return   

    menuItems.forEach((item, index) => {
      const li = document.createElement('li');
      li.classList.add('side-navigation-item');
      
      if (index === 0) {
        li.classList.add('active');
      }
      
      li.textContent = item.dataset.title || item.textContent;

      li.addEventListener('click', () => {
        item.scrollIntoView({
          behavior: 'smooth'  
        });
      });

      menuList.appendChild(li);      
    });      

    let currentActive = menuList.querySelector('.active');
    const menuOffset = menuList.getBoundingClientRect().top;
    
    document.addEventListener('scroll', () => {
      let nextIndex;
      menuItems.forEach((item, index) => {
        const rect = item.getBoundingClientRect();
        if (rect.top - menuOffset < 130) {
          nextIndex = index;
        }
      });
    
      if (nextIndex !== undefined) {
        currentActive.classList.remove('active');
        const nextActive = menuList.children[nextIndex];
        nextActive.classList.add('active');
        currentActive = nextActive;
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

    if(!wrapper) return

    const stickyElem = wrapper.querySelector('.sticky-elem');

    if(stickyElem) {
      let stickyElemOriginalTop = stickyElem.offsetTop;
      let stickyElemHeight = stickyElem.offsetHeight;
    
      function updateStickyElem() {
        const wrapperRect = wrapper.getBoundingClientRect();
        const wrapperTop = wrapperRect.top;
        const wrapperBottom = wrapperRect.bottom - stickyElemHeight;
    
        if (wrapperTop <= 0 && wrapperBottom > stickyElemHeight) {
          stickyElem.style.position = 'fixed';
          stickyElem.style.top = '0';
        } else if (wrapperBottom <= stickyElemHeight) {
          stickyElem.style.position = 'absolute';
          stickyElem.style.top = (wrapper.offsetHeight - stickyElemHeight) + 'px'; 
        } else {
          stickyElem.style.position = 'fixed';
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
})