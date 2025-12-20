'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface BookingFormProps {
  offerteData?: {
    eventType?: string;
    eventDate?: string;
    guestCount?: number;
    totalPrice?: number;
  };
}

export default function BookingForm({ offerteData }: BookingFormProps = {}) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('phone', formData.phone);
      formDataToSend.append('message', formData.message);
      
      if (pdfFile) {
        formDataToSend.append('offerte', pdfFile);
      }

      if (offerteData) {
        formDataToSend.append('offerteData', JSON.stringify(offerteData));
      }

      const response = await fetch('/api/book-call', {
        method: 'POST',
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error('Failed to submit booking request');
      }

      setSubmitted(true);
      setFormData({ name: '', email: '', phone: '', message: '' });
      setPdfFile(null);
      
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err) {
      setError('Failed to submit. Please try again or contact us directly.');
      console.error('Booking submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setPdfFile(file);
    } else if (file) {
      setError('Please upload a PDF file');
    }
  };

  return (
    <section id="booking" className="py-24 bg-[#f7f3ec] text-[#1f1f1f]">
      <div className="max-w-4xl mx-auto px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="text-xs uppercase tracking-[0.35em] text-[#6c655b]">Get In Touch</p>
          <h2 className="text-3xl md:text-4xl font-serif font-light uppercase tracking-[0.08em] mb-3">
            Book a Call
          </h2>
          <p className="text-[#4a4742] text-base max-w-xl mx-auto">
            Schedule a consultation to discuss your event details and finalize your catering experience.
          </p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          onSubmit={handleSubmit}
          className="bg-white border border-[#dcd3c5] rounded-none p-8 md:p-10 space-y-6"
        >
          {/* Summary if offerteData is provided */}
          {offerteData && (
            <div className="bg-[#f7f3ec] border border-[#e6ddd0] p-6 mb-6">
              <h3 className="text-sm uppercase tracking-[0.25em] text-[#6c655b] mb-3">Your Selection Summary</h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                {offerteData.eventType && (
                  <>
                    <span className="text-[#8a8275]">Event Type:</span>
                    <span className="text-[#1f1f1f] capitalize">{offerteData.eventType}</span>
                  </>
                )}
                {offerteData.eventDate && (
                  <>
                    <span className="text-[#8a8275]">Event Date:</span>
                    <span className="text-[#1f1f1f]">{new Date(offerteData.eventDate + 'T00:00:00').toLocaleDateString()}</span>
                  </>
                )}
                {offerteData.guestCount && (
                  <>
                    <span className="text-[#8a8275]">Guests:</span>
                    <span className="text-[#1f1f1f]">{offerteData.guestCount}</span>
                  </>
                )}
                {offerteData.totalPrice && (
                  <>
                    <span className="text-[#8a8275]">Total:</span>
                    <span className="text-[#1f1f1f] font-serif">€{offerteData.totalPrice.toFixed(2)}</span>
                  </>
                )}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-xs uppercase tracking-[0.25em] text-[#6c655b] mb-2 font-light">
                Full Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white border border-[#dcd3c5] text-[#1f1f1f] focus:outline-none focus:border-[#1f1f1f] transition-colors"
                placeholder="John Doe"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-xs uppercase tracking-[0.25em] text-[#6c655b] mb-2 font-light">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white border border-[#dcd3c5] text-[#1f1f1f] focus:outline-none focus:border-[#1f1f1f] transition-colors"
                placeholder="john@example.com"
              />
            </div>

            {/* Phone */}
            <div className="md:col-span-2">
              <label htmlFor="phone" className="block text-xs uppercase tracking-[0.25em] text-[#6c655b] mb-2 font-light">
                Phone Number *
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white border border-[#dcd3c5] text-[#1f1f1f] focus:outline-none focus:border-[#1f1f1f] transition-colors"
                placeholder="+31 (0)6 1234 5678"
              />
            </div>
          </div>

          {/* Upload Offerte PDF */}
          <div className="mb-6">
            <label htmlFor="pdfUpload" className="block text-xs uppercase tracking-[0.25em] text-[#6c655b] mb-2 font-light">
              Upload Your Offerte (Optional)
            </label>
            <div className="relative">
              <input
                type="file"
                id="pdfUpload"
                accept=".pdf"
                onChange={handleFileChange}
                className="w-full px-4 py-3 bg-white border border-[#dcd3c5] text-[#1f1f1f] focus:outline-none focus:border-[#1f1f1f] transition-colors file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:bg-[#f7f3ec] file:text-[#1f1f1f] hover:file:bg-[#e6ddd0]"
              />
            </div>
            {pdfFile && (
              <p className="text-xs text-[#6c655b] mt-2">
                Selected: {pdfFile.name}
              </p>
            )}
          </div>

          {/* Message */}
          <div className="mb-6">
            <label htmlFor="message" className="block text-xs uppercase tracking-[0.25em] text-[#6c655b] mb-2 font-light">
              Additional Details
            </label>
            <textarea
              id="message"
              name="message"
              rows={4}
              value={formData.message}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white border border-[#dcd3c5] text-[#1f1f1f] focus:outline-none focus:border-[#1f1f1f] transition-colors resize-none"
              placeholder="Tell us about your preferred times for a call, specific requirements, or any questions..."
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={submitted || isSubmitting}
            className="w-full py-4 bg-[#1f1f1f] text-white font-light text-lg rounded-none hover:bg-[#2b2b2b] transition-all duration-200 disabled:opacity-60"
          >
            {isSubmitting ? 'Sending...' : submitted ? '✓ Request Sent!' : 'Book a Call'}
          </motion.button>

          <p className="text-[#6c655b] text-sm text-center mt-2">
            {submitted 
              ? 'Thank you! We will contact you within 24 hours to schedule your call.' 
              : 'We will reach out within 24 hours to schedule a consultation call.'}
          </p>
        </motion.form>
      </div>
    </section>
  );
}

