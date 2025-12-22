const db = require('../database');

const getAllChampions = (req, res) => {
    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;
    const search = req.query.search || '';
    const role = req.query.role || '';
    const sortBy = req.query.sort || 'name';
    const order = req.query.order === 'desc' ? 'DESC' : 'ASC';

    let query = 'SELECT * FROM champions WHERE 1=1';
    let countQuery = 'SELECT COUNT(*) as total FROM champions WHERE 1=1';
    const params = [];

    // Search functionaliteit
    if (search) {
        query += ' AND (name LIKE ? OR title LIKE ?)';
        countQuery += ' AND (name LIKE ? OR title LIKE ?)';
        params.push(`%${search}%`, `%${search}%`);
    }

    // Filter op role
    if (role) {
        query += ' AND role = ?';
        countQuery += ' AND role = ?';
        params.push(role);
    }

    // Sortering
    query += ` ORDER BY ${sortBy} ${order}`;

    // Limit en offset
    query += ' LIMIT ? OFFSET ?';
    params.push(limit, offset);

    // Eerst totaal aantal ophalen
    db.get(countQuery, params.slice(0, -2), (err, countRow) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        // Dan de data ophalen
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

// GET één champion op ID
const getChampionById = (req, res) => {
    const id = req.params.id;

    db.get('SELECT * FROM champions WHERE id = ?', [id], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!row) {
            return res.status(404).json({ error: 'Champion not found' });
        }
        res.json(row);
    });
};

// POST nieuwe champion
const createChampion = (req, res) => {
    const { name, title, role, difficulty, release_date, lore } = req.body;

    const query = `
        INSERT INTO champions (name, title, role, difficulty, release_date, lore)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.run(query, [name, title, role, difficulty, release_date, lore], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({
            message: 'Champion created successfully',
            id: this.lastID
        });
    });
};

// PUT update champion
const updateChampion = (req, res) => {
    const id = req.params.id;
    const { name, title, role, difficulty, release_date, lore } = req.body;

    const query = `
        UPDATE champions 
        SET name = ?, title = ?, role = ?, difficulty = ?, release_date = ?, lore = ?
        WHERE id = ?
    `;

    db.run(query, [name, title, role, difficulty, release_date, lore, id], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Champion not found' });
        }
        res.json({ message: 'Champion updated successfully' });
    });
};

// DELETE champion
const deleteChampion = (req, res) => {
    const id = req.params.id;

    db.run('DELETE FROM champions WHERE id = ?', [id], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Champion not found' });
        }
        res.json({ message: 'Champion deleted successfully' });
    });
};

module.exports = {
    getAllChampions,
    getChampionById,
    createChampion,
    updateChampion,
    deleteChampion
};