import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BarChart3, Bell, Shield, Users } from "lucide-react";
import { Button } from "../components/ui/Button";

export const Route = createFileRoute("/")({ component: LandingPage });

function LandingPage() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-primary/5 via-white to-success/5">
			{/* Navbar */}
			<nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
				<div className="container mx-auto px-4 py-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<div className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg">
								<span className="text-xl font-bold text-white">E</span>
							</div>
							<div>
								<h1 className="text-xl font-bold text-gray-900">EntXit</h1>
								<p className="text-xs text-gray-500">Gate Pass Management</p>
							</div>
						</div>
						<div className="flex items-center gap-6">
							<a
								href="#features"
								className="text-sm text-gray-600 hover:text-primary transition-colors"
							>
								Features
							</a>
							<a
								href="#about"
								className="text-sm text-gray-600 hover:text-primary transition-colors"
							>
								About
							</a>
							<a
								href="#contact"
								className="text-sm text-gray-600 hover:text-primary transition-colors"
							>
								Contact
							</a>
							<Link to="/login">
								<Button size="sm">Sign In</Button>
							</Link>
						</div>
					</div>
				</div>
			</nav>

			{/* Hero Section */}
			<div className="container mx-auto px-4 py-20">
				<div className="text-center max-w-4xl mx-auto">
					<div className="inline-flex items-center justify-center w-20 h-20 bg-primary rounded-2xl mb-8">
						<span className="text-4xl font-bold text-white">E</span>
					</div>
					<h1 className="text-6xl font-bold text-gray-900 mb-6">
						Welcome to EntXit
					</h1>
					<p className="text-xl text-gray-600 mb-8 leading-relaxed">
						Professional Gate Pass Management System for HOAs, Estates, and
						Companies. Streamline visitor management, enhance security, and
						improve resident experience.
					</p>
					<div className="flex items-center justify-center gap-4">
						<Link to="/login">
							<Button size="lg">
								Sign In
								<ArrowRight className="w-5 h-5" />
							</Button>
						</Link>
						<Button size="lg" variant="outline">
							Learn More
						</Button>
					</div>
				</div>

				{/* Features Grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-20">
					<FeatureCard
						icon={<Shield className="w-8 h-8 text-primary" />}
						title="Security Management"
						description="Real-time security alerts and incident tracking with panic button integration"
					/>
					<FeatureCard
						icon={<Users className="w-8 h-8 text-success" />}
						title="User Management"
						description="Manage residents, guards, and admins with role-based permissions"
					/>
					<FeatureCard
						icon={<BarChart3 className="w-8 h-8 text-primary" />}
						title="Analytics & Reports"
						description="Comprehensive insights on usage, revenue, and user growth metrics"
					/>
					<FeatureCard
						icon={<Bell className="w-8 h-8 text-success" />}
						title="Announcements"
						description="System-wide broadcasts with scheduled delivery and priority levels"
					/>
				</div>
			</div>
		</div>
	);
}

interface FeatureCardProps {
	icon: React.ReactNode;
	title: string;
	description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
	return (
		<div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
			<div className="mb-4">{icon}</div>
			<h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
			<p className="text-gray-600 text-sm leading-relaxed">{description}</p>
		</div>
	);
}
