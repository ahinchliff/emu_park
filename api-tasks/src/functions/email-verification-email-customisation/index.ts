import generateEmailHtml from "../../../../core-backend/build/email-service/generate-email-html";

export const handler = async (e: any, _c: any, callback: any) => {
  // const logger = new Logger("dev");

  const emailMessage = generateEmailHtml("welcome", { code: "{####}" });
  callback(null, {
    ...e,
    response: {
      emailSubject: "Welcome to the service!",
      emailMessage,
    },
  });
};
