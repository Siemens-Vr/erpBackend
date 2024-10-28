const { Project, Phase, Deliverable, sequelize } = require('../models'); 


const createPhase = async (req, res) => {
  const { uuid } = req.params;
  const phases = req.body.phases;

  const transaction = await sequelize.transaction(); 

  try {
    // Find the project by UUID
    const project = await Project.findOne({ where: { uuid } }, { transaction });
    if (!project) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Project not found' });
    }

    // Loop through each phase and create it along with its deliverables within the transaction
    const createdPhases = await Promise.all(
      phases.map(async (phaseData) => {
        const { name, startDate, endDate, status, deliverables } = phaseData;

        // Create the phase associated with the project ID
        const phase = await Phase.create(
          {
            name,
            startDate,
            endDate,
            status,
            projectId: project.uuid,
          },
          { transaction }
        );

        // If deliverables are provided, create each associated with the phase ID
        if (deliverables && Array.isArray(deliverables)) {
          const createdDeliverables = await Promise.all(
            deliverables.map((deliverable) =>
              Deliverable.create(
                {
                  name: deliverable.name,
                  status: deliverable.status,
                  startDate: deliverable.startDate,
                  expectedFinish: deliverable.expectedFinish,
                  phaseId: phase.uuid,
                },
                { transaction }
              )
            )
          );
          phase.dataValues.deliverables = createdDeliverables; 
        }

        return phase;
      })
    );

    // Commit the transaction if all operations succeed
    await transaction.commit();
    res.status(201).json({ message: 'Phases and deliverables created successfully', phases: createdPhases });
  } catch (error) {
    // Rollback the transaction if any error occurs
    await transaction.rollback();
    res.status(500).json({ message: 'Failed to create phases and deliverables', error: error.message });
  }
};
  
  const getAllPhases = async (req, res) => {
    const { uuid } = req.params;
  
    try {
      // Find the project and associated phases
      const project = await Project.findOne({
        where: { uuid },
        include: [{ model: Phase, as: 'phases' }]
      });
  
      if (!project) return res.status(404).json({ message: 'Project not found' });
  
      res.status(200).json({ phases: project.phases });
    } catch (error) {
      res.status(500).json({ message: 'Failed to retrieve phases', error: error.message });
    }
  };
  

  const getPhaseById = async (req, res) => {
    const { uuid, phaseId } = req.params;
  
    try {
      // Find the project and specific phase
      const project = await Project.findOne({
        where: { uuid },
        include: [{ model: Phase, as: 'phases', where: { uuid: phaseId } }]
      });
  
      if (!project || !project.phases.length) return res.status(404).json({ message: 'Phase not found for this project' });
  
      res.status(200).json({ phase: project.phases[0] });
    } catch (error) {
      res.status(500).json({ message: 'Failed to retrieve phase', error: error.message });
    }
  };

  const updatePhase = async (req, res) => {
    const { uuid } = req.params; 
    const { phases } = req.body; 
  
    const transaction = await sequelize.transaction();
  
    try {
      // Find the project by UUID
      const project = await Project.findOne({ where: { uuid } });
      if (!project) {
        return res.status(404).json({ message: 'Project not found' });
      }
  
      // Loop through each phase to update
      for (const phaseData of phases) {
        const { phaseId, name, startDate, endDate, status, deliverables } = phaseData;
  
        // Find and update the phase
        const phase = await Phase.findOne({ where: { uuid: phaseId, projectId: project.uuid }, transaction });
        if (!phase) {
          await transaction.rollback();
          return res.status(404).json({ message: `Phase with id ${phaseId} not found` });
        }
  
        // Update phase details
        await phase.update({ name, startDate, endDate, status }, { transaction });
  
        // Check if deliverables are provided for the phase
        if (deliverables && deliverables.length > 0) {
          for (const deliverableData of deliverables) {
            const { deliverableId, name, status, startDate, expectedFinish } = deliverableData;
  
            // Find and update each deliverable
            const deliverable = await Deliverable.findOne({
              where: { uuid: deliverableId, phaseId: phase.uuid },
              transaction
            });
            if (!deliverable) {
              await transaction.rollback();
              return res.status(404).json({ message: `Deliverable with id ${deliverableId} not found` });
            }
  
            await deliverable.update({ name, status, startDate, expectedFinish }, { transaction });
          }
        }
      }
  
      // Commit the transaction if all updates succeed
      await transaction.commit();
      res.status(200).json({ message: 'Phases and deliverables updated successfully' });
    } catch (error) {
      // Rollback the transaction in case of any failure
      await transaction.rollback();
      res.status(500).json({ message: 'Failed to update phases and deliverables', error: error.message });
    }
  };
  
  const deletePhase = async (req, res) => {
    const { uuid } = req.params;
    const { phaseId } = req.body;
  
    try {
      // Find the project
      const project = await Project.findOne({ where: { uuid } });
      if (!project) return res.status(404).json({ message: 'Project not found' });
  
      // Find and delete the phase
      const phase = await Phase.findOne({ where: { uuid: phaseId, projectId: project.uuid } });
      if (!phase) return res.status(404).json({ message: 'Phase not found' });
  
      await phase.destroy();
      res.status(200).json({ message: 'Phase deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete phase', error: error.message });
    }
  };

  module.exports = {
    createPhase,
    getAllPhases,
    getPhaseById,
    updatePhase,
    deletePhase
  };
  
  