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
    const badge = document.getElementById('abBadge');

    if (!headline || !subheadline || !primaryCta) return;

    const variants = {
        A: {
            headline: 'Seu proximo site precisa virar <span>canal de vendas</span>, nao so cartao de visitas.',
            subheadline:
                'Eu crio landing pages e sites institucionais para empresas e profissionais que querem gerar mais leads, fechar mais contratos e crescer com previsibilidade.',
            cta: 'Quero meu projeto'
        },
        B: {
            headline: 'Transformo seu site em uma <span>maquina de oportunidades</span> para o comercial.',
            subheadline:
                'Com estrategia, UX e codigo de alta performance, sua presenca digital deixa de ser institucional e passa a gerar contatos qualificados todos os dias.',
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

    if (badge) {
        badge.textContent = `VERSAO ${variant} ATIVA`;
    }
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

function initReveal() {
    const elements = document.querySelectorAll('.reveal');
    if (!elements.length) return;

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.15 }
    );

    elements.forEach((element) => observer.observe(element));
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

    const onScroll = () => {
        const position = window.scrollY + 120;
        let activeId = '';

        sections.forEach((section) => {
            if (position >= section.offsetTop) {
                activeId = section.id;
            }
        });

        navLinks.forEach((link) => {
            const href = link.getAttribute('href') || '';
            link.classList.toggle('active', href === `#${activeId}`);
        });
    };

    window.addEventListener('scroll', onScroll);
    onScroll();
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

        const whatsappUrl = `https://wa.me/5527999933283?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    initHeroABTest();
    initReveal();
    initCounters();
    initFAQ();
    initSmoothScrollAndSpy();
    initConversionTracking();
    initLeadForm();
});