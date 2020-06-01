// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

let buttonUpdatePassphrase = document.getElementById('button-update-passphrase');
let inputPassphrase = document.getElementById('input-passphrase');

buttonUpdatePassphrase.onclick = function () {
  let passphrase = inputPassphrase.value;
  
  chrome.storage.sync.set({passphrase: passphrase}, function() {
    console.log(`passphrase '${passphrase}' is stored`);
  });
 
}
