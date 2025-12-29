"use client";

import { motion } from "framer-motion";
import {
  Truck,
  RefreshCw,
  Headphones,
  XCircle,
  Clock,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";

export default function PoliciesPage() {
  const policies = [
    {
      icon: Truck,
      title: "Shipping & Delivery Policy",
      color: "emerald",
      items: [
        { label: "Processing Time", value: "1–2 business days" },
        { label: "Delivery Time", value: "5–8 days PAN India" },
        {
          label: "Courier Partners",
          value: "DTDC, Delhivery (subject to change)",
        },
        {
          label: "Possible Delays",
          value: "Weather, strikes, or remote areas",
        },
        {
          label: "Compensation",
          value: "Company will compensate for major delays",
        },
      ],
    },
    {
      icon: RefreshCw,
      title: "Refund, Return & Replacement Policy",
      color: "blue",
      items: [
        { label: "Return Window", value: "3/5/7 days after delivery" },
        {
          label: "Return Conditions",
          value: "Unused, original packaging, manufacturing defect",
        },
        { label: "Refund Method", value: "Original payment method" },
        { label: "Refund Timeline", value: "7–10 working days" },
        {
          label: "Replacement",
          value: "Available if damaged or wrong item received",
        },
      ],
    },
    {
      icon: Headphones,
      title: "Customer Support Policy",
      color: "purple",
      items: [
        {
          label: "WhatsApp",
          value: "+91 8923765865",
          link: "https://wa.me/918923765865",
        },
        {
          label: "Email",
          value: "strikedge10@gmail.com",
          link: "mailto:strikedge10@gmail.com",
        },
        { label: "Working Hours", value: "9 AM to 6 PM (Monday to Saturday)" },
        { label: "Response Time", value: "Within 24–48 hours" },
      ],
    },
    {
      icon: XCircle,
      title: "Cancellation Policy",
      color: "red",
      items: [
        { label: "Cancellation Time", value: "Before dispatch only" },
        {
          label: "How to Cancel",
          value: "Through Website or WhatsApp or Email",
        },
        { label: "Refund Timeline", value: "24–48 hours after cancellation" },
      ],
    },
  ];

  const colorClasses = {
    emerald: {
      bg: "from-emerald-50 to-green-50",
      border: "border-emerald-100/50",
      icon: "text-emerald-600",
      hover: "group-hover:from-emerald-500/5 group-hover:to-green-500/5",
    },
    blue: {
      bg: "from-blue-50 to-cyan-50",
      border: "border-blue-100/50",
      icon: "text-blue-600",
      hover: "group-hover:from-blue-500/5 group-hover:to-cyan-500/5",
    },
    purple: {
      bg: "from-purple-50 to-pink-50",
      border: "border-purple-100/50",
      icon: "text-purple-600",
      hover: "group-hover:from-purple-500/5 group-hover:to-pink-500/5",
    },
    red: {
      bg: "from-red-50 to-orange-50",
      border: "border-red-100/50",
      icon: "text-red-600",
      hover: "group-hover:from-red-500/5 group-hover:to-orange-500/5",
    },
  };

  return (
    <div className=" mt-16 bg-linear-to-b from-white via-slate-50/30 to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-black/5">
        <div className="absolute inset-0 bg-linear-to-br from-emerald-50/50 via-white to-blue-50/30" />

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
                <Clock className="w-4 h-4" />
                Our Policies
              </span>
            </motion.div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-black mb-6 leading-tight">
              Terms &{" "}
              <span className="bg-linear-to-r from-emerald-600 to-green-500 bg-clip-text text-transparent">
                Policies
              </span>
            </h1>

            <p className="text-base sm:text-lg lg:text-xl text-black/70 leading-relaxed max-w-3xl mx-auto">
              Your trust matters to us. Read our transparent policies to
              understand how we serve you better.
            </p>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-emerald-200 to-transparent" />
      </section>

      {/* Policies Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {policies.map((policy, index) => {
            const Icon = policy.icon;
            const colors = colorClasses[policy.color];

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative"
              >
                <div className="relative h-full p-6 sm:p-8 rounded-2xl bg-white border border-black/5 hover:border-black/10 transition-all duration-300 hover:shadow-xl hover:shadow-black/5">
                  {/* Header */}
                  <div className="flex items-start gap-4 mb-6">
                    <div
                      className={`shrink-0 p-3 sm:p-3.5 rounded-xl bg-linear-to-br ${colors.bg} border ${colors.border} group-hover:scale-110 transition-transform duration-300`}
                    >
                      <Icon
                        className={`w-5 h-5 sm:w-6 sm:h-6 ${colors.icon}`}
                        strokeWidth={2}
                      />
                    </div>

                    <h2 className="flex-1 text-xl sm:text-2xl font-bold text-black leading-tight">
                      {policy.title}
                    </h2>
                  </div>

                  {/* Items */}
                  <div className="space-y-4">
                    {policy.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-3"
                      >
                        <div className="shrink-0 w-2 h-2 rounded-full bg-linear-to-r from-emerald-500 to-green-500 mt-1.5 sm:mt-2" />
                        <div className="flex-1 min-w-0">
                          <span className="text-sm sm:text-base font-semibold text-black/80">
                            {item.label}:
                          </span>{" "}
                          {item.link ? (
                            <a
                              href={item.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm sm:text-base text-emerald-600 hover:text-emerald-700 underline decoration-emerald-600/30 hover:decoration-emerald-600 transition-colors break-all"
                            >
                              {item.value}
                            </a>
                          ) : (
                            <span className="text-sm sm:text-base text-black/70">
                              {item.value}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Hover effect */}
                  <div
                    className={`absolute inset-0 rounded-2xl bg-linear-to-br ${colors.hover} transition-all duration-500 pointer-events-none`}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Contact CTA */}
      <section className="border-t border-black/5 bg-linear-to-b from-white to-slate-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-black mb-4 sm:mb-6">
              Still Have Questions?
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-black/70 mb-8">
              Our team is here to help. Reach out via WhatsApp or email for
              quick assistance.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.a
                href="https://wa.me/918923765865"
                target="_blank"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 rounded-xl bg-linear-to-r from-emerald-500 to-green-600 text-white text-sm sm:text-base font-semibold shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/35 transition-all duration-300"
              >
                <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
                WhatsApp Us
              </motion.a>

              <motion.a
                href="mailto:strikedge10@gmail.com"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 rounded-xl bg-white border-2 border-emerald-500 text-emerald-600 text-sm sm:text-base font-semibold hover:bg-emerald-50 transition-all duration-300"
              >
                <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
                Email Us
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
