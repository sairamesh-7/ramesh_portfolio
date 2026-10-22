// Sticky navbar background effect on scroll
window.addEventListener('scroll', function () {
    const nav = document.querySelector('nav');
    if (nav) {
        if (window.scrollY > 50) {
            nav.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
            nav.style.transition = '0.5s ease';
        } else {
            nav.style.backgroundColor = 'transparent';
        }
    }
});

// Card entrance animations using IntersectionObserver
const cards = document.querySelectorAll('.card');

if (cards.length > 0) {
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        },
        { threshold: 0.1 }
    );

    cards.forEach((card) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(50px)';
        card.style.transition = '1s ease-out';
        observer.observe(card);
    });
}

// Automatically close mobile menu dropdown on link selection
const navLinks = document.querySelectorAll('.nav-link');
const navCollapse = document.querySelector('.navbar-collapse');

navLinks.forEach((link) => {
    link.addEventListener('click', () => {
        if (navCollapse && navCollapse.classList.contains('show')) {
            const bsCollapse = bootstrap.Collapse.getInstance(navCollapse);
            if (bsCollapse) {
                bsCollapse.hide();
            }
        }
    });
});
