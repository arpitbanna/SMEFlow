/* ===== IMPORTS ===== */
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useToast } from '../context/ToastContext';
import { postInquiry } from '../services/api';

/* ===== CONTACT PAGE COMPONENT ===== */
function Contact() {
    const { showToast } = useToast();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        company: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.name || !formData.email || !formData.message) {
            showToast('Please fill out all required fields.');
            return;
        }

        setIsSubmitting(true);
        try {
            await postInquiry(formData);
            showToast('Thank you! Your message has been sent successfully.');
            setFormData({ name: '', email: '', company: '', message: '' });
        } catch (error) {
            console.error("Failed to submit inquiry:", error);
            showToast('Failed to send message. Please try again later.');
        } finally {
            setIsSubmitting(false);
        }
    };

    /* ===== ANIMATION VARIANTS ===== */
    const fadeInOptions = {
        initial: { opacity: 0, y: 30 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: "-50px" },
        transition: { duration: 0.6, ease: "easeOut" }
    };

    const staggerContainer = {
        initial: { opacity: 0 },
        whileInView: { opacity: 1 },
        viewport: { once: true, margin: "-50px" },
        transition: { staggerChildren: 0.2 }
    };

    const staggerItem = {
        initial: { opacity: 0, y: 30 },
        whileInView: { opacity: 1, y: 0 },
        transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
    };

    /* ===== RENDER ===== */
    return (
        <>
            <motion.section className="section" {...fadeInOptions}>
                <h2>GET IN TOUCH</h2>
                <p>
                    Have questions about SMEFlow or want to discuss partnerships?
                    Send us a message and our team will respond within 24 hours.
                </p>

                <motion.div
                    className="contact-grid"
                    variants={staggerContainer}
                    initial="initial"
                    whileInView="whileInView"
                    viewport={{ once: true }}
                >
                    <motion.div className="box" variants={staggerItem}>
                        <h3>SEND A MESSAGE</h3>
                        <form onSubmit={handleSubmit}>
                            <input type="text" name="name" placeholder="Your Name" value={formData.name} onChange={handleChange} required />
                            <input type="email" name="email" placeholder="Your Email" value={formData.email} onChange={handleChange} required />
                            <input type="text" name="company" placeholder="Company Name" value={formData.company} onChange={handleChange} />
                            <textarea name="message" placeholder="Your Message" value={formData.message} onChange={handleChange} required></textarea>
                            <button type="submit" style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: '14px 45px',
                                background: 'linear-gradient(135deg, #C64734 0%, #A23626 100%)',
                                color: '#FFF',
                                fontWeight: '700',
                                border: 'none',
                                borderRadius: '50px',
                                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                                marginTop: '10px',
                                boxShadow: '0 8px 15px rgba(0, 0, 0, 0.2), 0 5px 0px #75251a',
                                transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                                position: 'relative',
                                top: '0',
                                opacity: isSubmitting ? 0.7 : 1
                            }}
                                disabled={isSubmitting}
                                onMouseOver={(e) => {
                                    if(isSubmitting) return;
                                    e.currentTarget.style.transform = 'translateY(-4px)';
                                    e.currentTarget.style.boxShadow = '0 12px 20px rgba(0, 0, 0, 0.3), 0 7px 0px #75251a';
                                }}
                                onMouseOut={(e) => {
                                    if(isSubmitting) return;
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 8px 15px rgba(0, 0, 0, 0.2), 0 5px 0px #75251a';
                                }}
                                onMouseDown={(e) => {
                                    if(isSubmitting) return;
                                    e.currentTarget.style.transform = 'translateY(2px)';
                                    e.currentTarget.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.2), 0 2px 0px #75251a';
                                }}
                            >
                                {isSubmitting ? 'SENDING...' : 'SEND MESSAGE'}
                                {!isSubmitting && <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginLeft: '8px' }}>
                                    <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>}
                            </button>
                        </form>
                    </motion.div>

                    <motion.div className="box" variants={staggerItem}>
                        <h3>CONTACT INFORMATION</h3>
                        <div className="info-item">Email: hello@smeflow.ai</div>
                        <div className="info-item">Support: support@smeflow.ai</div>
                        <div className="info-item">Office: Global Remote Team</div>
                        <div className="info-item">Response Time: Within 24 hours</div>
                    </motion.div>
                </motion.div>
            </motion.section>
        </>
    );
}

export default Contact;
