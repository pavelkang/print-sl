var CLIENT_ID = '27235072689-490srk3q63nvk5ui6a06hukhivsvvh1o.apps.googleusercontent.com';
var APIKEY = 'AIzaSyCcJs5-Gf22pmMCfA5DBQCReJ61h8qQxhM'
var oauthToken;
var FILE;
var LOCAL = false;
var APILOADED = false;
var FILENAME = "xx";

/* API has loaded */
function setApi() {
    APILOADED = true;
}

/* open google picker */
function openGdrive() {
    if (APILOADED) {
        onApiLoad();
    }
}

function onApiLoad() {
    gapi.load('auth', {
        'callback': onAuthApiLoad
    });
    gapi.load('picker');
};

function onAuthApiLoad() {
    window.gapi.auth.authorize({
        'client_id': CLIENT_ID,
        'scope': ['https://www.googleapis.com/auth/drive']
    }, handleAuthResult);
}

function handleAuthResult(authResult) {
    if (authResult && !authResult.error) {
        oauthToken = authResult.access_token;
        createPicker();
    }
}

function createPicker() {
    var picker = new google.picker.PickerBuilder()
    .addView(new google.picker.DocsUploadView())
    .addView(new google.picker.DocsView())
    .setOAuthToken(oauthToken)
    .setDeveloperKey(APIKEY)
    .setCallback(pickerCallback)
    .build();
    picker.setVisible(true);
}

/* Download file from google drive */
function downloadFile(file, callback, token) {
    if (file.downloadUrl) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', file.downloadUrl, true);
        xhr.responseType = "blob";
        xhr.setRequestHeader('Authorization', 'Bearer ' + token);
        xhr.onload = function() {
            callback(xhr.response);
        };
        xhr.onerror = function() {
            callback(null);
        };
        xhr.send();
    } else {
        callback(null);
    }
}

function googleCallback(data) {
    hideSpin();
    if (data) {
        LOCAL = false;
        notifyFileSelected();
        updateCard(FILENAME);
        FILE = data;
    } else {
        notifyError();
    }
}

/* TODO Google drive API supports three documentes. This handles one of them. */
function pickerCallback(data) {
    if (data.action == google.picker.Action.PICKED) {
        showSpin();
        gapi.client.request({
            'path': '/drive/v2/files/' + data.docs[0].id,
            'method': 'GET',
            'callback': function(responsejs, responsetxt) {
                FILENAME = responsejs.originalFilename;
                downloadFile(responsejs, googleCallback, oauthToken);
            }
        });
    }
}

window.onload = function() {
    /* local button */
    var fileInputEl = document.querySelector("file-input");
    var validFiles = [];
    fileInputEl.addEventListener("change",
    function(event) {
        validFiles = event.detail.valid;
        LOCAL = true;
    }
);
/* google drive & dropbox buttons */
var gdriveButton = document.getElementById("gdriveButton");
gdriveButton.addEventListener("click", openGdrive);
var dboxButton = document.getElementById("dboxButton");
dboxButton.addEventListener("click", function() {
    Dropbox.choose({
        success: function(files) {
            showSpin();
            var oReq = new XMLHttpRequest();
            var theFile = files[0];
            oReq.onload = function() {
                hideSpin();
                FILENAME = theFile.name;
                FILE = oReq.response;
                updateCard(theFile.name);
                LOCAL = false;
                notifyFileSelected();
            }
            oReq.onerror = function() {
                hideSpin();
                notifyError();
            }
            oReq.open("GET", theFile.link, true);
            oReq.responseType = "blob";
            oReq.send();
        },
        cancel: function() {},
        linkType: "direct", // or "direct"
        extensions: ['.pdf', '.doc', '.docx'],
    });
});
/* submit button AJAX */
var submitButton = document.getElementById("printer");
submitButton.onclick = function(event) {
    event.preventDefault();
    /* check ID */
    var andrewId = document.getElementById("andrew").value;
    if (!andrewId) {
        notifyNoId();
        return;
    }
    /* Local file */
    if (LOCAL) {
        showSpin();
        if (validFiles.length == 0) {
            notifyFileInvalid();
            return;
        }
        console.log(validFiles[0]);
        postForm(validFiles[0], validFiles[0].name, andrewId);
        return;
    }
    /* google drive or dropbox */
    if (!FILE) {
        notifyNoFile();
        return;
    }
    postForm(FILE, FILENAME, andrewId);
}
};

function postForm(fileToPost, nameOfFile, andrewId) {
    var formData = new FormData();
    formData.append("file", fileToPost, nameOfFile);
    formData.append("andrew", andrewId);
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/upload", true);
    xhr.onload = function() {
        hideSpin();
        if (xhr.status === 200) {
            if (xhr.responseText === "") {
                notifySuccess();
            } else {
                notifyError();
            }
        } else {
            notifyError();
        }
    };
    xhr.send(formData);
}

/* Update the card content to be the file information */
function updateCard(fileName) {
    var card = document.querySelector("#card div");
    var len = fileName.length;
    var fileNameLine = "File: " + fileName;
    card.innerHTML = fileNameLine;
}

/* show spinner */
function showSpin() {
    var spinner = document.querySelector("paper-spinner");
    spinner.style.display = "block";
}

function hideSpin() {
    var spinner = document.querySelector("paper-spinner");
    spinner.style.display = "";
}

/* Toast a message confirming selection */
function notifyFileSelected() {
    var toast = document.getElementById("toast");
    toast.show();
}

function notifyFileInvalid() {
    var toast = document.getElementById("toast1");
    toast.show();
}

function notifySuccess() {
    var toast = document.getElementById("toast2");
    toast.show();
}

function notifyError() {
    var toast = document.getElementById("toast3");
    toast.show();
}

function notifyNoId() {
    var toast = document.getElementById("toast4");
    toast.show();
}

function notifyNoFile() {
    var toast = document.getElementById("toast5");
    toast.show();
}
