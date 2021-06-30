const Contact = require('../models/ContactModel')

exports.index = (req, res) => {
    res.render('contact', {
        contact: {}
    })   
}

exports.register = async (req, res) => {
    try {
        const contact = new Contact(req.body)
        await contact.register()
        
        if(contact.errors.length > 0) {
            req.flash('errors', contact.errors)
            req.session.save(() => res.redirect('back'))
            return;    
        }

        req.flash('success', 'Contato registrado com sucesso!')
        req.session.save(() => res.redirect(`/contact/index/${contact.contact._id}`))
        return;
    } catch (err) {
        console.log(err)
        return res.render('404')
    }
}

exports.editIndex = async (req, res) => {
    if(!req.params.id) return res.render('404')
    
    const contact = await Contact.searchById(req.params.id)
    
    if(!contact) return res.render('404')

    res.render('contact', {contact: contact})
}

exports.edit = async function(req, res) {
    try {
        if(!req.params.id) return res.render('404')

        const contact = new Contact(req.body)
        await contact.edit(req.params.id)
    
        if(contact.errors.length > 0) {
            req.flash('errors', contact.errors)
            req.session.save(() => res.redirect('back'))
            return;    
        }
    
        req.flash('success', 'Contato editado com sucesso!')
        req.session.save(() => res.redirect(`/contact/index/${contact.contact._id}`))
        return;
    } catch (err) {
        console.log(err)
        res.render(404)
    }
}

exports.delete = async (req, res) => {
    if(!req.params.id) return res.render('404')
    
    const contact = await Contact.delete(req.params.id)
    if(!contact) return res.render('404')

    req.flash('success', 'Contato apagado com sucesso!')
    req.session.save(() => res.redirect(`back`))
    return;
}
