const Tag = require('../models/Tag');

const getAllTags = async (req, res) => {
    try {
        const tags = await Tag.find({ userId: req.user._id });
        res.status(200).json(tags);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const createTag = async (req, res) => {
    try {
        const { name, color, emoji, userId } = req.body;
        const tag = new Tag({ name, color, emoji, userId });
        const savedTag = await tag.save();
        res.status(201).json(savedTag);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const updateTag = async (req, res) => {
    try {
        const { name, color, emoji } = req.body;
        const update = {};
        if (name) update.name = name;
        if (color) update.color = color;
        if (emoji) update.emoji = emoji;

        const updatedTag = await Tag.findOneAndUpdate(
            { _id: req.params.id, userId: req.user._id },
            update,
            { new: true, runValidators: true }
        );

        if (!updatedTag) return res.status(404).json({ message: 'Tag not found or not yours.' });

        res.json(updatedTag);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const deleteTag = async (req, res) => {
    try {
        const deletedTag = await Tag.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
        if (!deletedTag) return res.status(404).json({ message: 'Tag not found or not yours.' });
        res.json({ message: 'Tag deleted successfully.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    getAllTags,
    createTag,
    updateTag,
    deleteTag
};