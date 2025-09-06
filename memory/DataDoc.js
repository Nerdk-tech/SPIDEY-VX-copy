const fetch = require('node-fetch')
const FormData = require('form-data')
const { fromBuffer } = require('file-type')

/**
 ⚙️ Fitur TOURL Recode By @𝐦𝐳𝐚𝐳𝐢
 ⚙️ Upload File To Image telegra.ph
 ⚙️ Support Mimetype : png/jpg/jpeg
 */
module.exports = async buffer => {
  let { ext } = await fromBuffer(buffer);
  let bodyForm = new FormData();
  bodyForm.append("fileToUpload", buffer, "file." + ext);
  bodyForm.append("reqtype", "fileupload");

  let res = await fetch("https://catbox.moe/user/api.php", {
    method: "POST",
    body: bodyForm,
  });

  let data = await res.text();
  return data;
}