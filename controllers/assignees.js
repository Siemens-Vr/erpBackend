const { Assignee, Project, sequelize } = require('../models');

// Create Assignees
const createAssignee = async (req, res) => {
    const { uuid } = req.params;
    const { assignees } = req.body;

    const transaction = await sequelize.transaction();

    try {
        // Find the project by UUID
        const project = await Project.findOne({ where: { uuid } });
        if (!project) return res.status(404).json({ message: 'Project not found' });

        // Create Assignees
        const assigneeData = assignees.map(assignee => ({ ...assignee, projectId: project.uuid }));

        await Assignee.bulkCreate(assigneeData, { transaction });

        await transaction.commit();
        res.status(201).json({ message: 'Assignees created successfully' });
    } catch (error) {
        await transaction.rollback();
        res.status(500).json({ message: 'Failed to create assignees', error: error.message });
    }
};

// Get all Assignees
const getAllAssignees = async (req, res) => {
    const { uuid } = req.params;

    try {
        const project = await Project.findOne({ where: { uuid } });
        if (!project) return res.status(404).json({ message: 'Project not found' });

        const assignees = await Assignee.findAll({ where: { projectId: project.uuid } });
        res.status(200).json(assignees);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch assignees', error: error.message });
    }
};

// Get Assignee by ID
const getAssigneeById = async (req, res) => {
    const { uuid, assigneeId } = req.params;

    try {
        const project = await Project.findOne({ where: { uuid } });
        if (!project) return res.status(404).json({ message: 'Project not found' });

        const assignee = await Assignee.findOne({ where: { uuid: assigneeId, projectId: project.uuid } });
        if (!assignee) return res.status(404).json({ message: 'Assignee not found' });

        res.status(200).json(assignee);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch assignee', error: error.message });
    }
};

// Update Assignee
const updateAssignee = async (req, res) => {
    const { uuid ,assigneeId} = req.params;
    const { name, gender, access, role, dateJoined } = req.body;

    const transaction = await sequelize.transaction();

    try {
        const project = await Project.findOne({ where: { uuid } });
        if (!project) return res.status(404).json({ message: 'Project not found' });

        const assignee = await Assignee.findOne({ where: { uuid: assigneeId, projectId: project.uuid } });
        if (!assignee) return res.status(404).json({ message: 'Assignee not found' });

        await assignee.update({ name, gender, access, role, dateJoined }, { transaction });

        await transaction.commit();
        res.status(200).json({ message: 'Assignee updated successfully', assignee });
    } catch (error) {
        await transaction.rollback();
        res.status(500).json({ message: 'Failed to update assignee', error: error.message });
    }
};

// Delete Assignee
const deleteAssignee = async (req, res) => {
    const { uuid, assigneeId } = req.params;

    const transaction = await sequelize.transaction();

    try {
        const project = await Project.findOne({ where: { uuid } });
        if (!project) return res.status(404).json({ message: 'Project not found' });

        const assignee = await Assignee.findOne({ where: { uuid: assigneeId, projectId: project.uuid } });
        if (!assignee) return res.status(404).json({ message: 'Assignee not found' });

        await assignee.destroy({ transaction });

        await transaction.commit();
        res.status(200).json({ message: 'Assignee deleted successfully' });
    } catch (error) {
        await transaction.rollback();
        res.status(500).json({ message: 'Failed to delete assignee', error: error.message });
    }
};

module.exports = {
    createAssignee,
    getAllAssignees,
    getAssigneeById,
    updateAssignee,
    deleteAssignee
};
