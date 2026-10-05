type Skill = {
	readonly name: string;
	readonly items: { label: string; slug: string; invertOnDark?: boolean }[];
};

export const skills: Skill[] = [
	{
		name: "Languages",
		items: [
			{ label: "TypeScript", slug: "typescript" },
			{ label: "Python", slug: "python" },
			{ label: "SQL", slug: "sql", invertOnDark: true },
			{ label: "C", slug: "c" },
			{ label: "C++", slug: "cpp" },
			{ label: "PHP", slug: "php" },
		],
	},
	{
		name: "Frontend",
		items: [
			{ label: "React", slug: "react" },
			{ label: "Vue.js", slug: "vue" },
			{ label: "TanStack Stack", slug: "start" },
			{ label: "Next.js", slug: "nextjs", invertOnDark: true },
			{ label: "Nuxt", slug: "nuxt", invertOnDark: true },
			{ label: "Astro", slug: "astro" },
			{ label: "HTML & CSS", slug: "html" },
			{ label: "Tailwind CSS", slug: "tailwind" },
		],
	},
	{
		name: "Backend & Data",
		items: [
			{ label: "Express", slug: "express" },
			{ label: "Django", slug: "django" },
			{ label: "FastAPI", slug: "fastapi" },
			{ label: "CodeIgniter", slug: "codeigniter" },
			{ label: "MySQL", slug: "mysql" },
			{ label: "PostgreSQL", slug: "postgresql" },
			{ label: "Redis", slug: "redis" },
			{ label: "Supabase", slug: "supabase" },
			{ label: "REST", slug: "rest", invertOnDark: true },
		],
	},
	{
		name: "Tools",
		items: [
			{ label: "Git", slug: "git" },
			{ label: "Docker", slug: "docker" },
			{ label: "Linux", slug: "linux" },
			{ label: "Nginx", slug: "nginx" },
			{ label: "Figma", slug: "figma" },
			{ label: "Postman", slug: "postman" },
		],
	},
] satisfies readonly Skill[];
