'use client';

import type React from 'react';

import { useState, useEffect, useMemo } from 'react';
import { useTheme } from '@/lib/use-theme';
import emailjs from '@emailjs/browser';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
	Moon,
	Sun,
	Menu,
	X,
	Download,
	Calendar,
	Users,
	Code,
	Github,
	Globe,
	Server,
	Palette,
	MessageCircle,
	Mail,
	Linkedin,
	Send,
	MapPin,
	Phone,
	ExternalLink,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

// Define TypeScript interfaces
interface Project {
	id: number;
	title: string;
	description: string;
	techStack: string[];
	image: string;
	liveUrl: string;
	githubUrl: string;
}

interface Skill {
	name: string;
	level: number;
}

// These interfaces are used in the component but TypeScript doesn't recognize usage
// due to dynamic rendering in the JSX
// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface SkillCategory {
	category: string;
	skills: Skill[];
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface Service {
	icon: React.ComponentType<{ className?: string }>;
	title: string;
	description: string;
	features: string[];
}

// interface Testimonial {
// 	id: number;
// 	name: string;
// 	role: string;
// 	company: string;
// 	content: string;
// 	rating: number;
// 	avatar: string;
// }

export default function Home() {
	const { theme, setTheme } = useTheme();
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [mounted, setMounted] = useState(false);
	// Removed activeFilter since project filtering is not implemented
	// const [currentTestimonial, setCurrentTestimonial] = useState(0);
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		phone: '',
		message: '',
	});
	const [projects, setProjects] = useState<Project[]>([]);
	const [loading, setLoading] = useState(true);
	const [showAllProjects, setShowAllProjects] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitStatus, setSubmitStatus] = useState<
		'idle' | 'success' | 'error'
	>('idle');

	// Typing animation states
	const [currentTitleIndex, setCurrentTitleIndex] = useState(0);
	const [currentText, setCurrentText] = useState('');
	const [isDeleting, setIsDeleting] = useState(false);

	const titles = useMemo(
		() => [
			'Fullstack Developer',
			'Frontend Developer',
			'React.js Specialist',
			'TypeScript Enthusiast',
			'Node.js Backend Developer',
			'API & Integration Builder',
		],
		[]
	);

	useEffect(() => {
		const fetchProjects = async () => {
			try {
				const response = await fetch('/projects.json');
				const data = await response.json();
				setProjects(data.projects);
			} catch (error) {
				console.error('Failed to fetch projects:', error);
			} finally {
				setLoading(false);
			}
		};

		fetchProjects();
		setMounted(true);

		// Initialize EmailJS only if public key is available
		const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;
		if (publicKey) {
			emailjs.init(publicKey);
		}
	}, []);

	// Initialize theme to light mode on first visit
	useEffect(() => {
		if (theme === undefined && mounted) {
			setTheme('light');
		}
	}, [theme, setTheme, mounted]);

	// Typing animation effect
	useEffect(() => {
		if (!mounted) return;

		const currentTitle = titles[currentTitleIndex];

		if (isDeleting) {
			// Backspace effect
			if (currentText.length > 0) {
				const timer = setTimeout(() => {
					setCurrentText(currentText.slice(0, -1));
				}, 100);
				return () => clearTimeout(timer);
			} else {
				// Move to next title
				setIsDeleting(false);
				setCurrentTitleIndex((prev) => (prev + 1) % titles.length);
			}
		} else {
			// Typing effect
			if (currentText.length < currentTitle.length) {
				const timer = setTimeout(() => {
					setCurrentText(currentTitle.slice(0, currentText.length + 1));
				}, 150);
				return () => clearTimeout(timer);
			} else {
				// Wait before starting to delete
				const timer = setTimeout(() => {
					setIsDeleting(true);
				}, 2000);
				return () => clearTimeout(timer);
			}
		}
	}, [currentText, currentTitleIndex, isDeleting, titles, mounted]);

	const scrollToSection = (sectionId: string) => {
		const element = document.getElementById(sectionId);
		if (element) {
			element.scrollIntoView({ behavior: 'smooth' });
		}
		setIsMenuOpen(false);
	};

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);
		setSubmitStatus('idle');

		// Check if environment variables are set
		const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;
		const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
		const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;

		if (!publicKey || !serviceId || !templateId) {
			console.error(
				'EmailJS environment variables not configured. Please check your .env file.'
			);
			setSubmitStatus('error');
			setIsSubmitting(false);
			return;
		}

		try {
			// Send email using EmailJS
			const result = await emailjs.send(
				process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || '', // EmailJS service ID
				process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || '', // EmailJS template ID
				{
					name: formData.name,
					email: formData.email,
					phone: formData.phone || 'Not provided',
					message: formData.message,
					time: new Date().toLocaleString('en-US', {
						year: 'numeric',
						month: 'long',
						day: 'numeric',
						hour: '2-digit',
						minute: '2-digit',
						timeZoneName: 'short',
					}),
				},
				process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || '' // EmailJS public key
			);

			if (result.status === 200) {
				setSubmitStatus('success');
				setFormData({ name: '', email: '', phone: '', message: '' });
				// Reset status after 5 seconds
				setTimeout(() => setSubmitStatus('idle'), 5000);
			}
		} catch (error) {
			console.error('Failed to send email:', error);
			setSubmitStatus('error');
			// Reset error status after 5 seconds
			setTimeout(() => setSubmitStatus('idle'), 5000);
		} finally {
			setIsSubmitting(false);
		}
	};

	const skillCategories = [
		{
			category: 'Frontend',
			skills: [
				{ name: 'React', level: 95 },
				{ name: 'Next.js', level: 90 },
				{ name: 'TypeScript', level: 88 },
				{ name: 'Tailwind CSS', level: 92 },
				{ name: 'Vue.js', level: 80 },
				{ name: 'JavaScript', level: 95 },
			],
		},
		{
			category: 'Backend',
			skills: [
				{ name: 'Node.js', level: 90 },
				{ name: 'Python', level: 85 },
				{ name: 'Express.js', level: 88 },
				{ name: 'FastAPI', level: 82 },
				{ name: 'GraphQL', level: 78 },
				{ name: 'REST APIs', level: 92 },
			],
		},
		{
			category: 'Database',
			skills: [
				{ name: 'PostgreSQL', level: 88 },
				{ name: 'MongoDB', level: 85 },
				{ name: 'Redis', level: 80 },
				{ name: 'Supabase', level: 90 },
				{ name: 'Prisma', level: 85 },
			],
		},
		{
			category: 'DevOps & Tools',
			skills: [
				{ name: 'AWS', level: 85 },
				{ name: 'Docker', level: 82 },
				{ name: 'Git', level: 95 },
				{ name: 'Vercel', level: 90 },
				{ name: 'CI/CD', level: 80 },
			],
		},
	];

	const services = [
		{
			icon: Globe,
			title: 'Web Development',
			description:
				'Custom websites and web applications built with modern frameworks like React, Next.js, and Vue.js. From landing pages to complex SaaS platforms.',
			features: [
				'Responsive Design',
				'Performance Optimization',
				'SEO-Friendly',
				'Modern UI/UX',
			],
		},
		{
			icon: Server,
			title: 'API & Backend Development',
			description:
				'Scalable backend solutions with robust APIs, database design, and cloud infrastructure. Built for performance and security.',
			features: [
				'RESTful APIs',
				'Database Design',
				'Cloud Deployment',
				'Security Implementation',
			],
		},
		{
			icon: Palette,
			title: 'UI/UX Friendly Frontend',
			description:
				'Beautiful, intuitive user interfaces that convert visitors into customers. Focus on user experience and modern design principles.',
			features: [
				'User-Centered Design',
				'Interactive Components',
				'Accessibility',
				'Cross-Browser Support',
			],
		},
		{
			icon: MessageCircle,
			title: 'Consulting & Mentorship',
			description:
				'Technical consulting for your development team and one-on-one mentorship for developers looking to advance their skills.',
			features: [
				'Code Reviews',
				'Architecture Planning',
				'Team Training',
				'Career Guidance',
			],
		},
	];

	// const testimonials = [
	// 	{
	// 		id: 1,
	// 		name: 'Sarah Chen',
	// 		role: 'Product Manager',
	// 		company: 'TechFlow Inc',
	// 		content:
	// 			'Husaini delivered an exceptional SaaS dashboard that exceeded our expectations. His attention to detail and ability to translate complex requirements into intuitive user experiences is remarkable. The project was completed on time and within budget.',
	// 		rating: 5,
	// 		avatar: '/professional-woman-headshot.png',
	// 	},
	// 	{
	// 		id: 2,
	// 		name: 'Marcus Rodriguez',
	// 		role: 'CTO',
	// 		company: 'GreenCommerce',
	// 		content:
	// 			"Working with Husaini was a game-changer for our e-commerce platform. He not only built a lightning-fast website but also implemented features we didn't even know we needed. The 40% increase in conversions speaks for itself.",
	// 		rating: 5,
	// 		avatar: '/professional-man-headshot.png',
	// 	},
	// 	{
	// 		id: 3,
	// 		name: 'Dr. Emily Watson',
	// 		role: 'Healthcare Director',
	// 		company: 'MedTech Solutions',
	// 		content:
	// 			'The mobile app Husaini developed for our patient monitoring system has revolutionized how we track patient compliance. His understanding of healthcare requirements and HIPAA compliance was impressive.',
	// 		rating: 5,
	// 		avatar: '/professional-doctor-headshot.png',
	// 	},
	// ];

	// Project filtering removed since projects don't have category property
	// const filteredProjects = projects; // Commented out since not used

	// const nextTestimonial = () => {
	// 	setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
	// };

	// const prevTestimonial = () => {
	// 	setCurrentTestimonial(
	// 		(prev) => (prev - 1 + testimonials.length) % testimonials.length
	// 	);
	// };

	return (
		<div className="min-h-screen bg-[#F9FAFB] dark:bg-[#0D1117] text-[#1E293B] dark:text-[#E6EDF3] transition-colors duration-300">
			{/* Navigation */}
			<nav className="sticky top-0 z-50 bg-[#F9FAFB]/80 dark:bg-[#0D1117]/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between items-center h-16">
						<div className="font-bold text-xl">Husaini</div>

						{/* Desktop Navigation */}
						<div className="hidden md:flex items-center space-x-8">
							<button
								onClick={() => scrollToSection('home')}
								className="hover:text-[#2563EB] dark:hover:text-[#3B82F6] transition-colors"
							>
								Home
							</button>
							<button
								onClick={() => scrollToSection('about')}
								className="hover:text-[#2563EB] dark:hover:text-[#3B82F6] transition-colors"
							>
								About
							</button>
							<button
								onClick={() => scrollToSection('skills')}
								className="hover:text-[#2563EB] dark:hover:text-[#3B82F6] transition-colors"
							>
								Skills
							</button>
							<button
								onClick={() => scrollToSection('projects')}
								className="hover:text-[#2563EB] dark:hover:text-[#3B82F6] transition-colors"
							>
								Projects
							</button>
							<button
								onClick={() => scrollToSection('services')}
								className="hover:text-[#2563EB] dark:hover:text-[#3B82F6] transition-colors"
							>
								Services
							</button>
							{/* Testimonials - Commented out for now */}
							{/*
							<button
								onClick={() => scrollToSection('testimonials')}
								className="hover:text-[#2563EB] dark:hover:text-[#3B82F6] transition-colors"
							>
								Testimonials
							</button>
							*/}
						</div>

						<div className="flex items-center space-x-4">
							<button
								onClick={() => {
									const newTheme = theme === 'dark' ? 'light' : 'dark';
									setTheme(newTheme);
								}}
								className="relative w-16 h-8 rounded-full bg-gray-200 dark:bg-gray-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
								aria-label="Toggle theme"
							>
								{/* Sliding indicator */}
								<div
									className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-300 ease-in-out ${
										mounted && theme === 'dark'
											? 'translate-x-9'
											: 'translate-x-0.5'
									}`}
								/>

								{/* Icons positioned on the toggle */}
								<div className="absolute inset-0 flex items-center justify-between px-1.5">
									<Sun
										className={`w-4 h-4 transition-colors duration-300 ${
											mounted && theme === 'dark'
												? 'text-gray-400'
												: 'text-yellow-500'
										}`}
									/>
									<Moon
										className={`w-4 h-4 transition-colors duration-300 ${
											mounted && theme === 'dark'
												? 'text-blue-400'
												: 'text-gray-400'
										}`}
									/>
								</div>
							</button>

							<Button
								onClick={() => scrollToSection('contact')}
								variant="outline"
								className="hidden md:inline-flex border-[#2563EB] text-[#2563EB] hover:bg-[#2563EB] hover:text-white dark:border-[#3B82F6] dark:text-[#3B82F6] dark:hover:bg-[#3B82F6] bg-transparent transition-all duration-200"
							>
								Hire Me
							</Button>

							<Button
								variant="ghost"
								size="icon"
								className="md:hidden"
								onClick={() => setIsMenuOpen(!isMenuOpen)}
							>
								{isMenuOpen ? (
									<X className="h-5 w-5" />
								) : (
									<Menu className="h-5 w-5" />
								)}
							</Button>
						</div>
					</div>

					{/* Mobile Navigation */}
					{isMenuOpen && (
						<div className="md:hidden py-4 space-y-2">
							<button
								onClick={() => scrollToSection('home')}
								className="block w-full text-left py-2 hover:text-[#2563EB] dark:hover:text-[#3B82F6] transition-colors"
							>
								Home
							</button>
							<button
								onClick={() => scrollToSection('about')}
								className="block w-full text-left py-2 hover:text-[#2563EB] dark:hover:text-[#3B82F6] transition-colors"
							>
								About
							</button>
							<button
								onClick={() => scrollToSection('skills')}
								className="block w-full text-left py-2 hover:text-[#2563EB] dark:hover:text-[#3B82F6] transition-colors"
							>
								Skills
							</button>
							<button
								onClick={() => scrollToSection('projects')}
								className="block w-full text-left py-2 hover:text-[#2563EB] dark:hover:text-[#3B82F6] transition-colors"
							>
								Projects
							</button>
							<button
								onClick={() => scrollToSection('services')}
								className="block w-full text-left py-2 hover:text-[#2563EB] dark:hover:text-[#3B82F6] transition-colors"
							>
								Services
							</button>
							{/* Testimonials - Commented out for now */}
							{/*
							<button
								onClick={() => scrollToSection('testimonials')}
								className="block w-full text-left py-2 hover:text-[#2563EB] dark:hover:text-[#3B82F6] transition-colors"
							>
								Testimonials
							</button>
							*/}
							<button
								onClick={() => scrollToSection('contact')}
								className="block w-full text-left py-2 hover:text-[#2563EB] dark:hover:text-[#3B82F6] transition-colors"
							>
								Contact
							</button>
							<Button
								onClick={() => scrollToSection('contact')}
								variant="outline"
								className="w-full mt-4 border-[#2563EB] text-[#2563EB] hover:bg-[#2563EB] hover:text-white dark:border-[#3B82F6] dark:text-[#3B82F6] dark:hover:bg-[#3B82F6] bg-transparent transition-all duration-200"
							>
								Hire Me
							</Button>
						</div>
					)}
				</div>
			</nav>

			{/* Hero Section */}
			<section id="home" className="py-20 px-4 sm:px-6 lg:px-8">
				<div className="max-w-4xl mx-auto text-center">
					<div className="mb-8">
						<div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-[#2563EB] to-[#3B82F6] p-1">
							<div className="w-full h-full rounded-full bg-[#F9FAFB] dark:bg-[#0D1117] flex items-center justify-center">
								<span className="text-4xl font-bold text-[#2563EB] dark:text-[#3B82F6]">
									H
								</span>
							</div>
						</div>
					</div>

					<h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
						<span className="inline-block typing-container min-w-[400px] md:min-w-[600px]">
							{currentText}
							<span className="typing-cursor">|</span>
						</span>
					</h1>

					<p className="text-xl md:text-2xl text-[#64748B] dark:text-[#9CA3AF] mb-8 max-w-3xl mx-auto">
						Building Scalable Web Apps & Modern Digital Experiences
					</p>

					<div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
						<Button
							onClick={() => scrollToSection('projects')}
							className="bg-[#2563EB] hover:bg-[#1D4ED8] dark:bg-[#3B82F6] dark:hover:bg-[#2563EB] text-white px-8 py-3 text-lg"
						>
							View My Work
						</Button>
						<Button
							variant="outline"
							className="border-[#2563EB] text-[#2563EB] hover:bg-[#2563EB] hover:text-white dark:border-[#3B82F6] dark:text-[#3B82F6] dark:hover:bg-[#3B82F6] px-8 py-3 text-lg bg-transparent"
						>
							<Download className="mr-2 h-5 w-5" />
							Download CV
						</Button>
					</div>
				</div>
			</section>

			{/* About Me Section */}
			<section
				id="about"
				className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-[#161B22]"
			>
				<div className="max-w-6xl mx-auto">
					<div className="text-center mb-16">
						<h2 className="text-3xl md:text-4xl font-bold mb-4">About Me</h2>
						<div className="w-20 h-1 bg-[#2563EB] dark:bg-[#3B82F6] mx-auto rounded-full"></div>
					</div>

					<div className="grid lg:grid-cols-2 gap-12 items-center">
						{/* Bio Content */}
						<div className="space-y-6">
							<p className="text-lg text-[#64748B] dark:text-[#9CA3AF] leading-relaxed">
								I&apos;m a passionate fullstack developer with 3+ years of
								experience building modern web applications. React enthusiast,
								JavaScript expert, and always eager to learn new technologies.
							</p>

							<p className="text-lg text-[#64748B] dark:text-[#9CA3AF] leading-relaxed">
								I specialize in creating scalable, user-centric solutions across
								fintech, e-commerce, and SaaS platforms. When I&apos;m not
								coding, I&apos;m exploring new tech, contributing to
								open-source, or mentoring fellow developers.
							</p>

							{/* Experience Stats */}
							<div className="grid grid-cols-2 gap-6 pt-6">
								<div className="text-center">
									<div className="flex items-center justify-center w-12 h-12 bg-[#2563EB]/10 dark:bg-[#3B82F6]/10 rounded-lg mb-3 mx-auto">
										<Calendar className="w-6 h-6 text-[#2563EB] dark:text-[#3B82F6]" />
									</div>
									<div className="text-2xl font-bold text-[#1E293B] dark:text-[#E6EDF3]">
										3+
									</div>
									<div className="text-sm text-[#64748B] dark:text-[#9CA3AF]">
										Years Experience
									</div>
								</div>

								<div className="text-center">
									<div className="flex items-center justify-center w-12 h-12 bg-[#2563EB]/10 dark:bg-[#3B82F6]/10 rounded-lg mb-3 mx-auto">
										<Users className="w-6 h-6 text-[#2563EB] dark:text-[#3B82F6]" />
									</div>
									<div className="text-2xl font-bold text-[#1E293B] dark:text-[#E6EDF3]">
										50+
									</div>
									<div className="text-sm text-[#64748B] dark:text-[#9CA3AF]">
										Happy Clients
									</div>
								</div>
							</div>
						</div>

						{/* Achievements & Certifications */}
						<div className="space-y-8">
							<div>
								<h3 className="text-xl font-semibold mb-6 text-[#1E293B] dark:text-[#E6EDF3]">
									Achievements & Certifications
								</h3>

								<div className="space-y-4">
									<Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#0D1117] hover:shadow-lg transition-shadow">
										<CardContent className="p-4">
											<div className="flex items-center space-x-3">
												<div className="flex items-center justify-center w-10 h-10 bg-[#2563EB]/10 dark:bg-[#3B82F6]/10 rounded-lg">
													<Code className="w-5 h-5 text-[#2563EB] dark:text-[#3B82F6]" />
												</div>
												<div>
													<h4 className="font-semibold text-[#1E293B] dark:text-[#E6EDF3]">
														React.js Certification
													</h4>
													<p className="text-sm text-[#64748B] dark:text-[#9CA3AF]">
														Meta (Facebook)
													</p>
												</div>
											</div>
										</CardContent>
									</Card>

									<Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#0D1117] hover:shadow-lg transition-shadow">
										<CardContent className="p-4">
											<div className="flex items-center space-x-3">
												<div className="flex items-center justify-center w-10 h-10 bg-[#2563EB]/10 dark:bg-[#3B82F6]/10 rounded-lg">
													<Code className="w-5 h-5 text-[#2563EB] dark:text-[#3B82F6]" />
												</div>
												<div>
													<h4 className="font-semibold text-[#1E293B] dark:text-[#E6EDF3]">
														Next.js Certification
													</h4>
													<p className="text-sm text-[#64748B] dark:text-[#9CA3AF]">
														Vercel
													</p>
												</div>
											</div>
										</CardContent>
									</Card>

									<Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#0D1117] hover:shadow-lg transition-shadow">
										<CardContent className="p-4">
											<div className="flex items-center space-x-3">
												<div className="flex items-center justify-center w-10 h-10 bg-[#2563EB]/10 dark:bg-[#3B82F6]/10 rounded-lg">
													<Code className="w-5 h-5 text-[#2563EB] dark:text-[#3B82F6]" />
												</div>
												<div>
													<h4 className="font-semibold text-[#1E293B] dark:text-[#E6EDF3]">
														TypeScript Certification
													</h4>
													<p className="text-sm text-[#64748B] dark:text-[#9CA3AF]">
														Microsoft
													</p>
												</div>
											</div>
										</CardContent>
									</Card>
								</div>
							</div>

							{/* Industry Experience */}
							<div>
								<h3 className="text-xl font-semibold mb-4 text-[#1E293B] dark:text-[#E6EDF3]">
									Industry Experience
								</h3>
								<div className="flex flex-wrap gap-2">
									<Badge
										variant="secondary"
										className="bg-[#2563EB]/10 text-[#2563EB] dark:bg-[#3B82F6]/10 dark:text-[#3B82F6] hover:bg-[#2563EB]/20"
									>
										Fintech
									</Badge>
									<Badge
										variant="secondary"
										className="bg-[#2563EB]/10 text-[#2563EB] dark:bg-[#3B82F6]/10 dark:text-[#3B82F6] hover:bg-[#2563EB]/20"
									>
										E-commerce
									</Badge>
									<Badge
										variant="secondary"
										className="bg-[#2563EB]/10 text-[#2563EB] dark:bg-[#3B82F6]/10 dark:text-[#3B82F6] hover:bg-[#2563EB]/20"
									>
										Healthcare
									</Badge>
									<Badge
										variant="secondary"
										className="bg-[#2563EB]/10 text-[#2563EB] dark:bg-[#3B82F6]/10 dark:text-[#3B82F6] hover:bg-[#2563EB]/20"
									>
										SaaS
									</Badge>
									<Badge
										variant="secondary"
										className="bg-[#2563EB]/10 text-[#2563EB] dark:bg-[#3B82F6]/10 dark:text-[#3B82F6] hover:bg-[#2563EB]/20"
									>
										EdTech
									</Badge>
									<Badge
										variant="secondary"
										className="bg-[#2563EB]/10 text-[#2563EB] dark:bg-[#3B82F6]/10 dark:text-[#3B82F6] hover:bg-[#2563EB]/20"
									>
										Real Estate
									</Badge>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Skills Section */}
			<section id="skills" className="py-20 px-4 sm:px-6 lg:px-8">
				<div className="max-w-6xl mx-auto">
					<div className="text-center mb-16">
						<h2 className="text-3xl md:text-4xl font-bold mb-4">
							Skills & Technologies
						</h2>
						<div className="w-20 h-1 bg-[#2563EB] dark:bg-[#3B82F6] mx-auto rounded-full"></div>
						<p className="text-lg text-[#64748B] dark:text-[#9CA3AF] mt-6 max-w-2xl mx-auto">
							A comprehensive toolkit of modern technologies and frameworks I
							use to build exceptional digital experiences.
						</p>
					</div>

					<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
						{skillCategories.map((category, index) => (
							<Card
								key={index}
								className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#161B22] hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
							>
								<CardContent className="p-6">
									<h3 className="text-xl font-semibold mb-6 text-[#1E293B] dark:text-[#E6EDF3] text-center">
										{category.category}
									</h3>
									<div className="space-y-4">
										{category.skills.map((skill, skillIndex) => (
											<div key={skillIndex} className="space-y-2">
												<div className="flex justify-between items-center">
													<span className="text-sm font-medium text-[#64748B] dark:text-[#9CA3AF]">
														{skill.name}
													</span>
													<span className="text-xs text-[#2563EB] dark:text-[#3B82F6]">
														{skill.level}%
													</span>
												</div>
												<div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
													<div
														className="bg-gradient-to-r from-[#2563EB] to-[#3B82F6] h-2 rounded-full transition-all duration-1000 ease-out"
														style={{ width: `${skill.level}%` }}
													></div>
												</div>
											</div>
										))}
									</div>
								</CardContent>
							</Card>
						))}
					</div>
				</div>
			</section>

			{/* Projects Section */}
			<section
				id="projects"
				className="py-16 sm:py-20 bg-white dark:bg-[#161B22]"
			>
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center mb-16">
						<h2 className="text-3xl md:text-4xl font-bold mb-4">Projects</h2>
						<div className="w-20 h-1 bg-[#2563EB] dark:bg-[#3B82F6] mx-auto rounded-full"></div>
						<p className="text-lg text-[#64748B] dark:text-[#9CA3AF] mt-6 max-w-2xl mx-auto">
							A showcase of my recent work and technical projects.
						</p>
					</div>

					{loading ? (
						<div className="flex justify-center items-center py-20">
							<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2563EB] dark:border-[#3B82F6]"></div>
						</div>
					) : (
						/* Responsive Grid Layout */
						<div className="projects-grid">
							{(showAllProjects ? projects : projects.slice(0, 6)).map(
								(project) => (
									<Card
										key={project.id}
										className="project-card group border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#0D1117] overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 w-full"
									>
										<div className="flex flex-col h-full">
											{/* Project Image with Hover Effect */}
											<div className="relative overflow-hidden h-64">
												<img
													src={project.image || '/placeholder.svg'}
													alt={project.title}
													className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
												/>
											</div>

											<CardContent className="p-6 flex flex-col flex-grow">
												<div className="flex-grow">
													<h3 className="text-xl font-bold mb-3 text-[#1E293B] dark:text-[#E6EDF3] group-hover:text-[#2563EB] dark:group-hover:text-[#3B82F6] transition-colors">
														{project.title}
													</h3>

													<p className="text-[#64748B] dark:text-[#9CA3AF] text-sm leading-relaxed mb-4 line-clamp-3">
														{project.description}
													</p>

													{/* Tech Stack */}
													<div className="mb-6">
														<div className="flex flex-wrap gap-2">
															{project.techStack.map((tech, techIndex) => (
																<Badge
																	key={techIndex}
																	variant="outline"
																	className="text-xs border-[#2563EB]/30 text-[#2563EB] dark:border-[#3B82F6]/30 dark:text-[#3B82F6] hover:bg-[#2563EB]/10 dark:hover:bg-[#3B82F6]/10 transition-colors"
																>
																	{tech}
																</Badge>
															))}
														</div>
													</div>
												</div>

												{/* Action Buttons */}
												<div className="flex gap-3 mt-auto">
													<Button
														className="flex-1 bg-[#2563EB] hover:bg-[#1D4ED8] dark:bg-[#3B82F6] dark:hover:bg-[#2563EB] text-white transition-all duration-200 hover:scale-105"
														onClick={() =>
															window.open(project.liveUrl, '_blank')
														}
													>
														<ExternalLink className="w-4 h-4 mr-2" />
														Live Demo
													</Button>
													<Button
														variant="outline"
														className="flex-1 border-[#2563EB] text-[#2563EB] hover:bg-[#2563EB] hover:text-white dark:border-[#3B82F6] dark:text-[#3B82F6] dark:hover:bg-[#3B82F6] bg-transparent transition-all duration-200 hover:scale-105"
														onClick={() =>
															window.open(project.githubUrl, '_blank')
														}
													>
														<Github className="w-4 h-4 mr-2" />
														View Code
													</Button>
												</div>
											</CardContent>
										</div>
									</Card>
								)
							)}
						</div>
					)}

					{/* Show More Button */}
					{!loading && projects.length > 6 && (
						<div className="text-center mt-12">
							<Button
								onClick={() => setShowAllProjects(!showAllProjects)}
								variant="outline"
								className="border-[#2563EB] text-[#2563EB] hover:bg-[#2563EB] hover:text-white dark:border-[#3B82F6] dark:text-[#3B82F6] dark:hover:bg-[#3B82F6] bg-transparent transition-all duration-200 hover:scale-105 px-8 py-3 text-lg"
							>
								{showAllProjects
									? 'Show Less'
									: `Show More (${projects.length - 6} more)`}
							</Button>
						</div>
					)}
				</div>
			</section>

			{/* Services Section */}
			<section id="services" className="py-20 px-4 sm:px-6 lg:px-8">
				<div className="max-w-6xl mx-auto">
					<div className="text-center mb-16">
						<h2 className="text-3xl md:text-4xl font-bold mb-4">Services</h2>
						<div className="w-20 h-1 bg-[#2563EB] dark:bg-[#3B82F6] mx-auto rounded-full"></div>
						<p className="text-lg text-[#64748B] dark:text-[#9CA3AF] mt-6 max-w-2xl mx-auto">
							Comprehensive development services tailored to bring your digital
							vision to life with modern technologies and best practices.
						</p>
					</div>

					<div className="grid md:grid-cols-2 gap-8 mb-12">
						{services.map((service, index) => {
							const IconComponent = service.icon;
							return (
								<Card
									key={index}
									className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#161B22] hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group"
								>
									<CardContent className="p-8">
										<div className="flex items-center mb-6">
											<div className="flex items-center justify-center w-16 h-16 bg-[#2563EB]/10 dark:bg-[#3B82F6]/10 rounded-xl mr-4 group-hover:bg-[#2563EB]/20 transition-colors">
												<IconComponent className="w-8 h-8 text-[#2563EB] dark:text-[#3B82F6]" />
											</div>
											<h3 className="text-xl font-bold text-[#1E293B] dark:text-[#E6EDF3]">
												{service.title}
											</h3>
										</div>

										<p className="text-[#64748B] dark:text-[#9CA3AF] mb-6 leading-relaxed">
											{service.description}
										</p>

										<div className="space-y-2">
											{service.features.map((feature, featureIndex) => (
												<div
													key={featureIndex}
													className="flex items-center text-sm"
												>
													<div className="w-2 h-2 bg-[#2563EB] dark:bg-[#3B82F6] rounded-full mr-3"></div>
													<span className="text-[#64748B] dark:text-[#9CA3AF]">
														{feature}
													</span>
												</div>
											))}
										</div>
									</CardContent>
								</Card>
							);
						})}
					</div>

					<div className="text-center">
						<Button
							onClick={() => scrollToSection('contact')}
							className="bg-[#2563EB] hover:bg-[#1D4ED8] dark:bg-[#3B82F6] dark:hover:bg-[#2563EB] text-white px-8 py-3 text-lg"
						>
							Work With Me
						</Button>
					</div>
				</div>
			</section>

			{/* Testimonials Section - Commented out for now */}
			{/* 
			<section
				id="testimonials"
				className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-[#161B22]"
			>
				<div className="max-w-4xl mx-auto">
					<div className="text-center mb-16">
						<h2 className="text-3xl md:text-4xl font-bold mb-4">
							What Clients Say
						</h2>
						<div className="w-20 h-1 bg-[#2563EB] dark:bg-[#3B82F6] mx-auto rounded-full"></div>
						<p className="text-lg text-[#64748B] dark:text-[#9CA3AF] mt-6 max-w-2xl mx-auto">
							Hear from clients and team members who have worked with me on
							various projects.
						</p>
					</div>
				</div>
			</section>
			*/}

			<section id="contact" className="py-20 px-4 sm:px-6 lg:px-8">
				<div className="max-w-6xl mx-auto">
					<div className="text-center mb-16">
						<h2 className="text-3xl md:text-4xl font-bold mb-4">
							Let&apos;s Work Together
						</h2>
						<div className="w-20 h-1 bg-[#2563EB] dark:bg-[#3B82F6] mx-auto rounded-full"></div>
						<p className="text-lg text-[#64748B] dark:text-[#9CA3AF] mt-6 max-w-2xl mx-auto">
							Ready to bring your project to life? Get in touch and let&apos;s
							discuss how we can create something amazing together.
						</p>
					</div>

					<div className="grid lg:grid-cols-2 gap-12">
						{/* Contact Form */}
						<Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#161B22]">
							<CardContent className="p-8">
								<h3 className="text-2xl font-bold mb-6 text-[#1E293B] dark:text-[#E6EDF3]">
									Send a Message
								</h3>

								<form onSubmit={handleSubmit} className="space-y-6">
									<div>
										<label
											htmlFor="name"
											className="block text-sm font-medium text-[#1E293B] dark:text-[#E6EDF3] mb-2"
										>
											Name
										</label>
										<Input
											id="name"
											name="name"
											type="text"
											value={formData.name}
											onChange={handleInputChange}
											placeholder="Your full name"
											required
											className="w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-[#0D1117] text-[#1E293B] dark:text-[#E6EDF3] focus:border-[#2563EB] dark:focus:border-[#3B82F6]"
										/>
									</div>

									<div>
										<label
											htmlFor="email"
											className="block text-sm font-medium text-[#1E293B] dark:text-[#E6EDF3] mb-2"
										>
											Email
										</label>
										<Input
											id="email"
											name="email"
											type="email"
											value={formData.email}
											onChange={handleInputChange}
											placeholder="your.email@example.com"
											required
											className="w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-[#0D1117] text-[#1E293B] dark:text-[#E6EDF3] focus:border-[#2563EB] dark:focus:border-[#3B82F6]"
										/>
									</div>

									<div>
										<label
											htmlFor="phone"
											className="block text-sm font-medium text-[#1E293B] dark:text-[#E6EDF3] mb-2"
										>
											Phone Number{' '}
											<span className="text-gray-500 text-xs">(Optional)</span>
										</label>
										<Input
											id="phone"
											name="phone"
											type="tel"
											value={formData.phone}
											onChange={handleInputChange}
											placeholder="+60123456789"
											className="w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-[#0D1117] text-[#1E293B] dark:text-[#E6EDF3] focus:border-[#2563EB] dark:focus:border-[#3B82F6]"
										/>
									</div>

									<div>
										<label
											htmlFor="message"
											className="block text-sm font-medium text-[#1E293B] dark:text-[#E6EDF3] mb-2"
										>
											Message
										</label>
										<Textarea
											id="message"
											name="message"
											value={formData.message}
											onChange={handleInputChange}
											placeholder="Tell me about your project..."
											rows={5}
											required
											className="w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-[#0D1117] text-[#1E293B] dark:text-[#E6EDF3] focus:border-[#2563EB] dark:focus:border-[#3B82F6] resize-none"
										/>
									</div>

									<Button
										type="submit"
										disabled={isSubmitting}
										className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] dark:bg-[#3B82F6] dark:hover:bg-[#2563EB] text-white py-3 disabled:opacity-50 disabled:cursor-not-allowed"
									>
										{isSubmitting ? (
											<>
												<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
												Sending...
											</>
										) : (
											<>
												<Send className="w-4 h-4 mr-2" />
												Send Message
											</>
										)}
									</Button>

									{/* Status Messages */}
									{submitStatus === 'success' && (
										<div className="mt-4 p-3 bg-green-100 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
											<p className="text-green-800 dark:text-green-200 text-sm text-center">
												✅ Message sent successfully! I&apos;ll get back to you
												soon.
											</p>
										</div>
									)}

									{submitStatus === 'error' && (
										<div className="mt-4 p-3 bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
											<p className="text-red-800 dark:text-red-200 text-sm text-center">
												❌ Failed to send message. Please try again or email me
												directly at{' '}
												<a
													href="mailto:husainimuhd99@gmail.com"
													className="underline hover:text-red-600 dark:hover:text-red-400"
												>
													husainimuhd99@gmail.com
												</a>
											</p>
										</div>
									)}
								</form>
							</CardContent>
						</Card>

						{/* Contact Info */}
						<div className="space-y-8">
							<div>
								<h3 className="text-2xl font-bold mb-6 text-[#1E293B] dark:text-[#E6EDF3]">
									Get in Touch
								</h3>
								<p className="text-[#64748B] dark:text-[#9CA3AF] mb-8 leading-relaxed">
									I&apos;m always excited to work on new projects and
									collaborate with amazing people. Whether you have a specific
									project in mind or just want to explore possibilities,
									I&apos;d love to hear from you.
								</p>

								<div className="space-y-4">
									<div className="flex items-center space-x-4">
										<div className="flex items-center justify-center w-12 h-12 bg-[#2563EB]/10 dark:bg-[#3B82F6]/10 rounded-lg">
											<Mail className="w-6 h-6 text-[#2563EB] dark:text-[#3B82F6]" />
										</div>
										<div>
											<h4 className="font-semibold text-[#1E293B] dark:text-[#E6EDF3]">
												Email
											</h4>
											<p className="text-[#64748B] dark:text-[#9CA3AF]">
												husainimuhd99@gmail.com
											</p>
										</div>
									</div>

									<div className="flex items-center space-x-4">
										<div className="flex items-center justify-center w-12 h-12 bg-[#2563EB]/10 dark:bg-[#3B82F6]/10 rounded-lg">
											<MapPin className="w-6 h-6 text-[#2563EB] dark:text-[#3B82F6]" />
										</div>
										<div>
											<h4 className="font-semibold text-[#1E293B] dark:text-[#E6EDF3]">
												Location
											</h4>
											<p className="text-[#64748B] dark:text-[#9CA3AF]">
												Malaysia | Available for remote work worldwide
											</p>
										</div>
									</div>

									<div className="flex items-center space-x-4">
										<div className="flex items-center justify-center w-12 h-12 bg-[#2563EB]/10 dark:bg-[#3B82F6]/10 rounded-lg">
											<Phone className="w-6 h-6 text-[#2563EB] dark:text-[#3B82F6]" />
										</div>
										<div>
											<h4 className="font-semibold text-[#1E293B] dark:text-[#E6EDF3]">
												Response Time
											</h4>
											<p className="text-[#64748B] dark:text-[#9CA3AF]">
												Usually within 24 hours
											</p>
										</div>
									</div>
								</div>
							</div>

							{/* Social Links */}
							<div>
								<h4 className="text-lg font-semibold mb-4 text-[#1E293B] dark:text-[#E6EDF3]">
									Connect With Me
								</h4>
								<div className="flex space-x-4">
									<Button
										variant="outline"
										size="icon"
										className="border-[#2563EB] text-[#2563EB] hover:bg-[#2563EB] hover:text-white dark:border-[#3B82F6] dark:text-[#3B82F6] dark:hover:bg-[#3B82F6] bg-transparent"
										onClick={() =>
											window.open(
												'https://www.linkedin.com/in/husaini99/',
												'_blank'
											)
										}
									>
										<Linkedin className="w-5 h-5" />
									</Button>
									<Button
										variant="outline"
										size="icon"
										className="border-[#2563EB] text-[#2563EB] hover:bg-[#2563EB] hover:text-white dark:border-[#3B82F6] dark:text-[#3B82F6] dark:hover:bg-[#3B82F6] bg-transparent"
										onClick={() =>
											window.open('https://github.com/Husaini1999', '_blank')
										}
									>
										<Github className="w-5 h-5" />
									</Button>
									<Button
										variant="outline"
										size="icon"
										className="border-[#2563EB] text-[#2563EB] hover:bg-[#2563EB] hover:text-white dark:border-[#3B82F6] dark:text-[#3B82F6] dark:hover:bg-[#3B82F6] bg-transparent"
										onClick={() => {
											const subject = encodeURIComponent(
												'Project Inquiry - Web Development'
											);
											const body = encodeURIComponent(`Hi Husaini,
											I came across your portfolio and I&apos;m interested in working with you on a project.

											Project Details:
											- Project Type: 
											- Timeline: 
											- Budget Range: 
											- Description: 

											Please let me know if you&apos;re available and how we can proceed.

											Best regards,
											[Your Name]`);
											window.open(
												`mailto:husainimuhd99@gmail.com?subject=${subject}&body=${body}`,
												'_blank'
											);
										}}
									>
										<Mail className="w-5 h-5" />
									</Button>
									{/* <Button
										variant="outline"
										size="icon"
										className="border-[#2563EB] text-[#2563EB] hover:bg-[#2563EB] hover:text-white dark:border-[#3B82F6] dark:text-[#3B82F6] dark:hover:bg-[#3B82F6] bg-transparent"
										onClick={() =>
											window.open('https://twitter.com/husaini', '_blank')
										}
									>
										<Twitter className="w-5 h-5" />
									</Button> */}
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			<footer className="bg-[#1E293B] dark:bg-[#0D1117] text-white py-12 px-4 sm:px-6 lg:px-8">
				<div className="max-w-6xl mx-auto">
					<div className="grid md:grid-cols-4 gap-8">
						{/* Brand */}
						<div className="md:col-span-2">
							<h3 className="text-2xl font-bold mb-4">Husaini</h3>
							<p className="text-gray-300 mb-6 leading-relaxed">
								Fullstack developer passionate about creating exceptional
								digital experiences. Let&apos;s build something amazing
								together.
							</p>
							<div className="flex space-x-4">
								<Button
									variant="ghost"
									size="icon"
									className="text-gray-300 hover:text-white hover:bg-white/10"
									onClick={() =>
										window.open(
											'https://www.linkedin.com/in/husaini99/',
											'_blank'
										)
									}
								>
									<Linkedin className="w-5 h-5" />
								</Button>
								<Button
									variant="ghost"
									size="icon"
									className="text-gray-300 hover:text-white hover:bg-white/10"
									onClick={() =>
										window.open('https://github.com/Husaini1999', '_blank')
									}
								>
									<Github className="w-5 h-5" />
								</Button>
								<Button
									variant="ghost"
									size="icon"
									className="text-gray-300 hover:text-white hover:bg-white/10"
									onClick={() => {
										const subject = encodeURIComponent(
											'Project Inquiry - Web Development'
										);
										const body = encodeURIComponent(`Hi Husaini,

										I came across your portfolio and I&apos;m interested in working with you on a project.

										Project Details:
										- Project Type: 
										- Timeline: 
										- Budget Range: 
										- Description: 

										Please let me know if you&apos;re available and how we can proceed.

										Best regards,
										[Your Name]`);
										window.open(
											`mailto:husainimuhd99@gmail.com?subject=${subject}&body=${body}`,
											'_blank'
										);
									}}
								>
									<Mail className="w-5 h-5" />
								</Button>
								{/* <Button
									variant="ghost"
									size="icon"
									className="text-gray-300 hover:text-white hover:bg-white/10"
									onClick={() =>
										window.open('https://twitter.com/husaini', '_blank')
									}
								>
									<Twitter className="w-5 h-5" />
								</Button> */}
							</div>
						</div>

						{/* Quick Links */}
						<div>
							<h4 className="text-lg font-semibold mb-4">Quick Links</h4>
							<ul className="space-y-2">
								<li>
									<button
										onClick={() => scrollToSection('about')}
										className="text-gray-300 hover:text-white transition-colors"
									>
										About
									</button>
								</li>
								<li>
									<button
										onClick={() => scrollToSection('projects')}
										className="text-gray-300 hover:text-white transition-colors"
									>
										Projects
									</button>
								</li>
								<li>
									<button
										onClick={() => scrollToSection('services')}
										className="text-gray-300 hover:text-white transition-colors"
									>
										Services
									</button>
								</li>
								<li>
									<button
										onClick={() => scrollToSection('contact')}
										className="text-gray-300 hover:text-white transition-colors"
									>
										Contact
									</button>
								</li>
							</ul>
						</div>

						{/* Resources */}
						<div>
							<h4 className="text-lg font-semibold mb-4">Resources</h4>
							<ul className="space-y-2">
								<li>
									<a
										href="#"
										className="text-gray-300 hover:text-white transition-colors flex items-center"
									>
										<Download className="w-4 h-4 mr-2" />
										Resume
									</a>
								</li>
								<li>
									<a
										href="https://github.com/Husaini1999"
										className="text-gray-300 hover:text-white transition-colors flex items-center"
									>
										<Github className="w-4 h-4 mr-2" />
										GitHub
									</a>
								</li>
								<li>
									<a
										href="https://www.linkedin.com/in/husaini99/"
										className="text-gray-300 hover:text-white transition-colors flex items-center"
									>
										<Linkedin className="w-4 h-4 mr-2" />
										LinkedIn
									</a>
								</li>
								{/* <li>
									<a
										href="https://twitter.com/husaini"
										className="text-gray-300 hover:text-white transition-colors flex items-center"
									>
										<Twitter className="w-4 h-4 mr-2" />
										Twitter
									</a>
								</li> */}
							</ul>
						</div>
					</div>

					<div className="border-t border-gray-600 mt-8 pt-8 text-center">
						<p className="text-gray-300">
							© {new Date().getFullYear()} Husaini. All rights reserved. Built
							with Next.js and Tailwind CSS.
						</p>
					</div>
				</div>
			</footer>
		</div>
	);
}
