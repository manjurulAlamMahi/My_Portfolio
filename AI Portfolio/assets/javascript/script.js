/*--------------------------- Page Loader --------------------------------*/
$(function () {
    setTimeout(() => {
        $('.page-loader').fadeOut('slow');
    }, 500);
});

/*-------------------- Hero Typing Animation -----------------------*/
const $typed = $(".ityped");
if ($typed.length && typeof Typed !== "undefined") {
    if (!$typed.data("typed-initialized")) {

        new Typed(".ityped", {
            strings: [
                "Web Designer",
                "Full Stack Developer",
                "UI/UX Designer",
                "Product Designer",
                "Freelancer"
            ],
            typeSpeed: 50,
            backSpeed: 30,
            loop: true
        });

        $typed.data("typed-initialized", true);
    }
}

/*----------------------------- Dark/ Light Mode Toggle --------------------*/
function myFunction() {
    var element = document.body;
    element.classList.toggle("dark-mode");

    var sunIcon = document.getElementById("sunIcon");
    var moonIcon = document.getElementById("moonIcon");

    if (element.classList.contains("dark-mode")) {
        sunIcon.classList.add("hidden");
        moonIcon.classList.remove("hidden");
        localStorage.setItem("mode", "dark");
    } else {
        moonIcon.classList.add("hidden");
        sunIcon.classList.remove("hidden");
        localStorage.setItem("mode", "light");
    }
}
document.addEventListener("DOMContentLoaded", function () {
    const storedMode = localStorage.getItem("mode");
    if (storedMode === "dark") {
        document.body.classList.add("dark-mode");
        var sunIcon = document.getElementById("sunIcon");
        var moonIcon = document.getElementById("moonIcon");
        sunIcon.classList.add("hidden");
        moonIcon.classList.remove("hidden");
    }
});

/*-------------------- Contact Form -----------------------*/
const $formOverlay = $("#formOverlay");
if ($formOverlay.length) {

    $(document).on("click", "#openForm", () => {
        $formOverlay.addClass("active");
    });

    $(document).on("click", "#closeForm", () => {
        $formOverlay.removeClass("active");
    });
}

/*-------------------- Skill Section Dots Skill bar -----------------------*/
$(".skill").each(function () {
    const $skill = $(this);
    const percent = parseInt($skill.data("percent"), 10);
    const $dotsContainer = $skill.find(".dots");
    const $percentText = $skill.find(".percent");

    if (!$dotsContainer.length || !$percentText.length || isNaN(percent)) return;

    const safePercent = Math.max(0, Math.min(100, percent));

    const totalDots = 10;
    const activeDots = Math.round((safePercent / 100) * totalDots);

    $dotsContainer.empty();
    $percentText.text(`[${safePercent}%]`);
    /* ===== CREATE DOTS ===== */
    for (let i = 0; i < totalDots; i++) {
        const $dot = $("<div>").addClass("dot");

        if (i < activeDots) {
            $dot.addClass("active");
        }

        $dotsContainer.append($dot);
    }
});

/*-------------------- WAIT FOR FANCYBOX -----------------------*/
function waitForFancybox() {
    if (typeof Fancybox !== "undefined") {
        initFancybox();
    } else {
        requestAnimationFrame(waitForFancybox);
    }
}
waitForFancybox();

/*-------------------- INIT FANCYBOX -----------------------*/
function initFancybox() {
    Fancybox.destroy();
    Fancybox.bind('.project-box a[data-fancybox]', {
        groupAll: false
    });
}

/*-------------------- Age Find Data Pattern -----------------------*/
$(".age-bithday").each(function () {
    const $el = $(this);
    const text = $el.text();

    // extract date like "Oct 07, 2024"
    const match = text.match(/([A-Za-z]+ \d{1,2}, \d{4})/);
    if (!match) return;

    const birth = new Date(match[0]);

    if (isNaN(birth.getTime())) return;

    const today = new Date();

    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    const dayDiff = today.getDate() - birth.getDate();

    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
        age--;
    }

    $el.find(".age").text(`${age} years old`);
});


(function () {
    /*----------------------------- Custome Placehoder --------------------*/
    const $input = $("#inputField");
    const $placeholder = $("#fakePlaceholder");

    if (!$input.length || !$placeholder.length) return;

    const togglePlaceholder = () => {
        const hasValue = $input.val().trim() !== "";
        const isFocused = $input.is(":focus");

        $placeholder.toggleClass("hidden", hasValue || isFocused);
    };

    $input.on("focus blur input", togglePlaceholder);


    /*-------------------- Menu Toggle -----------------------*/
    const $menuBtn = $("#menuBtn");
    const $menuPopup = $("#menuPopup");
    const $inputField = $("#inputField");

    if (!$menuBtn.length || !$menuPopup.length) return;

    $menuBtn.on("click", function (e) {
        e.stopPropagation();
        $menuPopup.toggleClass("active");
    });

    $menuPopup.on("click", "li", function () {
        const text = $(this)
            .text()
            .replace(/\[\d+\]/g, "")
            .trim()
            .toLowerCase();

        if ($inputField.length) {
            $inputField.val(text);
        }

        if (typeof sendMessage === "function") {
            sendMessage();
        }

        $menuPopup.removeClass("active");
    });

    $(document).on("click", function (e) {
        if (!$(e.target).closest($menuPopup).length &&
            !$(e.target).closest($menuBtn).length) {
            $menuPopup.removeClass("active");
        }
    });
})();



/* =========================================================
   ELEMENT SELECTORS Chat Main
========================================================= */
const inputField = document.getElementById("inputField");
const sendBtn = document.querySelector(".send");
const chatScreen = document.getElementById("chatScreen");
const homeSection = document.querySelector(".home-section");
const chatContainer = document.getElementById("chatContainer");

let currentProjectIndex = 0;

/* ====================  NORMALIZE INPUT TEXT ====================== */
function normalize(text) {
    return text.toLowerCase().trim();
}

/* ==================== GET BOT RESPONSE ====================== */
function getBotResponse(msg) {
    msg = normalize(msg);

    // ================= PROJECT START =================
    if (msg.includes("project") && !msg.includes("next project")) {

        currentProjectIndex = 0;

        const section = document.querySelector('#botData section[data-key*="project"]');
        if (!section) return fallback();

        const projects = section.querySelectorAll(".project-item");
        if (!projects.length) return fallback();

        const project = projects[0].cloneNode(true);

        const uniqueGallery = "gallery_" + Date.now();
        project.querySelectorAll('[data-fancybox]').forEach(el => {
            el.setAttribute('data-fancybox', uniqueGallery);
        });

        const heading = section.querySelector("h2")?.outerHTML || "";

        project.querySelectorAll(".project-card-footer").forEach(el => el.remove());

        const footer = document.createElement("div");
        footer.className = "project-card-footer";
        footer.innerHTML = `
            <a href="#" class="next-link">
                Next Project <i class="ti ti-chevrons-right"></i>
            </a>
        `;
        project.appendChild(footer);

        return {
            nodes: [
                { html: heading, noTyping: false },
                { html: project.outerHTML, noTyping: true }
            ]
        };
    }

    // ================= NEXT PROJECT =================
    if (msg.includes("next project")) {

        const section = document.querySelector('#botData section[data-key*="project"]');
        if (!section) return fallback();

        const projects = section.querySelectorAll(".project-item");
        currentProjectIndex++;
        if (currentProjectIndex >= projects.length) {
            return {
                nodes: [{
                    html: `<p class="sect-text">🚀 You've reached the last project!</p>`,
                    noTyping: false
                }]
            };
        }
        const project = projects[currentProjectIndex].cloneNode(true);

        const uniqueGallery = "gallery_" + Date.now();
        project.querySelectorAll('[data-fancybox]').forEach(el => {
            el.setAttribute('data-fancybox', uniqueGallery);
        });

        const total = projects.length;
        const number = currentProjectIndex + 1;

        const title = project.querySelector(".project-name-number");
        if (title) {
            const name = title.querySelector("span").innerText;
            title.innerHTML = `Project ${number} of ${total} : <span>${name}</span>`;
        }

        project.querySelectorAll(".project-card-footer").forEach(el => el.remove());

        if (currentProjectIndex < projects.length - 1) {
            const footer = document.createElement("div");
            footer.className = "project-card-footer";
            footer.innerHTML = `
                <a href="#" class="next-link">
                    Next Project <i class="ti ti-chevrons-right"></i>
                </a>
            `;
            project.appendChild(footer);
        }
        return {
            nodes: [{ html: project.outerHTML, noTyping: true }]
        };
    }

    // ================= NORMAL FLOW =================
    const data = document.querySelectorAll("#botData section");
    for (let item of data) {
        const keys = (item.dataset.key || "").toLowerCase().split(",");

        for (let key of keys) {
            if (msg === key.trim()) {

                const nodes = [];

                Array.from(item.children).forEach(node => {
                    nodes.push({
                        html: node.outerHTML,
                        noTyping: node.hasAttribute("data-no-typing")
                    });
                });

                return { nodes };
            }
        }
    }
    return fallback();
}

/* ==================== FALLBACK ====================== */
function fallback() {
    return {
        nodes: [
            {
                html: `<p class="sect-text">Apologies, I couldn't recognize that request. Please try one of the commands below:</p>`,
                noTyping: false
            },
            {
                html: `<p class="suggestions-sec">
                        <span class="suggestion" data-key="about">about</span> · 
                        <span class="suggestion" data-key="service">service</span> · 
                        <span class="suggestion" data-key="project">project</span> · 
                        <span class="suggestion" data-key="skills">skills</span> · 
                        <span class="suggestion" data-key="pricing">pricing</span> · 
                        <span class="suggestion" data-key="faqs">faqs</span> · 
                        <span class="suggestion" data-key="contact">contact</span> ·
                        <span class="suggestion" data-key="age">age</span> ·
                        <span class="suggestion" data-key="resume">resume</span> ·
                        <span class="suggestion" data-key="education">education</span> ·
                        <span class="suggestion" data-key="experience">experience</span> ·
                        <span class="suggestion" data-key="awards">awards</span> ·
                        <span class="suggestion" data-key="hobbies">hobbies</span> ·
                        <span class="suggestion" data-key="coding skills">coding skills</span> ·
                        <span class="suggestion" data-key="languages skills">languages skills</span>
                       </p>`,
                noTyping: true
            }
        ]
    };
}

/* ================ USER MESSAGE  ====================== */
function addUserMessage(msg) {
    const div = document.createElement("div");
    div.className = "user-msg";
    div.innerText = msg;
    chatContainer.appendChild(div);
}

/* ================ BOT MESSAGE  ====================== */
function addMixedBotMessage(nodes) {
    const wrapper = document.createElement("div");
    wrapper.className = "bot-msg";
    wrapper.innerHTML = `
        <img class="avtar-img" src="assets/images/home/profile-img.jpg" />
        <div class="bot-text"></div>
    `;

    chatContainer.appendChild(wrapper);
    const container = wrapper.querySelector(".bot-text");
    function runSequence(index) {
        if (index >= nodes.length) return;

        if (index === 0) {
            receiveSound.currentTime = 0;
            receiveSound.play();
        }

        const node = nodes[index];

        if (node.noTyping) {

            const temp = document.createElement("div");
            temp.innerHTML = node.html;
            const el = temp.firstElementChild;

            el.style.opacity = "0";
            el.style.transform = "translateY(10px)";
            el.style.transition = "all 0.3s ease";

            container.appendChild(el);

            setTimeout(() => {
                el.style.opacity = "1";
                el.style.transform = "translateY(0)";
                scrollBottom();
                runSequence(index + 1);
            }, 200);

        } else {

            const div = document.createElement("div");
            div.innerHTML = `<span class="typed-text"></span>`;
            container.appendChild(div);

            new Typed(div.querySelector(".typed-text"), {
                strings: [node.html],
                contentType: 'html',
                typeSpeed: 15,
                showCursor: false,

                onBegin: startAutoScroll,
                onComplete: () => {
                    stopAutoScroll();
                    scrollBottom();
                    runSequence(index + 1);
                }
            });
        }
    }
    runSequence(0);
}

/* ==================== SCROLL ====================== */
function scrollBottom() {
    if (!chatScreen) return;
    chatScreen.scrollTo({
        top: chatScreen.scrollHeight,
        behavior: "smooth"
    });
}

/* ==================== AUTOSCROLL FIX ====================== */
let scrollInterval = null;

function startAutoScroll() {
    stopAutoScroll();
    scrollInterval = setInterval(() => {
        if (chatScreen) {
            chatScreen.scrollTop = chatScreen.scrollHeight;
        }
    }, 100);
}

function stopAutoScroll() {
    if (scrollInterval) {
        clearInterval(scrollInterval);
        scrollInterval = null;
    }
}

/* ==================== SEND MESSAGE ====================== */
function sendMessage() {

    if (!inputField) return;

    let msg = inputField.value;
    if (!msg.trim()) return;

    if (sendSound) {
        sendSound.currentTime = 0;
        sendSound.play();
    }

    const cleanMsg = normalize(msg);

    if (homeSection && chatScreen) {
        homeSection.style.display = "none";
        chatScreen.style.display = "block";
    }

    addUserMessage(msg);
    scrollBottom();

    inputField.value = "";

    const loader = showLoader();

    setTimeout(() => {
        loader.remove();

        if (cleanMsg === "home") {
            chatScreen.style.display = "none";
            homeSection.style.display = "block";
            return;
        }

        const response = getBotResponse(cleanMsg);
        addMixedBotMessage(response.nodes);

    }, 800);
}

/* ==================== LOADER ====================== */
function showLoader() {
    const div = document.createElement("div");
    div.className = "bot-msg";

    div.innerHTML = `
        <img class="avtar-img" src="assets/images/home/profile-img.jpg" />
        <div class="bot-text"><div class="chatloader"></div></div>
    `;
    chatContainer.appendChild(div);
    return div;
}

/* =================================== EVENTS ==================================== */
if (sendBtn) {
    sendBtn.addEventListener("click", sendMessage);
}

if (inputField) {
    inputField.addEventListener("keypress", function (e) {
        if (e.key === "Enter") {
            e.preventDefault();
            sendMessage();
        }
    });
}

chatContainer.addEventListener("click", function (e) {
    const suggestion = e.target.closest(".suggestion");

    if (suggestion) {
        const key = suggestion.dataset.key;

        addUserMessage(key);

        sendSound.currentTime = 0;
        sendSound.play();

        const loader = showLoader();

        setTimeout(() => {
            loader.remove();
            const res = getBotResponse(key);
            addMixedBotMessage(res.nodes);
        }, 500);

        return;
    }

    // next project
    const nextBtn = e.target.closest(".next-link");
    if (nextBtn) {
        e.preventDefault();

        sendSound.currentTime = 0;
        sendSound.play();

        addUserMessage("Next Project");

        const loader = showLoader();

        setTimeout(() => {
            loader.remove();
            const res = getBotResponse("next project");
            addMixedBotMessage(res.nodes);
        }, 500);

        return;
    }

    //  default data-key click
    const target = e.target.closest("[data-key]");
    if (!target) return;

    const key = target.dataset.key;

    addUserMessage(key);

    sendSound.currentTime = 0;
    sendSound.play();

    const loader = showLoader();

    setTimeout(() => {
        loader.remove();
        const res = getBotResponse(key);
        addMixedBotMessage(res.nodes);
    }, 500);
});

/* ==================== SOUND ====================== */
const sendSound = new Audio("assets/notification/msg-send.mp3");
const receiveSound = new Audio("assets/notification/msg-received.mp3");
sendSound.volume = 0.5;
receiveSound.volume = 0.6;