/* ===== IMPORTS ===== */
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useToast } from '../context/ToastContext';
import { fetchPricingPlans } from '../services/api';

/* ===== PRICING PAGE COMPONENT ===== */
function Pricing() {
    const { showToast } = useToast();
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);

    /* Load plans from Supabase */
    useEffect(() => {
        const loadPlans = async () => {
            try {
                const data = await fetchPricingPlans();
                setPlans(data || []);
            } catch (err) {
                console.error('Error loading pricing plans:', err);
            } finally {
                setLoading(false);
            }
        };
        loadPlans();
    }, []);

    const handleComingSoon = (e) => {
        e.preventDefault();
        showToast('Feature Coming Soon!');
    };

    /* ===== ANIMATION VARIANTS ===== */
    const staggerContainer = {
        initial: { opacity: 0 },
        whileInView: { opacity: 1 },
        viewport: { once: true, margin: "-50px" },
        transition: { staggerChildren: 0.15 }
    };

    const staggerItem = {
        initial: { opacity: 0, y: 30 },
        whileInView: { opacity: 1, y: 0 },
        transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
    };

    const fadeInOptions = {
        initial: { opacity: 0, y: 30 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: "-100px" },
        transition: { duration: 0.6, ease: "easeOut" }
    };

    /* ===== RENDER ===== */
    if (loading) {
        return (
            <section className="pricing-section" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
                <p style={{ color: '#CBBE9A', fontSize: '1rem' }}>Loading pricing plans...</p>
            </section>
        );
    }

    if (plans.length === 0) {
        return (
            <section className="pricing-section" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
                <h2>PRICING</h2>
                <p>Pricing plans coming soon. Stay tuned!</p>
            </section>
        );
    }

    return (
        <>
            <section className="pricing-section">
                <motion.div
                    className="pricing-grid"
                    variants={staggerContainer}
                    initial="initial"
                    whileInView="whileInView"
                    viewport={{ once: true, margin: "-100px" }}
                >
                    {plans.map((plan) => {
                        const features = (plan.features || '').split('\n').filter(Boolean);
                        return (
                            <motion.div
                                key={plan.id}
                                className={`pricing-card ${plan.is_popular ? 'highlight' : ''}`}
                                variants={staggerItem}
                            >
                                {plan.is_popular && <div className="ribbon">MOST POPULAR</div>}
                                <h2>{plan.name}</h2>
                                <div className="plan-sub">{plan.subtitle}</div>
                                <div className="price">{plan.price} <span>/month</span></div>
                                <ul>
                                    {features.map((feat, i) => (
                                        <li key={i}>{feat}</li>
                                    ))}
                                </ul>
                                <a href="#" className="button" onClick={handleComingSoon}>
                                    {plan.button_text || 'GET STARTED'}
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginLeft: '8px' }}>
                                        <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M12 5L19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </a>
                            </motion.div>
                        );
                    })}
                </motion.div>
            </section>

            <motion.section className="ai-section" {...fadeInOptions}>
                <h2>SMEFLOW AI</h2>
                <p>
                    Add predictive intelligence to your workflow — conversion scoring,
                    revenue forecasting, and smart automation insights.
                </p>
                <div className="ai-price">$15 /month Add-On</div>
            </motion.section>
        </>
    );
}

export default Pricing;
