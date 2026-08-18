/*
* ----------------------------------------------------------------------------------------
* SKILLS DATA — single source of truth for the Resume page's technical skill tabs
* and soft skill cards.
*
* To add a new technical category (e.g. "DevOps"), just add an object to
* SKILLS.technical below — the tab bar and its panel build themselves from this array,
* no HTML or render-script changes needed.
* ----------------------------------------------------------------------------------------
*/

window.SKILLS = {
    technical: [
        {
            category: "Frontend",
            items: [
                { name: "JavaScript / TypeScript", level: 92 },
                { name: "React", level: 90 },
                { name: "HTML & CSS", level: 95 }
            ]
        },
        {
            category: "Backend",
            items: [
                { name: "Node.js", level: 88 },
                { name: "REST & GraphQL APIs", level: 85 },
                { name: "SQL & NoSQL Databases", level: 82 }
            ]
        },
        {
            category: "Tools & DevOps",
            items: [
                { name: "Git & GitHub", level: 90 },
                { name: "Docker", level: 75 },
                { name: "CI/CD Pipelines", level: 70 }
            ]
        }
    ],
    soft: [
        { name: "Communication", icon: "fa-comments-o", note: "Clear, client-friendly updates from kickoff to launch." },
        { name: "Problem Solving", icon: "fa-lightbulb-o", note: "Breaks ambiguous requirements down into shippable steps." },
        { name: "Time Management", icon: "fa-clock-o", note: "Keeps multiple projects on schedule." },
        { name: "Collaboration", icon: "fa-users", note: "Works closely with designers, PMs and other engineers." },
        { name: "Adaptability", icon: "fa-refresh", note: "Comfortable moving between frontend and backend work." }
    ]
};
