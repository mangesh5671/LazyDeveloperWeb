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


document.addEventListener('DOMContentLoaded', function() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImg');
    const closeBtn = document.querySelector('.close');
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');
    
    let currentIndex = 0;
    const images = [
      "/api/placeholder/600/800",
      "/api/placeholder/600/800",
      "/api/placeholder/1200/600",
      "/api/placeholder/1200/600",
      "/api/placeholder/400/400",
      "/api/placeholder/400/400",
      "/api/placeholder/800/400"
    ];
    
    const titles = [
      "Main Building",
      "Computer Lab",
      "Aerial View",
      "Student Lounge",
      "Library",
      "Conference Room",
      "Cafeteria"
    ];
    
    // Open modal when clicking on an image
    galleryItems.forEach((item, index) => {
      item.addEventListener('click', () => {
        currentIndex = parseInt(item.getAttribute('data-index'));
        modalImg.src = images[currentIndex];
        modalImg.alt = titles[currentIndex];
        modal.style.display = 'flex'; // Make sure modal is visible before adding active class
        setTimeout(() => {
          modal.classList.add('active');
        }, 10);
        document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
      });
    });
    
    // Close modal
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('active');
      setTimeout(() => {
        modal.style.display = 'none';
      }, 300);
      document.body.style.overflow = 'auto'; // Re-enable scrolling
    });
    
    // Next image
    nextBtn.addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % images.length;
      modalImg.src = images[currentIndex];
      modalImg.alt = titles[currentIndex];
    });
    
    // Previous image
    prevBtn.addEventListener('click', () => {
      currentIndex = (currentIndex - 1 + images.length) % images.length;
      modalImg.src = images[currentIndex];
      modalImg.alt = titles[currentIndex];
    });
    
    // Close modal when clicking outside the image
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
        setTimeout(() => {
          modal.style.display = 'none';
        }, 300);
        document.body.style.overflow = 'auto';
      }
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (!modal.classList.contains('active')) return;
      
      if (e.key === 'Escape') {
        modal.classList.remove('active');
        setTimeout(() => {
          modal.style.display = 'none';
        }, 300);
        document.body.style.overflow = 'auto';
      } else if (e.key === 'ArrowLeft') {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        modalImg.src = images[currentIndex];
        modalImg.alt = titles[currentIndex];
      } else if (e.key === 'ArrowRight') {
        currentIndex = (currentIndex + 1) % images.length;
        modalImg.src = images[currentIndex];
        modalImg.alt = titles[currentIndex];
      }
    });
    
    // Image loading animation
    galleryItems.forEach((item, index) => {
      const img = item.querySelector('img');
      if (img) { // Make sure img exists before trying to modify it
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.5s ease';
        
        img.onload = function() {
          setTimeout(() => {
            img.style.opacity = '1';
          }, 100 * index);
        };
        
        // Force load or set initial src if needed
        if (!img.src) {
          const itemIndex = parseInt(item.getAttribute('data-index'));
          if (!isNaN(itemIndex) && images[itemIndex]) {
            img.src = images[itemIndex];
          }
        }
        
        // In case the image was already loaded before we set onload
        if (img.complete) {
          setTimeout(() => {
            img.style.opacity = '1';
          }, 100 * index);
        }
      }
    });
});