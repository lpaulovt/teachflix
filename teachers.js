const fs = require('fs')
const data = require('./data.json')
const {age, graduation, date} = require('./utils')
const Intl = require('Intl')

//CREATE

exports.post = function(req, res){
    const keys = Object.keys(req.body)
    
    for(key of keys){
        if(req.body[key] ==""){
            return res.send("Preencha todos os campos!")
        }
    }

    let {avatar_url, name, birth, escolaridade, classes, area} = req.body

    const id = Number(data.teachers.length + 1)
    const created_at = Date.now();
    birth = Date.parse(birth)

    data.teachers.push({
        id,
        avatar_url,
        name,
        birth,
        escolaridade,
        classes,
        area,
        created_at
    })


    fs.writeFile('data.json', JSON.stringify(data, null, 4), function(err){
        if(err){
            return res.send("File write error!")
        }
        return res.redirect("/teachers")
    })
}

//SHOW

exports.show = function(req, res){
    const {id} = req.params

    const foundTeacher = data.teachers.find(function(teacher){
        return teacher.id == id
    })

    if (!foundTeacher) return res.send("Teacher not found!") 

    const teacher = {
        ...foundTeacher,
        age:age(foundTeacher.birth),
        area: foundTeacher.area.split(","),
        created_at: new Intl.DateTimeFormat('pt-Br').format(foundTeacher.created_at)
    }

    return res.render('teachers/show', {teacher})
}

//EDIT

exports.edit = function(req, res){
    const {id} = req.params

    const foundTeacher = data.teachers.find(function(teacher){
        return  teacher.id == id
    })

    if (!foundTeacher) return res.send("Teacher not found!") 

    const teacher = {
        ...foundTeacher,
        escolaridade: graduation(foundTeacher.escolaridade),
        birth: date(foundTeacher.birth)
    }

    res.render('teachers/edit', {teacher})
}