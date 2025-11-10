/**
 * Helper function to extract date components for filtering
 * @param {string} dateString - ISO date string
 * @returns {Object} Object with formatted date fields
 */
const getDateFields = (dateString) => {
    if (!dateString) return {};
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return {};
    
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const monthName = date.toLocaleString('default', { month: 'long' });
    const quarter = Math.ceil(month / 3);
    
    return {
        date: date.toISOString().split('T')[0], // YYYY-MM-DD format
        year: year,
        month: `${year}-${String(month).padStart(2, '0')}`,
        monthName: monthName,
        quarter: `${year} Q${quarter}`,
        yearMonth: `${year}-${monthName}`
    };
};

/**
 * Returns card data
 * @returns {Promise<any[]>}
 */
const getCardData = async () => {
    const iframe = window.TrelloPowerUp.iframe();
    const board = await iframe.board('all');
    const listStore = await iframe.lists('all');
    return listStore.map((listItem, listIndex) => {
        return listItem.cards.map(cardItem => {
            const customMap = {
                'Card ID': cardItem.id,
                'Card Name': cardItem.name,
                'List': listItem.name,
                'List index': listIndex + 1,
                'Members': cardItem.members.map(member => member.fullName).join(', '),
                'Labels': cardItem.labels.map(label => label.name).join(', ')
            };
            
            // Add due date if present
            if (cardItem.due) {
                const dueFields = getDateFields(cardItem.due);
                customMap['Due Date'] = dueFields.date;
                customMap['Due Year'] = dueFields.year;
                customMap['Due Month'] = dueFields.month;
                customMap['Due Month Name'] = dueFields.monthName;
                customMap['Due Quarter'] = dueFields.quarter;
                customMap['Due Year-Month'] = dueFields.yearMonth;
            }
            
            // Add card creation date if present
            if (cardItem.dateLastActivity) {
                const activityFields = getDateFields(cardItem.dateLastActivity);
                customMap['Last Activity Date'] = activityFields.date;
                customMap['Last Activity Year'] = activityFields.year;
                customMap['Last Activity Month'] = activityFields.month;
                customMap['Last Activity Quarter'] = activityFields.quarter;
            }
            
            cardItem.customFieldItems.forEach(customFieldItem => {
                var field = board.customFields.filter(cardItem => cardItem.id === customFieldItem.idCustomField)[0];
                if (field.type === 'number') {
                    customMap[field.name] = Number(customFieldItem.value.number);
                } else if (field.type === "text") {
                    customMap[field.name] = customFieldItem.value.text;
                } else if (field.type === "date") {
                    const dateValue = customFieldItem.value.date;
                    customMap[field.name] = dateValue;
                    
                    // Add derived date fields for custom date fields
                    const dateFields = getDateFields(dateValue);
                    if (dateFields.date) {
                        customMap[`${field.name} (Formatted)`] = dateFields.date;
                        customMap[`${field.name} Year`] = dateFields.year;
                        customMap[`${field.name} Month`] = dateFields.month;
                        customMap[`${field.name} Quarter`] = dateFields.quarter;
                    }
                } else if (field.type === "checkbox") {
                    customMap[field.name] = 1 * (customFieldItem.value.checked === true);
                } else if (field.type === "list") {
                    customMap[field.name] = field.options
                        .filter(option => option.id === customFieldItem.idValue)[0].value.text;
                }
            });
            return customMap;
        });
    }).flat(1);
};

/**
 * Loads either saved or default pivot settings
 * @returns {Promise<{aggregatorName: string, rows: [string], rendererName: string, cols: [string, string]}>}
 */
const getPivotSettings = async () => {
    let settings = await window.TrelloPowerUp.iframe().get('board', 'shared', 'pivotData');
    if (!settings) {
        settings = {
            rows: ['Members'],
            cols: ['List index', 'List'],
            aggregatorName: 'Count',
            rendererName: 'Table'
        };
    }
    if (settings.hasOwnProperty('aggregators')) {
        delete settings.aggregators;
    }
    if (settings.hasOwnProperty('renderers')) {
        delete settings.renderers;
    }
    return settings
}

/**
 * Apply date range filter to data
 * @param {Array} data - Original data
 * @param {string} field - Date field to filter on
 * @param {string} fromDate - Start date (YYYY-MM-DD)
 * @param {string} toDate - End date (YYYY-MM-DD)
 * @returns {Array} Filtered data
 */
const applyDateRangeFilter = (data, field, fromDate, toDate) => {
    if (!field || (!fromDate && !toDate)) {
        return data;
    }
    
    return data.filter(row => {
        const dateValue = row[field];
        if (!dateValue) return false;
        
        // Extract date string (handle both ISO strings and YYYY-MM-DD format)
        let dateStr = dateValue;
        if (typeof dateValue === 'string' && dateValue.includes('T')) {
            dateStr = dateValue.split('T')[0];
        }
        
        if (fromDate && dateStr < fromDate) return false;
        if (toDate && dateStr > toDate) return false;
        
        return true;
    });
};

/**
 * Populate date field selector
 * @param {Array} data - Card data
 */
const populateDateFieldSelector = (data) => {
    const dateFields = new Set();
    
    // Find all fields that contain date-like values
    if (data.length > 0) {
        Object.keys(data[0]).forEach(key => {
            // Check if field contains date or has date-related keywords
            if (key.toLowerCase().includes('date') || 
                key.toLowerCase().includes('year') || 
                key.toLowerCase().includes('month') || 
                key.toLowerCase().includes('quarter')) {
                dateFields.add(key);
            }
        });
    }
    
    const selector = $('#dateFilterField');
    selector.empty();
    selector.append('<option value="">Select a date field...</option>');
    
    Array.from(dateFields).sort().forEach(field => {
        selector.append(`<option value="${field}">${field}</option>`);
    });
};

let originalCardData = [];
let currentFilteredData = [];

(async () => {
    originalCardData = await getCardData();
    currentFilteredData = originalCardData;
    const pivotSettings = await getPivotSettings();

    pivotSettings.onRefresh = async (data) => {
        await window.TrelloPowerUp.iframe().set('board', 'shared', 'pivotData', data);
        $('.pvtTable, table').css('width', 'auto');
    };

    // Initialize date pickers
    $('#dateFrom, #dateTo').datepicker({
        dateFormat: 'yy-mm-dd',
        changeMonth: true,
        changeYear: true
    });
    
    // Populate date field selector
    populateDateFieldSelector(originalCardData);
    
    // Show/hide date filter
    let dateFilterVisible = false;
    const toggleButton = $('<button>')
        .text('📅 Date Filter')
        .css({
            'position': 'fixed',
            'top': '10px',
            'right': '10px',
            'padding': '5px 15px',
            'background-color': '#0079bf',
            'color': 'white',
            'border': 'none',
            'border-radius': '3px',
            'cursor': 'pointer',
            'z-index': '1000'
        })
        .on('click', function() {
            dateFilterVisible = !dateFilterVisible;
            $('#dateFilterContainer').toggleClass('active', dateFilterVisible);
            $(this).text(dateFilterVisible ? '📅 Hide Date Filter' : '📅 Date Filter');
        });
    
    $('body').append(toggleButton);
    
    $('#toggleDateFilter').on('click', function() {
        dateFilterVisible = false;
        $('#dateFilterContainer').removeClass('active');
        toggleButton.text('📅 Date Filter');
    });
    
    // Apply date filter
    $('#applyDateFilter').on('click', function() {
        const field = $('#dateFilterField').val();
        const fromDate = $('#dateFrom').val();
        const toDate = $('#dateTo').val();
        
        if (!field) {
            alert('Please select a date field to filter on.');
            return;
        }
        
        currentFilteredData = applyDateRangeFilter(originalCardData, field, fromDate, toDate);
        $('#output').empty();
        $('#output').pivotUI(currentFilteredData, pivotSettings);
        $('.pvtTable, table').css('width', 'auto');
        
        const filterInfo = [];
        if (fromDate) filterInfo.push(`from ${fromDate}`);
        if (toDate) filterInfo.push(`to ${toDate}`);
        
        if (filterInfo.length > 0) {
            alert(`Date filter applied: ${field} ${filterInfo.join(' ')}\nShowing ${currentFilteredData.length} of ${originalCardData.length} cards.`);
        }
    });
    
    // Clear date filter
    $('#clearDateFilter').on('click', function() {
        $('#dateFilterField').val('');
        $('#dateFrom').val('');
        $('#dateTo').val('');
        currentFilteredData = originalCardData;
        $('#output').empty();
        $('#output').pivotUI(currentFilteredData, pivotSettings);
        $('.pvtTable, table').css('width', 'auto');
    });

    $('#output').pivotUI(currentFilteredData, pivotSettings);
    $('.pvtTable, table').css('width', 'auto');
})();
