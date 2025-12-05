const Board = require('../models/board');

const index = async (req, res) => {
    try {
        const boards = await Board.find({ user: req.user._id }).populate('user').sort({createdAt: 'desc'});
        res.status(200).json(boards);
    } catch(err) {
        console.log(err);
        res.status(400).json(err);
    }
};

const show = async (req, res) => {
    try {
        const board = await Board.findById(req.params.id).populate({
            path: 'lists',
            populate: { 
                path: 'cards' 
            }
        }).populate('user');
        res.status(200).json(board);
    } catch(err) {
        res.status(400).json(err);
    }
};

const create = async (req, res) => {
    try {
        const board = await Board.create({...req.body, user: req.user._id});
        res.status(201).json(await board.populate('user'));
    } catch(err) {
        res.status(400).json(err);
    }
};

const deleteBoard = async (req, res) => {
    try {
        await Board.deleteOne({_id: req.body.boardId});
        res.json(true);
    } catch(err) {
        res.status(400).json(err);
    }
}

const update = async (req, res) => {
    try {
        const board = await Board.findByIdAndUpdate(req.params.id, req.body);
        res.status(200).json(board);
    }
    catch(err) {
        res.status(400).json(err);
    }
}

module.exports = {
    create,
    index,
    show,
    delete: deleteBoard,
    update
};