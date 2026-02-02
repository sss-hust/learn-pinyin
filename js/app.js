/**
 * 拼音小达人 - 应用逻辑
 */

// ===============================
// 应用状态
// ===============================
const state = {
    originalText: '',
    characters: [],  // { char, pinyin, isUnlocked, isChinese }
    currentIndex: null,
    unlockedCount: 0,
    totalChinese: 0
};

// ===============================
// DOM 元素
// ===============================
const elements = {
    inputSection: document.getElementById('input-section'),
    practiceSection: document.getElementById('practice-section'),
    textInput: document.getElementById('text-input'),
    startBtn: document.getElementById('start-btn'),
    backBtn: document.getElementById('back-btn'),
    resetBtn: document.getElementById('reset-btn'),
    cardsContainer: document.getElementById('cards-container'),
    progressFill: document.getElementById('progress-fill'),
    progressPercent: document.getElementById('progress-percent'),
    pinyinModal: document.getElementById('pinyin-modal'),
    modalChar: document.getElementById('modal-char'),
    pinyinInput: document.getElementById('pinyin-input'),
    errorMsg: document.getElementById('error-msg'),
    hintBtn: document.getElementById('hint-btn'),
    submitBtn: document.getElementById('submit-btn'),
    closeModal: document.getElementById('close-modal'),
    celebrateModal: document.getElementById('celebrate-modal'),
    celebrateBtn: document.getElementById('celebrate-btn')
};

// ===============================
// 工具函数
// ===============================

/**
 * 判断是否为中文字符
 */
function isChinese(char) {
    return /[\u4e00-\u9fa5]/.test(char);
}

/**
 * 获取汉字拼音
 */
function getPinyin(char) {
    // 使用 pinyin-pro 库
    if (window.pinyinPro && window.pinyinPro.pinyin) {
        return window.pinyinPro.pinyin(char, { toneType: 'symbol' });
    }
    return '';
}

/**
 * 规范化拼音（用于比较）
 */
function normalizePinyin(py) {
    return py.toLowerCase().trim();
}

/**
 * 更新进度显示
 */
function updateProgress() {
    if (state.totalChinese === 0) return;
    
    const percent = Math.round((state.unlockedCount / state.totalChinese) * 100);
    elements.progressFill.style.width = `${percent}%`;
    elements.progressPercent.textContent = `${percent}%`;
    
    // 完成时显示庆祝
    if (state.unlockedCount === state.totalChinese && state.totalChinese > 0) {
        setTimeout(() => {
            elements.celebrateModal.classList.remove('hidden');
        }, 500);
    }
}

/**
 * 创建汉字卡片
 */
function createCards() {
    elements.cardsContainer.innerHTML = '';
    
    state.characters.forEach((item, index) => {
        const card = document.createElement('div');
        card.className = 'char-card';
        card.dataset.index = index;
        
        if (!item.isChinese) {
            card.classList.add('non-chinese');
        } else if (item.isUnlocked) {
            card.classList.add('unlocked');
        } else {
            card.classList.add('locked');
        }
        
        const charSpan = document.createElement('span');
        charSpan.className = 'char-text';
        charSpan.textContent = item.char;
        
        const pinyinSpan = document.createElement('span');
        pinyinSpan.className = 'pinyin-text';
        pinyinSpan.textContent = item.pinyin;
        
        card.appendChild(charSpan);
        card.appendChild(pinyinSpan);
        
        // 点击事件
        if (item.isChinese && !item.isUnlocked) {
            card.addEventListener('click', () => openModal(index));
        }
        
        elements.cardsContainer.appendChild(card);
    });
}

/**
 * 打开拼音输入弹窗
 */
function openModal(index) {
    state.currentIndex = index;
    const item = state.characters[index];
    
    elements.modalChar.textContent = item.char;
    elements.pinyinInput.value = '';
    elements.errorMsg.classList.add('hidden');
    elements.pinyinModal.classList.remove('hidden');
    
    // 聚焦输入框
    setTimeout(() => elements.pinyinInput.focus(), 100);
}

/**
 * 关闭弹窗
 */
function closeModal() {
    elements.pinyinModal.classList.add('hidden');
    state.currentIndex = null;
}

/**
 * 显示提示
 */
function showHint() {
    if (state.currentIndex === null) return;
    
    const item = state.characters[state.currentIndex];
    elements.pinyinInput.value = item.pinyin;
    elements.pinyinInput.focus();
}

/**
 * 验证拼音
 */
function checkPinyin() {
    if (state.currentIndex === null) return;
    
    const item = state.characters[state.currentIndex];
    const userInput = normalizePinyin(elements.pinyinInput.value);
    const correctPinyin = normalizePinyin(item.pinyin);
    
    if (userInput === correctPinyin) {
        // 正确！
        unlockCard(state.currentIndex);
        closeModal();
    } else {
        // 错误
        elements.errorMsg.classList.remove('hidden');
        elements.pinyinInput.select();
    }
}

/**
 * 解锁卡片
 */
function unlockCard(index) {
    const item = state.characters[index];
    if (item.isUnlocked) return;
    
    item.isUnlocked = true;
    state.unlockedCount++;
    
    // 更新卡片样式
    const card = elements.cardsContainer.children[index];
    card.classList.remove('locked');
    card.classList.add('unlocked', 'just-unlocked');
    
    // 移除点击事件（通过替换元素）
    const newCard = card.cloneNode(true);
    card.parentNode.replaceChild(newCard, card);
    
    // 添加闪光效果
    createSparkles(newCard);
    
    // 移除动画类
    setTimeout(() => {
        newCard.classList.remove('just-unlocked');
    }, 600);
    
    // 更新进度
    updateProgress();
}

/**
 * 创建闪光效果
 */
function createSparkles(card) {
    for (let i = 0; i < 6; i++) {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        sparkle.style.left = `${Math.random() * 100}%`;
        sparkle.style.top = `${Math.random() * 100}%`;
        sparkle.style.animationDelay = `${i * 0.1}s`;
        card.appendChild(sparkle);
        
        setTimeout(() => sparkle.remove(), 1000);
    }
}

/**
 * 开始学习
 */
function startPractice() {
    const text = elements.textInput.value.trim();
    if (!text) {
        elements.textInput.focus();
        return;
    }
    
    state.originalText = text;
    state.characters = [];
    state.unlockedCount = 0;
    state.totalChinese = 0;
    
    // 解析每个字符
    for (const char of text) {
        const chinese = isChinese(char);
        const pinyin = chinese ? getPinyin(char) : '';
        
        state.characters.push({
            char,
            pinyin,
            isUnlocked: false,
            isChinese: chinese
        });
        
        if (chinese) {
            state.totalChinese++;
        }
    }
    
    // 切换显示
    elements.inputSection.classList.add('hidden');
    elements.practiceSection.classList.remove('hidden');
    
    // 创建卡片
    createCards();
    updateProgress();
}

/**
 * 返回输入
 */
function goBack() {
    elements.practiceSection.classList.add('hidden');
    elements.inputSection.classList.remove('hidden');
}

/**
 * 重置练习
 */
function resetPractice() {
    state.characters.forEach(item => {
        if (item.isChinese) {
            item.isUnlocked = false;
        }
    });
    state.unlockedCount = 0;
    
    createCards();
    updateProgress();
}

/**
 * 继续学习（庆祝后）
 */
function continueLearning() {
    elements.celebrateModal.classList.add('hidden');
    goBack();
    elements.textInput.value = '';
    elements.textInput.focus();
}

/**
 * 声调按钮点击
 */
function handleToneButton(e) {
    if (e.target.classList.contains('tone-btn')) {
        const tone = e.target.dataset.tone;
        const input = elements.pinyinInput;
        const start = input.selectionStart;
        const end = input.selectionEnd;
        const value = input.value;
        
        input.value = value.slice(0, start) + tone + value.slice(end);
        input.focus();
        input.setSelectionRange(start + 1, start + 1);
    }
}

// ===============================
// 事件绑定
// ===============================
elements.startBtn.addEventListener('click', startPractice);
elements.backBtn.addEventListener('click', goBack);
elements.resetBtn.addEventListener('click', resetPractice);
elements.closeModal.addEventListener('click', closeModal);
elements.hintBtn.addEventListener('click', showHint);
elements.submitBtn.addEventListener('click', checkPinyin);
elements.celebrateBtn.addEventListener('click', continueLearning);

// 回车提交
elements.pinyinInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        checkPinyin();
    }
});

// 输入时隐藏错误
elements.pinyinInput.addEventListener('input', () => {
    elements.errorMsg.classList.add('hidden');
});

// 点击遮罩关闭弹窗
elements.pinyinModal.querySelector('.modal-overlay').addEventListener('click', closeModal);

// 声调按钮
document.querySelectorAll('.tone-helper').forEach(helper => {
    helper.addEventListener('click', handleToneButton);
});

// Ctrl+Enter 开始
elements.textInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
        startPractice();
    }
});

// ===============================
// 初始化
// ===============================
console.log('🌟 拼音小达人已加载');
