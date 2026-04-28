// Mobile App Development Learning Dashboard - Interactive JavaScript

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const modules = document.querySelectorAll('.module');
  const lessons = document.querySelectorAll('.lesson');
  const lessonTitle = document.getElementById('lessonTitle');
  const lessonContent = document.getElementById('lessonContent');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
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
    lesson.addEventListener('click', () => {
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
    });
  });

  // Set Active Lesson
  function setActiveLesson(lesson) {
    if (!lesson) return;
    
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
      
      // Update breadcrumb to show current module
      const moduleNum = parentModule.getAttribute('data-module');
      const breadcrumbModule = document.getElementById('breadcrumbModule');
      if (breadcrumbModule) {
        breadcrumbModule.textContent = `Module ${moduleNum}`;
      }
      
      // Scroll the module into view
      setTimeout(() => {
        parentModule.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 100);
    }
  }

  // Update Lesson Content
  function updateLessonContent(lesson) {
    if (!lesson) return;
    
    const title = lesson.textContent;
    const content = lesson.getAttribute('data-content');
    
    // Update Lesson Badge (Lesson X of Y)
    const parentModule = lesson.closest('.module');
    if (parentModule) {
      const moduleLessons = Array.from(parentModule.querySelectorAll('.lesson'));
      const lessonIndexInModule = moduleLessons.indexOf(lesson) + 1;
      const totalLessonsInModule = moduleLessons.length;
      const lessonBadge = document.getElementById('lessonBadge');
      if (lessonBadge) {
        lessonBadge.textContent = `Lesson ${lessonIndexInModule} of ${totalLessonsInModule}`;
      }
    }
    
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
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 300);
  }

  // Generate Detailed Content for Each Lesson
  function generateDetailedContent(index, title, briefContent) {
    return `
      <p>${briefContent}</p>
      
      <div class="content-section">
        <h3><i class="ri-checkbox-circle-line"></i> Learning Objectives</h3>
        <ul>
          <li>Understand key concepts of ${title}</li>
          <li>Learn native and cross-platform techniques</li>
          <li>Build high-performance mobile UI</li>
          <li>Master modern mobile standards</li>
        </ul>
      </div>

      <div class="content-section">
        <h3><i class="ri-key-line"></i> Key Concepts</h3>
        <p><strong>${title}:</strong> This is a fundamental concept in modern mobile development. Mastering this will allow you to build more dynamic, efficient, and user-friendly mobile applications.</p>
      </div>

      <div class="content-section">
        <h3><i class="ri-global-line"></i> Mobile Ecosystem</h3>
        <p>In today's mobile-first world, understanding ${title.toLowerCase()} is essential for creating high-performance applications that meet user expectations across different platforms.</p>
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
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      const currentLesson = document.querySelector('.lesson.active');
      const currentIndex = allLessons.indexOf(currentLesson);
      
      if (currentIndex > 0) {
        const prevLesson = allLessons[currentIndex - 1];
        setActiveLesson(prevLesson);
        updateLessonContent(prevLesson);
      }
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      const currentLesson = document.querySelector('.lesson.active');
      const currentIndex = allLessons.indexOf(currentLesson);
      
      if (currentIndex < allLessons.length - 1) {
        const nextLesson = allLessons[currentIndex + 1];
        setActiveLesson(nextLesson);
        updateLessonContent(nextLesson);
      } else {
        alert('🎉 Congratulations! You\'ve completed the Mobile App Development course!');
      }
    });
  }

  // Initialize first lesson
  const firstLesson = document.querySelector('.lesson.active');
  if (firstLesson) {
    updateLessonContent(firstLesson);
  }

  // Keyboard Navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' && !prevBtn.disabled) {
      prevBtn.click();
    } else if (e.key === 'ArrowRight' && !nextBtn.disabled) {
      nextBtn.click();
    }
  });
});
