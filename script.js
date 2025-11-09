// ========== Utilidades ==========
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

// ========== Sidebar Toggle ==========
const menuToggle = $('#menuToggle');
const sidebar = $('#sidebar');

menuToggle.addEventListener('click', () => {
    const isActive = sidebar.classList.toggle('activo');
    // Solo cambia opacidad/posición si usas esa animación.
    // Pero en realidad, es mejor NO mover el botón (confunde al usuario).
    // En su lugar, podrías animar las líneas → sugerencia opcional.
    menuToggle.setAttribute('aria-expanded', isActive);
});

// ========== Cambiar secciones ==========
const sections = {
    compra: $('#compraMenu'),
    scripts: $('#scriptsMenu'),
    soporte: $('#soporteMenu')
};

function mostrarMenu(sectionKey) {
    // Ocultar todas
    Object.values(sections).forEach(sec => sec.classList.remove('activo'));
    // Mostrar la seleccionada
    sections[sectionKey]?.classList.add('activo');
    // Cerrar sidebar
    sidebar.classList.remove('activo');
    menuToggle.setAttribute('aria-expanded', 'false');
}

// Vincular botones dinámicamente
const menuButtons = {
    btnCompra: 'compra',
    btnScripts: 'scripts',
    btnSoporte: 'soporte'
};

Object.entries(menuButtons).forEach(([id, section]) => {
    const btn = $(`#${id}`);
    if (btn) btn.addEventListener('click', () => mostrarMenu(section));
});

// ========== Modal de Descarga ==========
const modal = $('#modal');
const modalText = $('#modal-text');
const modalImg = $('#modal-img');
const btnYes = $('#modal-yes');
const btnNo = $('#modal-no');

let currentDownloadLink = '';

// Solo botones de descarga (excluye "Ver Código")
$$('.producto a.glow-button:not(.ver-codigo)').forEach(btn => {
    btn.addEventListener('click', e => {
        e.preventDefault();
        const producto = btn.closest('.producto');
        const nombre = producto.dataset.nombre;
        const img = producto.dataset.img?.trim() || '';
        currentDownloadLink = producto.dataset.link?.trim() || '';

        modalText.textContent = `¿Quieres instalar este ${nombre}?`;
        modalImg.src = img;
        modalImg.alt = nombre;
        modal.style.display = 'flex';
    });
});

btnNo.addEventListener('click', () => modal.style.display = 'none');

btnYes.addEventListener('click', () => {
    if (currentDownloadLink) {
        // Crear enlace y simular clic
        const a = document.createElement('a');
        a.href = currentDownloadLink;
        a.download = currentDownloadLink.split('/').pop() || 'archivo';
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        currentDownloadLink = '';
    }
    modal.style.display = 'none';
});

// Cerrar modal al hacer clic fuera
window.addEventListener('click', e => {
    if (e.target === modal) modal.style.display = 'none';
});

// ========== Modal de Código ==========
const modalCodigo = $('#modal-codigo');
const codigoTitle = $('#codigo-title');
const codigoText = $('#codigo-text');

$$('.ver-codigo').forEach(btn => {
    btn.addEventListener('click', e => {
        e.preventDefault();
        const producto = btn.closest('.producto');
        codigoTitle.textContent = producto.dataset.nombre || 'Código';
        // Decodificamos saltos de línea si usaste &#10;
        let code = producto.dataset.codigo || '// Sin código disponible';
        code = code.replace(/&#10;/g, '\n');
        codigoText.textContent = code;
        modalCodigo.style.display = 'flex';
    });
});

$('#cerrar-codigo')?.addEventListener('click', () => {
    modalCodigo.style.display = 'none';
});

window.addEventListener('click', e => {
    if (e.target === modalCodigo) modalCodigo.style.display = 'none';
});

// ========== Estrellas flotantes ==========
const starsContainer = $('#stars');
const stars = [];

// Crear estrellas
for (let i = 0; i < 50; i++) {
    const size = Math.random() * 4 + 2;
    const star = document.createElement('div');
    star.className = 'star';
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    star.style.opacity = Math.random() * 0.7 + 0.3;
    star.style.left = `${Math.random() * 100}%`;
    star.style.top = `${Math.random() * 100}%`;
    starsContainer.appendChild(star);

    stars.push({
        el: star,
        x: parseFloat(star.style.left),
        y: parseFloat(star.style.top),
        vx: (Math.random() - 0.5) * 0.05,
        vy: (Math.random() - 0.5) * 0.05
    });
}

// Animación suave con límites más realistas
function animateStars() {
    stars.forEach(star => {
        star.x += star.vx;
        star.y += star.vy;

        // Rebote suave en bordes
        if (star.x <= 0 || star.x >= 100) star.vx *= -1;
        if (star.y <= 0 || star.y >= 100) star.vy *= -1;

        // Mantener dentro de límites
        star.x = Math.max(0, Math.min(100, star.x));
        star.y = Math.max(0, Math.min(100, star.y));

        star.el.style.left = `${star.x}%`;
        star.el.style.top = `${star.y}%`;
    });
    requestAnimationFrame(animateStars);
}

animateStars();

// ========== Mejoras de accesibilidad ==========
// Cerrar menú con ESC
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
        sidebar.classList.remove('activo');
        modal.style.display = 'none';
        modalCodigo.style.display = 'none';
        menuToggle.setAttribute('aria-expanded', 'false');
    }
});