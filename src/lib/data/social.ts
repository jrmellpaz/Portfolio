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
		link: "github.com/jrmellpaz",
	},
	{
		name: "LinkedIn",
		link: "linkedin.com/in/jermellapaz",
	},
	{
		name: "Résumé",
		link: "https://media.jermellapaz.me/Resume.pdf",
	},
] as const satisfies readonly Social[];
