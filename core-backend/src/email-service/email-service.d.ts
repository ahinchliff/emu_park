declare namespace core.backend {
  type WelcomeEmailTemplateVariables = {
    code: string;
  };

  type EmailTemplateVariables = {
    welcome: WelcomeEmailTemplateVariables;
  };

  type EmailTemplateName = keyof EmailTemplateVariables;
}
