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
        const sliderWrapper = document.getElementById('sliderWrapper');
        const sliderContainer = document.querySelector('.slider-container');
        const cards = document.querySelectorAll('.slider-card');
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        const indicators = document.getElementById('indicators');
        
        let cardWidth = cards[0].offsetWidth;
        let currentIndex = 0;
        let maxIndex = 0;
        let scrollPosition = 0;
        let isScrolling = false;
        let scrollTimeout = null;
        
        // Calculate how many cards to display based on screen width
        function updateSliderDimensions() {
            cardWidth = cards[0].offsetWidth;
            const viewportWidth = window.innerWidth;
            
            let visibleCards = 1;
            if (viewportWidth >= 1024) {
                visibleCards = 3;
            } else if (viewportWidth >= 768) {
                visibleCards = 2;
            }
            
            maxIndex = Math.max(0, cards.length - visibleCards);
            
            // Ensure current index is still valid after resize
            currentIndex = Math.min(currentIndex, maxIndex);
            
            updateSliderPosition();
            updateIndicators();
        }
        
        // Create indicators
        function createIndicators() {
            indicators.innerHTML = '';
            for (let i = 0; i <= maxIndex; i++) {
                const indicator = document.createElement('div');
                indicator.classList.add('indicator');
                if (i === currentIndex) {
                    indicator.classList.add('active');
                }
                indicator.addEventListener('click', () => {
                    currentIndex = i;
                    updateSliderPosition();
                    updateIndicators();
                });
                indicators.appendChild(indicator);
            }
        }
        
        // Update indicators based on current index
        function updateIndicators() {
            const indicatorDots = document.querySelectorAll('.indicator');
            indicatorDots.forEach((dot, index) => {
                if (index === currentIndex) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        }
        
        // Update slider position
        function updateSliderPosition(animation = true) {
            if (animation) {
                sliderWrapper.style.transition = 'transform 0.3s ease-out';
            } else {
                sliderWrapper.style.transition = 'none';
            }
            scrollPosition = -currentIndex * cardWidth;
            sliderWrapper.style.transform = `translateX(${scrollPosition}px)`;
        }
        
        // Initialize
        updateSliderDimensions();
        createIndicators();
        
        // Event listeners
        window.addEventListener('resize', function() {
            updateSliderDimensions();
            createIndicators();
        });
        
        prevBtn.addEventListener('click', function() {
            if (currentIndex > 0) {
                currentIndex--;
                updateSliderPosition();
                updateIndicators();
                stopAutoSlide();
                setTimeout(startAutoSlide, 2000);
            }
        });
        
        nextBtn.addEventListener('click', function() {
            if (currentIndex < maxIndex) {
                currentIndex++;
                updateSliderPosition();
                updateIndicators();
                stopAutoSlide();
                setTimeout(startAutoSlide, 2000);
            }
        });
        
        // FIXED WHEEL EVENT - Now properly handles vertical scrolling
        sliderContainer.addEventListener('wheel', function(e) {
            // Check if this is primarily horizontal scrolling
            // If deltaX is significantly larger than deltaY, we handle it as horizontal
            // Otherwise, allow normal page vertical scrolling
            if (Math.abs(e.deltaX) > Math.abs(e.deltaY) * 1.5) {
                e.preventDefault(); // Only prevent default for horizontal scrolls
                
                stopAutoSlide();
                isScrolling = true;
                
                // Move slider based on deltaX (horizontal scrolling)
                let newPosition = scrollPosition - e.deltaX;
                
                // Apply boundaries
                const minScroll = -maxIndex * cardWidth;
                const maxScroll = 0;
                
                if (newPosition < minScroll) {
                    newPosition = minScroll;
                } else if (newPosition > maxScroll) {
                    newPosition = maxScroll;
                }
                
                // Apply the transform with minimal latency
                sliderWrapper.style.transition = 'none';
                sliderWrapper.style.transform = `translateX(${newPosition}px)`;
                scrollPosition = newPosition;
                
                // Debounce the snap-to-slide functionality
                clearTimeout(scrollTimeout);
                scrollTimeout = setTimeout(function() {
                    isScrolling = false;
                    
                    // Calculate which slide we're closest to
                    currentIndex = Math.round(Math.abs(scrollPosition) / cardWidth);
                    currentIndex = Math.max(0, Math.min(currentIndex, maxIndex));
                    
                    // Snap to that slide
                    updateSliderPosition();
                    updateIndicators();
                    
                    // Resume auto-slide after delay
                    setTimeout(startAutoSlide, 2000);
                }, 150);
            }
            // If it's more vertical than horizontal, do nothing and let the page scroll naturally
        }, { passive: false });
        
        // DIRECT MOUSE/TOUCH DRAGGING
        let isDragging = false;
        let startX = 0;
        let startY = 0;
        let startScrollPosition = 0;
        let lastTouchTime = 0;
        let isHorizontalDrag = null;
        
        function handleDragStart(e) {
            // Store touch time for tap detection
            lastTouchTime = new Date().getTime();
            
            startX = e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
            startY = e.type.includes('mouse') ? e.pageY : e.touches[0].clientY;
            
            // We'll determine direction during the first move event
            isHorizontalDrag = null;
            
            // Start tracking this touch
            if (e.type.includes('mouse')) {
                document.addEventListener('mousemove', handleDragMove, { passive: false });
                document.addEventListener('mouseup', handleDragEnd, { passive: false });
            } else {
                document.addEventListener('touchmove', handleDragMove, { passive: false });
                document.addEventListener('touchend', handleDragEnd, { passive: false });
            }
            
            // Record starting position but don't commit to dragging yet
            startScrollPosition = scrollPosition;
            
            // Only prevent default for mouse events
            if (e.type.includes('mouse')) {
                e.preventDefault();
            }
        }
        
        function handleDragMove(e) {
            const x = e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
            const y = e.type.includes('mouse') ? e.pageY : e.touches[0].clientY;
            
            const diffX = x - startX;
            const diffY = y - startY;
            
            // If we haven't determined direction yet, do so now
            if (isHorizontalDrag === null) {
                // If movement is very small, don't decide yet
                if (Math.abs(diffX) < 5 && Math.abs(diffY) < 5) {
                    return;
                }
                
                // Determine if this is primarily horizontal or vertical movement
                isHorizontalDrag = Math.abs(diffX) > Math.abs(diffY);
                
                // If it's vertical movement, don't interfere with page scrolling
                if (!isHorizontalDrag) {
                    isDragging = false;
                    
                    // Clean up event listeners
                    if (e.type.includes('mouse')) {
                        document.removeEventListener('mousemove', handleDragMove);
                        document.removeEventListener('mouseup', handleDragEnd);
                    } else {
                        document.removeEventListener('touchmove', handleDragMove);
                        document.removeEventListener('touchend', handleDragEnd);
                    }
                    return;
                }
                
                // Now we're committed to horizontal dragging
                isDragging = true;
                stopAutoSlide();
                sliderWrapper.style.transition = 'none';
            }
            
            // If this is vertical scrolling, exit and let the browser handle it
            if (!isHorizontalDrag) {
                return;
            }
            
            // At this point, we know it's horizontal dragging
            
            // Calculate new position
            let newPos = startScrollPosition + diffX;
            
            // Add resistance at edges
            const minScroll = -maxIndex * cardWidth;
            if (newPos > 0) {
                newPos = newPos / 3; // Resistance at start
            } else if (newPos < minScroll) {
                const overScroll = newPos - minScroll;
                newPos = minScroll + (overScroll / 3); // Resistance at end
            }
            
            // Apply new position
            scrollPosition = newPos;
            sliderWrapper.style.transform = `translateX(${scrollPosition}px)`;
            
            // Only prevent default for horizontal drags to enable vertical scrolling
            if (isHorizontalDrag) {
                e.preventDefault();
            }
        }
        
        function handleDragEnd(e) {
            // Clean up event listeners
            if (e.type.includes('mouse')) {
                document.removeEventListener('mousemove', handleDragMove);
                document.removeEventListener('mouseup', handleDragEnd);
            } else {
                document.removeEventListener('touchmove', handleDragMove);
                document.removeEventListener('touchend', handleDragEnd);
            }
            
            // If this wasn't a horizontal drag, exit
            if (!isDragging || !isHorizontalDrag) {
                isDragging = false;
                isHorizontalDrag = null;
                return;
            }
            
            isDragging = false;
            isHorizontalDrag = null;
            
            const diff = scrollPosition - startScrollPosition;
            
            // Determine if we should change slides based on drag distance
            if (Math.abs(diff) > cardWidth / 3) {
                if (diff > 0) {
                    // Dragged right
                    currentIndex = Math.max(0, currentIndex - 1);
                } else {
                    // Dragged left
                    currentIndex = Math.min(maxIndex, currentIndex + 1);
                }
            }
            
            // Snap to nearest slide
            updateSliderPosition();
            updateIndicators();
            
            // Resume auto-slide after delay
            setTimeout(startAutoSlide, 2000);
            
            // Prevent default only for mouse events
            if (e.type.includes('mouse')) {
                e.preventDefault();
            }
            
            // If this was a significant drag, prevent click events
            if (Math.abs(diff) > 5) {
                e.stopPropagation();
            }
        }
        
        // Mouse events - attach only to slider
        sliderWrapper.addEventListener('mousedown', handleDragStart);
        
        // Touch events - attach only to slider
        sliderWrapper.addEventListener('touchstart', handleDragStart, { passive: true });
        
        // Auto-slide functionality
        let autoSlideInterval;
        
        function startAutoSlide() {
            stopAutoSlide(); // Clear any existing intervals
            autoSlideInterval = setInterval(() => {
                if (currentIndex < maxIndex) {
                    currentIndex++;
                } else {
                    currentIndex = 0;
                }
                updateSliderPosition();
                updateIndicators();
            }, 5000); // Change slides every 5 seconds
        }
        
        function stopAutoSlide() {
            clearInterval(autoSlideInterval);
        }
        
        // Start auto-sliding
        startAutoSlide();
        
        // Stop auto-sliding when user interacts with the slider
        sliderContainer.addEventListener('mouseenter', stopAutoSlide);
        
        // Resume auto-sliding when user stops interacting
        sliderContainer.addEventListener('mouseleave', function() {
            if (!isDragging && !isScrolling) {
                startAutoSlide();
            }
        });
        
        // Ensure the slider is responsive to orientation changes
        window.addEventListener('orientationchange', function() {
            // Small delay to ensure accurate dimensions after rotation
            setTimeout(updateSliderDimensions, 200);
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', function(e) {
            if (e.key === 'ArrowLeft') {
                if (currentIndex > 0) {
                    currentIndex--;
                    updateSliderPosition();
                    updateIndicators();
                    stopAutoSlide();
                    setTimeout(startAutoSlide, 2000);
                }
            } else if (e.key === 'ArrowRight') {
                if (currentIndex < maxIndex) {
                    currentIndex++;
                    updateSliderPosition();
                    updateIndicators();
                    stopAutoSlide();
                    setTimeout(startAutoSlide, 2000);
                }
            }
        });
    });
