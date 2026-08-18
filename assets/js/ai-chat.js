/*
* ----------------------------------------------------------------------------------------
* AI CHAT ENGINE (client-side demo)
* Simple keyword matching against a small knowledge base.
* No backend yet — answers are canned, ready to be swapped for a real API call later.
* ----------------------------------------------------------------------------------------
*/

(function () {
    "use strict";

    // ---- knowledge base -------------------------------------------------
    // Each topic has: keys (matched against the visitor's message) and
    // an html answer rendered inside a bot bubble.
    var knowledgeBase = [
        {
            id: "greeting",
            keys: ["hi", "hello", "hey", "yo", "name", "who are you"],
            html:
                "<h3>Hey, I'm Juliana's assistant 👋</h3>" +
                "<p>I can answer quick questions about Juliana Doe — a Full Stack Developer based in Australia. Try asking about her <strong>services</strong>, <strong>projects</strong>, <strong>resume</strong> or how to <strong>get in touch</strong>.</p>"
        },
        {
            id: "about",
            keys: ["about", "who is juliana", "bio"],
            html:
                "<h3>About Juliana</h3>" +
                "<p>Juliana is a Full Stack Developer based in Australia who builds powerful products for people and businesses.</p>" +
                "<p>She focuses on first-rate experiences — clean, dependable code across the full stack, from frontend to backend — for teams and businesses alike.</p>"
        },
        {
            id: "services",
            keys: ["service", "services", "offer", "what do you do"],
            html:
                "<h3>What Juliana offers</h3>" +
                "<ul>" +
                "<li><strong>Frontend Development</strong> — fast, responsive interfaces built with React and modern JavaScript.</li>" +
                "<li><strong>Backend Development</strong> — APIs, databases and server-side logic that scale.</li>" +
                "<li><strong>DevOps &amp; Deployment</strong> — CI/CD pipelines and cloud infrastructure, launch-ready.</li>" +
                "</ul>" +
                "<p>See the full breakdown on the <a class=\"ai-inline-link\" href=\"about.html\">About page</a>.</p>"
        },
        {
            id: "work",
            keys: ["work", "project", "projects", "portfolio", "case study"],
            html:
                "<h3>Recent work</h3>" +
                "<p>A mix of frontend, backend and full stack projects, filterable by category on the Projects page.</p>" +
                "<div class=\"ai-chip-row\"><span>Web Development</span><span>WordPress</span><span>Web Design</span></div>" +
                "<p style=\"margin-top:10px\">Browse it all on <a class=\"ai-inline-link\" href=\"projects.html\">the Projects page</a>.</p>"
        },
        {
            id: "resume",
            keys: ["resume", "cv", "experience", "education", "background", "history"],
            html:
                "<h3>Experience &amp; education</h3>" +
                "<p>8+ years of freelance and studio experience, plus a B.Sc. in Computer Science and a Certificate in Cloud Computing.</p>" +
                "<p>Full timeline and skill breakdown on the <a class=\"ai-inline-link\" href=\"resume.html\">Resume page</a>.</p>"
        },
        {
            id: "skills",
            keys: ["skill", "skills", "tools", "tech", "technology", "react", "node"],
            html:
                "<h3>Tools &amp; skills</h3>" +
                "<ul>" +
                "<li>JavaScript, TypeScript &amp; React</li>" +
                "<li>Node.js, REST &amp; GraphQL APIs</li>" +
                "<li>Git, Docker &amp; CI/CD</li>" +
                "</ul>" +
                "<p>See the full skill bars on the <a class=\"ai-inline-link\" href=\"resume.html\">Resume page</a>.</p>"
        },
        {
            id: "contact",
            keys: ["contact", "email", "reach", "hire", "get in touch", "skype", "location", "based"],
            html:
                "<h3>Let's connect</h3>" +
                "<p>Based in Australia, 99 Street Jognham.</p>" +
                "<p>Email: <a class=\"ai-inline-link\" href=\"mailto:jonathondoe@gmail.com\">jonathondoe@gmail.com</a><br>Skype: jonathon.doe</p>" +
                "<p>Or use the <a class=\"ai-inline-link\" href=\"contact.html\">Contact page</a> to send a message directly.</p>"
        },
        {
            id: "fallback",
            keys: [],
            html:
                "<h3>Not sure on that one</h3>" +
                "<p>I'm just a small on-page demo for now — ask me about Juliana's <strong>about</strong>, <strong>services</strong>, <strong>projects</strong>, <strong>resume</strong> or <strong>contact</strong> details.</p>"
        }
    ];

    function findTopic(message) {
        var text = message.toLowerCase();
        for (var i = 0; i < knowledgeBase.length; i++) {
            var topic = knowledgeBase[i];
            for (var j = 0; j < topic.keys.length; j++) {
                if (text.indexOf(topic.keys[j]) !== -1) {
                    return topic;
                }
            }
        }
        return knowledgeBase[knowledgeBase.length - 1];
    }

    // ---- rendering --------------------------------------------------------
    var chatMain = document.getElementById("aiChatMain");
    var scrollEl = document.getElementById("aiChatScroll");
    var inputEl = document.getElementById("aiChatInput");
    var sendBtn = document.getElementById("aiChatSend");
    var suggestions = document.querySelectorAll(".ai-suggestion-btn");

    function scrollToBottom() {
        chatMain.scrollTop = chatMain.scrollHeight;
    }

    function addUserMessage(text) {
        var row = document.createElement("div");
        row.className = "ai-msg-row user";
        var bubble = document.createElement("div");
        bubble.className = "ai-bubble";
        bubble.textContent = text;
        row.appendChild(bubble);
        scrollEl.appendChild(row);
        scrollToBottom();
    }

    function addTypingIndicator() {
        var row = document.createElement("div");
        row.className = "ai-msg-row bot ai-typing";
        row.id = "aiTypingRow";
        row.innerHTML =
            '<div class="ai-bubble"><span class="dot"></span><span class="dot"></span><span class="dot"></span></div>';
        scrollEl.appendChild(row);
        scrollToBottom();
    }

    function removeTypingIndicator() {
        var row = document.getElementById("aiTypingRow");
        if (row) {
            row.parentNode.removeChild(row);
        }
    }

    function addBotMessage(html) {
        var row = document.createElement("div");
        row.className = "ai-msg-row bot";
        var bubble = document.createElement("div");
        bubble.className = "ai-bubble";
        bubble.innerHTML = html;
        row.appendChild(bubble);
        scrollEl.appendChild(row);
        scrollToBottom();
    }

    function handleQuery(text) {
        if (!text.trim()) {
            return;
        }
        addUserMessage(text);
        inputEl.value = "";
        addTypingIndicator();

        var topic = findTopic(text);
        var delay = 500 + Math.random() * 400;

        window.setTimeout(function () {
            removeTypingIndicator();
            addBotMessage(topic.html);
        }, delay);
    }

    sendBtn.addEventListener("click", function () {
        handleQuery(inputEl.value);
    });

    inputEl.addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
            handleQuery(inputEl.value);
        }
    });

    for (var k = 0; k < suggestions.length; k++) {
        suggestions[k].addEventListener("click", function () {
            handleQuery(this.getAttribute("data-query"));
        });
    }

    inputEl.focus();
})();
