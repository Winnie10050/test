document.addEventListener("DOMContentLoaded", async () => {
    const hotItemsContainer = document.getElementById("hotItems");
    const prevButton = document.getElementById("prevButton");
    const nextButton = document.getElementById("nextButton");

    // 在类别和热销商品之间插入标题
const hotItemsTitle = document.createElement("h2");
hotItemsTitle.textContent = "熱銷商品區";
hotItemsTitle.className = "hot-items-title"; // 使用類名控制樣式和動畫

const categorySection = document.querySelector(".categories"); // 假设类别容器有 .categories 类
categorySection.parentNode.insertBefore(hotItemsTitle, categorySection.nextSibling);

// 延遲添加動畫類以觸發動畫
setTimeout(() => {
    hotItemsTitle.classList.add("animated");
}, 100);


    // 动态加载商品名称
    async function fetchProductName(index) {
        try {
            const response = await fetch(`details/product${index}.html`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const html = await response.text();
            const tempDiv = document.createElement("div");
            tempDiv.innerHTML = html;
            const productName = tempDiv.querySelector("h2")?.textContent || `熱銷商品${index}`;
            return productName;
        } catch (error) {
            console.error(`Error fetching product${index}.html:`, error);
            return `熱銷商品${index}`;
        }
    }

    // 动态生成商品的 HTML
    try {
        const productArray = await Promise.all(
            Array.from({ length: 48 }, async (_, i) => {
                const productName = await fetchProductName(i + 1);
                return `
                    <div class="hot-item">
                        <a href="details/product${i + 1}.html" class="hot-item-link">
                            <img class="hot-item-image" src="images/product${i + 1}.jpg" loading="lazy" alt="${productName}" onerror="this.src='images/placeholder.jpg';">
                            <h3>${productName}</h3>
                        </a>
                    </div>
                `;
            })
        );

        // 随机打乱顺序
        const shuffledProducts = productArray.sort(() => Math.random() - 0.5);
        hotItemsContainer.innerHTML = shuffledProducts.join(""); // 动态插入 HTML 结构
    } catch (error) {
        console.error("Error generating product HTML:", error);
    }

    // 滚动逻辑
    let isDragging = false;
    let startX = 0;
    let scrollLeft = 0;
    let autoScrollInterval;

    hotItemsContainer.addEventListener("mousedown", (e) => {
        isDragging = true;
        hotItemsContainer.classList.add("dragging");
        startX = e.pageX - hotItemsContainer.offsetLeft;
        scrollLeft = hotItemsContainer.scrollLeft;
        stopAutoScroll();
    });

    hotItemsContainer.addEventListener("mousemove", (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - hotItemsContainer.offsetLeft;
        const walk = (x - startX) * 2.5;
        hotItemsContainer.scrollLeft = scrollLeft - walk;
    });

    hotItemsContainer.addEventListener("mouseup", () => {
        isDragging = false;
        hotItemsContainer.classList.remove("dragging");
        setTimeout(startAutoScroll, 5000);
    });

    hotItemsContainer.addEventListener("mouseleave", () => {
        if (isDragging) {
            isDragging = false;
            hotItemsContainer.classList.remove("dragging");
            setTimeout(startAutoScroll, 5000);
        }
    });

    function autoScroll() {
        if (hotItemsContainer.scrollLeft + hotItemsContainer.clientWidth >= hotItemsContainer.scrollWidth) {
            hotItemsContainer.scrollLeft = 0; // 重置到起点
        } else {
            hotItemsContainer.scrollLeft += 2; // 每次移动 2px
        }
    }

    function startAutoScroll() {
        if (!autoScrollInterval) {
            autoScrollInterval = setInterval(autoScroll, 16);
        }
    }

    function stopAutoScroll() {
        clearInterval(autoScrollInterval);
        autoScrollInterval = null;
    }

    setTimeout(startAutoScroll, 1000);

    prevButton.addEventListener("click", () => {
        stopAutoScroll();
        hotItemsContainer.scrollBy({ left: -300, behavior: "smooth" });
        setTimeout(() => {
            startAutoScroll();
        }, 5000);
    });

    nextButton.addEventListener("click", () => {
        stopAutoScroll();
        hotItemsContainer.scrollBy({ left: 300, behavior: "smooth" });
        setTimeout(() => {
            startAutoScroll();
        }, 5000);
    });

    hotItemsContainer.addEventListener("mouseenter", stopAutoScroll);
    hotItemsContainer.addEventListener("mouseleave", startAutoScroll);

    // 整个块放大效果
    const hotItems = document.querySelectorAll(".hot-item");
    hotItems.forEach((item) => {
        item.addEventListener("mouseenter", () => {
            item.style.transform = "scale(1.1)";
            item.style.transition = "transform 0.3s ease";
        });

        item.addEventListener("mouseleave", () => {
            item.style.transform = "scale(1)";
        });
    });

    // 去掉超链接的下划线
    const links = document.querySelectorAll(".hot-item-link");
    links.forEach((link) => {
        link.style.textDecoration = "none";
    });

    // 固定按钮
    [prevButton, nextButton].forEach(button => {
        button.style.position = "absolute";
        button.style.top = "50%";
        button.style.transform = "translateY(-50%)";
        button.style.zIndex = "10";
        button.style.transition = "transform 0.3s ease";
        button.addEventListener("mouseenter", () => {
            button.style.transform = "scale(1.2) translateY(-50%)";
        });
        button.addEventListener("mouseleave", () => {
            button.style.transform = "translateY(-50%)";
        });
    });
});
