const Board = require('../models/Board');
const { getMemoryStoreStatus } = require('../config/db');
const { initialBoard } = require('../utils/seedData');

let memoryBoardStore = { ...initialBoard };

exports.getBoard = async (req, res) => {
  try {
    if (getMemoryStoreStatus()) {
      return res.json(memoryBoardStore);
    }
    let board = await Board.findOne({ boardId: 'global-hyper-mesh' });
    if (!board) {
      board = await Board.create(initialBoard);
      memoryBoardStore = board.toObject();
    }
    res.json(board);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving board state.' });
  }
};

exports.updateBoard = async (req, res) => {
  try {
    const updates = req.body;
    if (getMemoryStoreStatus()) {
      memoryBoardStore = { ...memoryBoardStore, ...updates, updatedAt: new Date() };
      return res.json(memoryBoardStore);
    }

    const updated = await Board.findOneAndUpdate(
      { boardId: 'global-hyper-mesh' },
      { ...updates, updatedAt: Date.now() },
      { new: true, upsert: true }
    );
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Error updating board state.' });
  }
};
