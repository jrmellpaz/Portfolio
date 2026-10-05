export type NavLink = {
	readonly id: string;
	readonly label: string;
};

export const links = [
	{ id: "about", label: "About" },
	{ id: "works", label: "Works" },
	{ id: "experience", label: "Experience" },
	{ id: "skills", label: "Skills" },
	{ id: "contact", label: "Contact" },
] as const satisfies readonly NavLink[];
