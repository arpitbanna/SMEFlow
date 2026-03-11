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
    const [sortBy, setSortBy] = useState('newest');

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

    /* ===== FILTERED + SORTED DATA ===== */
    const filteredInquiries = useMemo(() => {
        const filtered = inquiries.filter(inq => {
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

        return [...filtered].sort((a, b) => {
            switch (sortBy) {
                case 'newest': return new Date(b.created_at) - new Date(a.created_at);
                case 'oldest': return new Date(a.created_at) - new Date(b.created_at);
                case 'name_asc': return (a.name || '').localeCompare(b.name || '');
                case 'name_desc': return (b.name || '').localeCompare(a.name || '');
                case 'status': {
                    const order = { not_started: 0, in_process: 1, done: 2 };
                    return (order[a.status || 'not_started'] ?? 0) - (order[b.status || 'not_started'] ?? 0);
                }
                default: return 0;
            }
        });
    }, [inquiries, searchQuery, statusFilter, sortBy]);

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
        { label: 'Total Inquiries', value: statusCounts.all, color: '#F0B90B', icon: '📩', filterKey: 'all' },
        { label: 'Not Started', value: statusCounts.not_started, color: '#EF4444', icon: '🔴', filterKey: 'not_started' },
        { label: 'In Process', value: statusCounts.in_process, color: '#F0B90B', icon: '🟡', filterKey: 'in_process' },
        { label: 'Completed', value: statusCounts.done, color: '#22C55E', icon: '🟢', filterKey: 'done' }
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
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M19.4 15C19.2669 15.3016 19.2272 15.6362 19.286 15.9606C19.3448 16.285 19.4995 16.5843 19.73 16.82L19.79 16.88C19.976 17.0657 20.1235 17.2863 20.2241 17.5291C20.3248 17.7719 20.3766 18.0322 20.3766 18.295C20.3766 18.5578 20.3248 18.8181 20.2241 19.0609C20.1235 19.3037 19.976 19.5243 19.79 19.71C19.6043 19.896 19.3837 20.0435 19.1409 20.1441C18.8981 20.2448 18.6378 20.2966 18.375 20.2966C18.1122 20.2966 17.8519 20.2448 17.6091 20.1441C17.3663 20.0435 17.1457 19.896 16.96 19.71L16.9 19.65C16.6643 19.4195 16.365 19.2648 16.0406 19.206C15.7162 19.1472 15.3816 19.1869 15.08 19.32C14.7842 19.4468 14.532 19.6572 14.3543 19.9255C14.1766 20.1938 14.0813 20.5082 14.08 20.83V21C14.08 21.5304 13.8693 22.0391 13.4942 22.4142C13.1191 22.7893 12.6104 23 12.08 23C11.5496 23 11.0409 22.7893 10.6658 22.4142C10.2907 22.0391 10.08 21.5304 10.08 21V20.91C10.0723 20.579 9.96512 20.258 9.77251 19.9887C9.5799 19.7194 9.31074 19.5143 9 19.4C8.69838 19.2669 8.36381 19.2272 8.03941 19.286C7.71502 19.3448 7.41568 19.4995 7.18 19.73L7.12 19.79C6.93425 19.976 6.71368 20.1235 6.47088 20.2241C6.22808 20.3248 5.96783 20.3766 5.705 20.3766C5.44217 20.3766 5.18192 20.3248 4.93912 20.2241C4.69632 20.1235 4.47575 19.976 4.29 19.79C4.10405 19.6043 3.95653 19.3837 3.85588 19.1409C3.75523 18.8981 3.70343 18.6378 3.70343 18.375C3.70343 18.1122 3.75523 17.8519 3.85588 17.6091C3.95653 17.3663 4.10405 17.1457 4.29 16.96L4.35 16.9C4.58054 16.6643 4.73519 16.365 4.794 16.0406C4.85282 15.7162 4.81312 15.3816 4.68 15.08C4.55324 14.7842 4.34276 14.532 4.07447 14.3543C3.80618 14.1766 3.49179 14.0813 3.17 14.08H3C2.46957 14.08 1.96086 13.8693 1.58579 13.4942C1.21071 13.1191 1 12.6104 1 12.08C1 11.5496 1.21071 11.0409 1.58579 10.6658C1.96086 10.2907 2.46957 10.08 3 10.08H3.09C3.42099 10.0723 3.742 9.96512 4.0113 9.77251C4.28059 9.5799 4.48572 9.31074 4.6 9C4.73312 8.69838 4.77282 8.36381 4.714 8.03941C4.65519 7.71502 4.50054 7.41568 4.27 7.18L4.21 7.12C4.02405 6.93425 3.87653 6.71368 3.77588 6.47088C3.67523 6.22808 3.62343 5.96783 3.62343 5.705C3.62343 5.44217 3.67523 5.18192 3.77588 4.93912C3.87653 4.69632 4.02405 4.47575 4.21 4.29C4.39575 4.10405 4.61632 3.95653 4.85912 3.85588C5.10192 3.75523 5.36217 3.70343 5.625 3.70343C5.88783 3.70343 6.14808 3.75523 6.39088 3.85588C6.63368 3.95653 6.85425 4.10405 7.04 4.29L7.1 4.35C7.33568 4.58054 7.63502 4.73519 7.95941 4.794C8.28381 4.85282 8.61838 4.81312 8.92 4.68H9C9.29577 4.55324 9.54802 4.34276 9.72569 4.07447C9.90337 3.80618 9.99872 3.49179 10 3.17V3C10 2.46957 10.2107 1.96086 10.5858 1.58579C10.9609 1.21071 11.4696 1 12 1C12.5304 1 13.0391 1.21071 13.4142 1.58579C13.7893 1.96086 14 2.46957 14 3V3.09C14.0013 3.41179 14.0966 3.72618 14.2743 3.99447C14.452 4.26276 14.7042 4.47324 15 4.6C15.3016 4.73312 15.6362 4.77282 15.9606 4.714C16.285 4.65519 16.5843 4.50054 16.82 4.27L16.88 4.21C17.0657 4.02405 17.2863 3.87653 17.5291 3.77588C17.7719 3.67523 18.0322 3.62343 18.295 3.62343C18.5578 3.62343 18.8181 3.67523 19.0609 3.77588C19.3037 3.87653 19.5243 4.02405 19.71 4.21C19.896 4.39575 20.0435 4.61632 20.1441 4.85912C20.2448 5.10192 20.2966 5.36217 20.2966 5.625C20.2966 5.88783 20.2448 6.14808 20.1441 6.39088C20.0435 6.63368 19.896 6.85425 19.71 7.04L19.65 7.1C19.4195 7.33568 19.2648 7.63502 19.206 7.95941C19.1472 8.28381 19.1869 8.61838 19.32 8.92V9C19.4468 9.29577 19.6572 9.54802 19.9255 9.72569C20.1938 9.90337 20.5082 9.99872 20.83 10H21C21.5304 10 22.0391 10.2107 22.4142 10.5858C22.7893 10.9609 23 11.4696 23 12C23 12.5304 22.7893 13.0391 22.4142 13.4142C22.0391 13.7893 21.5304 14 21 14H20.91C20.5882 14.0013 20.2738 14.0966 20.0055 14.2743C19.7372 14.452 19.5268 14.7042 19.4 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
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
                            onClick={() => setStatusFilter(stat.filterKey)}
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

                        {/* Sort Dropdown */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ opacity: 0.4, flexShrink: 0 }}>
                                <path d="M11 5H21" stroke="#FFF" strokeWidth="2" strokeLinecap="round"/>
                                <path d="M11 9H18" stroke="#FFF" strokeWidth="2" strokeLinecap="round"/>
                                <path d="M11 13H15" stroke="#FFF" strokeWidth="2" strokeLinecap="round"/>
                                <path d="M3 4V20" stroke="#FFF" strokeWidth="2" strokeLinecap="round"/>
                                <path d="M3 20L6 17" stroke="#FFF" strokeWidth="2" strokeLinecap="round"/>
                                <path d="M3 20L0 17" stroke="#FFF" strokeWidth="2" strokeLinecap="round"/>
                            </svg>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                style={{
                                    padding: '8px 12px',
                                    backgroundColor: 'rgba(255,255,255,0.04)',
                                    border: '1.5px solid rgba(255,255,255,0.1)',
                                    borderRadius: '8px',
                                    color: '#E8E6DF',
                                    fontSize: '0.78rem',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    outline: 'none',
                                    appearance: 'none',
                                    WebkitAppearance: 'none',
                                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%23888' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
                                    backgroundRepeat: 'no-repeat',
                                    backgroundPosition: 'right 10px center',
                                    paddingRight: '30px'
                                }}
                            >
                                <option value="newest" style={{ backgroundColor: '#1E2128' }}>Newest First</option>
                                <option value="oldest" style={{ backgroundColor: '#1E2128' }}>Oldest First</option>
                                <option value="name_asc" style={{ backgroundColor: '#1E2128' }}>Name A → Z</option>
                                <option value="name_desc" style={{ backgroundColor: '#1E2128' }}>Name Z → A</option>
                                <option value="status" style={{ backgroundColor: '#1E2128' }}>Status</option>
                            </select>
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
