function setupCarousel(containerSelector, imageSelector, intervalTime, randomStart = false, pauseOnHover = true) {
    const containers = document.querySelectorAll(containerSelector);



    
    containers.forEach(container => {
        const images = container.querySelectorAll(imageSelector);
        if (images.length === 0) return;

        let currentIndex = randomStart ? Math.floor(Math.random() * images.length) : 0; // 隨機初始化索引
        let interval;

        // 顯示指定圖片
        function showImage(index) {
            images.forEach((img, i) => {
                img.style.display = i === index ? 'block' : 'none';
            });
        }

        // 隨機切換到下一張圖片
        function nextRandomImage() {
            let nextIndex;
            do {
                nextIndex = Math.floor(Math.random() * images.length);
            } while (nextIndex === currentIndex); // 確保不重複顯示
            currentIndex = nextIndex;
            showImage(currentIndex);
        }

        // 順序切換到下一張圖片
        function nextSequentialImage() {
            currentIndex = (currentIndex + 1) % images.length;
            showImage(currentIndex);
        }

        // 啟動輪播
        function startCarousel() {
            interval = setInterval(randomStart ? nextRandomImage : nextSequentialImage, intervalTime);
        }

        // 點擊圖片跳轉
        images.forEach(img => {
            const productLink = img.getAttribute('data-link');
            if (productLink) {
                img.style.cursor = 'pointer';
                img.addEventListener('click', () => {
                    window.location.href = productLink;
                });
            }
        });

        // 滑鼠懸停暫停功能
        if (pauseOnHover) {
            container.addEventListener('mouseenter', () => clearInterval(interval));
            container.addEventListener('mouseleave', startCarousel);
        }

        showImage(currentIndex); // 顯示初始圖片
        startCarousel(); // 啟動輪播
    });
}

// 初始化主要展示區域（隨機播放）
setupCarousel('.product-display', '.carousel-image', 3000, true, false);

// 初始化類別展示區域（順序播放）
setupCarousel('.category-display', '.category-image', 2000, false, true);

