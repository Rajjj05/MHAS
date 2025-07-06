import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Brain,
  Heart,
  MessageCircle,
  Sparkles,
  Shield,
  ArrowRight,
  Users,
  Clock,
  CheckCircle,
} from "lucide-react";

const Home = () => {
  const features = [
    {
      icon: Brain,
      title: "Mental Health Support",
      description:
        "Compassionate AI conversations for mental health concerns, coping strategies, and emotional support.",
      color: "from-blue-400 to-blue-600",
      link: "/mental-health",
    },
    {
      icon: Heart,
      title: "Spiritual Guidance",
      description:
        "Explore spiritual questions, find inner peace, and discover meaning through thoughtful dialogue.",
      color: "from-indigo-400 to-indigo-600",
      link: "/spiritual",
    },
    {
      icon: MessageCircle,
      title: "24/7 Availability",
      description:
        "Always available when you need someone to talk to, providing consistent support and understanding.",
      color: "from-purple-400 to-purple-600",
      link: "/about",
    },
  ];

  const benefits = [
    {
      icon: Shield,
      title: "Private & Secure",
      description: "Your conversations are confidential and secure",
    },
    {
      icon: Users,
      title: "Accessible to All",
      description: "No barriers to accessing mental health support",
    },
    {
      icon: Clock,
      title: "Always Available",
      description: "Support whenever you need it, day or night",
    },
    {
      icon: CheckCircle,
      title: "Evidence-Based",
      description: "Grounded in established wellness principles",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="relative z-10 container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-5xl mx-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-6"
            >
              <span className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-700 font-medium text-sm border border-blue-200">
                <Sparkles className="w-4 h-4 mr-2" />
                AI-Powered Mental Wellness Support
              </span>
            </motion.div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold text-gray-900 mb-6 leading-tight animate-float">
              Your Journey to{" "}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Mental Wellness
              </span>
              <br />
              Starts Here
            </h1>

            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Find support, guidance, and peace through compassionate AI
              conversations. Whether you're seeking mental health support or
              spiritual guidance, we're here to listen.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link
                to="/mental-health"
                className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center justify-center group"
              >
                <Brain className="w-5 h-5 mr-2 group-hover:animate-pulse" />
                Mental Health Chat
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/spiritual"
                className="border-2 border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center justify-center group"
              >
                <Heart className="w-5 h-5 mr-2" />
                Spiritual Guidance
              </Link>
            </div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="flex flex-wrap justify-center items-center gap-8 text-sm text-gray-500"
            >
              <div className="flex items-center">
                <Shield className="w-4 h-4 mr-2 text-blue-500" />
                Private & Secure
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-2 text-blue-500" />
                24/7 Available
              </div>
              <div className="flex items-center">
                <Heart className="w-4 h-4 mr-2 text-blue-500" />
                Compassionate AI
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-gray-900 mb-6">
              How We Can Support You
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our AI companions are designed to provide compassionate support
              for your mental health and spiritual wellness journey, available
              whenever you need someone to talk to.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 text-center group hover:shadow-xl transition-all duration-300"
              >
                <div
                  className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-heading font-semibold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  {feature.description}
                </p>
                <Link
                  to={feature.link}
                  className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium group-hover:underline"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Benefits Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-md border border-gray-200 p-6 text-center hover:shadow-lg transition-all duration-300"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="font-heading font-semibold text-gray-900 mb-2">
                  {benefit.title}
                </h4>
                <p className="text-sm text-gray-600">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-gray-900 mb-6">
              Simple Steps to Get Support
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Getting started is easy. Choose your path and begin your
              conversation with our AI companion.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Choose Your Path",
                description:
                  "Select mental health support or spiritual guidance based on your needs.",
                icon: Brain,
              },
              {
                step: "02",
                title: "Start Talking",
                description:
                  "Begin your conversation with our compassionate AI companion.",
                icon: MessageCircle,
              },
              {
                step: "03",
                title: "Find Support",
                description:
                  "Receive understanding, guidance, and coping strategies tailored to you.",
                icon: Heart,
              },
            ].map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="relative"
              >
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 text-center hover:shadow-xl transition-all duration-300">
                  <div className="relative mb-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl flex items-center justify-center mx-auto">
                      <step.icon className="w-10 h-10 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">
                        {step.step}
                      </span>
                    </div>
                  </div>
                  <h3 className="text-xl font-heading font-semibold text-gray-900 mb-4">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Connection Line */}
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-blue-300 to-indigo-300 transform -translate-y-1/2"></div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-gray-900 to-blue-900 text-white relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold mb-6">
              Ready to Begin Your Journey?
            </h2>
            <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
              Take the first step towards better mental health and spiritual
              wellness. Our AI companions are here to listen, support, and guide
              you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/mental-health"
                className="bg-white text-gray-900 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-all duration-300 flex items-center justify-center group"
              >
                <Brain className="w-5 h-5 mr-2 group-hover:animate-pulse" />
                Start Mental Health Chat
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/spiritual"
                className="border-2 border-white/30 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/10 transition-all duration-300 flex items-center justify-center"
              >
                <Heart className="w-5 h-5 mr-2" />
                Spiritual Guidance
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
