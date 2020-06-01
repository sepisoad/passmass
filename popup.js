// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

let logger = chrome.extension.getBackgroundPage().console;
let labelDomain = document.getElementById('domain-name');
let inputTextMessage = document.getElementById('input-text-message');
let buttonGeneratePassword = document.getElementById('button-generate-password');
let hostNname = "";

chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
  let activeTab = tabs[0];
  let url = new URL(activeTab.url);
  hostNname = url.hostname
  labelDomain.innerText = hostNname;
});

buttonGeneratePassword.onclick = function () {
	chrome.storage.sync.get('passphrase', function (data) {    		
		let passphrase = data.passphrase;

    let sha256 = new Hashes.SHA256();
    let password = sha256.b64_hmac(passphrase, hostNname)
	  logger.log(`generated password: ${password}`);

	  navigator.clipboard.writeText(password)
	  .then(() => {
	  	inputTextMessage.classList.add = 'text-error'
	  	inputTextMessage.style.padding = "5px";
	  	inputTextMessage.style.paddingLeft = "10px";
	  	inputTextMessage.style.borderRadius = "5px";
	  	inputTextMessage.innerText = 'password copied to clipboard'	  	
	  })
	  .catch(err => {
	    // This can happen if the user denies clipboard permissions:
	    inputTextMessage.classList.add = 'text-error'
	    inputTextMessage.style.padding = "5px";
	    inputTextMessage.style.paddingLeft = "10px";
	    inputTextMessage.style.borderRadius = "5px";
	    inputTextMessage.innerText = 'could not copy password'	    
	    logger.error('could not copy password: ', err);
	  });
  });
}