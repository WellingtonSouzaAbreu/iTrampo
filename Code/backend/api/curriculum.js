const fs = require('fs')

module.exports = app => {

    const multer = require('multer') // Interpretar o arquivo que vem do upload
    const storage = multer.diskStorage({ // Objeto para configurar a pasta de salvamento e o nome 
        destination: function (req, file, callback) {
            callback(null, './curriculum') // Pasta de destino
        },
        filename: function (req, file, callback) {
            callback(null, `${Date.now()}_${file.originalname}`)
        }
    })
    const upload = multer({ storage }).single('curriculum') // Nome do input(name) que vem como requisição

    const save = async (req, res) => {

        upload(req, res, err => {
            if (err) {
                return res.end('Ocorreu um Erro')
            }
            console.log(req.file)
            console.log(req.params.idUser)
            let file = req.file
            let idUser = req.params.idUser

            console.log('curriculum <<<<<<<<<<')

            app.db('users')
                .select('curriculum')
                .where({ id: idUser })
                .then(async curriculum => {
                    if (curriculum != []) {
                        console.log('Já existe um currículo cadastradado!')
                        curriculum = curriculum[0].curriculum

                        fs.unlink(`${__dirname}/../curriculum/${curriculum}`, (err) => {
                            if (err) res.status('Erro ao salvar currículo!')
                            console.log('Arquivo deletado!')
                        })

                    } else {
                        console.log('Não há nenhuma foto cadastrada')
                    }
                })
                .then(async _ => {
                    await app.db('users')
                        .where({ id: idUser })
                        .update({ curriculum: file.filename })
                        .then(fileName => {
                            console.log(fileName)
                            res.status(204).send() // End diz que finalizou o upload
                        })
                })
        })
    }

    const getById = async (req, res) => {
        console.log('get by idd')
        await app.db('users')
            .select('profileImage')
            .where({ id: idUser })
            .then(fileName => res.status(200).send(fileName))
            .catch(err => res.status(500).send())
    }

    return { save/* , getById */ }

}