"use strict";

const navBtnsContainer = document.querySelector("#sectionsList");
const navBtns = document.querySelectorAll(".navButton");
const phoneBtnEl = document.querySelector("#phoneBtnEl");
const phoneBtn = document.querySelector("#toTopBtn");
const main = document.querySelector("main");
const sections = document.querySelectorAll(".sectionsFormat");
const siteIcon = document.querySelector("#siteIcon").firstElementChild;
const header = document.querySelector("header");
const videoContainer = document.querySelector("#videoContainer");
const videoElements = document.querySelectorAll(".videoElement");
const vidArrowBtns = document.querySelectorAll(".arrowButton");
const vidSwipeArea = document.querySelector("#swipeOverlay");
const vidSwipeBtns = document
  .querySelector("#videoBtnContainer")
  .querySelectorAll("button");
const contLinks = sections[3].querySelectorAll("a");
const specialCharLesser = htmlEntityToString("&#8810;");
const specialCharGreater = htmlEntityToString("&#8811;");

const hueArr = [
  "var(--cyanHue1)",
  "var(--pinkHue1)",
  "var(--yellowHue1)",
  "var(--greenHue1)",
];

const vidUrlArr = [
  "https://www.youtube.com/embed/QbtF_VBIBUw?si=633dMs6PZDmF3S-m",
  "https://www.youtube.com/embed/ixU5qYb2TRU?si=I6Xq_6yh5fwoy8sa",
  "https://www.youtube.com/embed/rEYkbVuVNkM?si=P2kpRHDZ-eqM-bsf",
  "https://www.youtube.com/embed/LjVFxP7Q-vM?si=JWqqIujYsI4wVKIG",
  "https://www.youtube.com/embed/I-xcP3_p9t4?si=9xwnpJb_tMxJl4k6",
];
const options = {
  duration: 500,
  direction: "normal",
  fill: "forwards",
  easing: "cubic-bezier(0.42, 0, 0.58, 1)",
};

let refIndex = 0;
let vidZapCounter = -1;
let curPos;
let newPos;
let curAng = 0;
let targetIndex = 0;

let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;
let swipeCounter = -1;
let deltaX;
let deltaY;

let screenWidth;
let lastFocused;
let focusable;
let activeSection;
let visSection;
let orientFlag = false;

let curTarget;
let lastTarget;
let orient = window.screen.orientation.type;

let loadFlag = false;
let viewportWidth = window.innerWidth;

function htmlEntityToString(entity) {
  const textarea = document.createElement("textarea");
  textarea.innerHTML = entity;
  return textarea.value;
}

const addClass = function (element, className) {
  element.classList.add(className);
};
const remClass = function (element, className) {
  element.classList.remove(className);
};
const bgColorHue = function (number) {
  header.style.setProperty(
    "background",
    ` linear-gradient(
      -45deg,
      #00000028,
      ${hueArr[number]},
      #28e7dd1e,
      #00000025,
      #28e7dd6e
    )`
  );
  header.style.setProperty("background-size", " 500% 500%");
  header.style.setProperty(
    "animation",
    " gradientBannerAnimation 10s ease infinite"
  );
};

const activeBtnCheck = function () {
  navBtns.forEach((button) => {
    button.getAttribute("activeBtn") === "true"
      ? addClass(button, "buttonVFX")
      : remClass(button, "buttonVFX");
  });
};

const iframeLoader = function () {
  videoContainer.style.opacity = "0";
  vidUrlArr.forEach((url, i) => {
    const vidContShow = function () {
      if (i === vidUrlArr.length - 1) videoContainer.style.opacity = "100";
      iframe.removeEventListener("load", vidContShow);
    };
    const iframe = document.createElement("iframe");
    iframe.src = url + "?controls=1";
    iframe.width = "300";
    iframe.height = "200";
    iframe.frameborder = "0";
    iframe.allow =
      "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
    iframe.referrerpolicy = "strict-origin-when-cross-origin";
    iframe.allowFullscreen = true;
    iframe.tabIndex = "-1";
    iframe.classList.add("videoClip");
    videoElements[i].insertAdjacentElement("afterbegin", iframe);
    iframe.addEventListener("load", vidContShow);
  });
};
const logoAnimation = function (rotCoeff) {
  const rotAng = rotCoeff * 180;
  let diff = rotAng - curAng;
  if (diff > 180) diff -= 360;
  if (diff < 180) diff += 360;
  curAng += diff;
  siteIcon.style.transform = `RotateY(${curAng}deg)`;
};

const swipeBtnDisplay = function () {
  vidSwipeBtns.forEach((btn, i) => {
    if (swipeCounter + 2 === i) {
      btn.style.background = "var(--greenHue1)";
      btn.style.width = "2rem";
      btn.style.height = "2rem";
      btn.style.border = " solid  rgba(6, 152, 152, 0.1) 3px";
    } else {
      btn.style.background = "var(--greyHue1)";
      btn.style.width = "1rem";
      btn.style.height = "1rem";
      btn.style.border = "none";
    }
  });
};
const initOrient = function () {
  sections.forEach((section) => {
    orientObserver.observe(section);
  });
};

const vidDisplayHide = function (target, action, opacity, tabIndex) {
  if (tabIndex === 0)
    loadFlag === true
      ? (target.tabIndex = `${tabIndex}`)
      : (target.tabIndex = `-1`);
  else {
    target.tabIndex = `${tabIndex}`;
  }
  target.style.opacity = `${opacity}`;
  action(target, "activeVidEl");
  if (target === videoElements[0]) action(vidArrowBtns[1], "isNotActive");
  if (target === videoElements[videoElements.length - 1])
    action(vidArrowBtns[0], "isNotActive");
};

const vidContCbk = (entries, _) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting && entry.intersectionRatio === 0) {
      vidDisplayHide(entry.target, remClass, 0, -1);
    } else {
      vidDisplayHide(entry.target, addClass, 100, 0);
    }
  });
};

const vidContObserver = new IntersectionObserver(vidContCbk, {
  root: videoContainer,
  threshold: 0,
  rootMargin: "0% -35% 0% -35%",
});

const topScrollCbk = (entries, _) => {
  entries.forEach((entry) => {
    if (entry.intersectionRatio < 0.5) {
      phoneBtnEl.style.setProperty("z-index", "1");
      phoneBtn.style.opacity = "100";
      phoneBtnEl.addEventListener("click", scrollToTop);
    }
    if (entry.intersectionRatio > 0.5) {
      {
        phoneBtn.style.opacity = "0";
        phoneBtnEl.style.setProperty("z-index", "-1");
        phoneBtnEl.removeEventListener("click", scrollToTop);
      }
    }
  });
};
const topScrollObserver = new IntersectionObserver(topScrollCbk, {
  root: null,
  threshold: 0.5,
});

const swipeStartCbk = function (e) {
  touchStartX = e.changedTouches[0].screenX;
  touchStartY = e.changedTouches[0].screenY;
};
const swipeEndCbk = function (e) {
  touchEndX = e.changedTouches[0].screenX;
  touchEndY = e.changedTouches[0].screenY;
  handleSwipe();
  swipeBtnDisplay();
};
const swipeFunction = function (element) {
  element.addEventListener("touchstart", swipeStartCbk, false);
  element.addEventListener("touchend", swipeEndCbk, false);
};

function handleSwipe() {
  deltaX = touchEndX - touchStartX;
  deltaY = touchEndY - touchStartY;
  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    if (deltaX > 0) {
      swipeCounter >= -1 ? swipeCounter-- : swipeCounter;
      videoElements.forEach(
        (vidEl, _) =>
          (vidEl.style.transform = `translateX(${-100 * swipeCounter}%)`)
      );
    } else {
      swipeCounter <= 1 ? swipeCounter++ : swipeCounter;
      videoElements.forEach(
        (vidEl, _) =>
          (vidEl.style.transform = `translateX(${-100 * swipeCounter}%)`)
      );
    }
  }
}

const scrollToInit = function () {
  swipeFunction(vidSwipeArea);
  topScrollObserver.observe(sections[0]);
};

const orientObserver = new IntersectionObserver(
  (entries, _) => {
    entries.forEach((entry) => {
      if (orientFlag === true && entry.intersectionRatio > 0.5) {
        visSection.scrollIntoView({ behavior: "smooth" });
        orientFlag = false;
      }
      visSection = entry.target;
      sections.forEach((section, i) => {
        if (visSection === section && entry.intersectionRatio > 0.5) {
          bgColorHue(i);
          console.log(i);
        }
      });
    });
  },
  {
    root: null,
    threshold: 0.5,
  }
);

const logoRotCbk = function (entries) {
  entries.forEach((entry) => {
    sections.forEach((section, i) => {
      if (entry.target === section) {
        logoAnimation(i);
      }
    });
  });
};

const logoRotObserver = new IntersectionObserver(logoRotCbk, {
  threshold: 0.1,
});

document.addEventListener("DOMContentLoaded", function () {
  swipeBtnDisplay();
  initOrient();
  scrollToInit();
});
window.addEventListener(
  "load",
  function () {
    activeBtnCheck();
    iframeLoader();
    const vids = this.document.querySelectorAll("iframe");
    vids.forEach((el, i) => {
      vidContObserver.observe(el);
    });
    siteIcon.style.transform = "RotateY(360deg)";
  },
  { once: true }
);

const updateActiveBtn = function (targetIndex) {
  navBtns.forEach((_, i) => {
    if (i !== targetIndex) {
      navBtns[i].setAttribute("activeBtn", "false");
    } else {
      navBtns[i].setAttribute("activeBtn", "true");
    }
    activeBtnCheck();
  });
};

const showTarget = function (targetIndex, target) {
  // viewportWidth = window.innerWidth;
  const keyframes = [
    { transform: `translateX(${-refIndex * viewportWidth}px)` },
    { transform: `translateX(${-targetIndex * viewportWidth}px)` },
  ];

  const options = {
    duration: 100 * Math.abs(refIndex - targetIndex) + 500,
    direction: "normal",
    fill: "forwards",
    easing: "cubic-bezier(0.42, 0, 0.58, 1)",
  };

  sections.forEach((section, i) => {
    i === targetIndex
      ? addClass(section, "activeSection")
      : remClass(section, "activeSection");
  });

  if (targetIndex !== refIndex)
    sections.forEach((section, _) => {
      section.animate(keyframes, options);
    });

  refIndex = targetIndex;
  activeSection = document.querySelector(".activeSection");
  logoAnimation(targetIndex);
  updateActiveBtn(targetIndex);
  updateTabIndex(target);
};

document.addEventListener("click", function (e) {
  sections.forEach((section, i) => {
    if (e.target === section) {
      navBtns[i].focus();
    }
  });
});

const tabAbleDisable = function (targetArr, tabIndex) {
  targetArr.forEach((el) => {
    el.tabIndex = `${tabIndex}`;
  });
};

const updateTabIndex = function (curTarget) {
  if (activeSection === sections[0] || activeSection === sections[1]) {
    loadFlag = false;
    tabAbleDisable(vidArrowBtns, -1);
    tabAbleDisable(contLinks, -1);
    tabAbleDisable(document.querySelectorAll(".activeVidEl"), -1);
  }
  if (activeSection === sections[2]) {
    tabAbleDisable(vidArrowBtns, 0);
    tabAbleDisable(contLinks, -1);
    tabAbleDisable(document.querySelectorAll(".activeVidEl"), 0);
  }
  if (activeSection === sections[3]) {
    tabAbleDisable(vidArrowBtns, -1);
    tabAbleDisable(contLinks, 0);
    tabAbleDisable(document.querySelectorAll(".activeVidEl"), -1);
  }
  lastTarget = curTarget;
};

document.addEventListener("keydown", function (e) {
  curTarget = e.target;
  if (e.key === "Enter") {
    navBtns.forEach((btn, i) => {
      if (curTarget === btn) {
        showTarget(i, btn);
        lastFocused = btn;
      }
    });
  }
  if (e.key === "ArrowUp") {
    lastFocused.focus();
  }
});

navBtnsContainer.addEventListener("click", function (e) {
  navBtns.forEach((btn, i) => {
    if (e.target === btn && e.target.getAttribute("activeBtn") === "false") {
      curTarget = e.target;
      showTarget(i, btn);

      lastFocused = btn;
    }
  });
});

const vidZap = function () {
  videoElements.forEach((vidEl) => {
    vidEl.style.transform = `translateX(${-100 * vidZapCounter}%)`;
    loadFlag = true;
    vidContObserver.observe(vidEl);
  });
};

videoContainer.addEventListener("click", function (e) {
  if (
    e.target.id.includes("left") &&
    !e.target.classList.contains("isNotActive")
  ) {
    vidZapCounter++;
    vidZap();
  }
  if (
    e.target.id.includes("right") &&
    !e.target.classList.contains("isNotActive")
  ) {
    vidZapCounter--;
    vidZap();
  }
});
const scrollToTop = function () {
  main.scrollTo({ left: 0, top: 0, behavior: "smooth" });
};

window.addEventListener("orientationchange", () => {
  orientFlag = true;
  orient = window.screen.orientation.type;
  sections.forEach((section) => {
    orientObserver.observe(section);
  });
  scrollToInit();
});

const updateTransformOnResize = function () {
  viewportWidth = window.innerWidth;
  const translateValue = -refIndex * viewportWidth;

  const keyframes = [
    { transform: `translateX(${-targetIndex * viewportWidth}px)` },
    { transform: `translateX(${translateValue}px)` },
  ];
  const options = {
    duration: 0,
    direction: "normal",
    fill: "forwards",
    easing: "cubic-bezier(0.42, 0, 0.58, 1)",
  };
  sections.forEach((section) => {
    section.style.transform = `translateX(${translateValue}px)`;
    section.animate(keyframes, options);
  });
};

window.addEventListener("resize", function (e) {
  // e.preventDefault();
  updateTransformOnResize();

  if (e.target.screen.width < 576) {
    sections.forEach((section) => logoRotObserver.observe(section));
    videoElements.forEach((el) => {
      remClass(el, "isNotVisible");
    });
  }
  if (e.target.screen.width === 426) showTarget(0, navBtns[0]);
  if (e.target.screen.width < 426) scrollToInit();
  if (e.target.screen.width < 321) vidSwipeArea.textContent = "SWIPE HERE";
  else {
    vidSwipeArea.textContent = `${specialCharLesser} SWIPE HERE ${specialCharGreater} `;
  }
});
