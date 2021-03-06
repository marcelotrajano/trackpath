const express = require(`express`);
const router = express.Router();
const Project = require(`../models/Project`);

router.get(`/`, (req, res) => {
    Project.findAll(function(results) {
        res.render("project/project", { Projects: results });
    });
});

router.get(`/new`, (req, res) => {
    res.render("project/newProject");
});

router.post(`/new`, (req, res) => {
    var errors = [];

    if (!req.body.pName ||
        typeof req.body.pName === undefined ||
        req.body.pName == null
    ) {
        errors.push({ texto: "Project name required!" });
    }

    if (errors.length > 0) {
        res.render("project/newProject", {
            erros: errors,
        });
    } else {
        const newProject = {
            ID: req.body.ID,
            NameProject: req.body.pName,
            StartDate: req.body.startDate,
            EndDate: req.body.endDate,
            DescriptionProject: req.body.pDescription,
            StatusID: req.body.pPriority,
        };

        if (!newProject.ID ||
            newProject.ID === null ||
            newProject.ID === undefined
        ) {
            Project.create(newProject, function() {
                req.flash("success_msg", "Project added successfully!");
                res.redirect(`/project`);
            });
        } else {
            Project.update(newProject, function() {
                req.flash("success_msg", "Project modified successfully!");
                res.redirect(`/project`);
            });
        }
    }
});

router.get(`/edit/:id`, (req, res) => {
    console.log(req.params.id);
    Project.findByPK(req.params.id, function(result) {
        console.log(result);
        res.render("project/newProject", {
            ID: result.ID,
            NameProject: result.NameProject,
            StartDate: result.StartDate,
            EndDate: result.EndDate,
            StatusID: result.StatusID,
            DescriptionProject: result.DescriptionProject,
        });
    });
});

router.post(`/delete`, (req, res) => {
    console.log(req.body.ID)
    Project.remove(req.body.ID, function() {
        req.flash("error_msg", "Project has been deleted!");
        res.redirect(`/project`);   
    })        
});


module.exports = router;