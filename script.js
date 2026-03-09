// Initialize AOS
AOS.init({
    duration: 800,
    once: true,
    offset: 50
});

// ===== WAIT FOR DOM TO LOAD =====
document.addEventListener('DOMContentLoaded', () => {
    initLoader();
    initCursor();
    initNavigation();
    initThreeJS();
    initTabs();
    initSkillBars();
    initPageTransitions();
    initContactForm();
    initBackToTop();
});

// ===== LOADING SCREEN =====
function initLoader() {
    const loader = document.getElementById('loading');
    
    setTimeout(() => {
        loader.classList.add('hidden');
    }, 2000);
}

// ===== CUSTOM CURSOR =====
function initCursor() {
    const cursor = document.querySelector('.cursor');
    const follower = document.querySelector('.cursor-follower');
    
    if (!cursor || !follower) return;
    
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
        
        setTimeout(() => {
            follower.style.left = e.clientX + 'px';
            follower.style.top = e.clientY + 'px';
        }, 100);
    });
    
    const hoverElements = document.querySelectorAll('a, button, .btn, .skill-card, .project-card, .service-card');
    
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('hover');
            follower.classList.add('hover');
        });
        
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('hover');
            follower.classList.remove('hover');
        });
    });
}

// ===== NAVIGATION =====
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (!navbar || !menuToggle || !navMenu) return;
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    menuToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        menuToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
            menuToggle.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            const targetId = link.getAttribute('href');
            
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            menuToggle.classList.remove('active');
            navMenu.classList.remove('active');
            
            changePage(targetId);
        });
    });
}

// ===== PAGE TRANSITIONS =====
function changePage(targetId) {
    const currentPage = document.querySelector('.page.active');
    const targetPage = document.querySelector(targetId);
    const transition = document.querySelector('.page-transition');
    
    if (!currentPage || !targetPage || currentPage === targetPage) return;
    
    transition.classList.add('active');
    
    setTimeout(() => {
        currentPage.classList.remove('active');
        targetPage.classList.add('active');
        
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        
        if (targetId === '#skills') {
            setTimeout(initSkillBars, 500);
        }
        
        AOS.refresh();
    }, 250);
    
    setTimeout(() => {
        transition.classList.remove('active');
    }, 500);
}

// ===== THREE.JS 3D MODEL =====
function initThreeJS() {
    const container = document.getElementById('canvas-container');
    if (!container) return;
    
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }
    
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0a);
    
    const aspect = container.clientWidth / container.clientHeight;
    const camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 1000);
    
    if (window.innerWidth <= 768) {
        camera.position.z = 8;
        camera.position.y = 1;
    } else {
        camera.position.z = 6;
        camera.position.y = 0;
    }
    
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);
    
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    const pointLight = new THREE.PointLight(0x2ecc71, 1, 10);
    pointLight.position.set(2, 3, 4);
    scene.add(pointLight);
    
    const geometry = new THREE.IcosahedronGeometry(1.2, 2);
    const material = new THREE.MeshPhongMaterial({
        color: 0x2ecc71,
        emissive: 0x1a6b3a,
        wireframe: true,
        transparent: true,
        opacity: 0.9
    });
    
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    
    const sphereGeo = new THREE.SphereGeometry(0.6, 32, 32);
    const sphereMat = new THREE.MeshStandardMaterial({
        color: 0x2ecc71,
        emissive: 0x1a6b3a,
        transparent: true,
        opacity: 0.2
    });
    const sphere = new THREE.Mesh(sphereGeo, sphereMat);
    scene.add(sphere);
    
    const particlesCount = window.innerWidth <= 768 ? 500 : 1000;
    const particlesGeo = new THREE.BufferGeometry();
    const posArray = new Float32Array(particlesCount * 3);
    
    for(let i = 0; i < particlesCount * 3; i += 3) {
        posArray[i] = (Math.random() - 0.5) * 10;
        posArray[i+1] = (Math.random() - 0.5) * 10;
        posArray[i+2] = (Math.random() - 0.5) * 10;
    }
    
    particlesGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    
    const particlesMat = new THREE.PointsMaterial({
        size: window.innerWidth <= 768 ? 0.03 : 0.02,
        color: 0x2ecc71,
        transparent: true,
        opacity: 0.5
    });
    
    const particles = new THREE.Points(particlesGeo, particlesMat);
    scene.add(particles);
    
    let mouseX = 0;
    let mouseY = 0;
    
    if (window.innerWidth > 992) {
        document.addEventListener('mousemove', (event) => {
            mouseX = (event.clientX / window.innerWidth) * 2 - 1;
            mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
        });
    }
    
    function animate() {
        requestAnimationFrame(animate);
        
        mesh.rotation.x += 0.003;
        mesh.rotation.y += 0.005;
        
        sphere.rotation.x -= 0.002;
        sphere.rotation.y -= 0.003;
        
        particles.rotation.y += 0.0003;
        
        if (window.innerWidth > 992) {
            mesh.position.x += (mouseX * 2 - mesh.position.x) * 0.03;
            mesh.position.y += (mouseY * 2 - mesh.position.y) * 0.03;
            
            sphere.position.x += (mouseX * 1.5 - sphere.position.x) * 0.03;
            sphere.position.y += (mouseY * 1.5 - sphere.position.y) * 0.03;
        }
        
        renderer.render(scene, camera);
    }
    
    animate();
    
    window.addEventListener('resize', () => {
        const width = container.clientWidth;
        const height = container.clientHeight;
        
        camera.aspect = width / height;
        
        if (window.innerWidth <= 768) {
            camera.position.z = 8;
            camera.position.y = 1;
        } else {
            camera.position.z = 6;
            camera.position.y = 0;
        }
        
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
    });
}

// ===== TABS =====
function initTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.getAttribute('data-tab');
            
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            
            btn.classList.add('active');
            const content = document.getElementById(tabId + '-tab');
            if (content) {
                content.classList.add('active');
            }
        });
    });
}

// ===== SKILL BARS =====
function initSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    
    skillBars.forEach(bar => {
        const progress = bar.getAttribute('data-progress');
        bar.style.width = progress + '%';
    });
}

// ===== CONTACT FORM =====
function initContactForm() {
    const form = document.getElementById('contactForm');
    
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Message sent successfully!');
            form.reset();
        });
    }
}

// ===== BACK TO TOP =====
function initBackToTop() {
    const backToTop = document.getElementById('backToTop');
    
    if (!backToTop) return;
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }
    });
    
    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ===== CHECK INITIAL HASH =====
if (window.location.hash) {
    const targetId = window.location.hash;
    const targetPage = document.querySelector(targetId);
    
    if (targetPage) {
        document.querySelector('.page.active').classList.remove('active');
        targetPage.classList.add('active');
        
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === targetId) {
                link.classList.add('active');
            }
        });
    }
}