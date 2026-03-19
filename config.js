/**
 * config.js
 * UNNYBUS Global Configuration File
 * 이 파일에서 가격을 수정하면 홈페이지 전체(메인, 견적안내, 진단하기)의 가격이 자동으로 업데이트됩니다.
 */

const UNNYBUS_PRICING = {
    // 1. 올인원 패키지 (All-in-one Packages)
    packages: {
        allinone: {
            light: 1000000,     // 100만~
            standard: 2500000,  // 250만~
            pro: 5000000        // 500만~
        },
        subscription: {
            light: 890000,      // 89만/월
            standard: 1790000,  // 179만/월
            pro: 2990000        // 299만/월
        }
    },

    // 2. 커스텀 견적 단가 (Custom Estimates & Diagnosis)
    custom: {
        // 브랜딩
        'brand-identity': 1000000,  // 브랜드 아이덴티티
        'naming': 800000,           // 네이밍 / 슬로건
        'brand-guide': 1200000,     // 브랜드 가이드라인
        'brand-story': 1000000,     // 브랜드 스토리 기획
        
        // 상세페이지
        'detail-basic': 800000,     // 상세페이지 기본
        'detail-page': 1000000,     // 상세페이지 프리미엄
        'detail-renewal': 600000,   // 상세페이지 리뉴얼

        // 콘텐츠
        'sns-feed': 100000,         // SNS 피드 디자인
        'sns-manage': 1000000,      // 인스타그램 운영 대행
        'ai-image': 50000,          // AI 이미지 제작
        'video-ad': 1000000,        // 영상 제작 / 편집
        'ad-banner': 150000,        // 광고 배너 / 소재

        // 인쇄/패키지
        'package-design': 600000,   // 패키지 디자인
        'leaflet': 500000,          // 리플렛 / 브로슈어
        'namecard': 200000,         // 명함 / 봉투
        'poster': 300000,           // 포스터 / 현수막

        // 디지털
        'landing': 1000000,         // 랜딩페이지
        'web-dev': 2000000,         // 홈페이지 제작
        'ppt': 500000               // 프레젠테이션
    },

    // 3. AI 대비표 가격 (AI Comparison Table)
    ai_compare: {
        studio: {
            photo_min: 1500000,
            photo_max: 3000000,
            model_min: 3000000,
            model_max: 5000000
        },
        ai: {
            photo_min: 300000,
            photo_max: 500000,
            photo_save: "▼80%",
            model_min: 500000,
            model_max: 800000,
            model_save: "▼83%"
        }
    }
};

// 숫자 포맷팅 유틸리티 (1000000 -> "100만", 1500000 -> "150만")
function formatPriceKorean(num) {
    if (num >= 10000) {
        if (num % 10000 === 0) {
            return (num / 10000).toLocaleString() + '만';
        } else {
            return (num / 10000).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 1 }) + '만';
        }
    }
    return num.toLocaleString();
}
