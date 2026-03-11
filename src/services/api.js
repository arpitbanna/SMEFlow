import supabase from '../lib/supabase';

/* ===== INQUIRIES ===== */

export const fetchInquiries = async () => {
    const { data, error } = await supabase
        .from('inquiries')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching inquiries:', error);
        throw error;
    }
    return data;
};

export const postInquiry = async (inquiryData) => {
    const { data, error } = await supabase
        .from('inquiries')
        .insert([{
            name: inquiryData.name,
            email: inquiryData.email,
            company: inquiryData.company,
            message: inquiryData.message
        }])
        .select();

    if (error) {
        console.error('Error posting inquiry:', error);
        throw error;
    }
    return data;
};

export const updateInquiryStatus = async (id, status) => {
    const { data, error } = await supabase
        .from('inquiries')
        .update({ status })
        .eq('id', id)
        .select();

    if (error) {
        console.error('Error updating inquiry status:', error);
        throw error;
    }
    return data;
};

/* ===== LEADS ===== */

export const fetchLeads = async () => {
    const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching leads:', error);
        throw error;
    }
    return data;
};
