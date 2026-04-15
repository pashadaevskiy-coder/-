// Плавный скролл для якорных ссылок
document.addEventListener('DOMContentLoaded', function() {
    // Плавный скролл для всех ссылок с якорями
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Валидация форм
    const forms = document.querySelectorAll('.contact-form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            let valid = true;
            
            // Проверка поля имени
            const nameInput = this.querySelector('input[name="name"]');
            if (nameInput && nameInput.value.trim().length < 2) {
                showError(nameInput, 'Введите имя (минимум 2 символа)');
                valid = false;
            } else {
                clearError(nameInput);
            }
            
            // Проверка телефона
            const phoneInput = this.querySelector('input[name="phone"]');
            if (phoneInput && !isValidPhone(phoneInput.value)) {
                showError(phoneInput, 'Введите корректный номер телефона');
                valid = false;
            } else {
                clearError(phoneInput);
            }
            
            if (!valid) {
                e.preventDefault();
            } else {
                // В реальном проекте здесь будет отправка через formsubmit.co
                // Для демо просто показываем сообщение
                e.preventDefault();
                showSuccessMessage(this);
            }
        });
    });

    // Добавление маски телефона
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    phoneInputs.forEach(input => {
        input.addEventListener('input', function() {
            formatPhone(this);
        });
    });

    // Анимация появления элементов при скролле
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, observerOptions);

    // Наблюдаем за карточками
    const cards = document.querySelectorAll('.problem-card, .specialist-item, .advantage-card');
    cards.forEach(card => {
        observer.observe(card);
    });

    // Добавление активного класса для навигации при скролле
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - 100)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
});

// Вспомогательные функции
function isValidPhone(phone) {
    const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
    return phoneRegex.test(phone);
}

function formatPhone(input) {
    let value = input.value.replace(/\D/g, '');
    if (value.length > 0) {
        if (value.length <= 3) {
            input.value = value;
        } else if (value.length <= 6) {
            input.value = `+${value.substring(0, 3)} ${value.substring(3)}`;
        } else if (value.length <= 8) {
            input.value = `+${value.substring(0, 3)} ${value.substring(3, 6)} ${value.substring(6)}`;
        } else {
            input.value = `+${value.substring(0, 3)} ${value.substring(3, 6)} ${value.substring(6, 8)} ${value.substring(8, 10)}`;
        }
    }
}

function showError(input, message) {
    clearError(input);
    const error = document.createElement('div');
    error.className = 'error-message';
    error.textContent = message;
    error.style.color = '#e53e3e';
    error.style.fontSize = '0.9rem';
    error.style.marginTop = '5px';
    input.parentNode.appendChild(error);
    input.style.borderColor = '#e53e3e';
}

function clearError(input) {
    if (!input) return;
    const error = input.parentNode.querySelector('.error-message');
    if (error) {
        error.remove();
    }
    input.style.borderColor = '#e2e8f0';
}

function showSuccessMessage(form) {
    const button = form.querySelector('button[type="submit"]');
    const originalText = button.textContent;
    
    button.textContent = 'Отправлено!';
    button.style.backgroundColor = '#38a169';
    button.disabled = true;
    
    setTimeout(() => {
        button.textContent = originalText;
        button.style.backgroundColor = '';
        button.disabled = false;
        form.reset();
    }, 3000);
}

// Добавление стилей для анимации
const style = document.createElement('style');
style.textContent = `
    .problem-card,
    .specialist-item,
    .advantage-card {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }
    
    .problem-card.animated,
    .specialist-item.animated,
    .advantage-card.animated {
        opacity: 1;
        transform: translateY(0);
    }
    
    .nav-link.active {
        color: #2563eb;
        font-weight: 600;
    }
`;
document.head.appendChild(style);