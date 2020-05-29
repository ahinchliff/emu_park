const Axios = require("axios").default;

const client = Axios.create({
  baseURL: "https://cognito-idp.eu-west-1.amazonaws.com",
  headers: {
    "Content-Type": "application/x-amz-json-1.1",
  },
  responseType: "json",
});

const signup = async (email, password) => {
  try {
    const result = await client.post(
      "",
      {
        ClientId: "130kgqg7dqa21opkkcampp6g9g",
        Username: email,
        Password: password,
      },
      {
        headers: {
          "X-Amz-Target": "AWSCognitoIdentityProviderService.SignUp",
        },
      }
    );
    console.log(result.data);
  } catch (e) {
    console.log(e.response.data);
  }
};

const confirmSignup = async (confirmationCode) => {
  try {
    const result = await client.post(
      "",
      {
        ClientId: "130kgqg7dqa21opkkcampp6g9g",
        Username: "anthony.hinchliff@gmail.com",
        ConfirmationCode: confirmationCode,
      },
      {
        headers: {
          "X-Amz-Target": "AWSCognitoIdentityProviderService.ConfirmSignUp",
        },
      }
    );
    console.log(result.data);
  } catch (e) {
    console.log(e.response.data);
  }
};

const login = async (useerName, password) => {
  try {
    const result = await client.post(
      "",
      {
        AuthFlow: "USER_PASSWORD_AUTH",
        ClientId: "130kgqg7dqa21opkkcampp6g9g",
        AuthParameters: {
          USERNAME: useerName,
          PASSWORD: password,
        },
      },
      {
        headers: {
          "X-Amz-Target": "AWSCognitoIdentityProviderService.InitiateAuth",
        },
      }
    );
    console.log(result.data);
  } catch (e) {
    console.log(e.response.data);
  }
};

(async () => {
  // await signup("anthony.hinchliff@gmail.com", "Password123!");
  // await confirmSignup("052886");
  await login("anthony.hinchliff@gmail.com", "Password123!");
})();
