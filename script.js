// Tailwind Configuration (必須在其他 JS 執行前定義，以確保自定義顏色可用)
tailwind.config = {
    theme: {
        extend: {
            colors: {
                'tws-blue': '#60a5fa', // 鮮明、清爽的藍色
                'tws-yellow': '#fdae1aff', // 活力十足的黃色
                'tws-light': '#bfdbfe', // 淺藍色
                'tws-dark': '#1e3a8a', // 深藍色
            }
        }
    }
}

// Global state to track current photo index for each member
const memberPhotoIndex = {
    'shinyu': 0,
    'dohoon': 0,
    'youngjae': 0,
    'hanjin': 0,
    'jihoon': 0,
    'kyungmin': 0,
};

// 模擬的成員照片資料 (text: 顯示在圖片上的文字, color: 背景顏色, src: 自定義路徑)
const memberPhotos = {
    'shinyu': [
        { src: 'assets/img/SINYU_1.png', text: 'SINYU (1)' },
        { src: 'assets/img/SINYU_2.png', text: 'SINYU (2)' },
        { src: 'assets/img/SINYU_3.png', text: 'SINYU (3)' },
    ],
    // DOHOON 的第一張圖片已修正為使用 'src' 屬性
    'dohoon': [
        { src: 'assets/img/AAA_道勳.png', text: 'DOHOON (1)'},
        { src: 'assets/img/DOHOON_2.png', text: 'DOHOON (2)' },
        { src: 'assets/img/DOHOON_3.png', text: 'DOHOON (3)' },
    ],
    'youngjae': [
        { src: 'assets/img/英宰_1.png', text: 'YOUNGJAE (1)' },
        { src: 'assets/img/英宰_3.png', text: 'YOUNGJAE (2)'},
        { src: 'assets/img/英宰_2.png', text: 'YOUNGJAE (3)' },
    ],
    'hanjin': [
        { src: 'assets/img/韓振_1.png', text: 'hanjin (1)' },
        { src: 'assets/img/韓振_2.png', text: 'hanjin (2)' },
        { src: 'assets/img/韓振_3.png', text: 'hanjin (3)' },
    ],
    'jihoon': [
        { src: 'assets/img/AAA_JIHOON.png', text: 'JIHOON (1)'  },
        { src: 'assets/img/JIHOON.png', text: 'JIHOON (2)' },
        { src: 'assets/img/JIHOON_3.png', text: 'JIHOON (3)'},
    ],
    'kyungmin': [
        { src: 'assets/img/AAA_忙內.png', text: 'KYUNGMIN (1)' },
        { src: 'assets/img/kyungmin_1.png', text: 'KYUNGMIN (2)' },
        { src: 'assets/img/kyungmin_2.png', text: 'KYUNGMIN (3)' },
    ],
};

/**
 * 處理照片切換邏輯 (已更新以支援自定義 src)
 * @param {string} memberId - 成員 ID (e.g., 'shinyu')
 * @param {number} direction - 切換方向 (-1 for prev, 1 for next)
 */
function changePhoto(memberId, direction) {
    const photos = memberPhotos[memberId];
    let currentIndex = memberPhotoIndex[memberId];
    
    currentIndex += direction;

    // 循環邏輯 (Wrap around)
    if (currentIndex >= photos.length) {
        currentIndex = 0;
    } else if (currentIndex < 0) {
        currentIndex = photos.length - 1;
    }

    memberPhotoIndex[memberId] = currentIndex;

    // 更新圖片來源和 alt 文本
    const imgElement = document.getElementById(`photo-${memberId}`);
    const photoData = photos[currentIndex];
    
    // 【核心邏輯：檢查是否有自定義的 src】
    if (photoData.src) {
        // 使用自定義的圖片路徑
        imgElement.src = photoData.src; 
    } else {
        // 否則，使用佔位圖生成邏輯 (用於未自定義圖片的成員/張數)
        const bgColor = photoData.color; // 使用成員定義的顏色作為背景
        const fgColor = '1e3a8a'; // 固定使用深藍色作為前景文字色
        imgElement.src = `https://placehold.co/300x300/${bgColor}/${fgColor}?text=${photoData.text.replace(/ /g, '+')}`;
    }

    imgElement.alt = `成員 ${memberId} 形象照 ${currentIndex + 1}`;
}

/**
 * 模擬的網站交互邏輯 (負責隱藏/顯示不同的 Section 和按鈕)
 * @param {string} sectionId - 目標 Section 的 ID
 */
function showSection(sectionId) {
    // 包含所有主區塊、媒體區塊和詳細頁面
    const sections = [
        'intro', 'members', 'music', 'performance', 'fan-corner', 
        
        'album-detail', 
        
        'all-stages', 'all-covers', 'all-fancams', 'all-TV', 'all-recording' ,'all-behind', 'all-dance',// 確保包含所有詳細頁面
        
        'member-shinyu-detail', 'member-dohoon-detail', 'member-youngjae-detail', 
        'member-hanjin-detail', 'member-jihoon-detail', 'member-kyungmin-detail',
    ];
    
    // 隱藏所有區塊
    sections.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.classList.add('hidden');
        }
    });
    
    // 顯示目標區塊
    const targetElement = document.getElementById(sectionId);
    if (targetElement) {
        targetElement.classList.remove('hidden');
    }

    // --- 更新導航活躍狀態邏輯 ---
    let activeMainSectionId = sectionId;
    
    // 如果當前頁面是成員詳細頁，則高亮父級 'members' 連結
    if (sectionId.startsWith('member-')) {
        activeMainSectionId = 'members';
    } else if (sectionId === 'all-stages' || sectionId === 'all-covers' || sectionId === 'all-fancams' || sectionId === 'all-TV') {
        activeMainSectionId = 'performance'; // '所有舞台' 應高亮 '舞台與媒體'
    }


    // 移除所有連結的活躍狀態，並設定新的活躍狀態
    document.querySelectorAll('nav a').forEach(link => {
        link.classList.remove('bg-tws-yellow', 'text-tws-dark');
        
        // 只檢查主要導航連結 (避免將詳細頁面 ID 傳給主要連結)
        const mainSections = ['intro', 'members', 'music', 'performance', 'fan-corner'];
        if (mainSections.includes(activeMainSectionId)) {
            if (link.getAttribute('onclick') && link.getAttribute('onclick').includes(activeMainSectionId)) {
                link.classList.add('bg-tws-yellow', 'text-tws-dark');
            }
        }
    });
    
    // 如果進入成員詳細頁面，確保圖片顯示在第一張 (重置輪播)
    if (sectionId.startsWith('member-')) {
        const memberId = sectionId.split('-')[1];
        memberPhotoIndex[memberId] = 0; // 重置索引
        changePhoto(memberId, 0); // 呼叫一次以確保顯示第一張圖
    }

    // =========================================================================
    // 【控制「查看全部歌曲」按鈕的顯示與隱藏】
    // =========================================================================
    const viewAllBtn = document.getElementById('view-all-songs-btn');
    
    if (viewAllBtn) {
        if (sectionId === 'music') {
            // 如果目標是 'music' 區塊，則顯示按鈕
            viewAllBtn.classList.remove('hidden');
        } else {
            // 如果跳轉到任何其他區塊，則隱藏按鈕
            viewAllBtn.classList.add('hidden');
        }
    }
    // =========================================================================
}

// 頁面載入時顯示介紹區
document.addEventListener('DOMContentLoaded', () => {
    showSection('intro');
});