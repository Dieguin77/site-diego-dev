function initMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const mobileMenu = document.getElementById('mobileMenu');

    if (!menuToggle || !mobileMenu) return;

    menuToggle.addEventListener('click', () => {
        const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
        menuToggle.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        menuToggle.setAttribute('aria-expanded', String(!expanded));
    });

    mobileMenu.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            mobileMenu.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
        });
    });
}

function initHeroABTest() {
    const headline = document.getElementById('heroHeadline');
    const subheadline = document.getElementById('heroSubheadline');
    const primaryCta = document.getElementById('heroPrimaryCta');

    if (!headline || !subheadline || !primaryCta) return;

    const variants = {
        A: {
            headline: 'Enquanto você espera, seus concorrentes fecham os clientes que <span>seriam seus</span>.',
            subheadline:
                'Crio landing pages e sites de alta conversão que geram leads qualificados todos os dias. Atendo poucos projetos por mês para garantir prazo e qualidade — a agenda preenche rápido.',
            cta: 'Quero garantir minha vaga'
        },
        B: {
            headline: 'Transformo seu site em uma <span>máquina de oportunidades</span> para o seu comercial.',
            subheadline:
                'Mais de 50 projetos entregues e 98% de satisfação. Estratégia, UX e código de alta performance trabalhando para gerar contatos qualificados com previsibilidade.',
            cta: 'Quero atrair mais clientes'
        }
    };

    const storageKey = 'lp_ab_variant_hero';
    let variant = localStorage.getItem(storageKey);

    if (!variant || !variants[variant]) {
        variant = Math.random() < 0.5 ? 'A' : 'B';
        localStorage.setItem(storageKey, variant);
    }

    headline.innerHTML = variants[variant].headline;
    subheadline.textContent = variants[variant].subheadline;
    primaryCta.textContent = variants[variant].cta;
    primaryCta.setAttribute('data-ab-variant', variant);
}

function trackEvent(eventName, metadata = {}) {
    const payload = {
        event: eventName,
        timestamp: new Date().toISOString(),
        page: window.location.pathname,
        ...metadata
    };

    const historyKey = 'lp_conversion_events';
    const existing = JSON.parse(localStorage.getItem(historyKey) || '[]');
    existing.push(payload);
    localStorage.setItem(historyKey, JSON.stringify(existing.slice(-100)));

    if (window.dataLayer && Array.isArray(window.dataLayer)) {
        window.dataLayer.push(payload);
    }
}

function initConversionTracking() {
    document.querySelectorAll('[data-track]').forEach((node) => {
        node.addEventListener('click', () => {
            trackEvent('cta_click', {
                cta_id: node.getAttribute('data-track'),
                cta_text: (node.textContent || '').trim(),
                cta_href: node.getAttribute('href') || '',
                ab_variant: node.getAttribute('data-ab-variant') || localStorage.getItem('lp_ab_variant_hero') || 'NA'
            });
        });
    });

    document.querySelectorAll('a[href*="wa.me/"]').forEach((node) => {
        node.addEventListener('click', () => {
            trackEvent('whatsapp_click', {
                source: node.getAttribute('data-track') || 'whatsapp-link',
                href: node.getAttribute('href') || ''
            });
        });
    });
}

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function initReveal() {
    const elements = document.querySelectorAll('.reveal');
    if (!elements.length) return;

    // Cascata: cada elemento ganha um atraso baseado na sua posição dentro do grupo (mesmo pai).
    const orderByParent = new Map();
    elements.forEach((element) => {
        const parent = element.parentElement;
        const order = orderByParent.get(parent) || 0;
        const cappedDelay = Math.min(order, 6) * 90;
        element.style.setProperty('--reveal-delay', `${cappedDelay}ms`);
        element.classList.add('will-animate');
        orderByParent.set(parent, order + 1);
    });

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    el.classList.add('visible');
                    // Libera a camada de composição após a transição terminar.
                    el.addEventListener('transitionend', () => el.classList.remove('will-animate'), { once: true });
                    observer.unobserve(el);
                }
            });
        },
        { threshold: 0.15 }
    );

    elements.forEach((element) => observer.observe(element));
}

function initScrollProgress() {
    const bar = document.getElementById('scrollProgress');
    if (!bar) return;

    let ticking = false;
    const update = () => {
        const scrollable = document.documentElement.scrollHeight - window.innerHeight;
        const progress = scrollable > 0 ? Math.min(window.scrollY / scrollable, 1) : 0;
        bar.style.transform = `scaleX(${progress})`;
        ticking = false;
    };

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(update);
            ticking = true;
        }
    }, { passive: true });

    update();
}

function initPointerEffects() {
    const finePointer = window.matchMedia('(pointer: fine)').matches;
    if (!finePointer) return;

    // Spotlight global suave que segue o cursor.
    // Movido só com transform (translate3d) => roda no compositor, sem repintar a viewport.
    // Considerado "movimento", então é desativado em prefers-reduced-motion.
    const glow = document.getElementById('cursorGlow');
    if (glow && !prefersReducedMotion) {
        let pending = false;
        let lastX = 0;
        let lastY = 0;
        window.addEventListener('mousemove', (event) => {
            lastX = event.clientX;
            lastY = event.clientY;
            if (!pending) {
                window.requestAnimationFrame(() => {
                    glow.style.transform = `translate3d(${lastX}px, ${lastY}px, 0)`;
                    glow.classList.add('is-active');
                    pending = false;
                });
                pending = true;
            }
        }, { passive: true });
    }

    // Brilho local + efeito magnético nos botões primários.
    // O rect é lido no mouseenter (cacheado) para evitar layout em todo mousemove.
    document.querySelectorAll('.btn-primary').forEach((btn) => {
        let rect = null;
        btn.addEventListener('mouseenter', () => { rect = btn.getBoundingClientRect(); });
        btn.addEventListener('mousemove', (event) => {
            if (!rect) rect = btn.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            btn.style.setProperty('--mx', `${x}px`);
            btn.style.setProperty('--my', `${y}px`);

            if (!prefersReducedMotion) {
                const pullX = (x - rect.width / 2) * 0.16;
                const pullY = (y - rect.height / 2) * 0.28;
                btn.style.transform = `translate(${pullX}px, ${pullY - 2}px)`;
            }
        });
        btn.addEventListener('mouseleave', () => {
            rect = null;
            btn.style.transform = '';
        });
    });

    // Spotlight de vidro nos cards.
    const glowCards = document.querySelectorAll(
        '.service-card, .portfolio-card, .testimonial-card, .problem-card, .solution-card, .hero-card, .about-card, .final-cta'
    );
    glowCards.forEach((card) => {
        card.classList.add('glow-card');
        card.addEventListener('mousemove', (event) => {
            const rect = card.getBoundingClientRect();
            card.style.setProperty('--mx', `${event.clientX - rect.left}px`);
            card.style.setProperty('--my', `${event.clientY - rect.top}px`);
        });
    });
}

function initCounters() {
    const counters = document.querySelectorAll('.metric-number');
    if (!counters.length) return;

    const animate = (counter) => {
        const target = Number(counter.dataset.target) || 0;
        let current = 0;
        const duration = 1300;
        const stepTime = 16;
        const increment = Math.max(1, Math.round((target * stepTime) / duration));

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                counter.textContent = String(target);
                clearInterval(timer);
                return;
            }
            counter.textContent = String(current);
        }, stepTime);
    };

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    animate(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.4 }
    );

    counters.forEach((counter) => observer.observe(counter));
}

function initFAQ() {
    const items = document.querySelectorAll('.faq-item');
    if (!items.length) return;

    items.forEach((item) => {
        const button = item.querySelector('.faq-question');
        if (!button) return;

        button.addEventListener('click', () => {
            const isOpen = item.classList.contains('active');

            items.forEach((other) => {
                other.classList.remove('active');
                const otherButton = other.querySelector('.faq-question');
                otherButton?.setAttribute('aria-expanded', 'false');
            });

            if (!isOpen) {
                item.classList.add('active');
                button.setAttribute('aria-expanded', 'true');
            }
        });
    });
}

function initSmoothScrollAndSpy() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach((link) => {
        link.addEventListener('click', (event) => {
            const href = link.getAttribute('href');
            if (!href || href === '#') return;

            const target = document.querySelector(href);
            if (!target) return;

            event.preventDefault();
            const offset = 84;
            const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
            window.scrollTo({ top, behavior: 'smooth' });
        });
    });

    const sections = Array.from(document.querySelectorAll('main section[id]'));
    const navLinks = Array.from(document.querySelectorAll('.desktop-nav a'));

    // Offsets cacheados (recalculados só em resize) para não ler layout em todo scroll.
    let offsets = [];
    const measure = () => {
        offsets = sections.map((section) => ({ id: section.id, top: section.offsetTop }));
    };

    const updateSpy = () => {
        const position = window.scrollY + 120;
        let activeId = '';
        offsets.forEach((section) => {
            if (position >= section.top) activeId = section.id;
        });
        navLinks.forEach((link) => {
            link.classList.toggle('active', (link.getAttribute('href') || '') === `#${activeId}`);
        });
    };

    let ticking = false;
    const onScroll = () => {
        if (!ticking) {
            window.requestAnimationFrame(() => { updateSpy(); ticking = false; });
            ticking = true;
        }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', () => { measure(); updateSpy(); }, { passive: true });
    measure();
    updateSpy();
}

function initLeadForm() {
    const form = document.getElementById('leadForm');
    if (!form) return;

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const nome = document.getElementById('nome')?.value.trim() || '';
        const telefone = document.getElementById('telefone')?.value.trim() || '';
        const tipo = document.getElementById('tipo')?.value.trim() || '';
        const detalhes = document.getElementById('detalhes')?.value.trim() || '';

        const message = [
            'Ola Diego! Vim pela landing page e quero um orcamento.',
            '',
            `Nome: ${nome}`,
            `WhatsApp: ${telefone}`,
            `Tipo de projeto: ${tipo}`,
            `Objetivo principal: ${detalhes}`,
            '',
            'Pode me enviar os proximos passos?'
        ].join('\n');

        const whatsappUrl = `https://wa.me/553384251297?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    initHeroABTest();
    initReveal();
    initScrollProgress();
    initPointerEffects();
    initCounters();
    initFAQ();
    initSmoothScrollAndSpy();
    initConversionTracking();
    initLeadForm();
});
