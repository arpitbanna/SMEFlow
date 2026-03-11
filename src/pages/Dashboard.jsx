/* ===== IMPORTS ===== */
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchInquiries, updateInquiryStatus } from '../services/api';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';

/* ===== STATUS CONFIG ===== */
const STATUS_OPTIONS = [
    { value: 'not_started', label: 'NOT STARTED', color: '#EF4444', icon: '○' },
    { value: 'in_process', label: 'IN PROCESS', color: '#F0B90B', icon: '◐' },
    { value: 'done', label: 'DONE', color: '#22C55E', icon: '●' }
];

const getStatusStyle = (status) => {
    const opt = STATUS_OPTIONS.find(s => s.value === status) || STATUS_OPTIONS[0];
    return {
        backgroundColor: opt.color + '18',
        color: opt.color,
        border: `1px solid ${opt.color}44`,
        padding: '4px 12px',
        borderRadius: '20px',
        fontSize: '0.7rem',
        fontWeight: '700',
        letterSpacing: '1px',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '5px'
    };
};

/* ===== SHARED STYLES ===== */
const panelBg = {
    background: 'linear-gradient(145deg, #0F1114 0%, #1A1D23 100%)',
    minHeight: '100vh',
    padding: '2rem 1.5rem',
    color: '#E8E6DF',
    fontFamily: "'Inter', 'Segoe UI', sans-serif"
};

const cardStyle = {
    backgroundColor: '#1E2128',
    borderRadius: '14px',
    border: '1px solid rgba(255,255,255,0.06)',
    padding: '1.5rem',
    boxShadow: '0 4px 16px rgba(0,0,0,0.3)'
};

const btnPrimary = {
    padding: '8px 20px',
    background: 'linear-gradient(135deg, #F0B90B 0%, #D4A008 100%)',
    color: '#111',
    fontWeight: '700',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.8rem',
    letterSpacing: '0.5px',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    transition: 'all 0.2s ease'
};

const btnGhost = {
    padding: '8px 16px',
    backgroundColor: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.1)',
    color: '#E8E6DF',
    fontWeight: '600',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.8rem',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    transition: 'all 0.2s ease'
};

/* ===== DASHBOARD COMPONENT ===== */
function Dashboard() {
    const { showToast } = useToast();
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [inquiries, setInquiries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    const handleLogout = () => {
        logout();
        showToast("Logged out successfully");
        navigate('/');
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            await updateInquiryStatus(id, newStatus);
            setInquiries(prev =>
                prev.map(inq => inq.id === id ? { ...inq, status: newStatus } : inq)
            );
            const label = STATUS_OPTIONS.find(s => s.value === newStatus)?.label;
            showToast(`Status → ${label}`);
        } catch (error) {
            showToast("Failed to update status.");
        }
    };

    const handleRefresh = async () => {
        setLoading(true);
        try {
            const data = await fetchInquiries();
            setInquiries(data);
            showToast("Data refreshed");
        } catch (error) {
            showToast("Refresh failed");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const loadInquiries = async () => {
            try {
                const data = await fetchInquiries();
                setInquiries(data);
            } catch (error) {
                console.error("Failed to load inquiries:", error);
                showToast("Error loading inquiries.");
            } finally {
                setLoading(false);
            }
        };
        loadInquiries();
    }, [showToast]);

    /* ===== FILTERED DATA ===== */
    const filteredInquiries = useMemo(() => {
        return inquiries.filter(inq => {
            const statusMatch = statusFilter === 'all' || (inq.status || 'not_started') === statusFilter;
            const query = searchQuery.toLowerCase().trim();
            if (!query) return statusMatch;
            const searchMatch = 
                (inq.name || '').toLowerCase().includes(query) ||
                (inq.email || '').toLowerCase().includes(query) ||
                (inq.company || '').toLowerCase().includes(query) ||
                (inq.message || '').toLowerCase().includes(query);
            return statusMatch && searchMatch;
        });
    }, [inquiries, searchQuery, statusFilter]);

    /* ===== STATUS COUNTS ===== */
    const statusCounts = useMemo(() => {
        const counts = { all: inquiries.length, not_started: 0, in_process: 0, done: 0 };
        inquiries.forEach(inq => {
            const s = inq.status || 'not_started';
            if (counts[s] !== undefined) counts[s]++;
        });
        return counts;
    }, [inquiries]);

    /* ===== FILTER BUTTON STYLE ===== */
    const filterBtnStyle = (isActive, color = '#F0B90B') => ({
        padding: '7px 16px',
        borderRadius: '8px',
        border: isActive ? `1.5px solid ${color}` : '1.5px solid rgba(255,255,255,0.1)',
        backgroundColor: isActive ? color + '20' : 'rgba(255,255,255,0.04)',
        color: isActive ? color : 'rgba(255,255,255,0.5)',
        fontWeight: '700',
        fontSize: '0.72rem',
        cursor: 'pointer',
        letterSpacing: '0.5px',
        transition: 'all 0.2s ease'
    });

    /* ===== STAT CARDS DATA ===== */
    const statCards = [
        { label: 'Total Inquiries', value: statusCounts.all, color: '#F0B90B', icon: '📩' },
        { label: 'Not Started', value: statusCounts.not_started, color: '#EF4444', icon: '🔴' },
        { label: 'In Process', value: statusCounts.in_process, color: '#F0B90B', icon: '🟡' },
        { label: 'Completed', value: statusCounts.done, color: '#22C55E', icon: '🟢' }
    ];

    return (
        <div style={panelBg}>
            {/* ===== TOP BAR ===== */}
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#22C55E', boxShadow: '0 0 8px #22C55E88' }} />
                            <span style={{ fontSize: '0.75rem', color: '#22C55E', fontWeight: '600', letterSpacing: '1px' }}>LIVE</span>
                        </div>
                        <h1 style={{ margin: 0, fontSize: '1.8rem', fontWeight: '800', letterSpacing: '-0.5px', color: '#F5F3E7' }}>
                            Admin Panel
                        </h1>
                        <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)' }}>
                            SMEFlow Control Center • {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                        </p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                        <button onClick={handleRefresh} style={btnGhost}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M1 4V10H7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M23 20V14H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M20.49 9A9 9 0 005.64 5.64L1 10M23 14L18.36 18.36A9 9 0 013.51 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                            Refresh
                        </button>
                        <button onClick={() => showToast('Export feature coming soon!')} style={btnGhost}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M21 15V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M7 10L12 15L17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M12 15V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                            Export CSV
                        </button>
                        <button onClick={() => showToast('Feature Coming Soon!')} style={btnGhost}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2"/><path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                            Activity Log
                        </button>
                        <button onClick={() => showToast('Feature Coming Soon!')} style={btnPrimary}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12.22 2H11.78C11.2496 2 10.7409 2.21071 10.3658 2.58579C9.99072 2.96086 9.78 3.46957 9.78 4V4.18C9.78 5.28 9.08 6.26 8.04 6.64C7.95 6.67 7.86 6.71 7.77 6.74C6.71 7.16 5.5 6.95 4.69 6.17L4.55 6.03C4.17572 5.65612 3.66777 5.44574 3.1377 5.44522C2.60762 5.44475 2.09928 5.65418 1.72432 6.02736C1.34936 6.40053 1.13756 6.90787 1.13599 7.43795C1.13443 7.96803 1.34322 8.47676 1.71601 8.85172L1.85 8.99C2.63 9.8 2.85 11.01 2.43 12.07C2.4 12.16 2.36 12.25 2.33 12.34C1.95 13.38 0.97 14.08 -0.13 14.08H-0.31C-0.840426 14.08 -1.34914 14.2907 -1.72421 14.6658C-2.09929 15.0409 -2.31 15.5496 -2.31 16.08V16.52C-2.31 17.0504 -2.09929 17.5591 -1.72421 17.9342C-1.34914 18.3093 -0.840426 18.52 -0.31 18.52H-0.13" stroke="currentColor" strokeWidth="2"/><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/></svg>
                            Settings
                        </button>
                        <button onClick={handleLogout} style={{
                            ...btnGhost,
                            borderColor: '#EF444444',
                            color: '#EF4444'
                        }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M9 21H5C3.89543 21 3 20.1046 3 19V5C3 3.89543 3.89543 3 5 3H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M16 17L21 12L16 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                            Logout
                        </button>
                    </div>
                </div>

                {/* ===== STAT CARDS ===== */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                    {statCards.map((stat, i) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1, duration: 0.4 }}
                            style={{
                                ...cardStyle,
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                                cursor: 'pointer',
                                transition: 'border-color 0.2s'
                            }}
                            onClick={() => {
                                if (stat.label === 'Total Inquiries') setStatusFilter('all');
                                else if (stat.label === 'Not Started') setStatusFilter('not_started');
                                else if (stat.label === 'In Process') setStatusFilter('in_process');
                                else if (stat.label === 'Completed') setStatusFilter('done');
                            }}
                        >
                            <span style={{ fontSize: '1.6rem' }}>{stat.icon}</span>
                            <div>
                                <div style={{ fontSize: '1.6rem', fontWeight: '800', color: stat.color, lineHeight: 1 }}>{stat.value}</div>
                                <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.45)', fontWeight: '600', letterSpacing: '0.5px', marginTop: '2px' }}>{stat.label.toUpperCase()}</div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* ===== SEARCH & FILTER ===== */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.4 }}
                    style={{
                        ...cardStyle,
                        marginBottom: '1.5rem',
                        padding: '1.2rem 1.5rem'
                    }}
                >
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
                        {/* Search */}
                        <div style={{ 
                            flex: 1, 
                            minWidth: '220px', 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '10px',
                            backgroundColor: 'rgba(255,255,255,0.04)',
                            border: '1.5px solid rgba(255,255,255,0.08)',
                            borderRadius: '10px',
                            padding: '0 14px'
                        }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, opacity: 0.4 }}>
                                <circle cx="11" cy="11" r="8" stroke="#FFF" strokeWidth="2"/>
                                <path d="M21 21L16.65 16.65" stroke="#FFF" strokeWidth="2" strokeLinecap="round"/>
                            </svg>
                            <input
                                type="text"
                                placeholder="Search inquiries..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                style={{
                                    flex: 1,
                                    padding: '10px 0',
                                    backgroundColor: 'transparent',
                                    border: 'none',
                                    color: '#E8E6DF',
                                    fontSize: '0.9rem',
                                    outline: 'none'
                                }}
                            />
                            {searchQuery && (
                                <button onClick={() => setSearchQuery('')} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer', fontSize: '1.1rem', padding: '0' }}>✕</button>
                            )}
                        </div>

                        {/* Filter Pills */}
                        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                            <button onClick={() => setStatusFilter('all')} style={filterBtnStyle(statusFilter === 'all')}>
                                ALL ({statusCounts.all})
                            </button>
                            {STATUS_OPTIONS.map(opt => (
                                <button 
                                    key={opt.value}
                                    onClick={() => setStatusFilter(opt.value)} 
                                    style={filterBtnStyle(statusFilter === opt.value, opt.color)}
                                >
                                    {opt.icon} {opt.label} ({statusCounts[opt.value]})
                                </button>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* ===== RESULTS BAR ===== */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)' }}>
                        Showing <span style={{ color: '#F0B90B', fontWeight: '700' }}>{filteredInquiries.length}</span> of <span style={{ fontWeight: '700' }}>{inquiries.length}</span> inquiries
                    </p>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button onClick={() => showToast('Bulk actions coming soon!')} style={{ ...btnGhost, fontSize: '0.75rem', padding: '6px 12px' }}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.709 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371C2.43727 15.6281 1.87979 13.4881 2.02168 11.3363C2.16356 9.18457 2.99721 7.13633 4.39828 5.49707C5.79935 3.85782 7.69279 2.71539 9.79619 2.24015C11.8996 1.7649 14.1003 1.98234 16.07 2.86" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M22 4L12 14.01L9 11.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                            Bulk Actions
                        </button>
                        <button onClick={() => showToast('Notifications coming soon!')} style={{ ...btnGhost, fontSize: '0.75rem', padding: '6px 12px' }}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                            Notifications
                        </button>
                    </div>
                </div>

                {/* ===== INQUIRY CARDS ===== */}
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '4rem', color: 'rgba(255,255,255,0.4)' }}>
                        <motion.div 
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
                            style={{ display: 'inline-block', marginBottom: '1rem' }}
                        >
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M12 2V6" stroke="#F0B90B" strokeWidth="2" strokeLinecap="round"/><path d="M12 18V22" stroke="#F0B90B44" strokeWidth="2" strokeLinecap="round"/><path d="M4.93 4.93L7.76 7.76" stroke="#F0B90B" strokeWidth="2" strokeLinecap="round"/><path d="M16.24 16.24L19.07 19.07" stroke="#F0B90B44" strokeWidth="2" strokeLinecap="round"/><path d="M2 12H6" stroke="#F0B90B88" strokeWidth="2" strokeLinecap="round"/><path d="M18 12H22" stroke="#F0B90B44" strokeWidth="2" strokeLinecap="round"/></svg>
                        </motion.div>
                        <p>Loading data from Supabase...</p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1rem' }}>
                        <AnimatePresence mode="popLayout">
                            {filteredInquiries.length > 0 ? (
                                filteredInquiries.map((inq, index) => (
                                    <motion.div 
                                        key={inq.id}
                                        layout
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ duration: 0.3, delay: index * 0.05 }}
                                        style={{
                                            ...cardStyle,
                                            transition: 'border-color 0.2s'
                                        }}
                                    >
                                        {/* Card Header */}
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', gap: '0.5rem' }}>
                                            <div>
                                                <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: '700', color: '#F5F3E7' }}>{inq.name}</h3>
                                                <p style={{ margin: '3px 0 0', fontSize: '0.8rem', color: 'rgba(255,255,255,0.35)' }}>
                                                    {new Date(inq.created_at).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                            </div>
                                            <span style={getStatusStyle(inq.status || 'not_started')}>
                                                {STATUS_OPTIONS.find(s => s.value === (inq.status || 'not_started'))?.icon}{' '}
                                                {STATUS_OPTIONS.find(s => s.value === (inq.status || 'not_started'))?.label}
                                            </span>
                                        </div>

                                        {/* Contact Info */}
                                        <div style={{ fontSize: '0.85rem', marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'rgba(255,255,255,0.6)' }}>
                                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M22 6L12 13L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                                {inq.email}
                                            </div>
                                            {inq.company && (
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'rgba(255,255,255,0.6)' }}>
                                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M3 21H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><path d="M5 21V7L13 3V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M19 21V11L13 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M9 9V9.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><path d="M9 13V13.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><path d="M9 17V17.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                                                    {inq.company}
                                                </div>
                                            )}
                                        </div>

                                        {/* Message */}
                                        <div style={{ 
                                            backgroundColor: 'rgba(255,255,255,0.03)',
                                            padding: '1rem',
                                            borderRadius: '10px',
                                            border: '1px solid rgba(255,255,255,0.04)',
                                            marginBottom: '1rem'
                                        }}>
                                            <p style={{ margin: 0, fontSize: '0.88rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>"{inq.message}"</p>
                                        </div>

                                        {/* Status Actions */}
                                        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                                            {STATUS_OPTIONS.map((opt) => {
                                                const isActive = (inq.status || 'not_started') === opt.value;
                                                return (
                                                    <button
                                                        key={opt.value}
                                                        onClick={() => handleStatusChange(inq.id, opt.value)}
                                                        style={{
                                                            padding: '5px 12px',
                                                            borderRadius: '6px',
                                                            border: `1.5px solid ${isActive ? opt.color : 'rgba(255,255,255,0.1)'}`,
                                                            backgroundColor: isActive ? opt.color + '20' : 'transparent',
                                                            color: isActive ? opt.color : 'rgba(255,255,255,0.35)',
                                                            fontWeight: '700',
                                                            fontSize: '0.68rem',
                                                            cursor: 'pointer',
                                                            letterSpacing: '0.5px',
                                                            transition: 'all 0.2s ease',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '4px'
                                                        }}
                                                    >
                                                        {opt.icon} {opt.label}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </motion.div>
                                ))
                            ) : (
                                <motion.div 
                                    key="empty"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: 'rgba(255,255,255,0.35)' }}
                                >
                                    <p style={{ fontSize: '1.1rem' }}>
                                        {searchQuery || statusFilter !== 'all' 
                                            ? '🔍 No inquiries match your search or filter.' 
                                            : '📭 No inquiries found yet.'}
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                )}

                {/* ===== FOOTER ===== */}
                <div style={{ 
                    marginTop: '3rem', 
                    paddingTop: '1.5rem', 
                    borderTop: '1px solid rgba(255,255,255,0.06)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '1rem'
                }}>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: 'rgba(255,255,255,0.25)' }}>
                        SMEFlow Admin Panel • Powered by Supabase
                    </p>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button onClick={() => showToast('Feature Coming Soon!')} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.25)', cursor: 'pointer', fontSize: '0.75rem' }}>Documentation</button>
                        <button onClick={() => showToast('Feature Coming Soon!')} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.25)', cursor: 'pointer', fontSize: '0.75rem' }}>API Reference</button>
                        <button onClick={() => showToast('Feature Coming Soon!')} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.25)', cursor: 'pointer', fontSize: '0.75rem' }}>Support</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
