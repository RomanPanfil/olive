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

  // вставка текущего года в копирайт футера
  (function() {   
    const yearElement = document.querySelector('.footer-copy-txt-year');

    if (yearElement) {
      yearElement.textContent = ` ${new Date().getFullYear()}`;
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
})