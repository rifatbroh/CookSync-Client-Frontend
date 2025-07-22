import React from 'react';
import { motion } from 'framer-motion';
import { Users, Heart, Star } from 'lucide-react';

const features = [
  {
    icon: <Users className="text-[#9ae600] w-7 h-7" />,
    title: "Our Community",
    description: "Thousands of users sharing and discovering new recipes every day.",
  },
  {
    icon: <Heart className="text-[#9ae600] w-7 h-7" />,
    title: "Our Passion",
    description: "Cooking with love, building a platform that inspires culinary creativity.",
  },
  {
    icon: <Star className="text-[#9ae600] w-7 h-7" />,
    title: "Our Vision",
    description: "Becoming the #1 destination for food lovers around the globe.",
  },
];

const AboutUs = () => {
  return (
    <section className="relative py-20 px-6 md:px-20 rounded-3xl overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2 className="text-5xl font-extrabold text-gray-800 mb-4 tracking-tight drop-shadow-md">
          About Us
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto text-lg md:text-xl">
          At <span className="text-[#9ae600] font-semibold">CookSync</span>, we believe food connects people. Whether you're a home cook or a pro chef,
          our platform helps you discover, share, and enjoy amazing recipes.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {features.map((item, index) => (
          <motion.div
            key={index}
            className="group bg-white border border-[#d6fbb4] hover:border-[#9ae600] p-8 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
            whileHover={{ scale: 1.04 }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center justify-center mb-6">
              <div className="bg-[#ebffd4] group-hover:bg-[#d5ff9f] transition p-4 rounded-full shadow-inner">
                {item.icon}
              </div>
            </div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-2 group-hover:text-[#9ae600] transition">
              {item.title}
            </h3>
            <p className="text-gray-600 text-base leading-relaxed">{item.description}</p>
          </motion.div>
        ))}
      </div>

      <motion.div
        className="absolute -top-16 -right-16 w-64 h-64 bg-[#9ae600] opacity-10 rounded-full blur-3xl"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-0 left-0 w-48 h-48 bg-[#9ae600] opacity-10 rounded-full blur-2xl"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 6, repeat: Infinity }}
      />
    </section>
  );
};

export default AboutUs;
