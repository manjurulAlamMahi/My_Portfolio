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
            category: "Development",
            items: [
                { name: "WordPress", level: 95 },
                { name: "HTML & CSS", level: 92 },
                { name: "JavaScript", level: 80 }
            ]
        },
        {
            category: "Design",
            items: [
                { name: "Branding & Identity", level: 88 }
            ]
        },
        {
            category: "Marketing",
            items: [
                { name: "SEO Fundamentals", level: 75 }
            ]
        }
    ],
    soft: [
        { name: "Communication", icon: "fa-comments-o", note: "Clear, client-friendly updates from kickoff to launch." },
        { name: "Problem Solving", icon: "fa-lightbulb-o", note: "Breaks ambiguous briefs down into shippable steps." },
        { name: "Time Management", icon: "fa-clock-o", note: "Keeps multiple client projects on schedule." },
        { name: "Collaboration", icon: "fa-users", note: "Works closely with designers, PMs and stakeholders." },
        { name: "Adaptability", icon: "fa-refresh", note: "Comfortable moving between design and dev work." }
    ]
};
