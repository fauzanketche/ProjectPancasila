document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
    initNavigation();
    initHeroCanvas();
    initScrollAnimations();
    initStatCounters();
    initTabs();
    initPolling();
    initEmpathyMirror();
    initDigitalCourt();
    initCommentSimulator();
    initPledge();
});

// ============================
// NAVIGATION
// ============================
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const menuToggle = document.getElementById('menuToggle');
    const menuClose = document.getElementById('menuClose');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileOverlay = document.getElementById('mobileOverlay');
    const mobileLinks = document.querySelectorAll('.mobile-link');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    // Scroll effect
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
        updateActiveNav();
    });

    // Mobile menu
    function openMenu() {
        mobileMenu.classList.add('open');
        mobileOverlay.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
        mobileMenu.classList.remove('open');
        mobileOverlay.classList.remove('open');
        document.body.style.overflow = '';
    }

    menuToggle.addEventListener('click', openMenu);
    menuClose.addEventListener('click', closeMenu);
    mobileOverlay.addEventListener('click', closeMenu);
    mobileLinks.forEach(link => link.addEventListener('click', closeMenu));

    // Active nav on scroll
    function updateActiveNav() {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-section') === current) {
                link.classList.add('active');
            }
        });
    }
}

// ============================
// HERO CANVAS (Particle Network)
// ============================
function initHeroCanvas() {
    const canvas = document.getElementById('heroCanvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationId;
    const PARTICLE_COUNT = 80;
    const CONNECTION_DIST = 150;

    function resize() {
        canvas.width = canvas.offsetWidth * window.devicePixelRatio;
        canvas.height = canvas.offsetHeight * window.devicePixelRatio;
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    }
    resize();
    window.addEventListener('resize', resize);

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.offsetWidth;
            this.y = Math.random() * canvas.offsetHeight;
            this.vx = (Math.random() - 0.5) * 0.6;
            this.vy = (Math.random() - 0.5) * 0.6;
            this.radius = Math.random() * 2.5 + 1;
            this.baseAlpha = Math.random() * 0.4 + 0.1;
            this.alpha = this.baseAlpha;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            if (this.x < 0 || this.x > canvas.offsetWidth) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.offsetHeight) this.vy *= -1;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(200, 149, 108, ${this.alpha})`;
            ctx.fill();
        }
    }

    for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(new Particle());
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

        particles.forEach(p => {
            p.update();
            p.draw();
        });

        // Draw connections
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < CONNECTION_DIST) {
                    const alpha = (1 - dist / CONNECTION_DIST) * 0.15;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(200, 149, 108, ${alpha})`;
                    ctx.lineWidth = 0.8;
                    ctx.stroke();
                }
            }
        }

        animationId = requestAnimationFrame(animate);
    }
    animate();

    // Pause when not visible
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                cancelAnimationFrame(animationId);
            } else {
                animate();
            }
        });
    });
    observer.observe(canvas);
}

// ============================
// SCROLL ANIMATIONS
// ============================
function initScrollAnimations() {
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));
}

// ============================
// STAT COUNTERS
// ============================
function initStatCounters() {
    const counters = document.querySelectorAll('.stat-number[data-target]');
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.getAttribute('data-target'));
                animateCounter(el, 0, target, 1500);
                observer.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(c => observer.observe(c));
}

function animateCounter(el, start, end, duration) {
    const startTime = performance.now();
    const suffix = el.getAttribute('data-suffix') || ''; // Ambil suffix dari HTML (+ atau %)
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // Easing cubic
        const current = Math.floor(start + (end - start) * eased);
        
        // Format angka dengan pemisah ribuan (contoh: 11000 -> 11.000)
        const formattedValue = current.toLocaleString('id-ID');
        
        el.textContent = formattedValue + suffix;
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    requestAnimationFrame(update);
}

// ============================
// TABS
// ============================
function initTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.getAttribute('data-tab');
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById('tab-' + tabId).classList.add('active');
        });
    });
}

// ============================
// POLLING
// ============================
function initPolling() {
    const polls = [
        {
            question: "Ketika seseorang berbeda pendapat di media sosial, reaksi pertama Anda…",
            options: [
                { text: "Langsung membalas dengan argumen balik", votes: 34 },
                { text: "Membaca ulang dan coba pahami dulu", votes: 42 },
                { text: "Mengabaikan dan scroll terus", votes: 18 },
                { text: "Memblokir/mute orang tersebut", votes: 6 }
            ]
        },
        {
            question: "Seberapa sering Anda memverifikasi informasi sebelum membagikannya?",
            options: [
                { text: "Selalu cek sumber dan faktanya", votes: 28 },
                { text: "Kadang-kadang, tergantung topiknya", votes: 45 },
                { text: "Jarang, jika banyak yang share pasti benar", votes: 20 },
                { text: "Tidak pernah", votes: 7 }
            ]
        },
        {
            question: "Menurut Anda, apa penyebab utama diskusi online menjadi tidak sehat?",
            options: [
                { text: "Ego dan tidak mau mendengar", votes: 38 },
                { text: "Anonimitas yang mengurangi rasa tanggung jawab", votes: 30 },
                { text: "Algoritma yang memperkuat echo chamber", votes: 22 },
                { text: "Kurangnya edukasi etika digital", votes: 10 }
            ]
        }
    ];

    const colors = ['#1B3A4B', '#C8956C', '#D4553A', '#2A5A73'];
    let currentPoll = 0;
    let hasVoted = [];

    function renderPoll() {
        const poll = polls[currentPoll];
        const totalVotes = poll.options.reduce((s, o) => s + o.votes, 0);
        const container = document.getElementById('pollContainer');

        container.innerHTML = `
            <div class="mb-3 flex items-center justify-between">
                <span class="text-xs text-gray-400 font-medium">Polling ${currentPoll + 1} / ${polls.length}</span>
                <span class="text-xs text-gray-300">${totalVotes} suara</span>
            </div>
            <h4 class="font-semibold text-primary mb-6">${poll.question}</h4>
            <div class="space-y-3" id="pollOptions">
                ${poll.options.map((opt, i) => {
                    const pct = Math.round((opt.votes / totalVotes) * 100);
                    const voted = hasVoted.includes(currentPoll);
                    return `
                        <div class="poll-bar ${voted ? 'pointer-events-none' : ''}" data-index="${i}">
                            <div class="poll-bar-fill" style="width: ${voted ? pct : 0}%; background: ${colors[i]};">
                                ${voted ? `<span class="text-xs">${opt.text}</span>` : ''}
                            </div>
                            ${!voted ? `<span class="absolute inset-0 flex items-center px-4 text-sm text-gray-600 font-medium">${opt.text}</span>` : ''}
                        </div>
                        ${voted ? `<div class="flex justify-between text-xs px-1"><span class="text-gray-500">${opt.text}</span><span class="font-semibold" style="color:${colors[i]}">${pct}%</span></div>` : ''}
                    `;
                }).join('')}
            </div>
            <div class="flex justify-between mt-8">
                <button id="pollPrevBtn" class="text-sm text-gray-400 hover:text-primary transition-colors flex items-center gap-1 ${currentPoll === 0 ? 'invisible' : ''}" ${currentPoll === 0 ? 'disabled' : ''}>
                    <i data-lucide="chevron-left" class="w-4 h-4"></i> Sebelumnya
                </button>
                <button id="pollNextBtn" class="text-sm text-primary hover:text-secondary transition-colors flex items-center gap-1 ${currentPoll === polls.length - 1 ? 'invisible' : ''}" ${currentPoll === polls.length - 1 ? 'disabled' : ''}>
                    Berikutnya <i data-lucide="chevron-right" class="w-4 h-4"></i>
                </button>
            </div>
        `;

        lucide.createIcons();

        // Click to vote
        if (!hasVoted.includes(currentPoll)) {
            document.querySelectorAll('.poll-bar').forEach(bar => {
                bar.addEventListener('click', () => {
                    const idx = parseInt(bar.getAttribute('data-index'));
                    polls[currentPoll].options[idx].votes += 1;
                    hasVoted.push(currentPoll);
                    renderPoll();
                    showToast('Terima kasih telah berpartisipasi!', 'success');
                });
            });
        }

        // Navigation
        const prevBtn = document.getElementById('pollPrevBtn');
        const nextBtn = document.getElementById('pollNextBtn');
        if (prevBtn) prevBtn.addEventListener('click', () => {
            currentPoll = Math.max(0, currentPoll - 1);
            renderPoll();
        });
        if (nextBtn) nextBtn.addEventListener('click', () => {
            currentPoll = Math.min(polls.length - 1, currentPoll + 1);
            renderPoll();
        });
    }

    renderPoll();
}

// ============================
// CERMIN EMPATI (Empathy Mirror)
// ============================
function initEmpathyMirror() {
    const input = document.getElementById('empathyInput');
    const analyzeBtn = document.getElementById('empathyAnalyze');
    const resultDiv = document.getElementById('empathyResult');

    // Toxic keywords (Indonesian)
    const toxicWords = [
        'bodoh', 'idiot', 'goblok', 'tolol', 'bego', 'dungu', 'stupid', 'dumb',
        'sampah', 'bangsat', 'brengsek', 'kampungan', 'kafir', 'komunis',
        'mati', 'mampus', 'bunuh', 'sialan', 'keparat', 'lacur', 'pelacur',
        'anjing', 'babi', 'katak', 'kadal', 'ular', 'monyet',
        'gila', 'sinting', 'edan', 'norak', 'murahan',
        'pecundang', 'pengkhianat', 'munafik', 'facist', 'fasis',
        'belum pensiun', 'pensiun dulu', 'pamit', 'bubar'
    ];

    const aggressivePatterns = [
        /kamu\s+yang\s+bodoh/i,
        /nggak\s+ada\s+otak/i,
        /pikir\s+dulu/i,
        /mulut\s+busuk/i,
        /tutup\s+mulut/i,
        /jangan\s+ngomong/i,
        /siapa\s+suruh/i,
        /buka\s+mata/i,
        /belum\s+cukup\s+umur/i,
        /belum\s+pensiun/i
    ];

    const dismissivePatterns = [
        /siapa\s+peduli/i,
        /bukan\s+urusan/i,
        /terserah/i,
        /nggak\s+mau\s+tahu/i,
        /bodoh\s+amat/i,
        /emang\s+iya/i,
        /ya\s+sudahlah/i,
        /gapapa\s+kan/i
    ];

    const constructivePhrases = [
        'menurut saya', 'mungkin bisa', 'sebaiknya', 'saya rasa',
        'setuju', 'pendapat', 'mari diskusi', 'terima kasih',
        'maaf', 'permisi', 'mohon maaf', 'saya menghargai',
        'saya paham', 'perspektif', 'sudut pandang', 'mungkin',
        'kiranya', 'ada baiknya', 'bagaimana kalau'
    ];

    analyzeBtn.addEventListener('click', () => {
        const text = input.value.trim();
        if (!text) {
            showToast('Silakan ketik komentar terlebih dahulu', 'warning');
            return;
        }

        // Analyze
        let toxicityScore = 0;
        let foundToxic = [];
        let foundDismissive = 0;
        let foundConstructive = 0;

        // Check toxic words
        const lowerText = text.toLowerCase();
        toxicWords.forEach(word => {
            if (lowerText.includes(word)) {
                toxicityScore += 15;
                foundToxic.push(word);
            }
        });

        // Check aggressive patterns
        aggressivePatterns.forEach(pattern => {
            if (pattern.test(lowerText)) {
                toxicityScore += 20;
            }
        });

        // Check dismissive patterns
        dismissivePatterns.forEach(pattern => {
            if (pattern.test(lowerText)) {
                toxicityScore += 10;
                foundDismissive++;
            }
        });

        // Check constructive phrases
        constructivePhrases.forEach(phrase => {
            if (lowerText.includes(phrase)) {
                foundConstructive++;
                toxicityScore = Math.max(0, toxicityScore - 10);
            }
        });

        // ALL CAPS detection
        const capsRatio = (text.match(/[A-Z]/g) || []).length / text.length;
        if (capsRatio > 0.5 && text.length > 10) toxicityScore += 15;

        // Exclamation marks
        const exclamCount = (text.match(/!/g) || []).length;
        if (exclamCount >= 3) toxicityScore += 10;

        toxicityScore = Math.min(100, Math.max(0, toxicityScore));

        // Determine level
        let level, emoji, color, message, rewrite;
        if (toxicityScore <= 20) {
            level = 'Empatik & Konstruktif';
            emoji = '💚';
            color = '#2D8B55';
            message = 'Komentar Anda menunjukkan empati dan kebijaksanaan. Anda membuktikan bahwa diskusi sehat masih mungkin di era digital.';
            rewrite = text;
        } else if (toxicityScore <= 45) {
            level = 'Cenderung Dismissif';
            emoji = '💛';
            color = '#E67E22';
            message = 'Komentar Anda mungkin tidak bermaksud menyakiti, tapi bisa terasa meremehkan. Coba bayangkan jika Anda yang menerima komentar ini.';
            rewrite = generateRewrite(text, foundToxic, foundDismissive);
        } else if (toxicityScore <= 70) {
            level = 'Agresif & Melukai';
            emoji = '🧡';
            color = '#D4553A';
            message = 'Komentar ini berpotensi menyakiti perasaan orang lain. Ingat, di balik layar ada manusia yang punya perasaan—seperti Anda.';
            rewrite = generateRewrite(text, foundToxic, foundDismissive);
        } else {
            level = 'Sangat Toksik & Merusak';
            emoji = '❤️‍🩹';
            color = '#C0392B';
            message = 'Komentar ini bisa menyebabkan trauma psikologis nyata. Hikmat kebijaksanaan menuntut kita untuk menyampaikan kritik dengan cara yang memanusiakan.';
            rewrite = generateRewrite(text, foundToxic, foundDismissive);
        }

        // Psychological impact
        const impacts = [];
        if (toxicityScore > 20) impacts.push('Kecemasan & stres pada penerima');
        if (toxicityScore > 40) impacts.push('Penurunan kepercayaan diri');
        if (toxicityScore > 60) impacts.push('Isolasi sosial digital');
        if (toxicityScore > 80) impacts.push('Potensi depresi & trauma jangka panjang');

        // Highlight toxic words
        let highlightedText = text;
        foundToxic.forEach(word => {
            const regex = new RegExp(`(${word})`, 'gi');
            highlightedText = highlightedText.replace(regex,
                '<span style="background:#C0392B;color:#fff;padding:1px 6px;border-radius:4px;font-weight:600;">$1</span>'
            );
        });

        resultDiv.innerHTML = `
            <div style="animation: slideInScale 0.5s ease;">
                <div class="text-center mb-6">
                    <div class="text-5xl mb-2 breathe-anim">${emoji}</div>
                    <div class="inline-block px-4 py-1.5 rounded-full text-white text-xs font-bold" style="background:${color};">${level}</div>
                </div>
                <div class="mb-5">
                    <div class="flex justify-between text-xs mb-1.5">
                        <span class="font-medium text-gray-500">Tingkat Dampak Emosional</span>
                        <span class="font-bold" style="color:${color};">${toxicityScore}%</span>
                    </div>
                    <div class="impact-meter">
                        <div class="impact-meter-fill" style="width:${toxicityScore}%;background:${color};"></div>
                    </div>
                </div>
                ${foundToxic.length > 0 ? `
                    <div class="bg-red-50 border border-red-100 rounded-xl p-4 mb-4">
                        <p class="text-xs text-red-600 font-semibold mb-2">Kata/kalimat yang berpotensi melukai:</p>
                        <p class="text-sm text-gray-700 leading-relaxed">${highlightedText}</p>
                    </div>
                ` : ''}
                ${impacts.length > 0 ? `
                    <div class="bg-orange-50 border border-orange-100 rounded-xl p-4 mb-4">
                        <p class="text-xs text-orange-600 font-semibold mb-2">Dampak psikologis yang mungkin ditimbulkan:</p>
                        <ul class="space-y-1">
                            ${impacts.map(imp => `<li class="text-xs text-gray-600 flex items-start gap-2"><span class="text-orange-400 mt-0.5">•</span>${imp}</li>`).join('')}
                        </ul>
                    </div>
                ` : ''}
                <div class="bg-gray-50 rounded-xl p-4 mb-4">
                    <p class="text-sm text-gray-600 leading-relaxed">${message}</p>
                </div>
                ${toxicityScore > 20 ? `
                    <div class="bg-green-50 border border-green-100 rounded-xl p-4">
                        <p class="text-xs text-green-600 font-semibold mb-2">💡 Alternatif yang lebih bijak:</p>
                        <p class="text-sm text-gray-700 leading-relaxed italic">"${rewrite}"</p>
                    </div>
                ` : ''}
            </div>
        `;
    });
}

function generateRewrite(original, toxicWords, dismissiveCount) {
    const rewrites = {
        'bodoh': 'kurang tepat',
        'idiot': 'perlu belajar lebih banyak',
        'goblok': 'belum memahami',
        'tolol': 'mungkin bisa mempertimbangkan ulang',
        'bego': 'belum sepenuhnya paham',
        'dungu': 'mungkin bisa lebih peka',
        'sampah': 'tidak bermanfaat',
        'bangsat': 'tidak terhormat',
        'brengsek': 'kurang bertanggung jawab',
        'gila': 'tidak realistis',
        'sinting': 'kurang masuk akal',
        'anjing': 'tidak baik',
        'babi': 'tidak terhormat',
        'monyet': 'kurang bermartabat',
        'mati': 'tidak diinginkan',
        'sialan': 'menyedihkan',
        'pecundang': 'yang kalah',
        'munafik': 'tidak konsisten',
        'kampungan': 'kurang terbuka',
        'murahan': 'tidak berkualitas',
    };

    let rewritten = original.toLowerCase();
    Object.keys(rewrites).forEach(key => {
        if (rewritten.includes(key)) {
            rewritten = rewritten.replace(new RegExp(key, 'g'), rewrites[key]);
        }
    });

    // Remove excessive punctuation
    rewritten = rewritten.replace(/!{2,}/g, '.');
    rewritten = rewritten.replace(/\?{2,}/g, '?');

    // Add constructive framing if too dismissive
    if (dismissiveCount > 0) {
        rewritten = 'Saya mungkin berbeda pandangan, tapi ' + rewritten;
    }

    // Capitalize first letter
    rewritten = rewritten.charAt(0).toUpperCase() + rewritten.slice(1);

    // Ensure it ends properly
    if (!/[.!?]$/.test(rewritten)) rewritten += '.';

    return rewritten;
}

// ============================
// SIDANG DIGITAL (Digital Court)
// ============================
function initDigitalCourt() {
    const cases = [
        {
            title: "Kasus Komentar Meremehkan terhadap Figur Publik",
            scenario: "Seseorang mengomentari penampilan fisik seorang pejabat publik di media sosial dengan kata-kata merendahkan. Komentar tersebut mendapat ribuan dukungan dari netizen.",
            prosecution: "Komentar ini bukan kritik, tapi penyerangan personal yang merendahkan martabat manusia. Meskipun tidak melanggar hukum pidana secara langsung, ini merusak budaya diskusi sehat dan bertentangan dengan hikmat kebijaksanaan.",
            defense: "Figur publik harus siap dikritik. Ini adalah kebebasan berekspresi. Jika tidak kuat dikritik, jangan jadi pejabat. Selain itu, tidak ada hukum yang melarang berkomentar demikian.",
            victim: "Saya manusia yang punya perasaan. Komentar-komentar itu membuat saya tidak bisa tidur, keluarga saya juga ikut terluka. Anak-anak saya membaca itu di internet.",
            question: "Apakah komentar tersebut salah secara moral, meskipun mungkin tidak melanggar hukum?",
            options: [
                { text: "Tidak salah — kebebasan berekspresi harus diutamakan", wisdom: 1 },
                { text: "Agak salah — tapi wajar terhadap figur publik", wisdom: 2 },
                { text: "Salah secara moral — meski bukan pelanggaran hukum, tetap merusak kemanusiaan", wisdom: 3 },
                { text: "Sangat salah — ini pelanggaran terhadap Sila 4 karena mengabaikan hikmat kebijaksanaan", wisdom: 4 }
            ],
            wisdomMessage: "Hikmat kebijaksanaan mengajarkan bahwa kebebasan bukan berarti bebas dari tanggung jawab moral. Kritik terhadap kinerja adalah hak, tapi menyerang personal adalah pelanggaran kemanusiaan. Sila 4 menuntut musyawarah yang bermartabat."
        },
        {
            title: "Kasus Penyebar Informasi Tidak Terverifikasi tentang Kebijakan Pemerintah",
            scenario: "Seseorang membagikan informasi tentang kebijakan pemerintah yang terbukti tidak akurat. Postingan tersebut sudah dibagikan ribuan kali dan mempengaruhi opini publik sebelum dikoreksi.",
            prosecution: "Menyebarkan informasi tanpa verifikasi adalah bentuk ketidakbijaksanaan. Ini menciptakan kepanikan dan polarisasi, bertentangan dengan semangat musyawarah yang harus dilandasi fakta dan kebenaran.",
            defense: "Saya hanya membagikan apa yang saya baca. Banyak orang juga membagikannya. Ini bukan saya yang membuat informasinya. Kebebasan berpendapat termasuk menyuarakan kekhawatiran.",
            victim: "Kebijakan yang kami buat berdasarkan data dan musyawarah panjang. Informasi palsu itu menghapus semua kerja keras kami dan memicu kebencian terhadap kami yang tidak berdasar.",
            question: "Apakah menyebarkan informasi tanpa verifikasi bertentangan dengan Sila Keempat?",
            options: [
                { text: "Tidak — semua orang berhak membagikan informasi", wisdom: 1 },
                { text: "Mungkin — tapi sulit memverifikasi semua informasi", wisdom: 2 },
                { text: "Ya — karena musyawarah harus dilandasi kebenaran, bukan rumor", wisdom: 3 },
                { text: "Sangat bertentangan — hikmat kebijaksanaan menuntut tanggung jawab atas setiap informasi yang disebarkan", wisdom: 4 }
            ],
            wisdomMessage: "Permusyawaratan yang sehat membutuhkan informasi yang benar. Menyebarkan hoaks, bahkan tanpa sengaja, adalah bentuk ketidakpedulian terhadap kebenaran—lawan dari hikmat kebijaksanaan."
        },
        {
            title: "Kasus Menenggelamkan Suara Minoritas dalam Diskusi Online",
            scenario: "Dalam diskusi online tentang kebijakan publik, kelompok mayoritas menggunakan jumlah massa untuk mendominasi dan menenggelamkan pendapat kelompok minoritas. Suara minoritas tidak pernah benar-benar terdengar.",
            prosecution: "Musyawarah berarti mendengar SEMUA suara, termasuk minoritas. Mendominasi diskusi dengan jumlah bukan musyawarah—itu tirani mayoritas. Sila 4 secara eksplisit menyebut 'perwakilan', artinya semua terwakili.",
            defense: "Dalam demokrasi, suara terbanyak yang menang. Minoritas bisa berpendapat, tapi tidak bisa memaksakan kehendak. Ini bukan penenggelaman, ini demokrasi.",
            victim: "Kami tidak minta menang, kami hanya minta didengar. Tapi setiap kali kami bicara, komentar kami di-report, di-bully, di-drowning. Apakah ini musyawarah?",
            question: "Apakah menenggelamkan suara minoritas bertentangan dengan prinsip permusyawaratan?",
            options: [
                { text: "Tidak — demokrasi berarti mayoritas menang", wisdom: 1 },
                { text: "Sedikit — minoritas memang lebih sedikit pendukungnya", wisdom: 2 },
                { text: "Ya — musyawarah membutuhkan semua suara terdengar", wisdom: 3 },
                { text: "Sangat bertentangan — Sila 4 menekankan 'perwakilan' yang berarti setiap suara harus terwakili dalam musyawarah", wisdom: 4 }
            ],
            wisdomMessage: "Musyawarah bukan voting—bukan jumlah yang menentukan kebenaran. Hikmat kebijaksanaan justru menuntut kita mendengar terutama mereka yang suaranya paling kecil. 'Perwakilan' dalam Sila 4 berarti semua terwakili, bukan hanya yang paling keras."
        }
    ];

    let currentCase = 0;
    let hasAnswered = [];
    let selectedOption = {};

    function renderCase() {
        const c = cases[currentCase];
        const answered = hasAnswered.includes(currentCase);
        const caseDiv = document.getElementById('courtCase');

        caseDiv.innerHTML = `
            <div class="bg-gray-50 rounded-xl p-6 mb-6">
                <h4 class="font-heading font-bold text-primary text-lg mb-3">${c.title}</h4>
                <p class="text-gray-600 text-sm leading-relaxed">${c.scenario}</p>
            </div>
            <div class="grid md:grid-cols-2 gap-4 mb-6">
                <div class="bg-red-50 border border-red-100 rounded-xl p-5">
                    <div class="flex items-center gap-2 mb-3">
                        <i data-lucide="flame" class="w-4 h-4 text-red-500"></i>
                        <span class="text-xs font-bold text-red-600 uppercase tracking-wider">Argumen Penuntut</span>
                    </div>
                    <p class="text-sm text-gray-600 leading-relaxed">${c.prosecution}</p>
                </div>
                <div class="bg-blue-50 border border-blue-100 rounded-xl p-5">
                    <div class="flex items-center gap-2 mb-3">
                        <i data-lucide="shield" class="w-4 h-4 text-blue-500"></i>
                        <span class="text-xs font-bold text-blue-600 uppercase tracking-wider">Argumen Pembela</span>
                    </div>
                    <p class="text-sm text-gray-600 leading-relaxed">${c.defense}</p>
                </div>
            </div>
            <div class="bg-purple-50 border border-purple-100 rounded-xl p-5 mb-6">
                <div class="flex items-center gap-2 mb-3">
                    <i data-lucide="heart-crack" class="w-4 h-4 text-purple-500"></i>
                    <span class="text-xs font-bold text-purple-600 uppercase tracking-wider">Testimoni Pihak yang Terdampak</span>
                </div>
                <p class="text-sm text-gray-600 leading-relaxed italic">"${c.victim}"</p>
            </div>
            <div class="bg-primary/5 border border-primary/10 rounded-xl p-5">
                <p class="font-semibold text-primary text-sm mb-4">${c.question}</p>
                <div class="space-y-3">
                    ${c.options.map((opt, i) => `
                        <button class="court-option w-full text-left px-5 py-3.5 rounded-xl border-2 ${answered ? 'border-gray-200 opacity-50 pointer-events-none' : 'border-gray-200 hover:border-secondary hover:bg-secondary/5'} transition-all text-sm font-medium ${answered && selectedOption[currentCase] === i ? 'border-secondary bg-secondary/10 !opacity-100' : ''}" data-index="${i}" ${answered ? 'disabled' : ''}>
                            <span class="inline-flex items-center justify-center w-6 h-6 rounded-full ${answered && selectedOption[currentCase] === i ? 'bg-secondary text-white' : 'bg-gray-100 text-gray-500'} text-xs font-bold mr-3">${String.fromCharCode(65 + i)}</span>
                            ${opt.text}
                        </button>
                    `).join('')}
                </div>
            </div>
        `;

        if (!answered) {
            document.querySelectorAll('.court-option').forEach(btn => {
                btn.addEventListener('click', () => {
                    const idx = parseInt(btn.getAttribute('data-index'));
                    selectedOption[currentCase] = idx;
                    hasAnswered.push(currentCase);
                    renderCase();
                    showVerdict(c, idx);
                });
            });
        }

        if (answered && selectedOption[currentCase] !== undefined) {
            showVerdict(c, selectedOption[currentCase]);
        }

        lucide.createIcons();
        updateCourtNav();
    }

    function showVerdict(c, optionIdx) {
        const verdictDiv = document.getElementById('courtVerdict');
        const wisdom = c.options[optionIdx].wisdom;
        const wisdomLevel = wisdom >= 4 ? 'Sangat Bijak' : wisdom >= 3 ? 'Bijak' : wisdom >= 2 ? 'Cukup' : 'Perlu Refleksi';
        const wisdomColor = wisdom >= 4 ? '#2D8B55' : wisdom >= 3 ? '#1B3A4B' : wisdom >= 2 ? '#E67E22' : '#C0392B';
        const wisdomEmoji = wisdom >= 4 ? '⚖️✨' : wisdom >= 3 ? '⚖️' : wisdom >= 2 ? '🤔' : '💭';

        verdictDiv.classList.remove('hidden');
        verdictDiv.innerHTML = `
            <div class="verdict-card border-2 rounded-xl p-6 mt-6" style="border-color:${wisdomColor}20; background:${wisdomColor}05;">
                <div class="text-center mb-4">
                    <div class="text-3xl mb-2">${wisdomEmoji}</div>
                    <span class="inline-block px-4 py-1 rounded-full text-white text-xs font-bold" style="background:${wisdomColor};">Skor Kebijaksanaan: ${wisdom}/4 — ${wisdomLevel}</span>
                </div>
                <div class="bg-white rounded-xl p-5">
                    <h4 class="font-heading font-bold text-primary mb-2 flex items-center gap-2">
                        <i data-lucide="book-open" class="w-4 h-4 text-secondary"></i>
                        Pertimbangan Hikmat Kebijaksanaan
                    </h4>
                    <p class="text-sm text-gray-600 leading-relaxed">${c.wisdomMessage}</p>
                </div>
                ${wisdom < 3 ? `
                    <p class="text-xs text-center text-gray-400 mt-4 italic">Coba pikirkan ulang dari sudut pandang pihak yang terdampak. Hikmat kebijaksanaan dimulai dari kesediaan mendengar semua suara.</p>
                ` : ''}
            </div>
        `;
        lucide.createIcons();
    }

    function updateCourtNav() {
        const prevBtn = document.getElementById('courtPrev');
        const nextBtn = document.getElementById('courtNext');
        const counter = document.getElementById('courtCounter');
        prevBtn.disabled = currentCase === 0;
        nextBtn.innerHTML = currentCase === cases.length - 1
            ? 'Selesai <i data-lucide="check" class="w-4 h-4"></i>'
            : 'Berikutnya <i data-lucide="chevron-right" class="w-4 h-4"></i>';
        counter.textContent = `Kasus ${currentCase + 1} / ${cases.length}`;
        lucide.createIcons();
    }

    document.getElementById('courtPrev').addEventListener('click', () => {
        currentCase = Math.max(0, currentCase - 1);
        document.getElementById('courtVerdict').classList.add('hidden');
        renderCase();
    });

    document.getElementById('courtNext').addEventListener('click', () => {
        currentCase = Math.min(cases.length - 1, currentCase + 1);
        document.getElementById('courtVerdict').classList.add('hidden');
        renderCase();
    });

    renderCase();
}

// ============================
// SIMULASI KOMENTAR
// ============================
function initCommentSimulator() {
    const comments = [
        {
            text: "Kebijakan ini punya sisi positif dan negatif. Mari kita diskusikan solusinya bersama.",
            type: "good",
            explanation: "Komentar ini konstruktif karena mengakui kompleksitas isu dan mengundang dialog."
        },
        {
            text: "Lo yang bikin kebijakan ini otaknya di mana sih? Udah bodoh jangan berkuasa!",
            type: "toxic",
            explanation: "Komentar ini destruktif karena menyerang personal, bukan substansi kebijakan. Ini bertentangan dengan hikmat kebijaksanaan."
        },
        {
            text: "Saya tidak setuju dengan pendekatan ini karena datanya menunjukkan hasil berbeda. Ini referensinya: [link].",
            type: "good",
            explanation: "Komentar ini konstruktif karena mengkritik ide dengan data, bukan menyerang orang."
        },
        {
            text: "Orang yang setuju kebijakan ini jelas ga punya otak. Block semua aja yang ga sependapat!",
            type: "toxic",
            explanation: "Komentar ini mendorong intoleransi dan menolak dialog—lawan dari musyawarah."
        },
        {
            text: "Terima kasih sudah menjelaskan. Saya masih punya kekhawatiran di beberapa poin, boleh saya tanya?",
            type: "good",
            explanation: "Komentar ini menunjukkan kesediaan mendengar sebelum merespons—intisari hikmat kebijaksanaan."
        },
        {
            text: "Wong miskin ngomong apa sih? Udahlah urusan kalian bukan urusan gue!",
            type: "toxic",
            explanation: "Komentar ini meremehkan hak orang lain untuk berpendapat dan menghilangkan prinsip perwakilan dalam musyawarah."
        },
        {
            text: "Mungkin kita bisa cari titik temu di sini. Tidak semua harus hitam-putih.",
            type: "good",
            explanation: "Komentar ini mencari solusi melalui musyawarah—implementasi langsung Sila 4."
        },
        {
            text: "Share ini biar semua tahu betapa bobroknya orang ini! Jangan dengerin dia!",
            type: "toxic",
            explanation: "Komentar ini mendorong pembatalan tanpa mendengar—bertentangan dengan permusyawaratan."
        }
    ];

    let currentIndex = 0;
    let score = 0;
    let shuffled = [...comments].sort(() => Math.random() - 0.5);

    function renderComment() {
        const container = document.getElementById('commentSimContainer');
        const resultDiv = document.getElementById('commentSimResult');
        const scoreEl = document.getElementById('empathyScore');
        const totalEl = document.getElementById('totalQuestions');

        if (currentIndex >= shuffled.length) {
            const pct = Math.round((score / shuffled.length) * 100);
            const emoji = pct >= 80 ? '🌟' : pct >= 60 ? '😊' : pct >= 40 ? '🤔' : '💪';
            const msg = pct >= 80 ? 'Luar biasa! Anda memiliki empati digital yang tinggi!' :
                       pct >= 60 ? 'Bagus! Anda cukup peka terhadap etika digital.' :
                       pct >= 40 ? 'Perlu peningkatan. Coba ingat pesan Sila 4!' :
                       'Mari belajar lebih banyak tentang empati dan hikmat kebijaksanaan.';

            container.innerHTML = `
                <div class="text-center py-8">
                    <div class="text-5xl mb-4">${emoji}</div>
                    <h4 class="font-heading font-bold text-primary text-xl mb-2">Hasil Simulasi</h4>
                    <p class="text-gray-500 text-sm mb-4">Skor Empati Anda: <strong class="text-primary">${score} / ${shuffled.length}</strong> (${pct}%)</p>
                    <p class="text-gray-600 text-sm max-w-md mx-auto">${msg}</p>
                    <button id="restartCommentSim" class="mt-6 bg-primary hover:bg-primary-light text-white font-semibold px-6 py-3 rounded-xl transition-all text-sm">
                        Ulangi Simulasi
                    </button>
                </div>
            `;
            document.getElementById('restartCommentSim').addEventListener('click', () => {
                currentIndex = 0;
                score = 0;
                shuffled = [...comments].sort(() => Math.random() - 0.5);
                resultDiv.classList.add('hidden');
                scoreEl.textContent = '0';
                renderComment();
            });
            return;
        }

        const c = shuffled[currentIndex];
        scoreEl.textContent = score;
        totalEl.textContent = shuffled.length;

        container.innerHTML = `
            <div class="mb-4 flex items-center justify-between">
                <span class="text-xs text-gray-400">Komentar ${currentIndex + 1} / ${shuffled.length}</span>
            </div>
            <div class="comment-bubble ${c.type === 'good' ? 'comment-good' : 'comment-toxic'} mb-6 mx-auto">
                <p class="text-sm">${c.text}</p>
            </div>
            <p class="text-center text-gray-500 text-sm mb-6">Klasifikasikan komentar di atas:</p>
            <div class="flex gap-3">
                <button class="comment-classify flex-1 py-4 rounded-xl border-2 border-green-200 hover:border-green-500 hover:bg-green-50 transition-all font-semibold text-sm text-green-700" data-type="good">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 mx-auto mb-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 10v12"/><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z"/></svg>
                    Konstruktif
                </button>
                <button class="comment-classify flex-1 py-4 rounded-xl border-2 border-red-200 hover:border-red-500 hover:bg-red-50 transition-all font-semibold text-sm text-red-700" data-type="toxic">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 mx-auto mb-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 14V2"/><path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22h0a3.13 3.13 0 0 1-3-3.88Z"/></svg>
                    Destruktif
                </button>
            </div>
        `;

        document.querySelectorAll('.comment-classify').forEach(btn => {
            btn.addEventListener('click', () => {
                const chosen = btn.getAttribute('data-type');
                const correct = chosen === c.type;
                if (correct) score++;

                const resultDiv = document.getElementById('commentSimResult');
                resultDiv.classList.remove('hidden');
                resultDiv.className = `mt-6 p-5 rounded-xl text-center ${correct ? 'bg-green-50 border border-green-100' : 'bg-red-50 border border-red-100'}`;
                resultDiv.innerHTML = `
                    <p class="font-semibold text-sm ${correct ? 'text-green-700' : 'text-red-700'} mb-2">${correct ? '✅ Benar!' : '❌ Kurang tepat.'}</p>
                    <p class="text-xs text-gray-600">${c.explanation}</p>
                `;

                document.getElementById('empathyScore').textContent = score;
                currentIndex++;
                setTimeout(() => {
                    resultDiv.classList.add('hidden');
                    renderComment();
                }, 2500);
            });
        });
    }

    renderComment();
}

// ============================
// PLEDGE (Ikrar Digital)
// ============================
function initPledge() {
    const pledgeBtn = document.getElementById('pledgeBtn');
    const pledgeInput = document.getElementById('pledgeName');
    const pledgeList = document.getElementById('pledgeList');
    let pledges = JSON.parse(localStorage.getItem('digitalPledges') || '[]');

    function renderPledges() {
        pledgeList.innerHTML = pledges.map(p => `
            <span class="inline-flex items-center gap-1.5 bg-white/10 border border-white/10 rounded-full px-4 py-2 text-xs text-white/70">
                <span class="text-secondary">♥</span> ${p}
            </span>
        `).join('');
    }
    renderPledges();

    pledgeBtn.addEventListener('click', () => {
        const name = pledgeInput.value.trim();
        if (!name) {
            showToast('Silakan masukkan nama atau inisial Anda', 'warning');
            return;
        }
        if (pledges.includes(name)) {
            showToast('Nama tersebut sudah terdaftar', 'warning');
            return;
        }
        pledges.push(name);
        localStorage.setItem('digitalPledges', JSON.stringify(pledges));
        renderPledges();
        pledgeInput.value = '';
        showToast(`Terima kasih, ${name}! Komitmen Anda tercatat. 🤍`, 'success');
    });
}

// ============================
// TOAST NOTIFICATION
// ============================
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(20px)';
        toast.style.transition = 'all 0.3s';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}