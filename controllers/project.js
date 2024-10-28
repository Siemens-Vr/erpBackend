const { Project, Assignee, Phase, Deliverable, sequelize } = require('../models'); 
const path = require('path');

const createProject = async (req, res) => {
  const { name, description, status, budget, funding, startDate, endDate, assignees, phases } = req.body;

  const transaction = await sequelize.transaction(); 

  try {
    // Get file path from multer (if file is uploaded)
    const documentPath = req.file ? req.file.path : null;

    // Step 1: Create the project with document path if provided
    const project = await Project.create(
      {
        name,
        description,
        status,
        budget,
        funding,
        startDate,
        endDate,
        documentPath, 
      },
      { transaction }
    );

    // Step 2: Create Assignees if provided
    if (assignees && assignees.length > 0) {
      const assigneeData = assignees.map((assignee) => ({
        ...assignee,
        projectId: project.uuid,
      }));

      await Assignee.bulkCreate(assigneeData, { transaction });
    }

    // Step 3: Create Phases and Deliverables if provided
    if (phases && phases.length > 0) {
      for (const phase of phases) {
        const phaseRecord = await Phase.create(
          {
            name: phase.name,
            startDate: phase.startDate,
            endDate: phase.endDate,
            status: phase.status,
            projectId: project.uuid,
          },
          { transaction }
        );

        // Step 4: Create Deliverables for each Phase if provided
        if (phase.deliverables && phase.deliverables.length > 0) {
          const deliverableData = phase.deliverables.map((deliverable) => ({
            ...deliverable,
            phaseId: phaseRecord.uuid,
          }));

          await Deliverable.bulkCreate(deliverableData, { transaction });
        }
      }
    }

    // Commit the transaction
    await transaction.commit();
    res.status(201).json({ message: 'Project created successfully', project });
  } catch (error) {
    // Rollback the transaction if any error occurs
    await transaction.rollback();
    res.status(500).json({ message: 'Failed to create project', error: error.message });
  }
};

const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.findAll({
      include: [
        {
          model: Assignee,
          as: 'assignees',
        },
        {
          model: Phase,
          as: 'phases',
          include: [
            {
              model: Deliverable,
              as: 'deliverables',
            },
          ],
        },
      ],
    });

    // Process each project to get just the document filename
    const processedProjects = projects.map((project) => {
      const documentName = project.documentPath
        ? project.documentPath.startsWith('/') 
          ? project.documentPath.slice(1).split('/').pop() 
          : project.documentPath.split('/').pop()
        : null;

      return {
        ...project.toJSON(),
        documentName, 
      };
    });

    res.status(200).json(processedProjects);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve projects', error: error.message });
  }
};

const getProjectById = async (req, res) => {
  const { uuid} = req.params;

  try {
    const project = await Project.findOne({
      where: { uuid },
      include: [
        {
          model: Assignee,
          as: 'assignees',
        },
        {
          model: Phase,
          as: 'phases',
          include: [
            {
              model: Deliverable,
              as: 'deliverables',
            },
          ],
        },
      ],
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Extract filename from documentPath
    const documentName = project.documentPath
      ? project.documentPath.startsWith('/') 
        ? project.documentPath.slice(1).split('/').pop() 
        : project.documentPath.split('/').pop()
      : null;

    // Add document name as a separate field
    const processedProject = {
      ...project.toJSON(),
      documentName,
    };

    res.status(200).json(processedProject);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve project', error: error.message });
  }
};
const updateProject = async (req, res) => {
  const { uuid } = req.params;
  const { name, description, status, budget, funding, startDate, endDate, assignees, phases } = req.body;

  const transaction = await sequelize.transaction();
  try {
    // Step 1: Update the Project
    const project = await Project.findByPk(uuid);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Update project fields
    await project.update({
      name,
      description,
      status,
      budget,
      funding,
      startDate,
      endDate,
      documentPath: req.file ? req.file.path : project.documentPath,
    }, { transaction });

    // Step 2: Update Assignees if provided
    if (assignees) {
      for (const assignee of assignees) {
        if (assignee.uuid) {
          // Update existing assignee
          await Assignee.update(assignee, {
            where: { uuid: assignee.uuid, projectId: uuid },
            transaction,
          });
        } else {
          // Add new assignee
          await Assignee.create({
            ...assignee,
            projectId: uuid,
          }, { transaction });
        }
      }
    }

    // Step 3: Update Phases if provided
    if (phases) {
      for (const phase of phases) {
        let phaseRecord;
        if (phase.uuid) {
          // Check if the phase exists for this project
          phaseRecord = await Phase.findOne({
            where: { uuid: phase.uuid, projectId: uuid },
            transaction,
          });
          if (!phaseRecord) {
            return res.status(404).json({ message: `Phase with uuid ${phase.uuid} not found` });
          }
          await phaseRecord.update(phase, { transaction });
        } else {
          // Add new phase
          phaseRecord = await Phase.create({
            ...phase,
            projectId: uuid,
          }, { transaction });
        }

        // Step 4: Update or Create Deliverables if provided
        if (phase.deliverables) {
          for (const deliverable of phase.deliverables) {
            if (deliverable.uuid) {
              // Ensure deliverable is associated with an existing phase
              const existingDeliverable = await Deliverable.findOne({
                where: { uuid: deliverable.uuid, phaseId: phaseRecord.uuid },
                transaction,
              });
              if (!existingDeliverable) {
                return res.status(404).json({ message: `Deliverable with uuid ${deliverable.uuid} not found for the phase ${phaseRecord.uuid}` });
              }
              await existingDeliverable.update(deliverable, { transaction });
            } else {
              // Add new deliverable to the existing phase
              await Deliverable.create({
                ...deliverable,
                phaseId: phaseRecord.uuid,
              }, { transaction });
            }
          }
        }
      }
    }

    // Commit the transaction
    await transaction.commit();
    res.status(200).json({ message: 'Project updated successfully', project });
  } catch (error) {
    // Rollback the transaction if any error occurs
    await transaction.rollback();
    res.status(500).json({ message: 'Failed to update project', error: error.message });
  }
};


const deleteProject = async (req, res) => {
  const { uuid } = req.params;
  const transaction = await sequelize.transaction();

  try {
    // Step 1: Find the project by UUID
    const project = await Project.findOne({ where: { uuid } });
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Step 2: Fetch associated phases for deletion of deliverables
    const phases = await Phase.findAll({ where: { projectId: project.uuid } });
    const phaseIds = phases.map(phase => phase.uuid);

    // Step 3: Delete associated deliverables
    await Deliverable.destroy({ where: { phaseId: phaseIds }, transaction });

    // Step 4: Delete associated phases
    await Phase.destroy({ where: { projectId: project.uuid }, transaction });

    // Step 5: Delete associated assignees
    await Assignee.destroy({ where: { projectId: project.uuid }, transaction });

    // Step 6: Delete the project itself
    await project.destroy({ transaction });

    // Step 7: Delete the document from the uploads folder
    if (project.documentPath) {
      const filePath = path.join(__dirname, '../uploads', project.documentPath);
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error('Error deleting the file:', err);
        }
      });
    }

    // Commit the transaction
    await transaction.commit();
    res.status(200).json({ message: 'Project and associated records deleted successfully' });
  } catch (error) {
    // Rollback the transaction if any error occurs
    await transaction.rollback();
    res.status(500).json({ message: 'Failed to delete project', error: error.message });
  }
};


module.exports = { createProject, getProjectById, getAllProjects, updateProject, deleteProject };
