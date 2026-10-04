
// Burger

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
    burger.setAttribute(
        "aria-label",
        isOpen ? "Close menu" : "Open menu"
    );
});

window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        closeMenu();
    }
});


// Hero slider

const heroSlider = document.querySelector(".slider__container");
const heroContent = document.querySelector(".content");
const heroSlides = Array.from(
    document.querySelectorAll(".content .box")
);
const heroLabels = Array.from(
    document.querySelectorAll(".buttons label")
);
const heroInputs = Array.from(
    document.querySelectorAll(".tabs input")
);

let heroIndex = heroInputs.findIndex(input => input.checked);

if (heroIndex < 0) {
    heroIndex = 0;
}

let heroDragging = false;
let heroStartX = 0;
let heroStartY = 0;
let heroCurrentX = 0;

function getHeroWidth() {
    return heroSlider.clientWidth;
}

function moveHero(index, animate = true) {
    heroIndex =
        (index + heroSlides.length) % heroSlides.length;

    const width = getHeroWidth();

    heroContent.style.transition = animate
        ? "transform 0.5s ease"
        : "none";

    heroContent.style.transform =
        `translate3d(${-heroIndex * width}px, 0, 0)`;

    if (heroInputs[heroIndex]) {
        heroInputs[heroIndex].checked = true;
    }
}

moveHero(heroIndex, false);

heroLabels.forEach((label, i) => {
    label.addEventListener("click", () => {
        moveHero(i);
    });
});

heroContent.addEventListener("pointerdown", (e) => {
    heroDragging = true;

    heroStartX = e.clientX;
    heroStartY = e.clientY;
    heroCurrentX = e.clientX;

    heroContent.setPointerCapture(e.pointerId);

    heroContent.style.transition = "none";

    e.preventDefault();
});

heroContent.addEventListener("pointermove", (e) => {
    if (!heroDragging) return;

    heroCurrentX = e.clientX;

    const diffX = e.clientX - heroStartX;
    const diffY = e.clientY - heroStartY;

    if (Math.abs(diffY) > Math.abs(diffX)) {
        return;
    }

    const width = getHeroWidth();

    heroContent.style.transform =
        `translate3d(${-heroIndex * width + diffX}px, 0, 0)`;
});

function endHeroDrag(e) {
    if (!heroDragging) return;

    heroDragging = false;

    const diff = heroCurrentX - heroStartX;
    const threshold = 50;

    if (diff < -threshold) {
        moveHero(heroIndex + 1);
    } else if (diff > threshold) {
        moveHero(heroIndex - 1);
    } else {
        moveHero(heroIndex);
    }

    try {
        heroContent.releasePointerCapture(e.pointerId);
    } catch {}
}

heroContent.addEventListener("pointerup", endHeroDrag);
heroContent.addEventListener("pointercancel", endHeroDrag);

window.addEventListener("resize", () => {
    moveHero(heroIndex, false);
});


// Comments slider

const commentsContainer = document.querySelector(
    ".comments-slider__content"
);

const commentsBox = document.querySelector(
    ".comments-slider__box"
);

const originalComments = Array.from(
    document.querySelectorAll(".comments-slider__item")
);

const prevBtn = document.querySelector(
    ".comments-slider__button-left"
);

const nextBtn = document.querySelector(
    ".comments-slider__button-right"
);

const firstCommentClone =
    originalComments[0].cloneNode(true);

const lastCommentClone =
    originalComments[originalComments.length - 1]
        .cloneNode(true);

commentsBox.appendChild(firstCommentClone);

commentsBox.insertBefore(
    lastCommentClone,
    originalComments[0]
);

const commentsSlides =
    Array.from(commentsBox.children);

let commentsIndex = 1;
let commentsAnimating = false;

function moveComments(index, animate = true) {

    const width = commentsContainer.clientWidth;

    commentsBox.style.transition = animate
        ? "transform 0.5s ease"
        : "none";

    commentsBox.style.transform =
        `translate3d(${-index * width}px, 0, 0)`;

    commentsIndex = index;
}

moveComments(commentsIndex, false);

prevBtn.addEventListener("click", () => {

    if (commentsAnimating) return;

    commentsAnimating = true;

    moveComments(commentsIndex - 1);
});

nextBtn.addEventListener("click", () => {

    if (commentsAnimating) return;

    commentsAnimating = true;

    moveComments(commentsIndex + 1);
});

commentsBox.addEventListener("transitionend", () => {

    if (
        commentsSlides[commentsIndex] ===
        firstCommentClone
    ) {
        moveComments(1, false);
    }

    if (
        commentsSlides[commentsIndex] ===
        lastCommentClone
    ) {
        moveComments(originalComments.length, false);
    }

    commentsAnimating = false;
});

let commentsDragging = false;
let commentsStartX = 0;
let commentsCurrentX = 0;

commentsBox.addEventListener("pointerdown", (e) => {

    if (commentsAnimating) return;

    commentsDragging = true;

    commentsStartX = e.clientX;
    commentsCurrentX = e.clientX;

    commentsBox.setPointerCapture(e.pointerId);

    commentsBox.style.transition = "none";

    e.preventDefault();
});

commentsBox.addEventListener("pointermove", (e) => {

    if (!commentsDragging) return;

    commentsCurrentX = e.clientX;

    const diff = e.clientX - commentsStartX;
    const width = commentsContainer.clientWidth;

    commentsBox.style.transform =
        `translate3d(${-commentsIndex * width + diff}px, 0, 0)`;
});

function endCommentsDrag(e) {

    if (!commentsDragging) return;

    commentsDragging = false;

    const diff = commentsCurrentX - commentsStartX;
    const threshold = 50;

    if (diff < -threshold) {
        commentsAnimating = true;
        moveComments(commentsIndex + 1);
    } else if (diff > threshold) {
        commentsAnimating = true;
        moveComments(commentsIndex - 1);
    } else {
        moveComments(commentsIndex);
    }

    try {
        commentsBox.releasePointerCapture(e.pointerId);
    } catch {}
}

commentsBox.addEventListener(
    "pointerup",
    endCommentsDrag
);

commentsBox.addEventListener(
    "pointercancel",
    endCommentsDrag
);

window.addEventListener("resize", () => {
    moveComments(commentsIndex, false);
});