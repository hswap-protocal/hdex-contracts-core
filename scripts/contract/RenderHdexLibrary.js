const { renderString, renderTemplateFile } = require('template-file');
const fs = require('fs');

async function injectInitCodeHash(init_code_hash){
    let template_path = "scripts/contract/HdexLibrary.template";
    let res = await renderTemplateFile(template_path, {"init_code_hash": init_code_hash}).then(renderString);
    let to_sol_path = "contracts/libraries/HdexLibrary.sol";
    console.log("inject init_code: ", init_code_hash);
    await fs.writeFileSync(to_sol_path, res);
}

module.exports = injectInitCodeHash;