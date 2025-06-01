document.addEventListener('DOMContentLoaded', function() {
    // Hamburger menü
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navLinksItems = document.querySelectorAll('.nav-link');

    if (hamburger) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
    }

    // Menü linklerine tıklandığında menüyü kapat ve scroll yap
    navLinksItems.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                const offset = targetId === 'skills' ? -100 : 
                              targetId === 'experience' ? -70 : 0; // Deneyimlerim için -50px offset
                const targetPosition = targetSection.offsetTop + offset;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
            
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    // Sayfa dışına tıklandığında menüyü kapat
    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        }
    });

    // Projelerim butonuna tıklandığında
    const projectsLink = document.querySelector('a[href="#projects"]');
    if (projectsLink) {
        projectsLink.addEventListener('click', function(e) {
            e.preventDefault();
            const projectsSection = document.querySelector('.projects-section');
            if (projectsSection) {
                projectsSection.classList.add('active');
                const isMobile = window.innerWidth <= 768;
                const scrollPosition = isMobile ? window.innerHeight * 5.3 : window.innerHeight * 2.8;
                window.scrollTo({
                    top: scrollPosition,
                    behavior: 'smooth'
                });
            }
        });
    }

    const projectsSection = document.querySelector('.projects-section');
    const mainTitle = document.querySelector('.main-title');
    const scrollIndicator = document.querySelector('.scroll-indicator');
    const columns = document.querySelectorAll('.second-bg:not(.second-set):not(.third-set):not(.fourth-set) .column');
    const secondSetColumns = document.querySelectorAll('.second-set .column');
    const thirdSetColumns = document.querySelectorAll('.third-set .column');
    const fourthSetColumns = document.querySelectorAll('.fourth-set .column');
    const scrollProgress = document.querySelector('.scroll-progress');
    const projectCard = document.querySelector('.project-card:not(.second-project):not(.third-project):not(.fourth-project)');
    const secondProjectCard = document.querySelector('.second-project');
    const thirdProjectCard = document.querySelector('.third-project');
    const fourthProjectCard = document.querySelector('.fourth-project');
    const secondSet = document.querySelector('.second-set');
    const thirdSet = document.querySelector('.third-set');
    const fourthSet = document.querySelector('.fourth-set');
    let lastScrollTop = 0;
    let isTitleHidden = false;

    // Tema değiştirme fonksiyonu
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = themeToggle.querySelector('i');

    // Sayfa yüklendiğinde kaydedilmiş temayı kontrol et
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    // Tema değiştirme butonuna tıklama olayı
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });

    // Tema ikonunu güncelleme fonksiyonu
    function updateThemeIcon(theme) {
        themeIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }

    function updateScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        
        // Mobil cihaz kontrolü
        const isMobile = window.innerWidth <= 768;
        const triggerPoint = isMobile ? 5.2 : 2.7;
        
        // Projeler bölümünü aktifleştir
        if (scrollTop >= windowHeight * triggerPoint) {
            projectsSection.classList.add('active');
            
            // Projeler bölümündeki scroll pozisyonunu hesapla
            const projectsScrollTop = scrollTop - (windowHeight * triggerPoint);
            
            // Scroll progress bar'ı sadece projeler bölümü için güncelle
            const projectsSectionHeight = documentHeight - (windowHeight * 4);
            const projectsScrollPercentage = (projectsScrollTop / projectsSectionHeight) * 100;
            
            // 4. projeye kadar orantılı dolum
            const fourthProjectTrigger = windowHeight * 7; // 4. projenin gösterileceği yaklaşık scroll pozisyonu
            const adjustedPercentage = Math.min((projectsScrollTop / fourthProjectTrigger) * 100, 100);
            
            scrollProgress.style.height = adjustedPercentage + '%';
            
            // İlk 900px scroll'da yazıyı ve oku göster, sonra kaybolsun
            if (projectsScrollTop < 900) {
                mainTitle.style.opacity = '1';
                if (scrollIndicator) {
                    scrollIndicator.style.opacity = '0.7';
                }
            } else {
                mainTitle.style.opacity = '0';
                if (scrollIndicator) {
                    scrollIndicator.style.opacity = '0';
                }
            }
            
            updateColumns(projectsScrollTop);
        } else {
            projectsSection.classList.remove('active');
            mainTitle.style.opacity = '0';
            if (scrollIndicator) {
                scrollIndicator.style.opacity = '0';
            }
            resetColumns();
            // CV bölümlerinde scroll bar'ı sıfırla
            scrollProgress.style.height = '0%';
        }
    }

    function updateColumns(scrollTop) {
        const windowHeight = window.innerHeight;
        const triggerPoint = windowHeight * 0.1;
        const initialDelay = windowHeight * 0.5; // İlk sütunlar için gecikme

        const scrollDirection = scrollTop > lastScrollTop ? 'down' : 'up';
        lastScrollTop = scrollTop;

        let allColumnsVisible = true;

        // İlk set sütunları için kontrol
        columns.forEach((column, index) => {
            const columnTrigger = initialDelay + (triggerPoint * (index + 1) * 1.1);

            if (scrollDirection === 'down') {
                if (scrollTop >= columnTrigger) {
                    column.classList.add('active');
                } else {
                    allColumnsVisible = false;
                }
            } else {
                if (scrollTop < columnTrigger) {
                    column.classList.remove('active');
                    allColumnsVisible = false;
                }
            }
        });

        // Proje kartı kontrolü
        if (allColumnsVisible) {
            projectCard.classList.add('active');
           
            // İkinci set animasyonu
            const secondTriggerStart = triggerPoint * (columns.length + 8);
            let secondSetVisible = true;
            let allSecondColumnsVisible = true;

            if (scrollTop >= secondTriggerStart) {
                secondSet.classList.add('active');
                
                secondSetColumns.forEach((column, index) => {
                    const columnTrigger = secondTriggerStart + triggerPoint * (index + 1) * 1;
                    
                    if (scrollTop >= columnTrigger) {
                        column.classList.add('active');
                    } else {
                        column.classList.remove('active');
                        allSecondColumnsVisible = false;
                    }
                });

                if (allSecondColumnsVisible) {
                    secondProjectCard.classList.add('active');
                    
                    // Üçüncü set animasyonu
                    const thirdTriggerStart = secondTriggerStart + triggerPoint * (secondSetColumns.length + 8);
                    let allThirdColumnsVisible = true;

                    if (scrollTop >= thirdTriggerStart) {
                        thirdSet.classList.add('active');
                        
                        thirdSetColumns.forEach((column, index) => {
                            const columnTrigger = thirdTriggerStart + triggerPoint * (index + 1) * 1.1;
                            
                            if (scrollTop >= columnTrigger) {
                                column.classList.add('active');
                            } else {
                                column.classList.remove('active');
                                allThirdColumnsVisible = false;
                            }
                        });

                        if (allThirdColumnsVisible) {
                            thirdProjectCard.classList.add('active');
                            
                            // Dördüncü set animasyonu
                            const fourthTriggerStart = thirdTriggerStart + triggerPoint * (thirdSetColumns.length + 8);
                            let allFourthColumnsVisible = true;

                            if (scrollTop >= fourthTriggerStart) {
                                fourthSet.classList.add('active');
                                
                                fourthSetColumns.forEach((column, index) => {
                                    const columnTrigger = fourthTriggerStart + triggerPoint * (index + 1) * 1.1;
                                    
                                    if (scrollTop >= columnTrigger) {
                                        column.classList.add('active');
                                    } else {
                                        column.classList.remove('active');
                                        allFourthColumnsVisible = false;
                                    }
                                });

                                if (allFourthColumnsVisible) {
                                    fourthProjectCard.classList.add('active');
                                } else {
                                    fourthProjectCard.classList.remove('active');
                                }
                            } else {
                                fourthSet.classList.remove('active');
                                fourthSetColumns.forEach(column => column.classList.remove('active'));
                                fourthProjectCard.classList.remove('active');
                            }
                        } else {
                            thirdProjectCard.classList.remove('active');
                            fourthSet.classList.remove('active');
                            fourthSetColumns.forEach(column => column.classList.remove('active'));
                            fourthProjectCard.classList.remove('active');
                        }
                    } else {
                        thirdSet.classList.remove('active');
                        thirdSetColumns.forEach(column => column.classList.remove('active'));
                        thirdProjectCard.classList.remove('active');
                        fourthSet.classList.remove('active');
                        fourthSetColumns.forEach(column => column.classList.remove('active'));
                        fourthProjectCard.classList.remove('active');
                    }
                } else {
                    secondProjectCard.classList.remove('active');
                    thirdSet.classList.remove('active');
                    thirdSetColumns.forEach(column => column.classList.remove('active'));
                    thirdProjectCard.classList.remove('active');
                    fourthSet.classList.remove('active');
                    fourthSetColumns.forEach(column => column.classList.remove('active'));
                    fourthProjectCard.classList.remove('active');
                }
            } else {
                secondSet.classList.remove('active');
                secondSetColumns.forEach(column => column.classList.remove('active'));
                secondProjectCard.classList.remove('active');
                thirdSet.classList.remove('active');
                thirdSetColumns.forEach(column => column.classList.remove('active'));
                thirdProjectCard.classList.remove('active');
                fourthSet.classList.remove('active');
                fourthSetColumns.forEach(column => column.classList.remove('active'));
                fourthProjectCard.classList.remove('active');
            }
        } else {
            projectCard.classList.remove('active');
            secondSet.classList.remove('active');
            secondSetColumns.forEach(column => column.classList.remove('active'));
            secondProjectCard.classList.remove('active');
            thirdSet.classList.remove('active');
            thirdSetColumns.forEach(column => column.classList.remove('active'));
            thirdProjectCard.classList.remove('active');
            fourthSet.classList.remove('active');
            fourthSetColumns.forEach(column => column.classList.remove('active'));
            fourthProjectCard.classList.remove('active');
        }
    }

    function resetColumns() {
        columns.forEach(column => column.classList.remove('active'));
        secondSetColumns.forEach(column => column.classList.remove('active'));
        thirdSetColumns.forEach(column => column.classList.remove('active'));
        fourthSetColumns.forEach(column => column.classList.remove('active'));
        projectCard.classList.remove('active');
        secondProjectCard.classList.remove('active');
        thirdProjectCard.classList.remove('active');
        fourthProjectCard.classList.remove('active');
        secondSet.classList.remove('active');
        thirdSet.classList.remove('active');
        fourthSet.classList.remove('active');
    }

    // Scroll olayını dinle
    window.addEventListener('scroll', updateScroll);
    updateScroll();

    // Başlığı gizleme
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300 && !isTitleHidden) {
            mainTitle.classList.add('hide');
            isTitleHidden = true;
        } else if (window.scrollY <= 300 && isTitleHidden) {
            mainTitle.classList.remove('hide');
            isTitleHidden = false;
        }
    });

    // Dil seçimi
    const langSelects = document.querySelectorAll('.lang-select');
    const langToggles = document.querySelectorAll('.lang-toggle');
    const langOptions = document.querySelectorAll('.lang-option');
    const langTexts = document.querySelectorAll('.lang-text');

    // Dil seçimi dropdown'ını aç/kapat
    langToggles.forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            e.stopPropagation();
            const parent = toggle.closest('.lang-select');
            parent.classList.toggle('active');
        });
    });

    // Dil değiştirme fonksiyonları
    let currentLang = localStorage.getItem('language') || 'tr';
    let translations = {};

    // Dil dosyalarını yükle
    async function loadTranslations() {
        try {
            const trResponse = await fetch('translations/tr.json');
            const enResponse = await fetch('translations/en.json');
            translations.tr = await trResponse.json();
            translations.en = await enResponse.json();
            updateContent(currentLang);
        } catch (error) {
            console.error('Dil dosyaları yüklenirken hata oluştu:', error);
        }
    }

    // Sayfa içeriğini güncelle
    function updateContent(lang) {
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(element => {
            const key = element.getAttribute('data-i18n');
            const value = key.split('.').reduce((obj, k) => obj && obj[k], translations[lang]);
            if (value) {
                element.textContent = value;
            }
        });

        // Dil butonlarının metnini güncelle
        document.querySelectorAll('.lang-text').forEach(text => {
            text.textContent = lang.toUpperCase();
        });
    }

    // Dil değiştirme butonlarına tıklama olayı
    document.querySelectorAll('.lang-option').forEach(option => {
        option.addEventListener(
            'click', () => {
                const selectedLang = option.getAttribute('data-lang');
                currentLang = selectedLang;
                localStorage.setItem('language', selectedLang);
                updateContent(selectedLang);
                
                // Tüm dropdown'ları kapat
                document.querySelectorAll('.lang-select').forEach(select => {
                    select.classList.remove('active');
                });
            });
    });

    // Sayfa yüklendiğinde dil dosyalarını yükle
    loadTranslations();

    // Sayfa herhangi bir yerine tıklandığında dropdown'ları kapat
    document.addEventListener('click', () => {
        langSelects.forEach(select => {
            select.classList.remove('active');
        });
    });

    // Scroll animasyonu için Intersection Observer
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Yetenekler ve deneyimler elementlerini seç ve observe et
    const skillsCategories = document.querySelectorAll('.skills-category');
    const experienceItems = document.querySelectorAll('.experience-item');

    skillsCategories.forEach(category => observer.observe(category));
    experienceItems.forEach(item => observer.observe(item));

    // Logo'ya tıklandığında sayfayı en başa döndür
    const logoLink = document.querySelector('.nav-logo a');
    if (logoLink) {
        logoLink.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}); 