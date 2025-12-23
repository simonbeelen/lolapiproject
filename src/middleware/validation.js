const isValidDate = (dateString) => {
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date);
};

const isInPast = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    return date < now;
};

const containsOnlyLetters = (str) => {
    return /^[a-zA-Z\s'-]+$/.test(str);
};

const validateChampion = (req, res, next) => {
    const { name, title, role, difficulty, release_date, lore } = req.body;
    const errors = [];

    if (!name || name.trim() === '') {
        errors.push('Name is required');
    } else if (!containsOnlyLetters(name)) {
        errors.push('Name can only contain letters');
    }

    if (!title || title.trim() === '') {
        errors.push('Title is required');
    }

    if (!role || role.trim() === '') {
        errors.push('Role is required');
    } else {
        const validRoles = ['Tank', 'Fighter', 'Assassin', 'Mage', 'Marksman', 'Support'];
        if (!validRoles.includes(role)) {
            errors.push(`Role must be one of: ${validRoles.join(', ')}`);
        }
    }

    if (difficulty === undefined || difficulty === null || difficulty === '') {
        errors.push('Difficulty is required');
    } else if (isNaN(difficulty)) {
        errors.push('Difficulty must be a number');
    } else if (difficulty < 1 || difficulty > 10) {
        errors.push('Difficulty must be between 1 and 10');
    }

    if (!release_date || release_date.trim() === '') {
        errors.push('Release date is required');
    } else if (!isValidDate(release_date)) {
        errors.push('Release date must be a valid date (YYYY-MM-DD)');
    } else if (!isInPast(release_date)) {
        errors.push('Release date must be in the past');
    }

    if (errors.length > 0) {
        return res.status(400).json({ 
            error: 'Validation failed', 
            details: errors 
        });
    }

    next();
};

const validateItem = (req, res, next) => {
    const { name, description, cost, category, stats } = req.body;
    const errors = [];

    if (!name || name.trim() === '') {
        errors.push('Name is required');
    }

    if (!description || description.trim() === '') {
        errors.push('Description is required');
    }

    if (!category || category.trim() === '') {
        errors.push('Category is required');
    } else {
        const validCategories = ['Damage', 'Defense', 'Magic', 'Movement', 'Consumable'];
        if (!validCategories.includes(category)) {
            errors.push(`Category must be one of: ${validCategories.join(', ')}`);
        }
    }

    if (cost === undefined || cost === null || cost === '') {
        errors.push('Cost is required');
    } else if (isNaN(cost)) {
        errors.push('Cost must be a number');
    } else if (cost < 0) {
        errors.push('Cost cannot be negative');
    }

    if (errors.length > 0) {
        return res.status(400).json({ 
            error: 'Validation failed', 
            details: errors 
        });
    }

    next();
};

module.exports = {
    validateChampion,
    validateItem
};