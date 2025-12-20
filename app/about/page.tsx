'use client';

import { motion } from 'framer-motion';

export default function About() {
  return (
    <main className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="relative h-[60vh] bg-gradient-to-br from-primary-charcoal to-primary-black flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 moroccan-pattern opacity-20" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center px-4"
        >
          <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6">
            <span className="text-accent-gold">Our Story</span>
          </h1>
          <p className="text-xl text-secondary-text max-w-2xl mx-auto">
            A passion for authentic Moroccan cuisine and hospitality
          </p>
        </motion.div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-primary-black">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl font-serif font-bold mb-6">
                <span className="text-accent-gold">Traditional Recipes,</span>
                <br />
                <span className="text-primary-white">Modern Excellence</span>
              </h2>
              <div className="space-y-4 text-secondary-text leading-relaxed">
                <p>
                  Lila Catering was born from a deep love for Moroccan culinary traditions
                  and a desire to share the rich flavors of our heritage with the world.
                  Our journey began in the bustling souks and family kitchens of Marrakech,
                  where recipes have been passed down through generations.
                </p>
                <p>
                  Every dish we prepare is a celebration of Morocco's diverse culinary
                  landscape—from the aromatic tagines of the Atlas Mountains to the
                  delicate pastries of Fez. We use only the finest ingredients, sourced
                  both locally and from Morocco, ensuring authenticity in every bite.
                </p>
                <p>
                  Our team of experienced chefs brings decades of expertise, combining
                  time-honored cooking techniques with contemporary presentation to create
                  an unforgettable dining experience for your special occasions.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative h-96 rounded-2xl overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-accent-gold to-primary-charcoal" />
              <div className="absolute inset-0 moroccan-pattern opacity-30" />
              <div className="absolute inset-0 flex items-center justify-center text-8xl">
                🍲
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gradient-to-b from-black to-primary-dark-red/10 moroccan-pattern">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4">
              <span className="text-accent-gold">Our Values</span>
            </h2>
            <p className="text-secondary-text text-lg max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Authenticity',
                icon: '🌟',
                description:
                  'We stay true to traditional Moroccan recipes while adapting to modern tastes and dietary needs.',
              },
              {
                title: 'Quality',
                icon: '✨',
                description:
                  'Only the finest ingredients make it to our kitchen. We never compromise on quality.',
              },
              {
                title: 'Hospitality',
                icon: '🤝',
                description:
                  'Moroccan hospitality is legendary. We treat every event as if hosting in our own home.',
              },
            ].map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="bg-gradient-to-br from-primary-charcoal/50 to-primary-black border border-accent-gold/20 rounded-xl p-8 text-center hover:border-accent-gold/50 transition-all duration-300"
              >
                <div className="text-6xl mb-4">{value.icon}</div>
                <h3 className="text-2xl font-serif font-bold text-accent-gold mb-4">
                  {value.title}
                </h3>
                <p className="text-secondary-text">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-primary-black">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4">
              <span className="text-accent-gold">Meet Our</span>
              <br />
              <span className="text-primary-white">Expert Team</span>
            </h2>
            <p className="text-secondary-text text-lg max-w-2xl mx-auto">
              Passionate professionals dedicated to culinary excellence
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Chef Fatima',
                role: 'Head Chef',
                bio: '25+ years of experience in traditional Moroccan cuisine',
              },
              {
                name: 'Chef Youssef',
                role: 'Pastry Chef',
                bio: 'Master of Moroccan desserts and pastries',
              },
              {
                name: 'Amina',
                role: 'Event Coordinator',
                bio: 'Ensuring every event runs flawlessly',
              },
            ].map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="text-center"
              >
                <div className="w-48 h-48 mx-auto mb-6 rounded-full bg-gradient-to-br from-accent-gold to-primary-charcoal flex items-center justify-center text-6xl">
                  👨‍🍳
                </div>
                <h3 className="text-2xl font-serif font-bold text-accent-gold mb-2">
                  {member.name}
                </h3>
                <p className="text-primary-white font-medium mb-3">{member.role}</p>
                <p className="text-secondary-text">{member.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-b from-black to-primary-dark-red/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">
              <span className="text-accent-gold">Ready to Experience</span>
              <br />
              <span className="text-primary-white">Authentic Morocco?</span>
            </h2>
            <p className="text-secondary-text text-lg mb-8">
              Let us cater your next event with unforgettable Moroccan cuisine
            </p>
            <motion.a
              href="/#menu-builder"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block px-8 py-4 bg-accent-gold text-primary-black font-semibold rounded-full text-lg hover:shadow-lg hover:shadow-accent-gold/30 transition-all duration-300"
            >
              Start Building Your Menu
            </motion.a>
          </motion.div>
        </div>
      </section>
    </main>
  );
}

