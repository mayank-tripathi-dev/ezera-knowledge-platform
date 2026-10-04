const Card = require('../models/Card');
const { getMemoryStoreStatus } = require('../config/db');
const { initialCards } = require('../utils/seedData');

// In-memory cards store initialized with seed dataset
let memoryCardsStore = [...initialCards];

exports.getAllCards = async (req, res) => {
  try {
    if (getMemoryStoreStatus()) {
      return res.json(memoryCardsStore);
    }
    let cards = await Card.find({});
    if (!cards || cards.length === 0) {
      cards = await Card.insertMany(initialCards);
      memoryCardsStore = cards.map(c => c.toObject());
    }
    res.json(cards);
  } catch (error) {
    console.error('Error fetching cards:', error);
    res.status(500).json({ message: 'Error retrieving architecture cards.' });
  }
};

exports.createCard = async (req, res) => {
  try {
    const { title, category, status, statusType, nodeCode, description, tags, metrics, position, specifications } = req.body;
    
    const newNodeId = 'node-' + Date.now();
    const generatedCode = nodeCode || `ARCH // ${Math.floor(100 + Math.random() * 900)}`;

    const newCardData = {
      nodeId: newNodeId,
      nodeCode: generatedCode,
      title: title || 'New Architecture Component',
      category: category || 'Cloud Architecture',
      status: status || 'IN PRODUCTION',
      statusType: statusType || 'production',
      description: description || 'Enterprise solution topology card detailing modular infrastructure capabilities.',
      tags: tags && tags.length > 0 ? tags : ['#Architecture', '#Cloud'],
      metrics: metrics || [
        { label: 'AVAILABILITY', value: '99.99%', color: 'emerald' },
        { label: 'LATENCY', value: '< 10ms', color: 'cyan' }
      ],
      revision: `Rev: 1.00 • ${req.body.author || 'Architecture Team'}`,
      author: req.body.author || 'Enterprise Architect',
      position: position || { x: 300 + Math.floor(Math.random() * 200), y: 150 + Math.floor(Math.random() * 150) },
      dimensions: { width: 340, height: 280 },
      type: 'card',
      specifications: specifications || `# ${title}\n\nTechnical specification document for this architecture component.`
    };

    if (getMemoryStoreStatus()) {
      memoryCardsStore.push(newCardData);
      return res.status(201).json(newCardData);
    }

    const created = await Card.create(newCardData);
    res.status(201).json(created);
  } catch (error) {
    console.error('Error creating card:', error);
    res.status(500).json({ message: 'Error creating architecture card.' });
  }
};

exports.updateCard = async (req, res) => {
  try {
    const { nodeId } = req.params;
    const updates = req.body;

    if (getMemoryStoreStatus()) {
      const index = memoryCardsStore.findIndex(c => c.nodeId === nodeId);
      if (index === -1) return res.status(404).json({ message: 'Card not found' });
      memoryCardsStore[index] = { ...memoryCardsStore[index], ...updates, updatedAt: new Date() };
      return res.json(memoryCardsStore[index]);
    }

    const updated = await Card.findOneAndUpdate({ nodeId }, { ...updates, updatedAt: Date.now() }, { new: true });
    if (!updated) return res.status(404).json({ message: 'Card not found' });
    res.json(updated);
  } catch (error) {
    console.error('Error updating card:', error);
    res.status(500).json({ message: 'Error updating card.' });
  }
};

exports.updateCardPosition = async (req, res) => {
  try {
    const { nodeId } = req.params;
    const { position } = req.body;

    if (getMemoryStoreStatus()) {
      const card = memoryCardsStore.find(c => c.nodeId === nodeId);
      if (card) {
        card.position = position;
      }
      return res.json({ success: true, nodeId, position });
    }

    await Card.findOneAndUpdate({ nodeId }, { position, updatedAt: Date.now() });
    res.json({ success: true, nodeId, position });
  } catch (error) {
    res.status(500).json({ message: 'Error updating card position.' });
  }
};

exports.deleteCard = async (req, res) => {
  try {
    const { nodeId } = req.params;

    if (getMemoryStoreStatus()) {
      memoryCardsStore = memoryCardsStore.filter(c => c.nodeId !== nodeId);
      return res.json({ success: true, nodeId });
    }

    await Card.findOneAndDelete({ nodeId });
    res.json({ success: true, nodeId });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting card.' });
  }
};

exports.autoArrangeCards = async (req, res) => {
  try {
    const cards = getMemoryStoreStatus() ? memoryCardsStore : await Card.find({});
    
    // Grid layout auto-arrange logic
    const cols = 3;
    const startX = 80;
    const startY = 140;
    const gapX = 520;
    const gapY = 420;

    const rearranged = cards.map((card, index) => {
      const row = Math.floor(index / cols);
      const col = index % cols;
      const newPos = {
        x: startX + col * gapX,
        y: startY + row * gapY
      };
      card.position = newPos;
      return card;
    });

    if (!getMemoryStoreStatus()) {
      for (const card of rearranged) {
        await Card.findOneAndUpdate({ nodeId: card.nodeId }, { position: card.position });
      }
    } else {
      memoryCardsStore = rearranged;
    }

    res.json({ success: true, cards: rearranged });
  } catch (error) {
    console.error('Error auto arranging cards:', error);
    res.status(500).json({ message: 'Error auto-arranging cards.' });
  }
};

exports.resetBoardCards = async (req, res) => {
  try {
    if (getMemoryStoreStatus()) {
      memoryCardsStore = [...initialCards];
      return res.json(memoryCardsStore);
    }

    await Card.deleteMany({});
    const cards = await Card.insertMany(initialCards);
    memoryCardsStore = cards.map(c => c.toObject());
    res.json(cards);
  } catch (error) {
    console.error('Reset Cards Error:', error);
    res.status(500).json({ message: 'Failed to reset spatial grid.' });
  }
};
