// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

const MIN_PASSPHRASE_LEN = 8;
let logger = chrome.extension.getBackgroundPage().console;
let labelDomain = document.getElementById('domain-name');
let inputTextMessage = document.getElementById('input-text-message');
let inputErrorMessage = document.getElementById('input-error-message');
let buttonGeneratePassword = document.getElementById('button-generate-password');
let buttonUpdatePassphrase = document.getElementById('button-update-passphrase');
let inputPassphrase = document.getElementById('input-passphrase');
let hostNname = "";

chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
  let activeTab = tabs[0];  
  let url = new URL(activeTab.url);  
  hostNname = url.hostname
  labelDomain.innerText = hostNname;
  logger.log(hostNname)
});

function setMessageBox(msg) {	
	inputErrorMessage.style.display = "none";
	inputTextMessage.style.display = "block";
	
	inputTextMessage.style.padding = "5px";
	inputTextMessage.style.paddingLeft = "10px";
	inputTextMessage.style.borderRadius = "5px";
	inputTextMessage.innerText = msg;
}

function setErrorBox(msg) {	
	inputTextMessage.style.display = "none";
	inputErrorMessage.style.display = "block";

	inputErrorMessage.style.padding = "5px";
	inputErrorMessage.style.paddingLeft = "10px";
	inputErrorMessage.style.borderRadius = "5px";
	inputErrorMessage.innerText = msg;
}

buttonGeneratePassword.onclick = function () {
	chrome.storage.sync.get('passphrase', function (data) {    		
		let passphrase = data.passphrase;

		if (passphrase === '' || passphrase === null || passphrase === undefined) {
	    setErrorBox('passphrase is not set');
	    return
		}

		if (passphrase.length < MIN_PASSPHRASE_LEN) {			
	    setErrorBox(`passphrase is too short, it must be ${MIN_PASSPHRASE_LEN} characters at least`);
	    return
		}		

    let sha256 = new Hashes.SHA256();
    let password = sha256.b64_hmac(passphrase, hostNname)
	  logger.log(`generated password: ${password}`);

	  navigator.clipboard.writeText(password)
	  .then(() => {
	  	setMessageBox('password copied to clipboard');
	  })
	  .catch(err => {
	    // This can happen if the user denies clipboard permissions:
	    setErrorBox('could not copy password: ', err);
	  });
  });
}

buttonUpdatePassphrase.onclick = function () {
  let passphrase = inputPassphrase.value;
  
  chrome.storage.sync.set({passphrase: passphrase}, function() {
    console.log(`passphrase '${passphrase}' is stored`);
  });
 
}