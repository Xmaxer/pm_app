
export const LOGIN_MUTATION = `mutation Login($email: String!, $password: String!) {
    login(input: {authDetails: {email: $email, password: $password}}) {
        token
     }
   }
`;

export const IS_AUTHENTICATED_QUERY = `query {isAuthenticated}`;
