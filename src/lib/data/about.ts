import { profile } from "./profile";

type AboutItem = {
	readonly title: string;
	readonly description: string;
};

type About = {
	readonly intro: string[];
	readonly list: AboutItem[];
};

export const about = {
	intro: [
		"My journey into programming started back in my high school Computer classes. I quickly fell in love with the problem-solving nature of writing code. Even when debugging got deeply frustrating, nothing beat the satisfying feeling of finding a single mistyped line and watching the whole project finally come to life.",
		"I hold a Computer Science degree from the University of the Philippines Cebu and have a strong foundation in full-stack web development. My experience includes building AI-powered inventory systems, managing coupon platforms, and working as an intern to deliver healthcare features for patient management systems. I always focus on building software that gives practical value to businesses and everyday users.",
	],
	list: [
		{ title: "Based in", description: profile.location },
		{ title: "Focus", description: "Full-Stack Development · AI Integration" },
		{ title: "Status", description: profile.status },
		// { title: "Learning", description: "Advanced machine learning" },
	],
} as const satisfies About;
