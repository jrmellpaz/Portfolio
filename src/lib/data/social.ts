type Social = {
	readonly name: string;
	readonly url: string;
	readonly link: string;
};

export const social = [
	{
		name: "Email",
		url: "mailto:jermellapaz13@gmail.com",
		link: "jermellapaz13@gmail.com",
	},
	{
		name: "GitHub",
		url: "https://github.com/jrmellpaz",
		link: "github.com/jrmellpaz",
	},
	{
		name: "LinkedIn",
		url: "https://linkedin.com/in/jermellapaz",
		link: "linkedin.com/in/jermellapaz",
	},
	{
		name: "Résumé",
		url: "https://media.jermellapaz.me/Resume.pdf",
		link: "https://media.jermellapaz.me/Resume.pdf",
	},
] as const satisfies readonly Social[];
