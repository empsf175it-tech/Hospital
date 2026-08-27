/**
 * ==========================================================================
 * VITALIS MEDICAL CENTER — MASTER JAVASCRIPT
 * Dynamic micro-interactions, form validation, animated counters, modals & tabs
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* --- 1. STICKY NAVBAR & ACTIVE LINK CONTROLLER --- */
  const header = document.querySelector('.site-header');
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';

  const handleScroll = () => {
    if (window.scrollY > 40) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }

    // Back to top button
    const backToTopBtn = document.getElementById('backToTopBtn');
    if (backToTopBtn) {
      if (window.scrollY > 400) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // Highlight active nav links
  const navLinks = document.querySelectorAll('.nav-link, .mobile-menu-link');
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  /* --- 2. MOBILE OFFCANVAS DRAWER NAVIGATION --- */
  const mobileToggle = document.getElementById('mobileNavToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const drawerBackdrop = document.getElementById('drawerBackdrop');

  const openMobileMenu = () => {
    mobileToggle?.classList.add('active');
    mobileDrawer?.classList.add('open');
    drawerBackdrop?.classList.add('active');
    document.body.style.overflow = 'hidden';
    mobileToggle?.setAttribute('aria-expanded', 'true');
  };

  const closeMobileMenu = () => {
    mobileToggle?.classList.remove('active');
    mobileDrawer?.classList.remove('open');
    drawerBackdrop?.classList.remove('active');
    document.body.style.overflow = '';
    mobileToggle?.setAttribute('aria-expanded', 'false');
  };

  mobileToggle?.addEventListener('click', (e) => {
    e.stopPropagation();
    if (mobileDrawer?.classList.contains('open')) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  });

  drawerBackdrop?.addEventListener('click', closeMobileMenu);

  const drawerCloseBtn = document.getElementById('drawerCloseBtn');
  drawerCloseBtn?.addEventListener('click', closeMobileMenu);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeMobileMenu();
      closeModal();
    }
  });

  /* --- 3. INTERSECTION OBSERVER FOR SCROLL REVEAL --- */
  const revealElements = document.querySelectorAll('.reveal-fade-up, .reveal-fade-in');
  
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-active');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback for older browsers
    revealElements.forEach(el => el.classList.add('reveal-active'));
  }

  /* --- 4. ANIMATED COUNTERS --- */
  const statNumbers = document.querySelectorAll('.stat-number[data-target]');
  
  if (statNumbers.length > 0 && 'IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.getAttribute('data-target'), 10);
          const suffix = el.getAttribute('data-suffix') || '';
          const duration = 2000; // 2 seconds
          const frameDuration = 1000 / 60;
          const totalFrames = Math.round(duration / frameDuration);
          let frame = 0;

          const counter = setInterval(() => {
            frame++;
            const progress = frame / totalFrames;
            // Ease out cubic
            const currentCount = Math.round(target * (1 - Math.pow(1 - progress, 3)));
            
            if (currentCount >= target) {
              el.innerHTML = `${target.toLocaleString()}${suffix}`;
              clearInterval(counter);
            } else {
              el.innerHTML = `${currentCount.toLocaleString()}${suffix}`;
            }
          }, frameDuration);

          observer.unobserve(el);
        }
      });
    }, { threshold: 0.25 });

    statNumbers.forEach(stat => counterObserver.observe(stat));
  }

  /* --- 5. CATEGORY FILTER TABS (DEPARTMENTS & DOCTORS) --- */
  const filterButtons = document.querySelectorAll('.filter-btn');
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const parent = btn.closest('.filter-button-group');
      parent?.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');
      const targetGridId = btn.getAttribute('data-target-grid');
      const targetGrid = document.getElementById(targetGridId);

      if (targetGrid) {
        const items = targetGrid.querySelectorAll('.filterable-item');
        items.forEach(item => {
          const category = item.getAttribute('data-category');
          if (filterValue === 'all' || category === filterValue || item.classList.contains(filterValue)) {
            item.style.display = '';
            item.classList.add('reveal-active');
          } else {
            item.style.display = 'none';
          }
        });
      }
    });
  });

  /* --- 6. DOCTOR PROFILE MODAL --- */
  const doctorModalOverlay = document.getElementById('doctorModalOverlay');
  const doctorCards = document.querySelectorAll('[data-doctor-modal]');
  const modalCloseBtns = document.querySelectorAll('.modal-close-btn');

  const doctorDatabase = {
    'sarah-mitchell': {
      name: 'Dr. Sarah Mitchell, MD, FACC',
      title: 'Senior Consultant — Interventional Cardiology',
      experience: '18+ Years Clinical Experience',
      education: 'Harvard Medical School (MD), Johns Hopkins (Fellowship in Interventional Cardiology)',
      awards: 'American College of Cardiology Fellow, Top Cardiologist Award 2024',
      bio: 'Dr. Sarah Mitchell is an internationally recognized cardiologist specializing in complex coronary interventions, transcatheter aortic valve replacement (TAVR), and structural heart disease. She leads the Heart Institute at Vitalis.',
      availability: 'Mon, Wed, Fri (09:00 AM - 03:00 PM)',
      department: 'Cardiology'
    },
    'michael-carter': {
      name: 'Dr. Michael Carter, MD, FAANS',
      title: 'Chief of Neurosurgery & Spine Institute',
      experience: '15+ Years Clinical Experience',
      education: 'Stanford University School of Medicine (MD), Mayo Clinic (Neurosurgery Residency)',
      awards: 'Pioneer in Minimally Invasive Spine Surgery, Neurosciences Research Chair',
      bio: 'Dr. Michael Carter is a board-certified neurosurgeon renowned for complex brain tumor resections, endoscopic skull base surgery, and robotic-assisted spinal reconstructive procedures.',
      availability: 'Tue, Thu, Sat (10:00 AM - 04:00 PM)',
      department: 'Neurology'
    },
    'elena-rostova': {
      name: 'Dr. Elena Rostova, MD, FAAP',
      title: 'Head of Pediatric & Neonatal Medicine',
      experience: '14+ Years Clinical Experience',
      education: 'Oxford University Medical Sciences Division, Boston Children\'s Hospital',
      awards: 'Excellence in Pediatric Critical Care, Global Child Health Advocate',
      bio: 'Dr. Elena Rostova provides compassionate, evidence-based care for infants, children, and adolescents, specializing in pediatric emergency care and congenital developmental disorders.',
      availability: 'Mon through Thu (08:30 AM - 02:30 PM)',
      department: 'Pediatrics'
    },
    'marcus-vance': {
      name: 'Dr. Marcus Vance, MD, FAAOS',
      title: 'Senior Orthopedic & Joint Replacement Surgeon',
      experience: '16+ Years Clinical Experience',
      education: 'Columbia University Vagelos College of Physicians and Surgeons, Hospital for Special Surgery',
      awards: 'Gold Medalist in Orthopedic Surgery, Robotic Joint Pioneer',
      bio: 'Dr. Marcus Vance specializes in robotic-assisted total hip and knee arthroplasty, sports medicine trauma, and advanced arthroscopic reconstruction for high-performance athletes.',
      availability: 'Mon, Wed, Sat (09:00 AM - 05:00 PM)',
      department: 'Orthopedics'
    },
    'amara-patel': {
      name: 'Dr. Amara Patel, MD, FACP',
      title: 'Director of Comprehensive Oncology & Hematology',
      experience: '17+ Years Clinical Experience',
      education: 'University of Cambridge School of Clinical Medicine, Memorial Sloan Kettering Cancer Center',
      awards: 'National Cancer Research Excellence Award, ASCO Senior Fellow',
      bio: 'Dr. Amara Patel oversees targeted immunotherapy, precision molecular oncology, and multidisciplinary tumor boards, ensuring patient-first cancer treatments.',
      availability: 'Tue, Thu, Fri (09:00 AM - 04:00 PM)',
      department: 'Oncology'
    },
    'david-chen': {
      name: 'Dr. David Chen, MD, FACD',
      title: 'Chief Consultant Dermatologist & Mohs Surgeon',
      experience: '12+ Years Clinical Experience',
      education: 'University of California San Francisco (MD), New York University Langone',
      awards: 'Innovator in Laser Dermatology, Skin Cancer Foundation Contributor',
      bio: 'Dr. David Chen is an expert in dermatologic oncology, Mohs micrographic surgery, and advanced cosmetic and clinical rejuvenation therapies.',
      availability: 'Mon, Wed, Thu (10:00 AM - 05:00 PM)',
      department: 'Dermatology'
    },
    'alan-mercer': {
      name: 'Dr. Alan Mercer, MD, FRCOphth',
      title: 'Department Chair & Senior Consultant — Ophthalmic Surgery',
      experience: '16+ Years Clinical Experience',
      education: 'Oxford University Medical School, Moorfields Eye Hospital London (Fellowship in Vitreoretinal Surgery)',
      awards: 'Royal College of Ophthalmologists Fellow, Excellence in Vision Research Award',
      bio: 'Dr. Alan Mercer is a pioneer in micro-incision vitrectomy surgery, complex cataract procedures, and advanced laser refractive correction (LASIK/PRK).',
      availability: 'Mon, Tue, Thu (09:00 AM - 04:00 PM)',
      department: 'Ophthalmology'
    },
    'clara-ross': {
      name: 'Dr. Clara Ross, PT, DPT',
      title: 'Director of Rehabilitation Services & Physical Therapy',
      experience: '11+ Years Clinical Experience',
      education: 'Columbia University (Doctor of Physical Therapy), NYU Langone Orthopedic Fellowship',
      awards: 'APTA Certified Clinical Specialist, Outstanding Rehabilitation Leadership Award',
      bio: 'Dr. Clara Ross specializes in neurological post-stroke recovery, customized orthopedic recovery programs, and cardiac rehabilitation, helping patients restore their physical mobility.',
      availability: 'Tue, Wed, Fri (08:00 AM - 05:00 PM)',
      department: 'Rehabilitation'
    },
    'evelyn-hayes': {
      name: 'Dr. Evelyn Hayes, MD, FACOG',
      title: 'Senior Consultant — Obstetrics & Gynecology',
      experience: '15+ Years Clinical Experience',
      education: 'University of Pennsylvania School of Medicine, Hospital of the University of Pennsylvania (Residency)',
      awards: 'ACOG Distinguished Service Award, Top Obstetrician 2025',
      bio: 'Dr. Evelyn Hayes specializes in high-risk obstetrics, advanced minimally invasive gynecologic surgery, and comprehensive maternal-fetal medicine.',
      availability: 'Mon, Wed, Thu (09:00 AM - 04:00 PM)',
      department: 'Gynecology'
    },
    'jonathan-ryans': {
      name: 'Dr. Jonathan Ryans, MD',
      title: 'Senior Specialist — Urology & Kidney Institute',
      experience: '14+ Years Clinical Experience',
      education: 'Harvard Medical School (MD), Massachusetts General Hospital (Urology Residency)',
      awards: 'American Urological Association Member, Innovative Surgical Research Fellow',
      bio: 'Dr. Jonathan Ryans is an expert in minimally invasive robotic prostatectomy, laser lithotripsy for kidney stones, and advanced urologic cancer surgery.',
      availability: 'Tue, Thu, Sat (09:30 AM - 03:30 PM)',
      department: 'Urology'
    }
  };

  doctorCards.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const doctorId = btn.getAttribute('data-doctor-modal');
      const data = doctorDatabase[doctorId];

      if (data && doctorModalOverlay) {
        document.getElementById('modalDocName').textContent = data.name;
        document.getElementById('modalDocTitle').textContent = data.title;
        document.getElementById('modalDocExp').textContent = data.experience;
        document.getElementById('modalDocEdu').textContent = data.education;
        document.getElementById('modalDocAwards').textContent = data.awards;
        document.getElementById('modalDocBio').textContent = data.bio;
        document.getElementById('modalDocHours').textContent = data.availability;
        
        const bookBtn = document.getElementById('modalDocBookBtn');
        if (bookBtn) {
          bookBtn.setAttribute('href', `appointment.html?dept=${encodeURIComponent(data.department)}&doc=${encodeURIComponent(data.name)}`);
        }

        doctorModalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  const closeModal = () => {
    document.querySelectorAll('.modal-overlay').forEach(modal => modal.classList.remove('active'));
    document.body.style.overflow = '';
  };

  modalCloseBtns.forEach(btn => btn.addEventListener('click', closeModal));
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeModal();
    });
  });

  /* --- 7. APPOINTMENT FORM CONTROLLER --- */
  const appointmentForm = document.getElementById('vitalisAppointmentForm');
  const appointmentSuccessModal = document.getElementById('appointmentSuccessModal');
  const departmentSelect = document.getElementById('aptDepartment');
  const doctorSelect = document.getElementById('aptDoctor');
  const dateInput = document.getElementById('aptDate');

  // Set minimum date to today
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
  }

  // Pre-fill department & doctor from URL query parameters if present
  if (departmentSelect && doctorSelect) {
    const urlParams = new URLSearchParams(window.location.search);
    const deptParam = urlParams.get('dept');
    const docParam = urlParams.get('doc');

    if (deptParam) {
      departmentSelect.value = deptParam;
    }

    const doctorsByDept = {
      'Cardiology': ['Dr. Sarah Mitchell, MD', 'Dr. Robert Jenkins, MD'],
      'Neurology': ['Dr. Michael Carter, MD', 'Dr. Sophia Reyes, MD'],
      'Orthopedics': ['Dr. Marcus Vance, MD', 'Dr. James Anderson, MD'],
      'Pediatrics': ['Dr. Elena Rostova, MD', 'Dr. Chloe Bennett, MD'],
      'Oncology': ['Dr. Amara Patel, MD', 'Dr. Richard Sterling, MD'],
      'Dermatology': ['Dr. David Chen, MD', 'Dr. Lisa Thompson, MD'],
      'General Surgery': ['Dr. Harrison Forde, MD', 'Dr. Nadia Kamal, MD'],
      'Emergency Medicine': ['Dr. Anthony Quinn, MD', 'Dr. Emily Watson, MD'],
      'Ophthalmology': ['Dr. Alan Mercer, MD', 'Dr. Iris Vance, MD'],
      'Rehabilitation': ['Dr. Liam Sterling, DPT', 'Dr. Clara Ross, DPT'],
      'Gynecology': ['Dr. Evelyn Hayes, MD', 'Dr. Chloe Bennett, MD'],
      'Urology': ['Dr. Jonathan Ryans, MD', 'Dr. Arthur Pendelton, MD']
    };

    const updateDoctorOptions = () => {
      const selectedDept = departmentSelect.value;
      doctorSelect.innerHTML = '<option value="">Select Specialist (Optional / Auto-Assign)</option>';

      if (selectedDept && doctorsByDept[selectedDept]) {
        doctorsByDept[selectedDept].forEach(doc => {
          const opt = document.createElement('option');
          opt.value = doc;
          opt.textContent = doc;
          if (docParam && (doc.includes(docParam) || docParam.includes(doc))) {
            opt.selected = true;
          }
          doctorSelect.appendChild(opt);
        });
      } else {
        // Populate all
        Object.values(doctorsByDept).flat().forEach(doc => {
          const opt = document.createElement('option');
          opt.value = doc;
          opt.textContent = doc;
          doctorSelect.appendChild(opt);
        });
      }
    };

    departmentSelect.addEventListener('change', updateDoctorOptions);
    updateDoctorOptions();
  }

  if (appointmentForm) {
    appointmentForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      // Inputs to validate
      const requiredInputs = appointmentForm.querySelectorAll('[required]');
      requiredInputs.forEach(input => {
        if (!input.value.trim()) {
          input.classList.add('is-invalid');
          isValid = false;
        } else {
          // Email validation
          if (input.type === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(input.value.trim())) {
              input.classList.add('is-invalid');
              isValid = false;
              return;
            }
          }
          input.classList.remove('is-invalid');
        }
      });

      // Check slot selection
      const slotSelected = appointmentForm.querySelector('input[name="timeSlot"]:checked');
      const slotContainer = document.getElementById('slotContainer');
      if (!slotSelected && slotContainer) {
        slotContainer.classList.add('is-invalid');
        isValid = false;
      } else if (slotContainer) {
        slotContainer.classList.remove('is-invalid');
      }

      if (isValid) {
        // Generate reference ID
        const randomRef = 'VIT-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000);
        const refDisplay = document.getElementById('successRefNumber');
        const patientNameDisplay = document.getElementById('successPatientName');
        const aptDateDisplay = document.getElementById('successAptDate');
        const deptDisplay = document.getElementById('successDept');

        if (refDisplay) refDisplay.textContent = randomRef;
        if (patientNameDisplay) patientNameDisplay.textContent = document.getElementById('aptFullName')?.value || 'Valued Patient';
        if (aptDateDisplay) aptDateDisplay.textContent = document.getElementById('aptDate')?.value || 'Scheduled';
        if (deptDisplay) deptDisplay.textContent = document.getElementById('aptDepartment')?.value || 'General Medicine';

        if (appointmentSuccessModal) {
          appointmentSuccessModal.classList.add('active');
          document.body.style.overflow = 'hidden';
        }

        appointmentForm.reset();
      }
    });

    // Remove invalid style on input change
    appointmentForm.querySelectorAll('.form-control, input[type="radio"]').forEach(field => {
      field.addEventListener('input', () => {
        field.classList.remove('is-invalid');
      });
    });
  }

  /* --- 8. CONTACT FORM VALIDATION & FEEDBACK --- */
  const contactForm = document.getElementById('vitalisContactForm');
  const contactToast = document.getElementById('contactFeedbackToast');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      const requiredInputs = contactForm.querySelectorAll('[required]');
      requiredInputs.forEach(input => {
        if (!input.value.trim()) {
          input.classList.add('is-invalid');
          isValid = false;
        } else {
          if (input.type === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(input.value.trim())) {
              input.classList.add('is-invalid');
              isValid = false;
              return;
            }
          }
          input.classList.remove('is-invalid');
        }
      });

      if (isValid) {
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        if (submitBtn) {
          const originalText = submitBtn.innerHTML;
          submitBtn.disabled = true;
          submitBtn.innerHTML = '<i class="bi bi-hourglass-split"></i> Transmitting Message...';

          setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
            contactForm.reset();

            if (contactToast) {
              contactToast.style.display = 'block';
              contactToast.scrollIntoView({ behavior: 'smooth', block: 'center' });
              setTimeout(() => {
                contactToast.style.display = 'none';
              }, 6000);
            } else {
              alert('Thank you! Your message has been received. Our clinical coordination desk will respond within 24 hours.');
            }
          }, 900);
        }
      }
    });

    contactForm.querySelectorAll('.form-control').forEach(field => {
      field.addEventListener('input', () => {
        field.classList.remove('is-invalid');
      });
    });
  }

  /* --- 9. BACK TO TOP SCROLL BUTTON --- */
  const backToTopBtn = document.getElementById('backToTopBtn');
  backToTopBtn?.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
});
