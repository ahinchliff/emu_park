import * as handlebars from "handlebars";

const templateNameToHtmlMap: {
  [P in core.backend.EmailTemplateName]: string;
} = {
  welcome: require("./templates/welcome.html"),
};

export default <TemplateName extends core.backend.EmailTemplateName>(
  templateName: TemplateName,
  data: core.backend.EmailTemplateVariables[TemplateName]
): string => {
  const templateHtml = templateNameToHtmlMap[templateName];

  const template = handlebars.compile(templateHtml);

  return template(data);
};
