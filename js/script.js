document.addEventListener("DOMContentLoaded", () => {
  // Custom menu toggle that changes to a hamburger menu on scroll
  const headerContainer = document.querySelector(".header-container");
  const headerMobileContainer = document.querySelector(
    ".header-mobile-container"
  );
  const menuContainer = document.querySelector(".menu-container");
  const navMobile = document.querySelector(".nav-mobile");
  const navMobileClose = document.querySelector(".nav-mobile-close");
  let isMenuOpen = false;

  // Set initial states
  gsap.set(navMobile, { x: "100%", visibility: "hidden", display: "none" });

  function handleResize() {
    if (window.innerWidth < 768) {
      gsap.set(headerMobileContainer, { visibility: "visible", zIndex: 1 });
      gsap.set(menuContainer, { visibility: "visible", display: "flex" });
    } else {
      gsap.set(headerMobileContainer, { visibility: "hidden", zIndex: -1 });
    }
  }

  // window.addEventListener("resize", handleResize);
  handleResize(); // Initial setup

  // Toggle the hamburger menu
  menuContainer.addEventListener("click", () => {
    if (isMenuOpen) {
      closeMenu();
    } else {
      openMenu();
    }
    isMenuOpen = !isMenuOpen;
  });

  // Close the mobile menu when clicking the close button
  navMobileClose.addEventListener("click", () => {
    closeMenu();
    isMenuOpen = false;
  });

  function openMenu() {
    gsap.to(navMobile, {
      x: "0%",
      visibility: "visible",
      duration: 0.5,
      ease: "power3.out",
      display: "flex",
    });
    gsap.to(menuContainer, {
      visibility: "hidden",
      duration: 0.3,
      ease: "power3.in",
      onComplete: () => gsap.set(menuContainer, { display: "none" }),
    });
  }

  function closeMenu() {
    gsap.to(navMobile, {
      x: "100%",
      duration: 0.5,
      ease: "power3.in",
      onComplete: () => {
        gsap.set(navMobile, {
          visibility: "hidden",
          display: "none",
        });
      },
    });
    gsap.set(menuContainer, { display: "flex" });
    gsap.to(menuContainer, {
      visibility: "visible",
      duration: 0.3,
      ease: "power3.out",
    });
  }

  // Scroll-triggered opacity control for navigation
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.create({
    trigger: document.documentElement,
    start: 0,
    end: window.innerHeight,
    scrub: true,
    onLeave: () => {
      if (!isMenuOpen) {
        gsap.to(headerContainer, {
          visibility: "hidden",
          duration: 0.3,
          ease: "power3.out",
          onComplete: () => gsap.set(headerContainer, { zIndex: -1 }),
        });
        gsap.set(headerMobileContainer, { visibility: "hidden", zIndex: 1 });
        gsap.fromTo(
          headerMobileContainer,
          { y: -20, visibility: "hidden" },
          { y: 0, visibility: "visible", duration: 0.3, ease: "power3.out" }
        );
        gsap.to(menuContainer, {
          visibility: "visible",
          duration: 0.3,
          ease: "power3.out",
        });
      }
    },
    onEnterBack: () => {
      if (!isMenuOpen) {
        gsap.set(headerContainer, { zIndex: 1 });
        gsap.to(headerContainer, {
          visibility: "visible",
          duration: 0.3,
          ease: "power3.out",
        });
        gsap.to(headerMobileContainer, {
          y: -20,
          visibility: "hidden",
          duration: 0.3,
          ease: "power3.in",
          onComplete: () => {
            gsap.set(headerMobileContainer, { zIndex: -1 });
          },
        });
        gsap.to(menuContainer, {
          visibility: "hidden",
          duration: 0.3,
          ease: "power3.in",
        });
      }
    },
  });

  // Infinite loop animation for the hero section (marquee effect)
  const scrollers = document.querySelectorAll(".scroller");

  // If a user hasn't opted in for reduced motion, then we add the animation
  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    addAnimation();
  }

  function addAnimation() {
    scrollers.forEach((scroller) => {
      // add data-animated="true" to every `.scroller` on the page
      scroller.setAttribute("data-animated", true);

      // Make an array from the elements within `.scroller-inner`
      const scrollerInner = scroller.querySelector(".scroller-inner");
      const scrollerContent = Array.from(scrollerInner.children);

      // For each item in the array, clone it
      // add aria-hidden to it
      // add it into the `.scroller-inner`
      scrollerContent.forEach((item) => {
        const duplicatedItem = item.cloneNode(true);
        duplicatedItem.setAttribute("aria-hidden", true);
        scrollerInner.appendChild(duplicatedItem);
      });
    });
  }

  // Sliding animation for the twitter section
  const slider = document.querySelector(".twitter-slider");
  const slides = document.querySelectorAll(".twitter-slide");
  const sliderNav = document.querySelector(".twitter-slider-nav");
  const nextButton = document.querySelectorAll(
    ".twitter-action-icon.right-arrow"
  );
  const prevButton = document.querySelectorAll(
    ".twitter-action-icon.left-arrow"
  );
  let currentSlide = 0;
  let dots = [];

  // Set up initial positions
  gsap.set(slider, { xPercent: 0 });

  function showSlide(index) {
    gsap.to(slider, {
      duration: 0.7,
      xPercent: -index * 100,
      ease: "power2.inOut",
    });

    dots.forEach((dot, i) => {
      if (i === index) {
        dot.classList.add("active");
        dot.setAttribute("aria-selected", "true");
      } else {
        dot.classList.remove("active");
        dot.setAttribute("aria-selected", "false");
      }
    });

    nextButton.forEach((button) => {
      button.parentElement.parentElement.classList.toggle(
        "active",
        index === slides.length - 1
      );
    });
    prevButton.forEach((button) => {
      button.parentElement.parentElement.classList.toggle(
        "active",
        index === 0
      );
    });
    currentSlide = index;
  }

  function generateDots() {
    sliderNav.innerHTML = ""; // Clear existing dots
    dots = []; // Reset the dots array
    slides.forEach((slide, index) => {
      const dot = document.createElement("button");
      dot.classList.add("twitter-slider-dot");
      dot.setAttribute("aria-label", `Slide ${index + 1}`);
      dot.setAttribute("aria-controls", "twitter-slider");
      dot.setAttribute("aria-selected", index === 0);
      dot.setAttribute("tabindex", 0);
      dot.addEventListener("click", () => showSlide(index));
      sliderNav.appendChild(dot);
      dots.push(dot); // Add the dot to our array
    });
  }

  generateDots();
  showSlide(0); // Show the first slide

  function nextSlide() {
    showSlide((currentSlide + 1) % slides.length);
  }

  function prevSlide() {
    showSlide((currentSlide - 1 + slides.length) % slides.length);
  }

  // Add touch events for mobile swiping
  let touchStartX = 0;
  let touchEndX = 0;

  slider.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX;
  });

  slider.addEventListener("touchend", (e) => {
    touchEndX = e.changedTouches[0].screenX;
    if (touchStartX - touchEndX > 50) {
      nextSlide();
    } else if (touchEndX - touchStartX > 50) {
      prevSlide();
    }
  });

  // Add click events for navigation arrows on desktop
  nextButton.forEach((button) => {
    button.addEventListener("click", nextSlide);
  });
  prevButton.forEach((button) => {
    button.addEventListener("click", prevSlide);
  });

  // Add click events for navigation dots
  sliderNav.addEventListener("click", (event) => {
    if (event.target.classList.contains("twitter-slider-dot")) {
      const index = Array.from(event.target.parentNode.children).indexOf(
        event.target
      );
      showSlide(index);
    }
  });

  // Add keyboard events for navigation
  document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight") {
      nextSlide();
    } else if (event.key === "ArrowLeft") {
      prevSlide();
    }
  });

  // Hover effect for the repository section
  const filters = document.querySelectorAll(".repository-filter");

  filters.forEach((filter) => {
    const image = filter.querySelector("img:first-child");

    // Hover in timeline
    const hoverInTimeline = gsap.timeline({ paused: true });

    hoverInTimeline.to(image, {
      opacity: 1,
      scale: 1,
      y: -20,
      duration: 0.3,
      ease: "power2.out",
    });

    // Hover out timeline (for smooth exit)
    const hoverOutTimeline = gsap.timeline({ paused: true });

    hoverOutTimeline.to(image, {
      opacity: 0,
      scale: 0.75,
      y: 0,
      duration: 0.3,
      ease: "power2.in",
    });

    // Trigger animation on hover
    filter.addEventListener("mouseenter", () => {
      hoverOutTimeline.pause(); // Stop the exit animation if still running
      hoverInTimeline.restart();
    });

    filter.addEventListener("mouseleave", () => {
      hoverInTimeline.pause(); // Stop the entrance animation if still running
      hoverOutTimeline.restart();
    });
  });
});
