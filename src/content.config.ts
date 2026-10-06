import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const works = defineCollection({
	loader: glob({ pattern: "**/*.md", base: "./src/content/works" }),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			shortTitle: z.string().optional(),
			tagline: z.string(),
			date: z.object({ short: z.string(), long: z.string() }),
			cover: image().optional(),
			coverDark: image().optional(),
			stack: z.array(z.string()),
			links: z.object({ live: z.string().optional(), source: z.string().optional() }).default({}),
			highlights: z.array(z.string()).optional(),
			gallery: z
				.array(
					z.object({
						src: image(),
						srcDark: image().optional(),
						caption: z.string(),
					}),
				)
				.default([]),
			files: z
				.array(
					z.object({
						name: z.string(),
						kind: z.string(),
						size: z.string().optional(),
						href: z.string(),
					}),
				)
				.default([]),
		}),
});

const experience = defineCollection({
	loader: glob({ pattern: "**/*.md", base: "./src/content/experience" }),
	schema: z.object({
		role: z.string(),
		org: z.string(),
		date: z.string(),
		order: z.number(),
	}),
});

export const collections = { works, experience };
