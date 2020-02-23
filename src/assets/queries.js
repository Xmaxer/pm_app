export const LOGIN_MUTATION = `mutation Login($email: String!, $password: String!) {
    login(input: {authDetails: {email: $email, password: $password}}) {
        token
     }
   }
`;

export const REGISTER_MUTATION = `mutation Register($email: String!, $password: String!, $password_confirmation: String!, $first_name: String!, $last_name: String, $phone_number: String) {
  register(input: {userDetails: {email: $email, password: $password, passwordConfirmation: $password_confirmation, firstName: $first_name, lastName: $last_name, phoneNumber: $phone_number}}){
    token
  }
}
`;

export const COMPANIES_QUERY = `query Companies($first: Int, $skip: Int, $order: CompanyOrder, $filter: CompanyFilter){
  companies(order: $order, skip: $skip, first: $first, filter: $filter) {
    id
    name
    numberOfAssets
  }
}
`;

export const API_KEYS_QUERY = `query ApiKeys($first: Int, $skip: Int, $order: ApiKeysOrder, $filter: ApiKeysFilter){
  apiKeys(order: $order, skip: $skip, first: $first, filter: $filter) {
    id
    name
    companyName
    apiKey
  }
}
`;

export const LOGOUT_MUTATION = `mutation {
  logout(input:{}){
    success
  }
}
`;

export const COMPANY_ASSETS_QUERY = `query Company($companyId: ID!){
  company(companyId: $companyId){
    assets {
      id
      name
      description
    }
  }
}
`;

export const COMPANY_USERS_QUERY = `query Company($companyId: ID!)
{
    company(companyId: $companyId) {
    
    users {
      id
      firstName
      lastName
      roles{
        name
        colour
        id
      }
    }
  }
}
`;

export const IS_AUTHENTICATED_QUERY = `query {isAuthenticated}`;
