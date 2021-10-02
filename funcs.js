const User = require('./models').User;
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

async function addUser(req, res){
    try{
        const {Email, firstName, lastName, password} = req.body;
        if(!Email||!firstName||!lastName||!password) throw new Error('Incorrect data');
        const exUser = await User.findOne({where: {email: Email}});
        if(exUser) throw new Error('User already exists');

        await User.create({
            email: Email,
            firstName: firstName,
            lastName: lastName,
            password: password
        })
        res.send(JSON.stringify(User.findOne({where: {email: Email}})));
    }
    catch(err){
        console.log(err);
        res.send(JSON.stringify(err.message));
    }
}
async function updUser(req, res)
{
    try{
        const {Email, firstName, lastName} = req.body;
        if(!Email || !firstName || !lastName) throw new Error('Incorrect Data')
        await User.update({
            firstName: firstName, lastName: lastName
        }, {where:{email: Email}});
        res.send(await User.findOne({where: {email: Email}}));
    }
    catch(err)
    {
        console.log(err);
        res.send(JSON.stringify(err.message));
    }
}
async function delUser(req, res)
{
    try{
        const {Email} = req.body;
        if(!Email) throw new Error('Incorrect data');

        const exUser = await User.findOne({where: {email: Email}});
        if(!exUser) throw new Error('User with such email dosen`t exist');

        await User.destroy({where:{email: Email}});
        res.send(await User.findOne({where: {email: Email}}));
    }
    catch(err){
        console.log(err);
        res.send(JSON.stringify(err.message));
    }
}
async function loadImage(req, res)
{
    try{
        const {Email} = req.body;
        if(!Email) throw new Error('Incorrect data');

        const image = req.file;
        if(!image) throw new Error('file not found');

        const exUser = await User.findOne({where: {email: Email}});
        if(!exUser) throw new Error('User with such email dosen`t exist');

        let dir = path.join(__dirname + '/images/');
        let imagePath = path.join(dir, image.originalname);
        await exUser.update({ image: imagePath });
        fs.writeFileSync(imagePath, image.buffer);  
        await exUser.save();
        res.send(await User.findOne({where: {email: Email}}));
    }
    catch(err)
    {
        console.log(err);
        res.send(JSON.stringify(err.message));
    }
}
async function genPdf(req, res){
    try{
    const {Email} = req.body;
    if(!Email) throw new Error('Incorrect data');

    const exUser = await User.findOne({where: {email: Email}});
    if(!exUser) throw new Error('User with such email dosen`t exist');

    let PDFDoc = new PDFDocument;
    PDFDoc.pipe(fs.createWriteStream('./pdfs/test.pdf'));
    PDFDoc.text(exUser.firstName);
    PDFDoc.text(exUser.lastName);
    PDFDoc.image(exUser.image);
    PDFDoc.end();
    
    const pdfFile = Buffer.from(fs.readFileSync('./pdfs/test.pdf'));
    exUser.pdf = pdfFile;
    await exUser.save();
    res.send(JSON.stringify(true));
    }
    catch(err)
    {
        res.send(JSON.stringify(err.message))
    }
    /*let imgBytes = '';
    exUser.image.includes(path.join(__dirname, '../images/')) 
      ? imgBytes = fs.readFileSync(exUser.image)
      : imgBytes = await fetch(exUser.image).then(res => res.arrayBuffer());
    let userImg = '';
    if (exUser.image.includes('.jpg'))
      userImg = await pdfDoc.embedJpg(imgBytes);
    if (exUser.image.includes('.png'))*/

}


module.exports = {addUser, updUser, delUser, loadImage, genPdf}