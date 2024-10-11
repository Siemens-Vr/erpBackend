const { sequelize, Project, Member, ProjectFunding, Phase, Deliverable, Funder, PhaseBudget, BudgetItem } = require('../models');

module.exports.getProjects = async(req, res)=>{
    try{
        const projects = await Project.findAll()
        if(projects.length === 0){
            res.status(201).json("No projects found ")
        }

        res.status(201).json(projects)

    }catch(error){
        res.status(500).json(error.message)

    }
}
module.exports.createProject = async (req, res) => {
    const t = await sequelize.transaction();
  
    try {
      const {
        name,
        startDate,
        expectedCompletionDate,
        totalBudget,
        members,
        funding,
        phases
      } = req.body;
  
      // Create the project
      const project = await Project.create({
        name,
        startDate,
        expectedCompletionDate,
        totalBudget
      }, { transaction: t });
  
      // Associate members
      if (members && members.length > 0) {
        const memberInstances = await Promise.all(members.map(async (member) => {
          const [memberInstance] = await Member.findOrCreate({
            where: { email: member.email },
            defaults: member,
            transaction: t
          });
          return memberInstance;
        }));
  
        await project.addMembers(memberInstances, { transaction: t });
      }
  
      // Create funding entries
      if (funding && funding.length > 0) {
        await Promise.all(funding.map(async (fund) => {
          const [funderInstance] = await Funder.findOrCreate({
            where: { name: fund.funderName },
            defaults: { name: fund.funderName, contactInformation: fund.contactInformation },
            transaction: t
          });
  
          return ProjectFunding.create({
            projectId: project.id,
            funderId: funderInstance.id,
            totalAmountCommitted: fund.amount,
            amountDisbursedToDate: 0,
            remainingAmount: fund.amount
          }, { transaction: t });
        }));
      }
  
      // Create phases with deliverables and budgets
      if (phases && phases.length > 0) {
        await Promise.all(phases.map(async (phase) => {
          const createdPhase = await Phase.create({
            name: phase.name,
            startDate: phase.startDate,
            endDate: phase.endDate,
            status: phase.status,
            projectId: project.id
          }, { transaction: t });
  
          if (phase.deliverables && phase.deliverables.length > 0) {
            await Promise.all(phase.deliverables.map(deliverable =>
              Deliverable.create({
                name: deliverable.name,
                status: deliverable.status,
                phaseId: createdPhase.id
              }, { transaction: t })
            ));
          }
  
          if (phase.budget) {
            const phaseBudget = await PhaseBudget.create({
              phaseId: createdPhase.id,
              totalAmount: phase.budget.totalAmount,
              comments: phase.budget.comments
            }, { transaction: t });
  
            if (phase.budget.items && phase.budget.items.length > 0) {
              await Promise.all(phase.budget.items.map(item =>
                BudgetItem.create({
                  ...item,
                  phaseBudgetId: phaseBudget.id
                }, { transaction: t })
              ));
            }
          }
        }));
      }
  
      await t.commit();
  
      // Fetch the created project with all associations
      const createdProject = await Project.findByPk(project.id, {
        include: [
          { model: Member },
          { 
            model: ProjectFunding,
            include: [{ model: Funder }]
          },
          { 
            model: Phase,
            include: [
              { model: Deliverable },
              { 
                model: PhaseBudget,
                include: [{ model: BudgetItem }]
              }
            ]
          }
        ]
      });
  
      res.status(201).json(createdProject);
    } catch (error) {
      await t.rollback();
      res.status(400).json({ error: error.message });
    }
  };
  
    
  