import * as fs from "fs";
const generateEmailHtml = require("../../build/email-service/generate-email-templates.js");

const testEvents: {
  [K in core.backend.EmailTemplateName]: core.backend.EmailTemplateVariables[K];
} = {
  welcome: { code: "abc" },
};

const templateLinks: string[] = [];

Object.keys(testEvents).forEach((k: string) => {
  const templateName = k as core.backend.EmailTemplateName;
  const html = generateEmailHtml.default(
    templateName,
    testEvents[templateName]
  );
  const templateFileName = `${templateName}.html`;
  fs.writeFileSync(
    `./build/email-service/templates/outputs/${templateFileName}`,
    html
  );

  templateLinks.push(
    `<li><a href="./${templateFileName}">${templateName}</a></li>`
  );
});

fs.writeFileSync(
  `./build/email-service/templates/outputs/index.html`,
  `
  <!DOCTYPE html>
  <html>
      <body>
        <ul>
          ${templateLinks.join("")}
        </ul>
      </body>
  </html>
`
);
