/**
 * Ahmad Dawood - Portfolio Main Interactive Application Engine
 * Handles navigation, animations, filters, modals, cost estimator, forms & toast alerts
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initAnimatedCounters();
  initProjectFilters();
  initCaseStudyModal();
  initCertifications();
  initCostEstimator();
  initTestimonialSlider();
  initContactForm();
  initLiveClock();
  initLucideIcons();
});

// 1. Navigation & Scrollspy
function initNavigation() {
  const mobileToggle = document.getElementById('mobile-menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');
  const navbar = document.getElementById('main-navbar');

  if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
      const icon = mobileToggle.querySelector('i');
      if (icon) {
        if (mobileMenu.classList.contains('hidden')) {
          icon.setAttribute('data-lucide', 'menu');
        } else {
          icon.setAttribute('data-lucide', 'x');
        }
        if (window.lucide) window.lucide.createIcons();
      }
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        const icon = mobileToggle.querySelector('i');
        if (icon) {
          icon.setAttribute('data-lucide', 'menu');
          if (window.lucide) window.lucide.createIcons();
        }
      });
    });
  }

  // Sticky Navbar Scroll state
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('bg-slate-950/90', 'backdrop-blur-md', 'border-b', 'border-sky-500/20', 'shadow-lg', 'shadow-black/40');
    } else {
      navbar.classList.remove('bg-slate-950/90', 'border-sky-500/20', 'shadow-lg');
    }
  });

  // Section Scrollspy
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollPosition = window.pageYOffset + 160;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('text-sky-400', 'font-semibold');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('text-sky-400', 'font-semibold');
      }
    });
  });
}

// 2. Animated Statistic Number Counters
function initAnimatedCounters() {
  const counterElements = document.querySelectorAll('.stat-counter');
  let animated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        counterElements.forEach(counter => {
          const target = parseInt(counter.dataset.target, 10);
          const prefix = counter.dataset.prefix || '';
          const suffix = counter.dataset.suffix || '';
          const duration = 1800;
          const stepTime = 25;
          const steps = duration / stepTime;
          const increment = target / steps;
          let current = 0;

          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              counter.textContent = `${prefix}${target}${suffix}`;
              clearInterval(timer);
            } else {
              counter.textContent = `${prefix}${Math.floor(current)}${suffix}`;
            }
          }, stepTime);
        });
      }
    });
  }, { threshold: 0.25 });

  const statsSection = document.getElementById('stats-banner');
  if (statsSection) observer.observe(statsSection);
}

// 3. Project Filter System
function initProjectFilters() {
  const filterButtons = document.querySelectorAll('.project-filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      filterButtons.forEach(b => b.classList.remove('active'));
      e.currentTarget.classList.add('active');

      const filterValue = e.currentTarget.dataset.filter;

      projectCards.forEach(card => {
        const categories = card.dataset.categories ? card.dataset.categories.split(' ') : [];
        if (filterValue === 'all' || categories.includes(filterValue)) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });
}

// 4. Case Study Details Modal
const caseStudiesData = {
  'pbi-sales': {
    title: 'Enterprise Multi-Region Sales & Margin Intelligence',
    client: 'Global E-Commerce & Retail Distributor',
    tech: 'Power BI • DAX • Star Schema • PostgreSQL ETL',
    duration: '3 Weeks Delivery',
    metrics: ['+28.4% Revenue Growth Tracked', '12h Weekly Reporting Eliminated', '100% Data Reconciliation'],
    problem: 'The client suffered from disconnected regional spreadsheets across North America, EMEA, and APAC. Executive leadership lacked real-time visibility into product margin fluctuations, inventory turnover bottlenecks, and commission calculations.',
    solution: 'Engineered a centralized Star Schema data model ingesting historical transactions via Power Query. Developed 35+ custom DAX measures for Time-Intelligence (YTD, MoM, YoY), dynamic target vs. actual variance scorecards, and row-level security (RLS) for branch managers.',
    architecture: 'PostgreSQL Relational DB -> Power Query Data Sanitization -> Star Schema (FactSales, DimProduct, DimRegion, DimCalendar) -> DAX Measures -> Executive Dashboard'
  },
  'excel-payroll': {
    title: 'Automated Global Payroll, Attendance & Invoice Audit',
    client: 'International Staffing & Operations Agency',
    tech: 'Microsoft Excel • VBA Macros • Power Query • Dynamic Arrays',
    duration: '2 Weeks Delivery',
    metrics: ['150+ Weekly Invoices Processed', '100% Audit Accuracy Rate', '18 Hours Saved Weekly'],
    problem: 'Manual processing of 150+ weekly vendor invoices and biometric clock-in logs led to frequent calculation discrepancies, delayed payouts, and chaotic overtime reconciliations across international time zones.',
    solution: 'Designed an end-to-end automated Excel master system utilizing advanced dynamic array formulas (XLOOKUP, FILTER, LAMBDA) combined with custom VBA macro routines to validate raw attendance logs, cross-reference contract rates, and auto-generate PDF pay stubs.',
    architecture: 'Biometric CSV / PDF Exports -> Power Query Automated Deduplication & Time Normalization -> Formula Engine -> One-Click VBA PDF Paystub & Audit Report Generation'
  },
  'sql-retention': {
    title: 'High-Scale E-Commerce SQL Warehouse & Cohort Analysis',
    client: 'Direct-to-Consumer Brand (500K+ Customers)',
    tech: 'PostgreSQL • Window Functions • CTEs • Index Optimization',
    duration: '3 Weeks Delivery',
    metrics: ['71x Query Speedup (3.4s to 48ms)', '500K+ Transactions Indexed', '14.2% Churn Reduction Identified'],
    problem: 'Legacy unindexed SQL queries were timing out under 500,000+ transaction rows. Marketing and retention teams were unable to compute rolling 30-day customer retention cohorts or identify high-value repeat buyers in real-time.',
    solution: 'Restructured the database schema with B-Tree indexes, composite partitioning, and modular Common Table Expressions (CTEs). Implemented sophisticated analytical window functions (LEAD, LAG, NTILE, ROW_NUMBER) to calculate customer lifetime value (LTV) and churn probabilities.',
    architecture: 'PostgreSQL Raw Ledger -> Partitioned Tables -> Materialized Views with Window Functions -> Fast Indexed API Endpoints'
  },
  'python-churn': {
    title: 'Customer RFM Segmentation & Predictive Churn Pipeline',
    client: 'SaaS Subscription Platform',
    tech: 'Python • Pandas • Scikit-Learn • Streamlit • Seaborn',
    duration: '4 Weeks Delivery',
    metrics: ['89.4% Churn Prediction Accuracy', '$42,000 Saved at-risk ARR', '6 Actionable RFM Segments'],
    problem: 'Subscription churn was quietly rising, but marketing lacked early warning indicators to proactively target subscribers before renewal dates arrived.',
    solution: 'Built a programmatic machine learning pipeline in Python. Cleaned and normalized telemetry event logs with Pandas/NumPy, engineered Recency-Frequency-Monetary (RFM) features, and trained a Random Forest classification model served via an interactive Streamlit UI.',
    architecture: 'API Activity Telemetry -> Pandas Feature Engineering -> Scikit-Learn Classification Model -> Streamlit Interactive Dashboard'
  },
  'excel-pnl': {
    title: 'Automated Financial Statement P&L & Variance Forecasting',
    client: 'Mid-Market Logistics Corporation',
    tech: 'Advanced Excel • Financial Modeling • Scenario Slicers',
    duration: '10 Days Delivery',
    metrics: ['Zero Calculation Discrepancies', 'Real-Time EBITDA Sensitivity', '100% C-Suite Presentation Ready'],
    problem: 'Finance managers spent days manually consolidating departmental spreadsheets to produce monthly P&L statements, with no dynamic way to simulate inflation, fuel price shocks, or wage increases.',
    solution: 'Constructed an executive financial model featuring automated dynamic waterfall charts, budget variance analyses, and a three-scenario sensitivity matrix (Worst, Base, Best case) driven by dynamic sliders.',
    architecture: 'Raw Ledger GL Feeds -> Dynamic Aggregation Tables -> Sensitivity Analysis Matrix -> C-Suite Dashboard'
  },
  'python-scraper': {
    title: 'Automated Web Price Scraper & Catalog Market Intelligence',
    client: 'B2B Wholesale Marketplace',
    tech: 'Python • Selenium • BeautifulSoup • SQLite • Automated Email Alerts',
    duration: '2 Weeks Delivery',
    metrics: ['25,000+ Daily Competitor SKUs Monitored', '100% Automated Workflow', '3.8x Faster Pricing Response'],
    problem: 'The client was losing deals because competitor pricing fluctuated daily across three major wholesale platforms, and manual checks were too slow to keep up.',
    solution: 'Engineered a resilient headless web scraper using Selenium and BeautifulSoup with proxy rotation, anti-bot bypass, automated schema validation, and SQLite data persistence. Programmed automated morning email digests highlighting competitor price drops.',
    architecture: 'Target Websites -> Headless Scraper -> Data Normalizer -> SQLite Database -> Automated PDF & Email Dispatch'
  }
};

function initCaseStudyModal() {
  const modal = document.getElementById('case-study-modal');
  const closeBtn = document.getElementById('case-study-modal-close');
  const launchBtns = document.querySelectorAll('.btn-case-study');

  if (!modal) return;

  launchBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const studyKey = e.currentTarget.dataset.study;
      const data = caseStudiesData[studyKey];
      if (!data) return;

      document.getElementById('cs-modal-title').textContent = data.title;
      document.getElementById('cs-modal-client').textContent = data.client;
      document.getElementById('cs-modal-tech').textContent = data.tech;
      document.getElementById('cs-modal-duration').textContent = data.duration;
      document.getElementById('cs-modal-problem').textContent = data.problem;
      document.getElementById('cs-modal-solution').textContent = data.solution;
      document.getElementById('cs-modal-arch').textContent = data.architecture;

      const metricsList = document.getElementById('cs-modal-metrics');
      if (metricsList) {
        metricsList.innerHTML = data.metrics.map(m => `
          <div class="flex items-center gap-2.5 p-3 rounded-lg bg-sky-950/40 border border-sky-500/20">
            <span class="text-sky-400 font-bold text-lg">⚡</span>
            <span class="text-sm font-semibold text-slate-100">${m}</span>
          </div>
        `).join('');
      }

      modal.classList.add('active');
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => modal.classList.remove('active'));
  }
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.remove('active');
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      modal.classList.remove('active');
      const dashModal = document.getElementById('dashboard-modal');
      if (dashModal) dashModal.classList.remove('active');
      const certModal = document.getElementById('cert-modal');
      if (certModal) certModal.classList.remove('active');
    }
  });
}

// 5. Certifications Filter & Verification Modal
function initCertifications() {
  const filterBtns = document.querySelectorAll('.cert-filter-btn');
  const certCards = document.querySelectorAll('.cert-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      filterBtns.forEach(b => b.classList.remove('active'));
      e.currentTarget.classList.add('active');
      const category = e.currentTarget.dataset.category;

      certCards.forEach(card => {
        if (category === 'all' || card.dataset.category === category) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Cert Card Click to view credential modal
  const certModal = document.getElementById('cert-modal');
  const certClose = document.getElementById('cert-modal-close');

  certCards.forEach(card => {
    card.addEventListener('click', () => {
      const title = card.querySelector('h4')?.textContent || 'Verified Certification';
      const issuer = card.querySelector('.cert-issuer')?.textContent || 'Accredited Issuer';
      const credentialId = card.dataset.credential || 'CERT-VERIFIED-2025';
      const skills = card.dataset.skills || 'Data Analytics, Modeling, Business Intelligence';

      document.getElementById('cert-modal-title').textContent = title;
      document.getElementById('cert-modal-issuer').textContent = issuer;
      document.getElementById('cert-modal-id').textContent = credentialId;
      document.getElementById('cert-modal-skills').textContent = skills;

      if (certModal) certModal.classList.add('active');
    });
  });

  if (certClose && certModal) {
    certClose.addEventListener('click', () => certModal.classList.remove('active'));
    certModal.addEventListener('click', (e) => {
      if (e.target === certModal) certModal.classList.remove('active');
    });
  }
}

// 6. Interactive Project Cost & Timeline Estimator
function initCostEstimator() {
  const serviceTypeSelect = document.getElementById('est-service-type');
  const dataSizeSelect = document.getElementById('est-data-size');
  const speedSelect = document.getElementById('est-speed');
  const priceDisplay = document.getElementById('est-price-display');
  const timeDisplay = document.getElementById('est-time-display');
  const applyBtn = document.getElementById('est-apply-btn');

  if (!serviceTypeSelect || !priceDisplay) return;

  function calculateEstimate() {
    let basePrice = 120;
    let baseDays = 3;

    const service = serviceTypeSelect.value;
    const dataSize = dataSizeSelect.value;
    const speed = speedSelect.value;

    if (service === 'dashboard') { basePrice = 180; baseDays = 4; }
    else if (service === 'cleaning') { basePrice = 100; baseDays = 2; }
    else if (service === 'sql') { basePrice = 160; baseDays = 3; }
    else if (service === 'excel') { basePrice = 140; baseDays = 3; }
    else if (service === 'python') { basePrice = 220; baseDays = 5; }
    else if (service === 'fullsuite') { basePrice = 450; baseDays = 9; }

    let sizeMultiplier = 1.0;
    if (dataSize === 'medium') sizeMultiplier = 1.35;
    else if (dataSize === 'large') sizeMultiplier = 1.85;
    else if (dataSize === 'enterprise') sizeMultiplier = 2.4;

    let speedMultiplier = 1.0;
    if (speed === 'rush') {
      speedMultiplier = 1.4;
      baseDays = Math.max(1, Math.floor(baseDays * 0.5));
    } else if (speed === 'standard') {
      baseDays = Math.ceil(baseDays * (dataSize === 'enterprise' ? 1.4 : 1.0));
    }

    const finalLow = Math.round(basePrice * sizeMultiplier);
    const finalHigh = Math.round(finalLow * 1.35);

    priceDisplay.textContent = `$${finalLow} - $${finalHigh}`;
    timeDisplay.textContent = `${baseDays} - ${baseDays + 2} Business Days`;
  }

  [serviceTypeSelect, dataSizeSelect, speedSelect].forEach(select => {
    if (select) select.addEventListener('change', calculateEstimate);
  });

  calculateEstimate();

  // Apply to Contact Form
  if (applyBtn) {
    applyBtn.addEventListener('click', () => {
      const contactSection = document.getElementById('contact');
      const serviceField = document.getElementById('contact-service');
      const messageField = document.getElementById('contact-message');

      if (serviceField) {
        serviceField.value = serviceTypeSelect.value;
      }
      if (messageField) {
        messageField.value = `Hi Ahmad, I calculated an estimate for ${serviceTypeSelect.options[serviceTypeSelect.selectedIndex].text} (Data scale: ${dataSizeSelect.options[dataSizeSelect.selectedIndex].text}, Delivery: ${speedSelect.options[speedSelect.selectedIndex].text}). Estimated Budget: ${priceDisplay.textContent}. Here are additional details about my project: `;
        messageField.focus();
      }

      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
        showToast('Estimate transferred to Inquiry Form! 🎉');
      }
    });
  }
}

// 7. Client Reviews Testimonial Slider
function initTestimonialSlider() {
  const cards = document.querySelectorAll('.testimonial-slide');
  const prevBtn = document.getElementById('testi-prev');
  const nextBtn = document.getElementById('testi-next');
  const dots = document.querySelectorAll('.testi-dot');

  if (cards.length === 0) return;
  let currentIndex = 0;

  function showSlide(index) {
    cards.forEach((card, i) => {
      if (i === index) {
        card.classList.remove('hidden');
        card.classList.add('flex');
      } else {
        card.classList.add('hidden');
        card.classList.remove('flex');
      }
    });

    dots.forEach((dot, i) => {
      if (i === index) {
        dot.classList.add('bg-sky-400', 'w-8');
        dot.classList.remove('bg-slate-700', 'w-3');
      } else {
        dot.classList.remove('bg-sky-400', 'w-8');
        dot.classList.add('bg-slate-700', 'w-3');
      }
    });
    currentIndex = index;
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      let next = (currentIndex + 1) % cards.length;
      showSlide(next);
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      let prev = (currentIndex - 1 + cards.length) % cards.length;
      showSlide(prev);
    });
  }

  dots.forEach(dot => {
    dot.addEventListener('click', (e) => {
      const idx = parseInt(e.currentTarget.dataset.index, 10);
      showSlide(idx);
    });
  });

  // Auto rotate every 7 seconds
  setInterval(() => {
    if (document.hidden) return;
    let next = (currentIndex + 1) % cards.length;
    showSlide(next);
  }, 7000);
}

// 8. Contact Form Handling & Toasts
function initContactForm() {
  const form = document.getElementById('portfolio-contact-form');
  const submitBtn = document.getElementById('contact-submit-btn');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('contact-name').value.trim();
    const email = document.getElementById('contact-email').value.trim();
    const service = document.getElementById('contact-service').value;
    const message = document.getElementById('contact-message').value.trim();

    if (!name || !email || !message) {
      showToast('Please complete all required fields.', 'error');
      return;
    }

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg> Sending Inquiry...
      `;
    }

    setTimeout(() => {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `<span>Inquiry Sent Successfully!</span> <span>✓</span>`;
        submitBtn.classList.remove('bg-sky-500', 'hover:bg-sky-400');
        submitBtn.classList.add('bg-emerald-600', 'text-white');
      }

      showToast(`Thank you, ${name}! Your inquiry has been received. Ahmad will reply within 4 hours.`, 'success');
      form.reset();

      setTimeout(() => {
        if (submitBtn) {
          submitBtn.innerHTML = `<span>Send Project Inquiry</span> <i data-lucide="send" class="w-4 h-4 inline"></i>`;
          submitBtn.classList.add('bg-sky-500', 'hover:bg-sky-400');
          submitBtn.classList.remove('bg-emerald-600');
          if (window.lucide) window.lucide.createIcons();
        }
      }, 5000);
    }, 1200);
  });
}

// Global Toast System
function showToast(message, type = 'success') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  const icon = type === 'success' ? '⚡' : '⚠️';
  toast.innerHTML = `
    <span class="text-xl">${icon}</span>
    <span class="text-sm font-medium text-slate-100">${message}</span>
  `;

  container.appendChild(toast);
  setTimeout(() => toast.classList.add('show'), 50);

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400);
  }, 4500);
}

// 9. Live Pakistan Local Time Indicator (Multan: UTC+5)
function initLiveClock() {
  const clockElement = document.getElementById('live-pakistan-time');
  if (!clockElement) return;

  function updateClock() {
    const options = {
      timeZone: 'Asia/Karachi',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    };
    const formatter = new Intl.DateTimeFormat([], options);
    clockElement.textContent = `${formatter.format(new Date())} (PKT / UTC+5)`;
  }

  updateClock();
  setInterval(updateClock, 1000);
}

// 10. Lucide Icons Helper
function initLucideIcons() {
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

// Export Toast for global calls
window.showToast = showToast;