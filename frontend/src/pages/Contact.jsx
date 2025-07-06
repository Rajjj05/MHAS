import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  Clock,
  Send,
  MessageCircle,
  CheckCircle,
  ExternalLink,
  AlertTriangle,
  Heart,
} from "lucide-react";
import { useForm } from "react-hook-form";

const Contact = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = (data) => {
    console.log("Contact form submitted:", data);
    setIsSubmitted(true);
    reset();

    // Reset the success message after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
    }, 3000);
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email Support",
      details: "support@mentalwellness.ai",
      description: "General inquiries and support",
      responseTime: "Response within 24 hours",
    },
    {
      icon: Clock,
      title: "Response Time",
      details: "24-48 hours",
      description: "Typical response time for inquiries",
      responseTime: "Monday - Friday, 9 AM - 5 PM EST",
    },
  ];

  const emergencyResources = [
    {
      name: "National Suicide Prevention Lifeline",
      number: "988",
      description: "24/7 crisis support",
      type: "crisis",
    },
    {
      name: "Crisis Text Line",
      number: "Text HOME to 741741",
      description: "Text-based crisis support",
      type: "crisis",
    },
    {
      name: "SAMHSA National Helpline",
      number: "1-800-662-4357",
      description: "Mental health and substance abuse",
      type: "support",
    },
    {
      name: "National Alliance on Mental Illness",
      number: "1-800-950-6264",
      description: "Mental health information and support",
      type: "support",
    },
  ];

  const professionalResources = [
    {
      name: "Psychology Today",
      url: "https://www.psychologytoday.com",
      description: "Find therapists and mental health professionals",
    },
    {
      name: "BetterHelp",
      url: "https://www.betterhelp.com",
      description: "Online therapy and counseling services",
    },
    {
      name: "NAMI",
      url: "https://www.nami.org",
      description: "Mental health advocacy and support",
    },
    {
      name: "Mental Health America",
      url: "https://www.mhanational.org",
      description: "Mental health resources and screening tools",
    },
  ];

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-br from-tranquil-50 to-tranquil-50">
      {/* Header */}
      <section className="section-padding">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-mindful-900 mb-6">
              Contact & Support
            </h1>
            <p className="text-lg md:text-xl text-mindful-600 leading-relaxed">
              We're here to help with any questions about our service. For
              immediate mental health support, please use the emergency
              resources listed below.
            </p>
          </motion.div>

          {/* Emergency Alert */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card p-6 mb-12 bg-red-50 border-l-4 border-red-400"
          >
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-6 h-6 text-red-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold text-red-800 mb-2">
                  Mental Health Emergency?
                </h3>
                <p className="text-red-700 mb-4">
                  If you're experiencing a mental health crisis or having
                  thoughts of self-harm, please reach out for immediate help
                  using the emergency resources below.
                </p>
                <div className="flex flex-wrap gap-4">
                  <a
                    href="tel:988"
                    className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Call 988
                  </a>
                  <a
                    href="sms:741741?body=HOME"
                    className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Text 741741
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
            >
              <div className="card p-8">
                <h2 className="text-2xl font-heading font-bold text-mindful-900 mb-6">
                  Send Us a Message
                </h2>

                {isSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-8"
                  >
                    <div className="w-16 h-16 bg-tranquil-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-8 h-8 text-tranquil-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-mindful-900 mb-2">
                      Message Sent!
                    </h3>
                    <p className="text-mindful-600">
                      Thank you for reaching out. We'll get back to you within
                      24-48 hours.
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-mindful-700 mb-2">
                          First Name *
                        </label>
                        <input
                          {...register("firstName", {
                            required: "First name is required",
                          })}
                          type="text"
                          className="w-full px-4 py-3 border border-warm-300 rounded-lg focus:ring-2 focus:ring-tranquil-500 focus:border-transparent"
                          placeholder="Enter your first name"
                        />
                        {errors.firstName && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.firstName.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-mindful-700 mb-2">
                          Last Name *
                        </label>
                        <input
                          {...register("lastName", {
                            required: "Last name is required",
                          })}
                          type="text"
                          className="w-full px-4 py-3 border border-warm-300 rounded-lg focus:ring-2 focus:ring-tranquil-500 focus:border-transparent"
                          placeholder="Enter your last name"
                        />
                        {errors.lastName && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.lastName.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-mindful-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        {...register("email", {
                          required: "Email is required",
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: "Invalid email address",
                          },
                        })}
                        type="email"
                        className="w-full px-4 py-3 border border-warm-300 rounded-lg focus:ring-2 focus:ring-tranquil-500 focus:border-transparent"
                        placeholder="Enter your email"
                      />
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.email.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-mindful-700 mb-2">
                        Subject *
                      </label>
                      <select
                        {...register("subject", {
                          required: "Subject is required",
                        })}
                        className="w-full px-4 py-3 border border-warm-300 rounded-lg focus:ring-2 focus:ring-tranquil-500 focus:border-transparent"
                      >
                        <option value="">Select a subject</option>
                        <option value="general">General Inquiry</option>
                        <option value="technical">Technical Support</option>
                        <option value="feedback">Feedback</option>
                        <option value="partnership">Partnership</option>
                        <option value="other">Other</option>
                      </select>
                      {errors.subject && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.subject.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-mindful-700 mb-2">
                        Message *
                      </label>
                      <textarea
                        {...register("message", {
                          required: "Message is required",
                        })}
                        rows={5}
                        className="w-full px-4 py-3 border border-warm-300 rounded-lg focus:ring-2 focus:ring-tranquil-500 focus:border-transparent"
                        placeholder="Tell us how we can help you..."
                      />
                      {errors.message && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.message.message}
                        </p>
                      )}
                    </div>

                    <button
                      type="submit"
                      className="btn-primary w-full flex items-center justify-center space-x-2"
                    >
                      <Send className="w-5 h-5" />
                      <span>Send Message</span>
                    </button>
                  </form>
                )}
              </div>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="space-y-8"
            >
              {/* Contact Details */}
              <div className="card p-8">
                <h3 className="text-xl font-heading font-semibold text-mindful-900 mb-6">
                  Get in Touch
                </h3>
                <div className="space-y-6">
                  {contactInfo.map((info, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-tranquil-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <info.icon className="w-6 h-6 text-tranquil-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-mindful-900 mb-1">
                          {info.title}
                        </h4>
                        <p className="text-mindful-700 font-medium mb-1">
                          {info.details}
                        </p>
                        <p className="text-sm text-mindful-600 mb-1">
                          {info.description}
                        </p>
                        <p className="text-xs text-mindful-500">
                          {info.responseTime}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Response Expectations */}
              <div className="card p-6 bg-tranquil-50 border-l-4 border-tranquil-400">
                <h4 className="font-semibold text-mindful-900 mb-2">
                  Response Time Expectations
                </h4>
                <ul className="text-sm text-mindful-700 space-y-1">
                  <li>• General inquiries: 24-48 hours</li>
                  <li>• Technical support: 1-2 business days</li>
                  <li>• Partnership requests: 3-5 business days</li>
                  <li>• Emergency situations: Use crisis resources below</li>
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Emergency Resources */}
      <section className="section-padding bg-gradient-to-br from-tranquil-50 to-tranquil-50">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-mindful-900 mb-4">
              Emergency Mental Health Resources
            </h2>
            <p className="text-lg text-mindful-600 max-w-2xl mx-auto">
              If you're in crisis or need immediate support, these resources are
              available 24/7.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {emergencyResources.map((resource, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`card p-6 ${
                  resource.type === "crisis"
                    ? "border-l-4 border-red-400 bg-red-50"
                    : "border-l-4 border-tranquil-400 bg-tranquil-50"
                }`}
              >
                <div className="flex items-start space-x-4">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      resource.type === "crisis"
                        ? "bg-red-100"
                        : "bg-tranquil-100"
                    }`}
                  >
                    <Phone
                      className={`w-6 h-6 ${
                        resource.type === "crisis"
                          ? "text-red-600"
                          : "text-tranquil-600"
                      }`}
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-mindful-900 mb-1">
                      {resource.name}
                    </h3>
                    <p className="text-lg font-medium text-mindful-800 mb-1">
                      {resource.number}
                    </p>
                    <p className="text-sm text-mindful-600">
                      {resource.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Professional Resources */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-mindful-900 mb-4">
              Professional Mental Health Resources
            </h2>
            <p className="text-lg text-mindful-600 max-w-2xl mx-auto">
              Find professional therapists, counselors, and mental health
              services in your area.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {professionalResources.map((resource, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card p-6 text-center group hover:shadow-warm"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-tranquil-400 to-tranquil-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-mindful-900 mb-2">
                  {resource.name}
                </h3>
                <p className="text-sm text-mindful-600 mb-4">
                  {resource.description}
                </p>
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-tranquil-600 hover:text-tranquil-700 font-medium group-hover:underline"
                >
                  <span>Visit Website</span>
                  <ExternalLink className="w-4 h-4 ml-1" />
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
