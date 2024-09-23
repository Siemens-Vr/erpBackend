
const {  sequelize, Cohort, Level, Student, StudentLevels, Facilitator, LevelFacilitators } = require('../models');
const Sequelize = require('sequelize'); // Import Sequelize
const validateCohort = require('../validation/cohortValidation');
const Joi = require('joi');

module.exports.getCohorts = async (req, res) => {
  let cohorts = {};

  try {
    cohorts = await Cohort.findAll({});
    res.status(200).json(cohorts);
  } catch (error) {
    console.log(error);
  }
};

module.exports.createCohort = async (req, res) => {
  const { error, value } = validateCohort(req.body);
  if (error) {
    return res.status(400).json({
      message: "Validation failed",
      errors: error.details.map(detail => ({
        field: detail.context.key,
        message: detail.message
      }))
    });
  }


  try {
    const createStudent = await Cohort.create(value);
    res.status(200).json(createStudent);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports.getCohortById = async (req, res) => {
  const { error, value: id } = uuidSchema.validate(req.params.id);

  if (error) {
    return res.status(400).json({ message: "Invalid UUID format" });
  }
  try {
    const cohort = await Cohort.findOne({ where: { uuid: id } });

    if (!cohort) {
      return res.status(404).json({ message: 'Cohort not found' });
    }

    const levels = await Level.findAll({ where: { cohortId: cohort.uuid } });

    if (levels.length === 0) {
      return res.status(404).json({ message: 'No levels found for this cohort' });
    }

    const cohortData = await Promise.all(
      levels.map(async (level) => {
        const levelData = {
          id: level.id,
          uuid: level.uuid,
          levelName: level.levelName,
          startDate: level.startDate,
          endDate: level.endDate,
          exam_dates:level.exam_dates,
          exam_quotation_number:level.exam_quotation_number,
          createdAt: level.createdAt,
          updatedAt: level.updatedAt,
          cohortId: level.cohortId,
          students: [],
          facilitators: [],
        };

        const students = await StudentLevels.findAll({ where: { levelId: level.uuid } });
        const studentUuids = students.map((student) => student.studentId);
        const studentsInfo = await Student.findAll({ where: { uuid: studentUuids } });

        const facilitators = await LevelFacilitators.findAll({ where: { levelId: level.uuid } });
        const facilitatorUuids = facilitators.map((facilitator) => facilitator.facilitatorId);
        const facilitatorInfo = await Facilitator.findAll({ where: { uuid: facilitatorUuids } });

        levelData.students = studentsInfo;
        levelData.facilitators = facilitatorInfo;

        return levelData;
      })
    );

    const response = {
      cohorts: {
        id: cohort.id,
        uuid: cohort.uuid,
        cohortName: cohort.cohortName,
        startDate: cohort.startDate,
        endDate: cohort.endDate,
        createdAt: cohort.createdAt,
        updatedAt: cohort.updatedAt,
      },
      levels: cohortData,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};



module.exports.updateCohort = async (req, res) => {
  const { error: uuidError, value: id } = uuidSchema.validate(req.params.id);

  if (uuidError) {
    return res.status(400).json({ message: "Invalid UUID format" });
  }

  const { error, value } = validateCohort(req.body);

  if (error) {
    return res.status(400).json({
      message: "Validation failed",
      errors: error.details.map(detail => ({
        field: detail.context.key,
        message: detail.message
      }))
    });
  }

  try {
    const cohort = await Cohort.findOne({ where: { uuid: id } });

    if (!cohort) {
      return res.status(404).json({ message: 'Cohort not found' });
    }

    const [updatedRows] = await Cohort.update(value, { where: { uuid: id } });

    if (updatedRows === 0) {
      return res.status(400).json({ message: "Cohort not updated" });
    }

    const updatedCohort = await Cohort.findOne({ where: { uuid: id } });
    res.status(200).json({ message: "Cohort updated successfully", cohort: updatedCohort });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports.deleteCohort = async (req, res) => {
  const { error, value: id } = uuidSchema.validate(req.params.id);

  if (error) {
    return res.status(400).json({ message: "Invalid UUID format" });
  }

  try {
    const deletedRows = await Cohort.destroy({ where: { uuid: id } });

    if (deletedRows === 0) {
      return res.status(404).json({ message: "Cohort not found" });
    }

    res.status(200).json({ message: "Cohort successfully deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};