/*
* Seed data — mirrors the live site's current real content (see
* ../../../about.html, ../../../resume.html, ../../../assets/js/projects-data.js,
* ../../../assets/js/skills-data.js, ../../../contact.html) so the dashboard
* opens already consistent with what's published.
*/
window.SEED = {
    profile: {
        avatar: "assets/images/avatar-placeholder.svg",
        name: "Alex Morgan",
        designation: "Full Stack Developer",
        location: "Remote",
        available: true,
        social: [
            { icon: "fa-facebook", title: "Facebook", link: "#" },
            { icon: "fa-twitter", title: "Twitter", link: "#" },
            { icon: "fa-linkedin", title: "LinkedIn", link: "#" },
            { icon: "fa-instagram", title: "Instagram", link: "#" }
        ]
    },
    hero: {
        typedLine1: "Hi, I'm Alex Morgan",
        typedLine2: "Full Stack Developer",
        introText: "I design and build fast, accessible web products end to end — from the first Figma frame to a deployed, monitored backend. Below is a snapshot of recent work; the Resume page has the full skill and experience breakdown.",
        ctaPrimaryLabel: "Learn More",
        ctaSecondaryLabel: "View My Resume"
    },
    about: {
        bioParagraphs: [
            "I've spent the last several years building products end to end — translating rough ideas and Figma files into fast, reliable software people actually enjoy using.",
            "These days that means React and Node on most projects, but I'm happiest wherever the problem is hardest: a gnarly API, a stubborn performance bug, or a deploy pipeline that shouldn't be this fragile."
        ],
        availabilityText: "Available for freelance work"
    },
    stats: [
        { label: "Years Experience", value: 8, suffix: "+" },
        { label: "Projects Completed", value: 120, suffix: "+" },
        { label: "Happy Clients", value: 60, suffix: "+" },
        { label: "Awards & Recognitions", value: 15, suffix: "+" }
    ],
    services: [
        { image: "assets/images/tool-placeholder.svg", title: "Frontend Development", description: "Responsive, accessible interfaces built with React and modern JavaScript." },
        { image: "assets/images/tool-placeholder.svg", title: "Backend Development", description: "APIs, databases and server-side logic designed to scale with real traffic." },
        { image: "assets/images/tool-placeholder.svg", title: "DevOps & Deployment", description: "CI/CD pipelines and cloud infrastructure that ship without the drama." }
    ],
    toolbox: [
        { image: "assets/images/tool-placeholder.svg", label: "React" },
        { image: "assets/images/tool-placeholder.svg", label: "Node.js" },
        { image: "assets/images/tool-placeholder.svg", label: "JavaScript" },
        { image: "assets/images/tool-placeholder.svg", label: "HTML5" },
        { image: "assets/images/tool-placeholder.svg", label: "CSS3" },
        { image: "assets/images/tool-placeholder.svg", label: "Git" }
    ],
    testimonials: [
        { name: "Sarah K.", role: "Small Business Owner", stars: 5, source: "Google Reviews", quote: "Communication was clear from day one and the final build matched the brief almost exactly — no scope surprises, no chasing updates." },
        { name: "James T.", role: "Startup Founder", stars: 5, source: "Upwork", quote: "Took a messy MVP and turned it into something we could actually launch on schedule. Would bring them onto the next project without a second thought." },
        { name: "Priya M.", role: "Marketing Lead", stars: 5, source: "Direct Email", quote: "Genuinely good at translating vague product ideas into a working plan, then just quietly executing on it. Exactly what a small team needs." }
    ],
    skills: [
        { category: "Frontend", items: [
            { name: "JavaScript / TypeScript", level: 92 },
            { name: "React", level: 90 },
            { name: "HTML & CSS", level: 95 }
        ]},
        { category: "Backend", items: [
            { name: "Node.js", level: 88 },
            { name: "REST & GraphQL APIs", level: 85 },
            { name: "SQL & NoSQL Databases", level: 82 }
        ]},
        { category: "Tools & DevOps", items: [
            { name: "Git & GitHub", level: 90 },
            { name: "Docker", level: 75 },
            { name: "CI/CD Pipelines", level: 70 }
        ]}
    ],
    softSkills: [
        { name: "Communication", icon: "fa-comments-o", note: "Clear, client-friendly updates from kickoff to launch." },
        { name: "Problem Solving", icon: "fa-lightbulb-o", note: "Breaks ambiguous requirements down into shippable steps." },
        { name: "Time Management", icon: "fa-clock-o", note: "Keeps multiple projects on schedule." },
        { name: "Collaboration", icon: "fa-users", note: "Works closely with designers, PMs and other engineers." },
        { name: "Adaptability", icon: "fa-refresh", note: "Comfortable moving between frontend and backend work." }
    ],
    experience: [
        { id: "exp-1", dateRange: "2022 — Present", title: "Freelance Full Stack Developer", company: "", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore." },
        { id: "exp-2", dateRange: "2019 — 2022", title: "Full Stack Developer", company: "BrightPixel Studio", description: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo." },
        { id: "exp-3", dateRange: "2016 — 2019", title: "Junior Developer", company: "Coastline Digital", description: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla." }
    ],
    education: [
        { id: "edu-1", title: "B.Sc. in Computer Science", institution: "State University of Technology" },
        { id: "edu-2", title: "Certificate in Cloud Computing", institution: "Cloud Academy Online" }
    ],
    projectCategories: ["Web Development", "WordPress", "Web Design"],
    projects: [
        {
            slug: "nimbus-analytics-dashboard", title: "Nimbus Analytics Dashboard", category: "Web Development", status: "Published",
            shortDescription: "A real-time analytics dashboard for tracking product usage across web and mobile.",
            techStack: ["React", "Node.js", "PostgreSQL", "Chart.js"],
            thumbnail: "assets/images/work/1.svg", banner: "assets/images/work/1.svg",
            overview: "Nimbus is an internal analytics dashboard built for a SaaS team that needed a single place to watch product usage, retention, and funnel metrics without waiting on the data team for every report.",
            problem: "Stakeholders were pulling numbers from four different tools and reconciling them by hand before every planning meeting, which made the data slow to trust and easy to get wrong.",
            journey: "Started with a rough audit of every existing report to find the metrics people actually used, then built a small ingestion service before touching any UI.",
            functionality: "Users pick a date range and a segment, and the dashboard streams updated charts over a websocket connection.",
            features: ["Real-time usage charts with live updates", "Custom segment builder for filtering by plan, region, or cohort", "Shareable read-only snapshot links", "CSV export on every chart"],
            screenshots: ["assets/images/work/1.svg", "assets/images/work/2.svg"],
            links: { github: "#", live: "#", figma: "" }
        },
        {
            slug: "solstice-studio", title: "Solstice Studio", category: "WordPress", status: "Published",
            shortDescription: "A WordPress business site for a boutique interior design studio, built on a custom theme.",
            techStack: ["WordPress", "PHP", "ACF", "SCSS"],
            thumbnail: "assets/images/work/2.svg", banner: "assets/images/work/2.svg",
            overview: "Solstice Studio needed a site that felt as considered as their design work, with a content structure their small team could update without touching code.",
            problem: "Their previous site was a page-builder template that didn't match their brand and required a developer for every text change.",
            journey: "Designed the theme around a small set of reusable ACF-driven blocks so the client could assemble new pages themselves.",
            functionality: "Editors log into a simplified WordPress admin, build pages from the custom block set, and preview changes before publishing.",
            features: ["Custom ACF block library for page building", "Auto-populating portfolio grid", "Lightweight custom theme, no page-builder bloat", "Editor-friendly admin with restricted, curated blocks"],
            screenshots: ["assets/images/work/2.svg"],
            links: { github: "", live: "#", figma: "" }
        },
        {
            slug: "aperture-brand-web-design", title: "Aperture Brand & Web Design", category: "Web Design", status: "Draft",
            shortDescription: "Brand identity and marketing site design for a photography collective.",
            techStack: ["Figma", "HTML", "CSS"],
            thumbnail: "assets/images/work/3.svg", banner: "assets/images/work/3.svg",
            overview: "Aperture is a collective of freelance photographers who needed a shared brand and a marketing site that could showcase very different personal portfolios under one consistent identity.",
            problem: "Each photographer had their own inconsistent portfolio link, making the collective look fragmented to potential clients.",
            journey: "Started in Figma with moodboards and a type/color system flexible enough to sit behind wildly different photography styles.",
            functionality: "The marketing site links out to each member's individually themed portfolio page while keeping shared navigation, footer, and contact flow consistent.",
            features: ["Shared visual identity system across member portfolios", "Responsive marketing site with a unified navigation shell", "Individually themed member portfolio pages", "Centralized contact and booking flow"],
            screenshots: ["assets/images/work/3.svg", "assets/images/work/4.svg"],
            links: { github: "", live: "#", figma: "#" }
        }
    ],
    contact: {
        location: "Remote — available worldwide",
        email: "hello@yourdomain.com",
        whatsapp: "",
        phone: ""
    },
    messages: [
        { id: "msg-1", name: "Jordan Lee", email: "jordan.lee@example.com", subject: "Freelance project inquiry", message: "Hi Alex, I saw your portfolio and I'm impressed with the Nimbus Analytics case study. We're a small startup looking for a full stack developer for a 3-month contract. Would you be available to hop on a call this week?", date: "2026-08-18T10:22:00", read: false },
        { id: "msg-2", name: "Priya Nair", email: "priya.nair@example.com", subject: "Question about your React expertise", message: "Hello! We're building an internal dashboard product and need someone experienced with React and real-time data visualization. Do you have experience wiring up live charts over websockets?", date: "2026-08-17T15:05:00", read: false },
        { id: "msg-3", name: "Marcus Webb", email: "marcus.webb@example.com", subject: "Collaboration opportunity", message: "Hey, I run a small design studio and we often need a developer to bring our Figma designs to life. Your Aperture project caught my eye — let's talk about ongoing collaboration.", date: "2026-08-15T09:40:00", read: true }
    ],
    todos: [
        { id: "todo-1", text: "Reply to Jordan about the freelance inquiry", done: false },
        { id: "todo-2", text: "Update Nimbus Analytics screenshots", done: false },
        { id: "todo-3", text: "Publish Aperture case study", done: true }
    ],
    notes: {
        text: ""
    },
    reminders: [
        { id: "rem-1", text: "Renew domain registration", date: "2026-09-01" },
        { id: "rem-2", text: "Send monthly invoice", date: "2026-08-31" }
    ],
    account: {
        email: "admin@maxdev.com",
        password: "MaxDev@2026"
    },
    settingsMail: {
        smtpHost: "", smtpPort: 587, smtpUser: "", smtpPassword: "", fromAddress: "", fromName: "MaxDev Portfolio"
    },
    settingsAi: {
        assistantName: "ask-alex", displayName: "Ask Alex", persona: "Friendly, concise, answers on Alex's behalf about background, services, projects and how to get in touch.", knowledgeBaseFileName: ""
    }
};
