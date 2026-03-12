/* ===== SUPABASE API SERVICE ===== */
import supabase from '../lib/supabase';

/* ============================================================
   INQUIRIES
   ============================================================ */

/** Fetch all inquiries, newest first. */
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

/** Submit a new inquiry from the Contact form. */
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

/** Update the status of an inquiry (not_started | in_process | done). */
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

/* ============================================================
   PRICING PLANS
   ============================================================ */

/** Fetch all pricing plans, ordered by display_order. */
export const fetchPricingPlans = async () => {
    const { data, error } = await supabase
        .from('pricing_plans')
        .select('*')
        .order('display_order', { ascending: true });

    if (error) {
        console.error('Error fetching pricing plans:', error);
        throw error;
    }
    return data;
};

/** Create a new pricing plan. */
export const createPricingPlan = async (plan) => {
    const { data, error } = await supabase
        .from('pricing_plans')
        .insert([plan])
        .select();

    if (error) {
        console.error('Error creating pricing plan:', error);
        throw error;
    }
    return data;
};

/** Update an existing pricing plan. */
export const updatePricingPlan = async (id, updates) => {
    const { data, error } = await supabase
        .from('pricing_plans')
        .update(updates)
        .eq('id', id)
        .select();

    if (error) {
        console.error('Error updating pricing plan:', error);
        throw error;
    }
    return data;
};

/** Delete a pricing plan. */
export const deletePricingPlan = async (id) => {
    const { error } = await supabase
        .from('pricing_plans')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting pricing plan:', error);
        throw error;
    }
};

/* ============================================================
   TEAM MEMBERS
   ============================================================ */

/** Fetch all team members, ordered by display_order. */
export const fetchTeamMembers = async () => {
    const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .order('display_order', { ascending: true });

    if (error) {
        console.error('Error fetching team members:', error);
        throw error;
    }
    return data;
};

/** Create a new team member. */
export const createTeamMember = async (member) => {
    const { data, error } = await supabase
        .from('team_members')
        .insert([member])
        .select();

    if (error) {
        console.error('Error creating team member:', error);
        throw error;
    }
    return data;
};

/** Update an existing team member. */
export const updateTeamMember = async (id, updates) => {
    const { data, error } = await supabase
        .from('team_members')
        .update(updates)
        .eq('id', id)
        .select();

    if (error) {
        console.error('Error updating team member:', error);
        throw error;
    }
    return data;
};

/** Delete a team member. */
export const deleteTeamMember = async (id) => {
    const { error } = await supabase
        .from('team_members')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting team member:', error);
        throw error;
    }
};

/* ============================================================
   FAQs
   ============================================================ */

/** Fetch all FAQs, ordered by display_order. */
export const fetchFAQs = async () => {
    const { data, error } = await supabase
        .from('faqs')
        .select('*')
        .order('display_order', { ascending: true });

    if (error) {
        console.error('Error fetching FAQs:', error);
        throw error;
    }
    return data;
};

/** Create a new FAQ. */
export const createFAQ = async (faq) => {
    const { data, error } = await supabase
        .from('faqs')
        .insert([faq])
        .select();

    if (error) {
        console.error('Error creating FAQ:', error);
        throw error;
    }
    return data;
};

/** Update an existing FAQ. */
export const updateFAQ = async (id, updates) => {
    const { data, error } = await supabase
        .from('faqs')
        .update(updates)
        .eq('id', id)
        .select();

    if (error) {
        console.error('Error updating FAQ:', error);
        throw error;
    }
    return data;
};

/** Delete a FAQ. */
export const deleteFAQ = async (id) => {
    const { error } = await supabase
        .from('faqs')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting FAQ:', error);
        throw error;
    }
};
