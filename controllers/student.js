const {Student, StudentLevels, Cohort, Level} = require('../models');
const { sequelize } = require('../models');  // Adjust the path according to your project structure


const Joi = require('joi')
const { Op } = require('sequelize');
const validateStudent = require('../validation/studentsValidation');


const schema = Joi.object({

  email: Joi.string().email().required(),

})


module.exports.getStudents = async (req, res) =>{
  const name = req.query.q;
  const pageAsNumber = Number.parseInt(req.query.page);
  // console.log(pageAsNumber)

  let page = 0;
  if(!Number.isNaN(pageAsNumber) && pageAsNumber> 0 ){
    page = pageAsNumber;
  }

  console.log(page)
  let size = 10;

  try {
    if (name) {
      const students = await Student.findAndCountAll({
        where: {
          regNo: {
            [Op.iLike]: `%${name}%`  // Use Op.iLike for case-insensitive search
          }
        }
      });
      // console.log(students)
      res.status(200).json({
        content :students.rows,
        count: students.count});
    } else {
      const students = await Student.findAndCountAll({
        order: [['createdAt', 'DESC']],
        limit: size,
        offset: page * size

      });
      res.status(200).json({
        content :students.rows,
        count: students.count,
        totalPages: Math.ceil( students.count  / size)

      });
    }
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }

  }

  module.exports.createStudent = async (req, res) => {
    console.log(req.body)
    const { error } = validateStudent(req.body);
    if (error) {
      return res.status(400).json({ error: error.details.map(err => err.message) });
    }
    try {
      await sequelize.transaction(async (t) => {
        // Create student logic
        const student = await Student.create(req.body, { transaction: t });
  
        // Add to StudentLevels table
        await StudentLevels.create({
          studentId: student.uuid,
          levelId: req.body.level,  // Assuming levelId is provided in the request
        }, { transaction: t });
  
        res.status(201).json({ message: 'Student created successfully', student });
      });
    } catch (error) {
      console.error('Error creating student:', error);
      res.status(500).json({ message: 'Failed to create student', error });
    }
  };

module.exports.addStudentLevel = async(req, res) =>{
  console.log(req.body)

  const { studentId, levelId} = req.body

  try{

    await StudentLevels.create({ studentId, levelId})

     res.status(200).json({message : "student cerated successfully"})

  }catch(error){
    res.status(500).json({error:error.message})

  }
}

module.exports.getStudentById = async (req, res) => {
  const { id } = req.params;
  try {
    // Fetch the student along with their associated levels and cohorts
    const student = await Student.findOne({
      where: { uuid: id },
      include: [
        {
          model: Level, // Include the Level model directly
          as: 'levels', // Alias for the relationship
          through: {
            attributes: [], // Exclude the StudentLevels data
          },
          include: [
            {
              model: Cohort,
              // as: 'cohort', 
            },
          ],
        },
      ],
    });

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.status(200).json(student);
    console.log(student);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


module.exports.search = async (req, res) => {
    const {  idNo, name } = req.body;
    console.log(regNo, idNo, name);
    let students = null;
    try {
      if (regNo) {
        students = await Staff.findAll({
          where: {
            regNo
          },
        });
      } else if (id) {
        students = await Student.findAll({
          where: {
            idNo
          },
        });
      } else if (name) {
        students = await Student.findAll({
          where: {
            name: { [Op.like]: `%${name}%` },
          },
        });
      }
  
      if (!students || students.length === 0) {
        return res.status(404).json({ error: 'Student not found' });
      }
  
      res.status(200).json(students);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  module.exports.updateStudent = async (req, res) => {
    const { id} = req.params
    const {firstName, lastName, email, phone ,feePayment } = req.body

    try{
      const student = await Student.findOne({where: {uuid: id}});
      // res.json(student)
      const updateStudent = await Student.update(
        {
        firstName: firstName || student.firstName,
        lastName: lastName || student.lastName,
        email: email || student.email,
        phone: phone || student.phone,
        feePayment: feePayment || student.feePayment 
        },
        {
          where: {uuid: id}

      })
      if(!updateStudent){
        res.status(400).json({message: "Bad request.Try again later"})
      }

      res.status(200).json({message: "Student information successfully updated"})
    }
  catch(error){
    res.status(500).json({error:error.message})
  }
}

module.exports.deleteStudent = async(req, res)=>{
  const {id} = req.params

  try{

      const deleteStudent  = await Student.destroy({where: {uuid :id}})
      if(deleteStudent){
        res.status(200).json({message: "Student record succcessfully deleted"})
      }

    

  }catch(errror){
    res.status(500).json({error: error.message})
  }

}