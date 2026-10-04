// burger

const burger = document.getElementById("burger");
const header = document.querySelector(".header");

const closeMenu = () => {
    header.classList.remove("open");
    burger.setAttribute("aria-expanded", "false");
    burger.setAttribute("aria-label", "Open menu");
};

burger.addEventListener("click", () => {
    header.classList.toggle("open");

    const isOpen = header.classList.contains("open");

    burger.setAttribute("aria-expanded", isOpen);
    burger.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
});

window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        closeMenu();
    }
});


// hero slider

const content = document.querySelector(".content");
const labels = [...document.querySelectorAll(".buttons label")];
const inputs = [...document.querySelectorAll(".tabs input")];

let index = inputs.findIndex(i => i.checked);

if (index === -1) {
    inputs[0].checked = true;
    index = 0;
}

const setSlide = (i, animate = true) => {
    const slideWidth = content.querySelector(".box").offsetWidth;

    index = (i + labels.length) % labels.length;

    inputs[index].checked = true;

    content.style.transition = animate ? "left 0.5s ease" : "none";
    content.style.left = (-index * slideWidth) + "px";
};

setSlide(index, false);

labels.forEach((label, i) => {
    label.addEventListener("click", () => setSlide(i));
});

let isDragging = false;
let startX = 0;

content.addEventListener("pointerdown", e => {
    isDragging = true;
    startX = e.clientX;

    content.setPointerCapture(e.pointerId);
    content.style.transition = "none";

    e.preventDefault();
});

content.addEventListener("pointermove", e => {
    if (!isDragging) return;

    const diff = e.clientX - startX;
    const slideWidth = content.querySelector(".box").offsetWidth;

    content.style.left = (-index * slideWidth + diff) + "px";
});

const endDrag = e => {
    if (!isDragging) return;

    isDragging = false;

    const diff = e.clientX - startX;
    const threshold = 100;

    if (diff > threshold) {
        setSlide(index - 1);
    } else if (diff < -threshold) {
        setSlide(index + 1);
    } else {
        setSlide(index);
    }

    try {
        content.releasePointerCapture(e.pointerId);
    } catch {}
};

content.addEventListener("pointerup", endDrag);
content.addEventListener("pointercancel", endDrag);

window.addEventListener("resize", () => setSlide(index, false));


// comments slider

const commentsBox = document.querySelector(".comments-slider__box");
const commentsSlides = Array.from(
    document.querySelectorAll(".comments-slider__item")
);

const prevBtn = document.querySelector(".comments-slider__button-left");
const nextBtn = document.querySelector(".comments-slider__button-right");

let commentsIndex = 1;
let commentsTransitioning = false;

const firstClone = commentsSlides[0].cloneNode(true);
const lastClone = commentsSlides[commentsSlides.length - 1].cloneNode(true);

commentsBox.appendChild(firstClone);
commentsBox.insertBefore(lastClone, commentsSlides[0]);

const allSlides = Array.from(commentsBox.children);

commentsBox.style.display = "flex";
commentsBox.style.transition = "transform 0.5s ease";
commentsBox.style.transform =
    `translateX(-${commentsIndex * 100}%)`;

function goToCommentsSlide(i) {
    if (commentsTransitioning) return;

    commentsTransitioning = true;
    commentsIndex = i;

    commentsBox.style.transition = "transform 0.5s ease";
    commentsBox.style.transform =
        `translateX(-${commentsIndex * 100}%)`;
}

commentsBox.addEventListener("transitionend", () => {
    if (allSlides[commentsIndex] === firstClone) {
        commentsBox.style.transition = "none";
        commentsIndex = 1;
        commentsBox.style.transform =
            `translateX(-${commentsIndex * 100}%)`;
    }

    if (allSlides[commentsIndex] === lastClone) {
        commentsBox.style.transition = "none";
        commentsIndex = commentsSlides.length;
        commentsBox.style.transform =
            `translateX(-${commentsIndex * 100}%)`;
    }

    commentsPrevTranslate = -commentsIndex * 100;
    commentsTransitioning = false;
});

prevBtn.addEventListener("click", () => {
    goToCommentsSlide(commentsIndex - 1);
});

nextBtn.addEventListener("click", () => {
    goToCommentsSlide(commentsIndex + 1);
});

let commentsDragging = false;
let commentsStartX = 0;
let commentsCurrentTranslate = 0;
let commentsPrevTranslate = -commentsIndex * 100;

commentsBox.addEventListener("pointerdown", e => {
    if (commentsTransitioning) return;

    commentsDragging = true;
    commentsStartX = e.clientX;

    commentsBox.setPointerCapture(e.pointerId);
    commentsBox.style.transition = "none";

    e.preventDefault();
});

commentsBox.addEventListener("pointermove", e => {
    if (!commentsDragging) return;

    const diff = e.clientX - commentsStartX;
    const slideWidth = commentsBox.parentElement.offsetWidth;

    commentsCurrentTranslate =
        commentsPrevTranslate + (diff / slideWidth) * 100;

    commentsBox.style.transform =
        `translateX(${commentsCurrentTranslate}%)`;
});

const endCommentsDrag = e => {
    if (!commentsDragging) return;

    commentsDragging = false;

    const diff = e.clientX - commentsStartX;
    const threshold = 50;

    if (diff > threshold) {
        goToCommentsSlide(commentsIndex - 1);
    } else if (diff < -threshold) {
        goToCommentsSlide(commentsIndex + 1);
    } else {
        goToCommentsSlide(commentsIndex);
    }

    try {
        commentsBox.releasePointerCapture(e.pointerId);
    } catch {}
};

commentsBox.addEventListener("pointerup", endCommentsDrag);
commentsBox.addEventListener("pointercancel", endCommentsDrag);