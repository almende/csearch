var express = require('express');
var projectController = require('../controllers/projectController');
var router = express.Router();



/* GET home page. */
router.get('/:query', function(req, res, next) {
    let query = req.params.query;
    console.log('calling project controller with query: '+query);

    global.projectsBuilt.then(function(list){
        let sublist = projectController.project_list(query, list);
        res.render('project_list',{query: query, title: 'Project List', project_list: sublist})
    });
});

router.get('/details/:rcn', function(req,res, next){
    let rcn = req.params.rcn;
    console.log('get one project matching '+rcn);
    global.projectsBuilt.then(function (list){
        let sublist = projectController.project_details(rcn, list);
        console.log('sublist created ');
        console.log(sublist);
        res.render('project_details', {title: 'Project Details', project: sublist[0]})
    });
});

module.exports = router;
