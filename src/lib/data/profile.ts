type Profile = {
	readonly name: string;
	readonly role: string;
	readonly location: string;
	readonly intro: string;
	readonly status: string;
};

export const profile = {
	name: "Jermel Lapaz",
	role: "Computer Science Graduate · Software Engineer",
	location: "Cebu City, PH",
	intro:
		"I am a Computer Science graduate from the University of the Philippines Cebu who loves building full‑stack web applications. I focus on creating clean, practical software, such as AI‑powered business tools that solve real‑world problems.",
	status: "Looking for a full‑time role",
} as const satisfies Profile;
