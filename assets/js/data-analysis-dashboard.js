// Data Analysis Learning Dashboard - Interactive JavaScript

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
    lesson.addEventListener('click', () => {
      if (lesson.classList.contains('locked')) return;
      
      // Update active lesson
      setActiveLesson(lesson);
      
      // Update content
      updateLessonContent(lesson);
      
      // On mobile, close sidebar after selecting
      if (window.innerWidth <= 1024) {
        sidebar.classList.remove('open');
      }
    });
  });

  // Set Active Lesson
  function setActiveLesson(lesson) {
    lessons.forEach(l => l.classList.remove('active'));
    lesson.classList.add('active');
    
    // Auto-expand parent module
    const parentModule = lesson.closest('.module');
    if (parentModule) {
      parentModule.classList.add('active');
    }
  }

  // Update Lesson Content
  function updateLessonContent(lesson) {
    const title = lesson.textContent;
    const content = lesson.getAttribute('data-content');
    
    // Update title with animation
    lessonTitle.style.opacity = '0';
    setTimeout(() => {
      lessonTitle.textContent = title;
      lessonTitle.style.opacity = '1';
    }, 200);
    
    // Update content with detailed information
    const lessonIndex = allLessons.indexOf(lesson);
    const detailedContent = generateDetailedContent(lessonIndex, title, content);
    lessonContent.innerHTML = detailedContent;
    
    // Update navigation buttons
    updateNavigation();
    
    // Scroll to top of content
    document.querySelector('.content-area').scrollTop = 0;
  }

  // Generate Detailed Content for Each Lesson
  function generateDetailedContent(index, title, briefContent) {
    return `
      <p>${briefContent}</p>
      
      <div class="content-section">
        <h3>Learning Objectives</h3>
        <ul>
          <li>Understand key concepts and principles</li>
          <li>Learn practical skills and techniques</li>
          <li>Apply knowledge through examples</li>
          <li>Build confidence in the topic</li>
        </ul>
      </div>

      <div class="content-section">
        <h3>Key Concepts</h3>
        <p><strong>${title}:</strong> This fundamental concept forms the foundation for advanced data analysis techniques. Mastering this topic will enable you to work more effectively with data and extract meaningful insights.</p>
        <p>Throughout this lesson, you'll explore real-world applications, best practices, and common pitfalls to avoid. The skills you develop here will be essential for your success as a data analyst.</p>
      </div>

      <div class="content-section">
        <h3>Why This Matters</h3>
        <p>In today's data-driven business environment, understanding ${title.toLowerCase()} is crucial for making informed decisions. Organizations across industries rely on these skills to:</p>
        <ul>
          <li>Improve operational efficiency and reduce costs</li>
          <li>Identify new opportunities and revenue streams</li>
          <li>Enhance customer experience and satisfaction</li>
          <li>Make evidence-based strategic decisions</li>
          <li>Gain competitive advantage in the market</li>
        </ul>
      </div>

      <div class="content-section">
        <h3>Practical Application</h3>
        <p>As you progress through this lesson, you'll work with real datasets and scenarios that mirror actual business challenges. This hands-on approach ensures you can immediately apply what you learn to your work.</p>
        <p>Remember: The goal is not just to understand the theory, but to develop practical skills that you can use to solve real problems and deliver value to organizations.</p>
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
      alert('🎉 Congratulations! You\'ve completed the Data Analysis Mastery course!');
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
