const List = require('../models/list');
const Board = require('../models/board');

const index = async (req, res) => {
    try {
        const lists = await List.find({})
        .populate('board')
        .populate('cards')
        .sort({createdAt: 'desc'});
        console.log(lists);
        res.status(200).json(lists);
    } catch(err) {
        console.log(err);
        res.status(400).json(err);
    }
};

const create = async (req, res) => {
    try {
        const newList = await List.create({
            title: req.body.title,
            board: req.body.board
        });

        // Get the ObjectId of the newly created list
        const listId = newList._id;

        // Update the board document by pushing the listId into board.lists
        await Board.findByIdAndUpdate(req.body.board, {
            $push: { lists: listId }
        });
        //console.log(list);
        res.send({ message: 'List created and added to board successfully!' });
    } catch(err) {
        console.log(err);
        res.status(400).json(err);
    }
};

const deleteList = async (req, res) => {
    try {
        await List.deleteOne({_id: req.body.listId});
        res.json(true);
    } catch(err) {
        res.status(400).json(err);
    }
};

module.exports = {
    create,
    index,
    delete: deleteList
};