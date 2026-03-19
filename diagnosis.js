/* diagnosis.js - Logic for step-by-step form progression */

let currentStep = 0;
const totalSteps = 6; // 0 to 6

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    updateProgress();
    setupVibeLimit();
    
    // Add enter key support for inputs
    document.querySelectorAll('input[type="text"]').forEach(input => {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                // Find next button in the same step
                const nextBtn = input.closest('.step-card').querySelector('.btn-primary');
                if (nextBtn) nextBtn.click();
            }
        });
    });
});

// Toggle "기타" free-text input for category
function toggleCategoryOther() {
    const selected = document.querySelector('input[name="category"]:checked');
    const btn = document.getElementById('categoryOtherBtn');
    const input = document.getElementById('categoryOther');
    if (selected && selected.value === '기타') {
        btn.style.display = 'none';
        input.style.display = 'inline-block';
        input.focus();
    } else {
        btn.style.display = '';
        input.style.display = 'none';
        input.value = '';
    }
}

function nextStep(stepIndex) {
    // Step 1 → 2: 브랜드명 필수
    if (currentStep === 1) {
        const bName = document.getElementById('brandName').value.trim();
        if (!bName) {
            showValidationError('브랜드명을 입력해 주세요.');
            document.getElementById('brandName').focus();
            return;
        }
    }
    
    // Step 4 → 5: 필요 서비스 최소 1개 선택
    if (currentStep === 4) {
        const services = document.querySelectorAll('input[name="service"]:checked');
        if (services.length === 0) {
            showValidationError('필요한 서비스를 최소 1개 선택해 주세요.');
            return;
        }
    }
    
    goToStep(stepIndex);
}

// 연락처 형식 검증 (이메일 또는 전화번호)
function isValidContact(value) {
    // 이메일 형식
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // 전화번호 형식 (010-1234-5678, 01012345678, 010 1234 5678 등)
    const phoneRegex = /^0\d{1,2}[-\s]?\d{3,4}[-\s]?\d{4}$/;
    return emailRegex.test(value) || phoneRegex.test(value.replace(/\s/g, ''));
}

// 검증 에러 토스트
function showValidationError(msg) {
    // 기존 토스트 제거
    const existing = document.querySelector('.validation-toast');
    if (existing) existing.remove();
    
    const toast = document.createElement('div');
    toast.className = 'validation-toast';
    toast.textContent = msg;
    toast.style.cssText = `
        position: fixed; bottom: 40px; left: 50%; transform: translateX(-50%);
        background: #e74c3c; color: #fff; padding: 14px 28px; border-radius: 50px;
        font-size: 14px; font-weight: 600; z-index: 9999;
        animation: fadeInUp 0.3s ease;
        box-shadow: 0 8px 24px rgba(231, 76, 60, 0.4);
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

function prevStep() {
    if (currentStep > 0) {
        goToStep(currentStep - 1);
    }
}

function goToStep(stepIndex) {
    const steps = document.querySelectorAll('.step-card');
    
    // Smooth transition
    steps.forEach((step, idx) => {
        if (idx === stepIndex) {
            step.classList.add('active');
        } else {
            step.classList.remove('active');
        }
    });
    
    currentStep = stepIndex;
    updateProgress();
    
    // Scroll to top mobile view if needed
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateProgress() {
    const progressFill = document.getElementById('progressFill');
    // Step 0 = 0%, Step 1 = 20%, Step 2 = 40% ... Step 5 = 100%, Step 6 = hidden/completed
    if (currentStep === 0) {
        progressFill.style.width = '0%';
    } else if (currentStep === totalSteps) {
        progressFill.style.width = '100%';
    } else {
        const percentage = (currentStep / (totalSteps - 1)) * 100;
        progressFill.style.width = `${percentage}%`;
    }
}

// Enforce limit on tags (e.g. max 3 vibes)
function setupVibeLimit() {
    const vibeCheckboxes = document.querySelectorAll('input[name="vibe"]');
    
    vibeCheckboxes.forEach(box => {
        box.addEventListener('change', () => {
            const checkedCount = document.querySelectorAll('input[name="vibe"]:checked').length;
            if (checkedCount > 3) {
                box.checked = false;
                // Optional: show small toast/alert
            }
        });
    });
}

function submitForm() {
    // 1. Gather all form data
    const company = document.getElementById('brandName').value.trim() || '미입력 브랜드(진단)';
    const industryNode = document.querySelector('input[name="category"]:checked');
    const industry = industryNode ? industryNode.value : '기타';
    
    // Pain Points
    const painpoints = Array.from(document.querySelectorAll('input[name="painpoint"]:checked')).map(el => {
        if(el.value === '기타') {
            const extra = document.getElementById('painpoint_other').value.trim();
            return extra ? `기타: ${extra}` : '기타';
        }
        return el.value;
    });

    // Vibes
    const vibes = Array.from(document.querySelectorAll('input[name="vibe"]:checked')).map(el => el.value);
    const reference = document.getElementById('reference').value.trim();

    // Services
    const servicesNodes = document.querySelectorAll('input[name="service"]:checked');
    const services = Array.from(servicesNodes).map(el => {
        if(el.value === '기타') {
            const extra = document.getElementById('service_other').value.trim();
            return extra ? `기타: ${extra}` : '기타';
        }
        return el.value;
    });
    
    let totalEstimate = 0;
    servicesNodes.forEach(svc => {
        if (svc.dataset.price) {
            totalEstimate += parseInt(svc.dataset.price, 10);
        }
    });

    // Budget & Timeline & Contact
    const budget = document.getElementById('budget').value || '미입력';
    const timeline = document.getElementById('timeline').value || '미입력';
    const contactName = document.getElementById('contactName').value.trim() || '담당자 미상';
    const contactInfo = document.getElementById('contactInfo').value.trim() || '';
    
    // 연락처 필수 + 형식 검증
    if (!contactInfo) {
        showValidationError('연락처(이메일 또는 전화번호)를 입력해 주세요.');
        document.getElementById('contactInfo').focus();
        return;
    }
    if (!isValidContact(contactInfo)) {
        showValidationError('올바른 이메일 또는 전화번호 형식으로 입력해 주세요.');
        document.getElementById('contactInfo').focus();
        return;
    }

    let email = '';
    let phone = '';
    if (contactInfo.includes('@')) {
        email = contactInfo;
    } else {
        phone = contactInfo;
    }

    // 2. Format Notes for CRM
    const notesStr = `[브랜드 진단 신청]
- 예상 예산: ${budget}
- 희망 일정: ${timeline}
- 레퍼런스: ${reference || '없음'}

[현재 고민]
${painpoints.join(', ') || '없음'}

[원하는 무드]
${vibes.join(', ') || '없음'}

[필요 서비스]
${services.join('\n') || '없음'}

[선택 항목 예상 견적]
₩${totalEstimate.toLocaleString()}~`;

    // 3. Send to Google Sheets (via Apps Script)
    // ★ 배포 후 받은 URL을 여기에 붙여넣으세요!
    const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzvtoDilf-0vQENCc5bASaGEXIu-c8fE8rPKL_I-Vx-sNpSg-KdnwVTzfgwkgmbS3DH/exec';
    
    const sheetData = {
        company: company,
        industry: industry,
        contact: contactName,
        email: email,
        phone: phone,
        painpoints: painpoints.join(', '),
        vibes: vibes.join(', '),
        reference: reference,
        services: services.join(', '),
        budget: budget,
        timeline: timeline,
        estimate: `₩${totalEstimate.toLocaleString()}~`
    };

    // Google Sheets로 전송 (hidden iframe 방식 - CORS 우회)
    if (GOOGLE_SCRIPT_URL !== 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE') {
        try {
            // 숨겨진 iframe 생성
            let iframe = document.getElementById('hidden-submit-frame');
            if (!iframe) {
                iframe = document.createElement('iframe');
                iframe.id = 'hidden-submit-frame';
                iframe.name = 'hidden-submit-frame';
                iframe.style.display = 'none';
                document.body.appendChild(iframe);
            }
            // 숨겨진 form 생성
            const form = document.createElement('form');
            form.method = 'POST';
            form.action = GOOGLE_SCRIPT_URL;
            form.target = 'hidden-submit-frame';
            form.style.display = 'none';
            // 데이터를 hidden input으로 변환
            Object.keys(sheetData).forEach(key => {
                const input = document.createElement('input');
                input.type = 'hidden';
                input.name = key;
                input.value = sheetData[key];
                form.appendChild(input);
            });
            document.body.appendChild(form);
            form.submit();
            form.remove();
            console.log('✅ Google Sheets 전송 완료');
        } catch(err) {
            console.error('❌ Google Sheets 전송 실패:', err);
        }
    } else {
        console.warn('⚠️ Google Apps Script URL이 설정되지 않았습니다.');
    }

    // LocalStorage 백업 (CRM 연동용)
    try {
        let clients = JSON.parse(localStorage.getItem('unnybus_clients')) || [];
        const newClient = {
            id: Date.now(),
            company: company,
            contact: contactName,
            email: email,
            phone: phone,
            industry: industry,
            website: '',
            notes: notesStr,
            status: '수집됨',
            platform: '홈페이지 진단',
            createdAt: new Date().toISOString()
        };
        clients.unshift(newClient);
        localStorage.setItem('unnybus_clients', JSON.stringify(clients));
    } catch(e) {
        console.error("LocalStorage 백업 실패:", e);
    }

    // 4. Update UI Estimate
    const estimateDisplay = document.getElementById('estimateResult');
    if (estimateDisplay) {
        estimateDisplay.innerHTML = '';
    }

    // 5. Move to success step & Confetti
    nextStep(6);
    document.querySelector('.progress-bar-container').style.opacity = '0';
    triggerConfetti();
}

function triggerConfetti() {
    if (typeof confetti === 'function') {
        var duration = 3000;
        var end = Date.now() + duration;

        (function frame() {
            // launch a few confetti from the left edge
            confetti({
                particleCount: 7,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: ['#3B82F6', '#0984e3', '#ffffff']
            });
            // and launch a few from the right edge
            confetti({
                particleCount: 7,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: ['#3B82F6', '#0984e3', '#ffffff']
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        }());
    }
}

function toggleOtherInput(wrapperId) {
    const wrapper = document.getElementById(wrapperId);
    if (!wrapper) return;
    const checkbox = wrapper.previousElementSibling.querySelector('input[type="checkbox"]');
    if (checkbox && checkbox.checked) {
        wrapper.style.display = 'block';
        setTimeout(() => wrapper.querySelector('input').focus(), 50);
    } else {
        wrapper.style.display = 'none';
        wrapper.querySelector('input').value = '';
    }
}
