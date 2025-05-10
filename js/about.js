    // Sticky header functionality
    const topBar = document.getElementById('topBar');
    const desktopNav = document.getElementById('desktopNav');
    const mobileHeader = document.getElementById('mobileHeader');

    function onScroll() {
      if (window.scrollY > 10) {
        topBar.classList.add('scrolled');
        desktopNav.classList.add('scrolled');
        mobileHeader.classList.add('scrolled');
      } else {
        topBar.classList.remove('scrolled');
        desktopNav.classList.remove('scrolled');
        mobileHeader.classList.remove('scrolled');
      }
    }

    window.addEventListener('scroll', onScroll);

    // Mobile menu functionality
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const menuOverlay = document.getElementById('menuOverlay');
    const mobileClose = document.getElementById('mobileClose');

    hamburgerBtn.addEventListener('click', () => {
      mobileMenu.classList.add('active');
      menuOverlay.classList.add('active');
      document.body.style.overflow = 'hidden'; // Prevent scrolling when menu is open
    });

    function closeMenu() {
      mobileMenu.classList.remove('active');
      menuOverlay.classList.remove('active');
      document.body.style.overflow = ''; // Restore scrolling
    }

    mobileClose.addEventListener('click', closeMenu);
    menuOverlay.addEventListener('click', closeMenu);

    // Close menu when clicking a link
    const mobileMenuLinks = mobileMenu.querySelectorAll('a');
    mobileMenuLinks.forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    // Close menu on window resize if screen becomes large
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) {
        closeMenu();
      }
    });