var CLIENT_ID = '27235072689-490srk3q63nvk5ui6a06hukhivsvvh1o.apps.googleusercontent.com';
var APIKEY = 'AIzaSyCcJs5-Gf22pmMCfA5DBQCReJ61h8qQxhM'
var oauthToken;
var APILOADED = false;
var FILE;
var LOCAL = false;

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
    xhr.open('GET', file.downloadUrl);
    xhr.setRequestHeader('Authorization', 'Bearer ' + token);
    xhr.onload = function() {
      callback(xhr.responseText);
    };
    xhr.onerror = function() {
      callback(null);
    };
    xhr.send();
  } else {
    callback(null);
  }
}

function printCall(data) {
  console.log("print call");
  if (data) {
    FILE = data;
    hideSpin();
  } else {
    console.log("Nothing");
  }
}

/* TODO handle more documents */
function pickerCallback(data) {
  if (data.action == google.picker.Action.PICKED) {
    var theFile = data.docs[0];
    gapi.client.request({
      'path': '/drive/v2/files/' + theFile.id,
      'method': 'GET',
      'callback': function(responsejs, responsetxt) {
        LOCAL = false;
        showSpin();
        notifyFileSelected();
        updateCard(responsejs.originalFilename);
        var downloadUrl = responsejs.downloadUrl;
        downloadFile(responsejs, printCall, oauthToken);
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
        LOCAL = false;
        showSpin();
        notifyFileSelected();
        fetchFile(files[0].link);
        updateCard(files[0].name);
      },
      cancel: function() {},
      linkType: "direct", // or "direct"
      extensions: ['.pdf', '.doc', '.docx'],
    });
  });
  /* submit button AJAX */
  var submitButton = document.getElementById("printer");
  var form = document.querySelector("form");
  submitButton.onclick = function(event) {
    form.submit();
  }
  form.onsubmit = function(event) {
    event.preventDefault();
    console.log(event);
    /* check ID */
    var andrewId = document.getElementById("andrew").value;
    if (!andrewId) {
      alert("Please enter your Andrew ID!");
      return ;
    }
    if (LOCAL) {
      showSpin();
      if (validFiles.length==0) {
        alert("File not valid!");
        return ;
      }
      var formData = new FormData();
      formData.append("file", validFiles[0], validFiles[0].name);
      formData.append("andrew", andrewId);
      console.log(formData)
      formData.append("username", "Groucho");
      var xhr = new XMLHttpRequest();
      xhr.open("POST", "/api/upload", true);
      xhr.onload = function () {
        hideSpin();
        if (xhr.status === 200) {
          console.log(xhr.responseText);
        } else {
          alert('An error occurred!');
        }
      };
      xhr.send(formData);
    }
  }
  /*
  submitButton.addEventListener("click", function() {
    var andrewId = document.getElementById("andrew").value;
    if (!andrewId) {
      alert("Please enter your Andrew ID!");
      return ;
    }
    if (!FILE && !LOCAL) {
      alert("Please select a file or wait for it to be uploaded!");
      return ;
    }
    console.log("Posting to server with id " + andrewId);
    if (LOCAL) {
      var form = document.querySelector("form");
      form.submit();
    } else {
      console.log("cloud!");

    }
  })*/
};

/* Toast a message confirming selection */
function notifyFileSelected() {
  var toast = document.getElementById("toast");
  toast.show();
}

/* Update the card content to be the file information */
function updateCard(fileName) {
  var card = document.querySelector("#card div");
  var len = fileName.length;
  /*
  if (len > 15) {
    fileName = "..." + fileName.slice(len-15, len);
  }*/
  var fileNameLine = "File: " + fileName;
  card.innerHTML = fileNameLine;
}

/* Fetches from a URL */
function fetchFile(link) {
  var oReq = new XMLHttpRequest();
  oReq.onload = function () {
    FILE = this.responseText;
    hideSpin();
  }
  oReq.open("GET", link, true);
  oReq.send();
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
