/*
* ----------------------------------------------------------------------------------------
* PROJECT DATA — single source of truth for the projects grid and the case study page.
* Swap this file's contents for an API call later; nothing else needs to change.
*
* Fields: slug/title/category/thumbnail/banner/shortDescription are required.
* Everything else is optional — the details page hides any section whose data is missing.
* ----------------------------------------------------------------------------------------
*/

window.PROJECTS = [
    {
        slug: "nimbus-analytics-dashboard",
        title: "Nimbus Analytics Dashboard",
        category: "Web Development",
        shortDescription: "A real-time analytics dashboard for tracking product usage across web and mobile.",
        techStack: ["React", "Node.js", "PostgreSQL", "Chart.js"],
        thumbnail: "assets/images/work/1.svg",
        banner: "assets/images/work/1.svg",
        overview: "Nimbus is an internal analytics dashboard built for a SaaS team that needed a single place to watch product usage, retention, and funnel metrics without waiting on the data team for every report.",
        problem: "Stakeholders were pulling numbers from four different tools and reconciling them by hand before every planning meeting, which made the data slow to trust and easy to get wrong.",
        journey: "Started with a rough audit of every existing report to find the metrics people actually used, then built a small ingestion service before touching any UI. The dashboard itself went through three rounds of internal feedback before the layout settled.",
        functionality: "Users pick a date range and a segment, and the dashboard streams updated charts over a websocket connection. Every chart can be exported as CSV or pinned to a shareable snapshot link.",
        features: [
            "Real-time usage charts with live updates",
            "Custom segment builder for filtering by plan, region, or cohort",
            "Shareable read-only snapshot links",
            "CSV export on every chart"
        ],
        screenshots: [
            "assets/images/work/1.svg",
            "assets/images/work/2.svg"
        ],
        importantPages: [
            { label: "Overview dashboard", image: "assets/images/work/1.svg" },
            { label: "Segment builder", image: "assets/images/work/2.svg" }
        ],
        links: {
            github: "#",
            live: "#"
        }
    },
    {
        slug: "solstice-studio",
        title: "Solstice Studio",
        category: "WordPress",
        shortDescription: "A WordPress business site for a boutique interior design studio, built on a custom theme.",
        techStack: ["WordPress", "PHP", "ACF", "SCSS"],
        thumbnail: "assets/images/work/2.svg",
        banner: "assets/images/work/2.svg",
        overview: "Solstice Studio needed a site that felt as considered as their design work, with a content structure their small team could update without touching code.",
        problem: "Their previous site was a page-builder template that didn't match their brand and required a developer for every text change.",
        journey: "Designed the theme around a small set of reusable ACF-driven blocks — a project spotlight, a text-and-image split, and a testimonial strip — so the client could assemble new pages themselves.",
        functionality: "Editors log into a simplified WordPress admin, build pages from the custom block set, and preview changes before publishing. Project pages pull automatically into the homepage portfolio grid.",
        features: [
            "Custom ACF block library for page building",
            "Auto-populating portfolio grid",
            "Lightweight custom theme, no page-builder bloat",
            "Editor-friendly admin with restricted, curated blocks"
        ],
        importantPages: [
            { label: "Homepage", image: "assets/images/work/2.svg" },
            { label: "Portfolio grid", image: "assets/images/work/3.svg" }
        ],
        links: {
            live: "#"
        }
    },
    {
        slug: "aperture-brand-web-design",
        title: "Aperture Brand & Web Design",
        category: "Web Design",
        shortDescription: "Brand identity and marketing site design for a photography collective.",
        techStack: ["Figma", "HTML", "CSS"],
        thumbnail: "assets/images/work/3.svg",
        banner: "assets/images/work/3.svg",
        overview: "Aperture is a collective of freelance photographers who needed a shared brand and a marketing site that could showcase very different personal portfolios under one consistent identity.",
        problem: "Each photographer had their own inconsistent portfolio link, making the collective look fragmented to potential clients.",
        journey: "Started in Figma with moodboards and a type/color system flexible enough to sit behind wildly different photography styles, then translated the approved design into a static marketing site.",
        functionality: "The marketing site links out to each member's individually themed portfolio page while keeping shared navigation, footer, and contact flow consistent across all of them.",
        features: [
            "Shared visual identity system across member portfolios",
            "Responsive marketing site with a unified navigation shell",
            "Individually themed member portfolio pages",
            "Centralized contact and booking flow"
        ],
        screenshots: [
            "assets/images/work/3.svg",
            "assets/images/work/4.svg"
        ],
        additionalInfo: "Brand guidelines were delivered as a Figma component library so future member pages can stay on-brand without re-briefing a designer.",
        links: {
            figma: "#",
            live: "#"
        }
    }
];
