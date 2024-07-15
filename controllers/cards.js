const Card = require('../models/card');
const List = require('../models/list');

const addCard = async (req, res) => {
    try {
        const list = await List.findById(req.body.listId);
        if (!list) {
            console.log('List not found with id:', req.body.listId);
            return res.status(404).json({ message: 'List not found' });
        }

        const cardData = {
            title: req.body.title,
            description: req.body.description,
            priority: req.body.priority
        };
        const card = await Card.create(cardData);
        if (!card) {
            console.log('Failed to create card with data:', cardData);
            return res.status(500).json({ message: 'Failed to create card' });
        }

        list.cards.push(card);
        await list.save();
        res.status(201).json(card);
    } catch (err) {
        console.error('Error adding card:', err);
        res.status(400).json(err);
    }
};

const update = async (req, res) => {
    try {
        const card = await Card.findByIdAndUpdate(req.params.id, req.body);
        res.json(card);
    } catch (err) {
        console.error('Error updating card:', err);
        res.status(400).json(err);
    }
}


module.exports = {
    addCard,
    update
};