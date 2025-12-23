const db = require('../database');

const getAllItems = (req, res) => {
    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;
    const search = req.query.search || '';
    const category = req.query.category || '';
    const sortBy = req.query.sort || 'name';
    const order = req.query.order === 'desc' ? 'DESC' : 'ASC';

    let query = 'SELECT * FROM items WHERE 1=1';
    let countQuery = 'SELECT COUNT(*) as total FROM items WHERE 1=1';
    const params = [];

    // Search op meerdere velden
    if (search) {
        query += ' AND (name LIKE ? OR description LIKE ?)';
        countQuery += ' AND (name LIKE ? OR description LIKE ?)';
        params.push(`%${search}%`, `%${search}%`);
    }

    // Filter op category
    if (category) {
        query += ' AND category = ?';
        countQuery += ' AND category = ?';
        params.push(category);
    }

    // Sorteren
    query += ` ORDER BY ${sortBy} ${order}`;

    // Limit en offset toevoegen
    query += ' LIMIT ? OFFSET ?';
    params.push(limit, offset);

    // Totaal aantal items ophalen
    db.get(countQuery, params.slice(0, -2), (err, countRow) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        // Items ophalen
        db.all(query, params, (err, rows) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            res.json({
                data: rows,
                pagination: {
                    total: countRow.total,
                    limit: limit,
                    offset: offset,
                    total_pages: Math.ceil(countRow.total / limit)
                }
            });
        });
    });
};

// GET één item op ID
const getItemById = (req, res) => {
    const id = req.params.id;

    db.get('SELECT * FROM items WHERE id = ?', [id], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!row) {
            return res.status(404).json({ error: 'Item not found' });
        }
        res.json(row);
    });
};

// POST nieuw item
const createItem = (req, res) => {
    const { name, description, cost, category, stats } = req.body;

    const query = `
        INSERT INTO items (name, description, cost, category, stats)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.run(query, [name, description, cost, category, stats], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({
            message: 'Item created successfully',
            id: this.lastID
        });
    });
};

// PUT update item
const updateItem = (req, res) => {
    const id = req.params.id;
    const { name, description, cost, category, stats } = req.body;

    const query = `
        UPDATE items 
        SET name = ?, description = ?, cost = ?, category = ?, stats = ?
        WHERE id = ?
    `;

    db.run(query, [name, description, cost, category, stats, id], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Item not found' });
        }
        res.json({ message: 'Item updated successfully' });
    });
};

// DELETE item
const deleteItem = (req, res) => {
    const id = req.params.id;

    db.run('DELETE FROM items WHERE id = ?', [id], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Item not found' });
        }
        res.json({ message: 'Item deleted successfully' });
    });
};

module.exports = {
    getAllItems,
    getItemById,
    createItem,
    updateItem,
    deleteItem
};