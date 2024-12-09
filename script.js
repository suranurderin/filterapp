const upload = document.getElementById('upload');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const filterButtons = document.querySelectorAll('.filter-btn');
const resetBtn = document.getElementById('reset-btn');
const downloadBtn = document.getElementById('download-btn');
const filterSlider = document.getElementById('filter-slider');
const sliderContainer = document.getElementById('slider-container');
const filterPercentage = document.getElementById('filter-percentage');
const slider = document.getElementById("filter-slider");

let img = new Image();
let filters = {};
let activeFilter = null;  // Son seçilen filtreyi takip etmek için bir değişken

// Resim Yükleme
upload.addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }
});

// Resmi Yükleyip Boyutlandırma
img.onload = () => {
  canvas.width = img.width; // Resmin genişliği kadar
  canvas.height = img.height; // Resmin yüksekliği kadar
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  applyFilters();
};

// Filtre Ekle veya Kaldır
filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    if (filters[filter]) {
      delete filters[filter]; // Mevcut filtreyi kaldır
      button.classList.remove('active');
      activeFilter = null; // Seçilen filtreyi sıfırla
    } else {
      filters[filter] = parseFloat(filterSlider.value); // Kaydırıcı değeri ile filtreyi ayarla
      button.classList.add('active');
      activeFilter = filter; // Yeni seçilen filtreyi aktif yap
    }
    applyFilters();
  });
});

// Kaydırıcı Değeri Değiştiğinde Filtreyi Uygula
filterSlider.addEventListener('input', () => {
  const percentage = Math.round((filterSlider.value / 2) * 100); // Değerin %'si
  filterPercentage.textContent = `${percentage}%`;
  // Yüzde değerini yaz
  if (activeFilter) {
    // Kaydırıcı değeri ile sadece aktif olan filtreyi güncelle
    filters[activeFilter] = parseFloat(filterSlider.value);
    applyFilters();
  }
});

// Tüm Filtreleri Sıfırla
resetBtn.addEventListener('click', () => {
  filters = {};
  filterButtons.forEach((button) => button.classList.remove('active'));
  activeFilter = null;  // Seçili filtreyi sıfırla
  applyFilters();
});

slider.addEventListener("input", () => {
  const value = slider.value; // Mevcut kaydırıcı değeri
  const max = slider.max; // Maksimum değer
  const percentage = (value / max) * 100; // Yüzde hesapla

  // Dinamik olarak background stilini güncelle
  slider.style.background = `linear-gradient(90deg, orange ${percentage}%, #ccc ${percentage}%)`;
});

// Filtreleri Uygula
function applyFilters() {
  const cssFilters = Object.entries(filters)
    .map(([filterName, intensity]) => getCSSFilter(filterName, intensity))
    .join(' ') || 'none';
  ctx.filter = cssFilters;
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
}

// CSS Filtre Değerini Döndür
function getCSSFilter(filter, intensity) {
  switch (filter) {
    case 'grayscale':
      return `grayscale(${intensity})`;
    case 'sepia':
      return `sepia(${intensity})`;
    case 'brightness':
      return `brightness(${1 + intensity})`;
    case 'blur':
      return `blur(${intensity * 10}px)`;
    case 'invert':
      return `invert(${intensity})`;
    case 'contrast':
      return `contrast(${1 + intensity * 2})`;
    case 'hue-rotate':
      return `hue-rotate(${intensity * 360}deg)`;
    case 'saturation':
      return `saturate(${intensity})`;
    case 'red':
      return `sepia(${intensity}) saturate(${intensity}) hue-rotate(${intensity * 360}deg)`;
    case 'green':
      return `sepia(${intensity}) saturate(${intensity}) hue-rotate(${intensity * 180}deg)`;
    case 'blue':
      return `sepia(${intensity}) saturate(${intensity}) hue-rotate(${intensity * 90}deg)`;
    case 'lightness':
      return `brightness(${intensity * 2})`;
    case 'edge-soften':
      return `contrast(${1 + intensity}) blur(${intensity}px)`;
    case 'vignette':
      return `brightness(${1 - intensity})`;
    default:
      return '';
  }
}

// Resmi Kaydet
downloadBtn.addEventListener('click', () => {
  const link = document.createElement('a');
  link.download = 'filtered-image.png';
  link.href = canvas.toDataURL('image/png'); // PNG formatında resmi kaydet
  link.click();
});