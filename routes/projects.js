const {Router} = require('express')
const router = Router()

const projectsController = require('../controllers/projects')

router.get('/', projectsController.getProjects)
router.post('/', projectsController.createProject)


module.exports = router