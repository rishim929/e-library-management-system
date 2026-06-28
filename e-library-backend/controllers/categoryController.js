const db = require("../config/db");

// Get all categories
exports.getCategories = (req, res) => {
    const sql = "SELECT * FROM categories ORDER BY id DESC";

    db.query(sql, (err, result) => {
        if (err) return res.status(500).json(err);

        res.json(result);
    });
};

// Add category
exports.addCategory = (req, res) => {

    const {
        category_name,
        membership_level
    } = req.body;

    const sql =
        "INSERT INTO categories(category_name,membership_level) VALUES (?,?)";

    db.query(sql,
        [category_name, membership_level],
        (err, result) => {

            if (err)
                return res.status(500).json(err);

            res.json({
                message: "Category Added Successfully"
            });

        });

};

// Update category
exports.updateCategory = (req, res) => {

    const id = req.params.id;

    const {
        category_name,
        membership_level
    } = req.body;

    const sql =
        "UPDATE categories SET category_name=?, membership_level=? WHERE id=?";

    db.query(sql,
        [category_name, membership_level, id],
        (err) => {

            if (err)
                return res.status(500).json(err);

            res.json({
                message: "Category Updated Successfully"
            });

        });

};

// Delete category
exports.deleteCategory = (req, res) => {

    const id = req.params.id;

    const sql =
        "DELETE FROM categories WHERE id=?";

    db.query(sql,
        [id],
        (err) => {

            if (err)
                return res.status(500).json(err);

            res.json({
                message: "Category Deleted Successfully"
            });

        });

};