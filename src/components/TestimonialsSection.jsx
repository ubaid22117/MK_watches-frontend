import { motion } from 'framer-motion';

const testimonials = [
  {
    name: 'Ahmed Raza',
    city: 'Karachi',
    text: 'Purchased a watch from MK — the quality is exceptional. Comparable to Rolex at a reasonable price. Highly recommend!',
    rating: 5,
    initials: 'AR',
  },
  {
    name: 'Fatima Khan',
    city: 'Lahore',
    text: 'Fast delivery and luxury packaging. The watch is absolutely stunning. Gifted it to my husband — he loves it!',
    rating: 5,
    initials: 'FK',
  },
  {
    name: 'Usman Ali',
    city: 'Islamabad',
    text: 'Ordering via WhatsApp was incredibly easy. The team is very helpful and the watch quality is amazing.',
    rating: 5,
    initials: 'UA',
  },
];

const TestimonialsSection = () => {
  return (
    <section className="testimonials-section">
      <div className="container">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}>
          <p className="section-label">✦ Customer Reviews ✦</p>
          <h2 className="section-title">
            What Our <span className="gold-text">Customers</span> Say
          </h2>
          <div className="gold-divider" />
        </motion.div>

        <div className="testimonials-grid">
          {testimonials.map((t, i) => (
            <motion.div key={i} className="testimonial-card glass-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}>
              <div className="testimonial-stars">{'★'.repeat(t.rating)}</div>
              <p className="testimonial-text">"{t.text}"</p>
              <div className="testimonial-author">
                <div className="author-avatar">{t.initials}</div>
                <div>
                  <p className="author-name">{t.name}</p>
                  <p className="author-city">{t.city}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;