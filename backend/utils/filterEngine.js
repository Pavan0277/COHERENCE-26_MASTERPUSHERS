/**
 * Apply a filter to a lead object.
 *
 * @param {Object} lead - The lead document to test
 * @param {{ column: string, operator: string, value: any }} filterConfig
 * @returns {boolean} true if the lead passes the filter
 */
export function applyFilter(lead, filterConfig) {
    const { column, operator, value } = filterConfig;

    const leadValue = lead[column];

    if (leadValue === undefined || leadValue === null) {
        return false;
    }

    const strLead = String(leadValue).toLowerCase();
    const strFilter = String(value).toLowerCase();

    switch (operator) {
        case "equals":
            return strLead === strFilter;

        case "not_equals":
            return strLead !== strFilter;

        case "contains":
            return strLead.includes(strFilter);

        case "greater_than":
            return Number(leadValue) > Number(value);

        case "less_than":
            return Number(leadValue) < Number(value);

        default:
            return false;
    }
}

/**
 * Apply multiple filters to a list of leads (AND logic).
 *
 * @param {Object[]} leads
 * @param {Object[]} filters - Array of filterConfig objects
 * @returns {Object[]} leads that pass all filters
 */
export function filterLeads(leads, filters) {
    if (!filters || !filters.length) return leads;
    return leads.filter((lead) => filters.every((f) => applyFilter(lead, f)));
}
