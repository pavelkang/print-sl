Print @ ScottyLabs
==================
#### How-to
Run `npm install` to install dependencies, then run `node bin/www`
Also, you should include these in *app.js*:
```javascript
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public/bower_components')));
app.use(express.static(path.join(__dirname, 'public/javascripts')));
app.use(express.static(path.join(__dirname, 'public/stylesheets')));
app.use(express.static(path.join(__dirname, 'views')));
```
to make sure the front-end libraries are included correctly.
#### Introduction
This is a web app based based on [Polymer](https://www.polymer-project.org). It allows CMU students to print files from Google Drive, Dropbox, or local files on their computers or mobile devices.

#### Interface
```javascript
router.post('/api/upload', function(req, res) {
  console.log(req.body);
  console.log(req.files);
  /*
    if error is empty string, notify the user success. Otherwise, notify failure
  */
  res.send("");
})
```
- To get Andrew ID, use `req.body.andrew`. This is guaranteed to be *non-empty*.
- To get the file, use `req.files`. It is guaranteed to contain *one* file object. If `req.files` is empty, you should install node module [multer](https://github.com/expressjs/multer) or [busboy](https://github.com/mscdex/busboy). Use `app.use(multer({dest : './uploads/'}));` to specify the directory where you want to store the file.

#### Problems
1. Should we support multiple files? That will complicate things and I don't think we should. Also, do we have a limit on the SIZE of the file? What file types from dropbox should we support? Currently it supports .pdf, .doc, and .docx.
2. I think it's a great idea if we support printing Google Docs directly. The code currently does not support this, but it won't take long for me to implement.
