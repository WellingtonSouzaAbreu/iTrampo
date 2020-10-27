const fs = require('fs')

module.exports = app => {

    const multer = require('multer') // Interpretar o arquivo que vem do upload
    const storage = multer.diskStorage({ // Objeto para configurar a pasta de salvamento e o nome 
        destination: function (req, file, callback) {
            callback(null, './profile-images') // Pasta de destino
        },
        filename: function (req, file, callback) {
            callback(null, `${Date.now()}_${file.originalname}`)
        }
    })
    const upload = multer({ storage }).single('profile-image') // Nome do input(name) que vem como requisição

    const save = async (req, res) => {

        upload(req, res, err => {
            if (err) {
                return res.end('Ocorreu um Erro')
            }
            console.log(req.params.idUser)
            let file = req.file
            let idUser = req.params.idUser


            app.db('users')
                .select('profileImage')
                .where({ id: idUser })
                .first()
                .then(async profileImage => {
                    // console.log(profileImage)
                    if (profileImage != {}) {
                        console.log(profileImage.profileImage)
                        console.log('Já existe uma foto cadastrada!')

                        fs.unlink(`${__dirname}/../profile-images/${profileImage.profileImage}`, (err) => {
                            if (err) console.log(err)   // res.status('Erro ao salvar foto do perfil')
                            console.log('Arquivo deletado!')
                        })

                    } else {
                        console.log('Não há nenhuma foto cadastrada')
                    }
                })
                .then(async _ => {
                    console.log(req.file.fileName)
                    await app.db('users')
                        .where({ id: idUser })
                        .update({ profileImage: file.filename })
                        .then(rowsAfected => {
                            console.log(rowsAfected)
                            res.status(204).send() // End diz que finalizou o upload
                        })
                })



        })
    }

    const getById = async (req, res) => {
        await app.db('users')
            .select('profileImage')
            .where({ id: idUser })
            .then(fileName => res.status(200).send(fileName))
            .catch(err => res.status(500).send())
    }

    return { save/* , getById */ }

}