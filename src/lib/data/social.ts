type Social = {
	readonly name: string;
	readonly link: string;
};

export const social = [
	{
		name: "Email",
		link: "jermellapaz13@gmail.com",
	},
	{
		name: "GitHub",
		link: "https://github.com/jrmellpaz",
	},
	{
		name: "LinkedIn",
		link: "https://www.linkedin.com/in/jermellapaz",
	},
	{
		name: "Résumé",
		link: "https://media.jermellapaz.me/Resume.pdf",
	},
] as const satisfies readonly Social[];
