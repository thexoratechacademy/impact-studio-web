// Cybersecurity Learning Dashboard - Interactive JavaScript

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const modules = document.querySelectorAll('.module');
  const lessons = document.querySelectorAll('.lesson');
  const lessonTitle = document.getElementById('lessonTitle');
  const lessonContent = document.getElementById('lessonContent');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const menuToggle = document.getElementById('menuToggle');
  const sidebar = document.querySelector('.sidebar');

  // Flatten all lessons into a single array for navigation
  const allLessons = Array.from(lessons);

  // Module Toggle Functionality
  modules.forEach(module => {
    const header = module.querySelector('.module-header');
    
    header.addEventListener('click', () => {
      // Close other modules (accordion style)
      modules.forEach(otherModule => {
        if (otherModule !== module) {
          otherModule.classList.remove('active');
        }
      });
      
      // Toggle current module
      module.classList.toggle('active');
    });
  });

  // Lesson Selection Functionality
  lessons.forEach(lesson => {
    // Handle both click and touch events for better mobile support
    const handleLessonClick = (e) => {
      e.preventDefault(); // Prevent default touch behavior
      
      if (lesson.classList.contains('locked')) return;
      
      // Update active lesson
      setActiveLesson(lesson);
      
      // Update content
      updateLessonContent(lesson);
      
      // On mobile, close sidebar after selecting
      if (window.innerWidth <= 1024 && sidebar) {
        sidebar.classList.remove('open');
        const overlay = document.getElementById('sidebarOverlay');
        if (overlay) {
          overlay.classList.remove('visible');
        }
      }
    };
    
    // Add click listener
    lesson.addEventListener('click', handleLessonClick);
    
    // Add touch listener for mobile devices
    lesson.addEventListener('touchend', handleLessonClick);
  });

  // Set Active Lesson
  function setActiveLesson(lesson) {
    lessons.forEach(l => l.classList.remove('active'));
    lesson.classList.add('active');
    
    // Auto-expand parent module
    const parentModule = lesson.closest('.module');
    if (parentModule) {
      // Close other modules first
      modules.forEach(m => {
        if (m !== parentModule) {
          m.classList.remove('active');
        }
      });
      parentModule.classList.add('active');
      
      // Scroll the module into view
      setTimeout(() => {
        parentModule.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 100);
    }
  }

  // Update Lesson Content
  function updateLessonContent(lesson) {
    const title = lesson.textContent;
    const content = lesson.getAttribute('data-content');
    
    // Add loading state for visual feedback
    if (lessonContent) {
      lessonContent.classList.add('loading');
    }
    
    // Simulate brief loading delay for better UX
    setTimeout(() => {
      // Update title with animation
      if (lessonTitle) {
        lessonTitle.style.opacity = '0';
        setTimeout(() => {
          lessonTitle.textContent = title;
          lessonTitle.style.opacity = '1';
        }, 200);
      }
      
      // Update content with detailed information
      const lessonIndex = allLessons.indexOf(lesson);
      const detailedContent = generateDetailedContent(lessonIndex, title, content);
      
      if (lessonContent) {
        lessonContent.innerHTML = detailedContent;
        // Remove loading state
        lessonContent.classList.remove('loading');
      }
      
      // Update navigation buttons
      updateNavigation();
      
      // Scroll to top of content
      const contentArea = document.querySelector('.content-area');
      if (contentArea) {
        contentArea.scrollTop = 0;
      }
    }, 300);
  }

  // Generate Detailed Content for Each Lesson
  function generateDetailedContent(index, title, briefContent) {
    return `
      <p>${briefContent}</p>
      
      <div class="content-section">
        <h3><i class="ri-checkbox-circle-line"></i> Learning Objectives</h3>
        <ul>
          <li>Understand key concepts and principles</li>
          <li>Learn practical skills and techniques</li>
          <li>Apply knowledge through examples</li>
          <li>Build confidence in the topic</li>
        </ul>
      </div>

      <div class="content-section">
        <h3><i class="ri-key-line"></i> Key Concepts</h3>
        <p><strong>${title}:</strong> This fundamental concept forms the foundation for modern cybersecurity practices. Mastering this topic will enable you to protect systems, networks, and data from cyber threats.</p>
        <p>Throughout this lesson, you'll explore real-world examples, security case studies, and common attack scenarios. The skills you develop here will be essential for your success as a cybersecurity professional.</p>
      </div>

      <div class="content-section">
        <h3><i class="ri-global-line"></i> Why This Matters</h3>
        <p>In today's threat landscape, understanding ${title.toLowerCase()} is crucial for organizational security. Companies rely on these skills to:</p>
        <ul>
          <li>Protect sensitive data and customer privacy</li>
          <li>Prevent costly data breaches and attacks</li>
          <li>Maintain regulatory compliance</li>
          <li>Safeguard critical infrastructure</li>
          <li>Build trust with stakeholders and customers</li>
        </ul>
      </div>

      <div class="content-section">
        <h3><i class="ri-lightbulb-line"></i> Practical Application</h3>
        <p>As you progress through this lesson, you'll work with real security scenarios and hands-on labs that mirror actual industry challenges. This practical approach ensures you can immediately apply what you learn to your work.</p>
        <p>Remember: The goal is not just to understand the theory, but to develop practical security skills that you can use to protect organizations and make the digital world safer for everyone.</p>
      </div>
    `;
  }

  // Update Navigation Buttons
  function updateNavigation() {
    const currentLesson = document.querySelector('.lesson.active');
    const currentIndex = allLessons.indexOf(currentLesson);
    
    // Previous button
    prevBtn.disabled = currentIndex === 0;
    
    // Next button
    nextBtn.disabled = currentIndex === allLessons.length - 1;
    
    // Update button text
    if (currentIndex > 0) {
      const prevLesson = allLessons[currentIndex - 1];
      prevBtn.textContent = `← ${prevLesson.textContent.substring(0, 20)}${prevLesson.textContent.length > 20 ? '...' : ''}`;
    } else {
      prevBtn.textContent = '← Previous';
    }
    
    if (currentIndex < allLessons.length - 1) {
      const nextLesson = allLessons[currentIndex + 1];
      nextBtn.textContent = `${nextLesson.textContent.substring(0, 20)}${nextLesson.textContent.length > 20 ? '...' : ''} →`;
    } else {
      nextBtn.textContent = 'Complete Course →';
    }
  }

  // Navigation Button Event Listeners
  prevBtn.addEventListener('click', () => {
    const currentLesson = document.querySelector('.lesson.active');
    const currentIndex = allLessons.indexOf(currentLesson);
    
    if (currentIndex > 0) {
      const prevLesson = allLessons[currentIndex - 1];
      setActiveLesson(prevLesson);
      updateLessonContent(prevLesson);
    }
  });

  nextBtn.addEventListener('click', () => {
    const currentLesson = document.querySelector('.lesson.active');
    const currentIndex = allLessons.indexOf(currentLesson);
    
    if (currentIndex < allLessons.length - 1) {
      const nextLesson = allLessons[currentIndex + 1];
      setActiveLesson(nextLesson);
      updateLessonContent(nextLesson);
    } else {
      // Course completion
      alert('🎉 Congratulations! You\'ve completed the Cybersecurity Mastery course!');
    }
  });

  // Mobile Menu Toggle
  menuToggle.addEventListener('click', () => {
    sidebar.classList.toggle('open');
  });

  // Close sidebar when clicking outside on mobile
  document.addEventListener('click', (e) => {
    if (window.innerWidth <= 1024) {
      if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
        sidebar.classList.remove('open');
      }
    }
  });

  // Initialize first lesson
  const firstLesson = document.querySelector('.lesson.active');
  if (firstLesson) {
    updateLessonContent(firstLesson);
  }

  // Add smooth scrolling
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Keyboard Navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' && !prevBtn.disabled) {
      prevBtn.click();
    } else if (e.key === 'ArrowRight' && !nextBtn.disabled) {
      nextBtn.click();
    }
  });
});
