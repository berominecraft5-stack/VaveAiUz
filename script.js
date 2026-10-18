'use strict';

// ========================================
// TECHHUNTER — MAIN JAVASCRIPT
// ========================================

document.addEventListener('DOMContentLoaded', () => {
// Asosiy elementlar
const toast = document.getElementById('toast');
const searchForm = document.getElementById('searchForm');
const searchInput = document.getElementById('searchInput');
const productGrid = document.getElementById('productGrid');
const savedBtn = document.getElementById('savedBtn');
const savedCount = document.getElementById('savedCount');
const fixResult = document.getElementById('fixResult');
const aiBtn = document.getElementById('aiBtn');

// Yilni avtomatik yangilash
const year = document.getElementById('year');

if (year) {
year.textContent = new Date().getFullYear();
}

// Xabar chiqarish
let toastTimer;

function showToast(message) {
if (!toast) return;

toast.textContent = message;
toast.classList.add('show');

clearTimeout(toastTimer);

toastTimer = setTimeout(() => {
  toast.classList.remove('show');
}, 2800);

}

// ========================================
// 1. MAHSULOTLAR
// ========================================

const STORAGE_KEY = 'techhunter_saved_products';

const productNames = {
samsung: 'Samsung Galaxy',
iphone: 'Apple iPhone',
laptop: 'Noutbuk',
headphones: 'Simsiz quloqchin',
tablet: 'Planshet',
watch: 'Smart soat'
};

function getSaved() {
try {
const value = JSON.parse(
localStorage.getItem(STORAGE_KEY) || '[]'
);

  if (!Array.isArray(value)) return [];

  return [...new Set(
    value.filter(id =>
      Object.prototype.hasOwnProperty.call(productNames, id)
    )
  )];
} catch {
  return [];
}

}

function saveProducts(products) {
try {
localStorage.setItem(
STORAGE_KEY,
JSON.stringify(products)
);

  return true;
} catch {
  showToast('Brauzer xotirasiga saqlab bo‘lmadi.');
  return false;
}

}

function updateSavedUI() {
const saved = getSaved();

if (savedCount) {
  savedCount.textContent = saved.length;
}

document.querySelectorAll('.save-btn').forEach(button => {
  const active = saved.includes(button.dataset.id);

  button.textContent = active
    ? '♥ Saqlangan'
    : '♡ Saqlash';

  button.setAttribute('aria-pressed', String(active));
});

}

// Sevimli mahsulotga qo‘shish yoki olib tashlash
document.querySelectorAll('.save-btn').forEach(button => {
button.addEventListener('click', () => {
const id = button.dataset.id;

  if (!Object.prototype.hasOwnProperty.call(productNames, id)) {
    return;
  }

  let saved = getSaved();

  if (saved.includes(id)) {
    saved = saved.filter(item => item !== id);
  } else {
    saved.push(id);
  }

  if (saveProducts(saved)) {
    updateSavedUI();

    showToast(
      saved.includes(id)
        ? '♥ Sevimlilarga qo‘shildi!'
        : 'Mahsulot sevimlilardan olib tashlandi.'
    );
  }
});

});

// Saqlangan mahsulotlarni ko‘rsatish
if (savedBtn) {
savedBtn.addEventListener('click', () => {
const saved = getSaved();

  if (!saved.length) {
    showToast('Hozircha sevimli mahsulotlar yo‘q.');
    return;
  }

  const names = saved.map(id => productNames[id]);

  showToast('Saqlanganlar: ' + names.join(', '));

  if (productGrid) {
    document.querySelectorAll('.product-card').forEach(card => {
      card.style.display = '';
    });

    document.getElementById('products')?.scrollIntoView({
      behavior: 'smooth'
    });
  }
});

}

updateSavedUI();

// ========================================
// 2. MAHSULOTLARNI QIDIRISH
// ========================================

function searchProducts(query) {
if (!productGrid) return 0;

const cards = productGrid.querySelectorAll('.product-card');
let count = 0;

cards.forEach(card => {
  const title = card.querySelector('h3')?.textContent || '';
  const keywords = card.dataset.name || '';

  const searchableText =
    (title + ' ' + keywords).toLocaleLowerCase('uz-UZ');

  const matches = searchableText.includes(query);

  card.style.display = matches ? '' : 'none';

  if (matches) count++;
});

return count;

}

if (searchForm && searchInput) {
searchForm.addEventListener('submit', event => {
event.preventDefault();

  const query = searchInput.value
    .trim()
    .toLocaleLowerCase('uz-UZ');

  if (!query) {
    showToast('Qidirish uchun mahsulot nomini kiriting.');
    searchInput.focus();
    return;
  }

  const count = searchProducts(query);

  document.getElementById('products')?.scrollIntoView({
    behavior: 'smooth'
  });

  if (count > 0) {
    showToast(`${count} ta mahsulot topildi!`);
  } else {
    showToast('Mahsulot topilmadi. Boshqa so‘z bilan qidiring.');
  }
});

}

// ========================================
// 3. FIXIT — TEXNIK YORDAM
// ========================================

const fixes = {
charge: {
title: '🔋 Zaryadlash muammosi',
steps: [
'Boshqa mos kabel va adapter bilan tekshiring.',
'Boshqa rozetkadan foydalanib ko‘ring.',
'Zaryadlash portini tashqaridan tekshiring. Ichiga metall buyum tiqmang.',
'Telefon qizisa, kuygan hid chiqsa yoki batareya shishsa, foydalanishni to‘xtating va mutaxassisga murojaat qiling.'
]
},

internet: {
  title: '📶 Internet muammosi',
  steps: [
    'Wi-Fi yoki mobil internet yoqilganini tekshiring.',
    'Samolyot rejimini yoqib, bir necha soniyadan keyin o‘chiring.',
    'Telefonni qayta ishga tushiring.',
    'Boshqa qurilmada ham internet ishlashini tekshiring.',
    'Muammo davom etsa, internet operatoringizga murojaat qiling.'
  ]
},

slow: {
  title: '🐢 Telefon sekin ishlayapti',
  steps: [
    'Telefonni qayta ishga tushiring.',
    'Ishlatmayotgan ilovalarni yoping.',
    'Xotiradagi bo‘sh joyni tekshiring.',
    'Operatsion tizim va ilovalar yangilanishini tekshiring.',
    'Muhim ma’lumotlarni zaxiralamasdan zavod sozlamalariga qaytarmang.'
  ]
},

storage: {
  title: '💾 Xotirani bo‘shatish',
  steps: [
    'Sozlamalardan xotira bo‘limini oching.',
    'Keraksiz yuklab olingan fayllarni tekshiring.',
    'Muhim rasm va videolarni avval zaxiralang.',
    'Keraksiz ilovalarni o‘chirishingiz mumkin.',
    'Ilova ma’lumotlarini o‘chirishdan oldin muhim fayllaringizni saqlang.'
  ]
}

};

document.querySelectorAll('.fix-option').forEach(button => {
button.addEventListener('click', () => {
const fix = fixes[button.dataset.fix];

  if (!fix || !fixResult) return;

  // Matnni xavfsiz ko‘rsatish
  fixResult.replaceChildren();

  const heading = document.createElement('strong');
  heading.textContent = fix.title;

  const list = document.createElement('ol');

  fix.steps.forEach(step => {
    const item = document.createElement('li');
    item.textContent = step;
    item.style.marginTop = '8px';
    list.appendChild(item);
  });

  fixResult.append(heading, list);
  fixResult.style.display = 'block';

  fixResult.scrollIntoView({
    behavior: 'smooth',
    block: 'nearest'
  });
});

});

// ========================================
// 4. AI YORDAMCHI
// ========================================

if (aiBtn) {
aiBtn.addEventListener('click', () => {
showToast(
'AI hali ulanmagan. Keyingi bosqichda server orqali ulaymiz!'
);
});
}

// ========================================
// 5. SAHIFA ICHIDAGI NAVIGATSIYA
// ========================================

document.querySelectorAll('a[href^="#"]').forEach(link => {
link.addEventListener('click', event => {
const targetId = link.getAttribute('href');

  if (!targetId || targetId === '#') return;

  const target = document.querySelector(targetId);

  if (target) {
    event.preventDefault();

    target.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }
});

});

console.log('TECHHUNTER muvaffaqiyatli ishga tushdi! 🚀');
});
