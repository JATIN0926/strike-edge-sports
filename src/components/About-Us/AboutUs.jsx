"use client";

import { motion } from "framer-motion";
import { Award, Leaf, Users, Target, Heart } from "lucide-react";

export default function AboutPage() {
  const sections = [
    {
      icon: Users,
      title: "Who We Are",
      description:
        "Strikedge Sports is a cricket-focused brand dedicated to crafting high-quality cricket bats and equipment for players who value performance and reliability.",
    },
    {
      icon: Leaf,
      title: "Quality Materials",
      description:
        "At Strikedge Sports, we use carefully selected English and Kashmir willow (more into English willow) to ensure superior balance, strong grains, and long-lasting durability.",
    },
    {
      icon: Award,
      title: "Expert Craftsmanship",
      description:
        "Every bat from Strikedge Sports is shaped and finished by skilled craftsmen, blending traditional bat-making techniques with modern quality standards.",
    },
    {
      icon: Target,
      title: "Built for Players",
      description:
        "We design our products keeping players in mind — offering the right weight, pickup, and power to enhance on-field performance.",
    },
    {
      icon: Heart,
      title: "Our Commitment",
      description:
        "Strikedge Sports stands for trust, transparency, and honest pricing, aiming to build long-term relationships with cricketers across all levels.",
    },
  ];

  return (
    <div className="mt-16 bg-gradient-to-b from-white via-slate-50/30 to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-black/5">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 via-white to-green-50/30" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-block mb-6"
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-200/50 text-emerald-700 text-sm font-semibold">
                <Award className="w-4 h-4" />
                About Us
              </span>
            </motion.div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-black mb-6 leading-tight">
              Welcome to{" "}
              <span className="bg-gradient-to-r from-emerald-600 to-green-500 bg-clip-text text-transparent">
                Strikedge Sports
              </span>
            </h1>

            <p className="text-base sm:text-lg lg:text-xl text-black/70 leading-relaxed max-w-3xl mx-auto">
              Crafting excellence in cricket equipment, one bat at a time. We're passionate about delivering quality gear that empowers players to perform at their best.
            </p>
          </motion.div>
        </div>

        {/* Decorative bottom wave */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-200 to-transparent" />
      </section>

      {/* Content Sections */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {sections.map((section, index) => {
            const Icon = section.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative"
              >
                <div className="relative h-full p-6 sm:p-8 rounded-2xl bg-white border border-black/5 hover:border-emerald-200/50 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/5">
                  {/* Icon */}
                  <div className="flex items-start gap-4 sm:gap-5 mb-4">
                    <div className="flex-shrink-0 p-3 sm:p-3.5 rounded-xl bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-100/50 group-hover:scale-110 transition-transform duration-300">
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600" strokeWidth={2} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg sm:text-xl font-bold text-black mb-3 group-hover:text-emerald-600 transition-colors">
                        {section.title}
                      </h3>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm sm:text-base text-black/70 leading-relaxed pl-0 sm:pl-[68px]">
                    {section.description}
                  </p>

                  {/* Hover effect gradient */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-500/0 to-green-500/0 group-hover:from-emerald-500/5 group-hover:to-green-500/5 transition-all duration-500 pointer-events-none" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Bottom CTA Section */}
      <section className="border-t border-black/5 bg-gradient-to-b from-white to-slate-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-black mb-4 sm:mb-6">
              Ready to Elevate Your Game?
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-black/70 mb-8">
              Explore our premium collection of cricket equipment designed for champions.
            </p>
            
            <motion.a
              href="/products"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 text-white text-sm sm:text-base font-semibold shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/35 transition-all duration-300"
            >
              Shop Now
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </motion.a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}