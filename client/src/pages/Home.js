import React from "react";
import { Link } from "react-router-dom";
import {
  Database,
  BarChart3,
  ArrowRightLeft,
  Zap,
  CheckCircle,
  ArrowRight,
  Star,
  Users,
  Lock,
} from "lucide-react";

const Home = () => {
  const features = [
    {
      icon: Database,
      title: "Schema Analysis",
      description:
        "Automatically analyze your MySQL database structure, relationships, and data types.",
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
    },
    {
      icon: BarChart3,
      title: "Smart Recommendations",
      description:
        "Get intelligent suggestions for the best target database based on your schema.",
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-900/20",
    },
    {
      icon: ArrowRightLeft,
      title: "Data Migration",
      description:
        "Seamlessly migrate both structure and data between different database systems.",
      color: "text-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "CTO at TechCorp",
      content:
        "DataFlow saved us weeks of manual migration work. The intelligent recommendations were spot-on!",
      rating: 5,
      avatar: "SJ",
    },
    {
      name: "Michael Chen",
      role: "Lead Developer at DataFlow Inc",
      content:
        "The schema analysis feature is incredible. It helped us identify potential issues before migration.",
      rating: 5,
      avatar: "MC",
    },
    {
      name: "Emily Rodriguez",
      role: "DevOps Engineer at CloudScale",
      content:
        "Fast, reliable, and secure. DataFlow made our database migration seamless and worry-free.",
      rating: 5,
      avatar: "ER",
    },
  ];

  const securityFeatures = [
    {
      icon: Lock,
      title: "SSL Encryption",
      description:
        "All data transfers are encrypted with industry-standard SSL",
    },
    {
      icon: Users,
      title: "Role-Based Access",
      description: "Granular permissions and access control",
    },
  ];

  const pricingTiers = [
    {
      name: "Starter",
      price: "Free",
      description: "Perfect for small projects and testing",
      features: [
        "Up to 5 database migrations",
        "Basic schema analysis",
        "Community support",
        "Standard security",
      ],
      popular: false,
    },
    {
      name: "Professional",
      price: "$49",
      period: "/month",
      description: "Ideal for growing teams and businesses",
      features: [
        "Unlimited migrations",
        "Advanced analytics",
        "Priority support",
        "Enhanced security",
        "Custom integrations",
      ],
      popular: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "For large organizations with complex needs",
      features: [
        "Everything in Professional",
        "Dedicated support",
        "Custom SLAs",
        "On-premise deployment",
        "Advanced compliance",
      ],
      popular: false,
    },
  ];

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4 sm:space-y-6">
        <div className="inline-block p-3 sm:p-4 bg-purple-600 rounded-lg">
          <Zap className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white">
          DataFlow
        </h1>
        <p className="text-lg sm:text-xl text-gray-500 dark:text-gray-400">
          Migration Studio
        </p>
        <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto px-4">
          Migrate your data between different database systems with intelligent
          schema analysis and smart recommendations.
        </p>
        <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-3 pt-4">
          <Link
            to="/analyze"
            className="inline-flex items-center justify-center px-4 sm:px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-all duration-200 transform hover:scale-105 text-sm sm:text-base"
          >
            <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
            Analyze Database
          </Link>
          <Link
            to="/migrate"
            className="inline-flex items-center justify-center px-4 sm:px-6 py-3 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200 font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-200 transform hover:scale-105 text-sm sm:text-base border border-gray-300 dark:border-gray-500 shadow-sm"
          >
            <ArrowRightLeft className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-gray-900 dark:text-gray-200" />
            Start Migration
          </Link>
        </div>
      </div>

      {/* Supported Databases */}
      <div className="pt-4 pb-6 sm:pb-8">
        <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 dark:text-white mb-6 sm:mb-8 text-center">
          Supported Databases
        </h2>
        <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4 lg:space-x-8">
          {/* Source DB */}
          <span
            className={`px-4 sm:px-6 py-3 rounded-full text-base sm:text-lg font-bold bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border-2 border-blue-200 dark:border-blue-700 shadow-sm`}
          >
            MySQL
          </span>

          {/* Arrows and Target DBs */}
          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 lg:space-x-8">
            <div className="flex flex-row sm:flex-col space-x-4 sm:space-x-0 sm:space-y-4 lg:space-y-8">
              <ArrowRight className="h-8 w-8 sm:h-10 sm:w-10 text-gray-500 dark:text-gray-400 transform rotate-90 sm:rotate-0" />
              <ArrowRight className="h-8 w-8 sm:h-10 sm:w-10 text-gray-500 dark:text-gray-400 transform rotate-90 sm:rotate-0" />
            </div>
            <div className="flex flex-col space-y-4 lg:space-y-8">
              <span
                className={`px-4 sm:px-6 py-3 rounded-full text-base sm:text-lg font-bold bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-center border-2 border-green-200 dark:border-green-700 shadow-sm`}
              >
                PostgreSQL
              </span>
              <span
                className={`px-4 sm:px-6 py-3 rounded-full text-base sm:text-lg font-bold bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 text-center border-2 border-purple-200 dark:border-purple-700 shadow-sm`}
              >
                MongoDB
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <div
              key={feature.title}
              className="bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-6 hover:shadow-md transition-all duration-200 transform hover:scale-105 text-center group"
            >
              <div
                className={`inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-lg ${feature.bgColor} mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-200`}
              >
                <Icon className={`h-5 w-5 sm:h-6 sm:w-6 ${feature.color}`} />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                {feature.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Security Features */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 text-center">
          Enterprise-Grade Security
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
          {securityFeatures.map((feature) => {
            const Icon = feature.icon;
            return (
              <div key={feature.title} className="text-center space-y-3">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                  <Icon className="h-6 w-6 text-primary-600" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed max-w-xs mx-auto">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Testimonials */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 text-center">
          What Our Customers Say
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.name}
              className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 space-y-4"
            >
              <div className="flex items-center space-x-2">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 text-yellow-400 fill-current"
                  />
                ))}
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                "{testimonial.content}"
              </p>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center text-white font-semibold">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 text-center">
          Simple, Transparent Pricing
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pricingTiers.map((tier) => (
            <div
              key={tier.name}
              className={`relative rounded-lg p-6 border-2 transition-all duration-200 hover:scale-105 flex flex-col ${
                tier.popular
                  ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20"
                  : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700"
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}
              <div className="text-center space-y-4 flex-1 flex flex-col">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {tier.name}
                </h3>
                <div className="space-y-1">
                  <div className="text-3xl font-bold text-gray-900 dark:text-white">
                    {tier.price}
                    {tier.period && (
                      <span className="text-lg text-gray-600 dark:text-gray-400">
                        {tier.period}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {tier.description}
                  </p>
                </div>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300 flex-1">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  to="/analyze"
                  className={`w-full py-2 px-4 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 mt-auto ${
                    tier.popular
                      ? "bg-primary-600 text-white hover:bg-primary-700"
                      : "bg-gray-100 dark:bg-gray-600 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-500"
                  }`}
                >
                  Get Started
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
