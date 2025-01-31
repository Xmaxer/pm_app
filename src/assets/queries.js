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
    description
    numberOfAssets
    dashboardUrl
    totalSize
    grafanaUsername
    grafanaPassword
  }
}
`;

export const API_KEYS_QUERY = `query ApiKeys($first: Int, $skip: Int, $order: ApiKeysOrder, $filter: ApiKeysFilter){
  apiKeys(order: $order, skip: $skip, first: $first, filter: $filter) {
    id
    name
    companyName
    apiKey
    lastUsed
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
      files {
        totalSize
      }
      algorithm
    }
    dashboardUrl
    grafanaUsername
    grafanaPassword
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

export const COMPANY_MUTATION = `mutation Company($name: String!, $description: String, $id: ID){
  company(input: {companyDetails:{name: $name, description: $description, id: $id}}) {
    company {
          id
    name
    description
    numberOfAssets
    dashboardUrl
    grafanaUsername
    grafanaPassword
    totalSize
    }
  }
}
`;

export const ASSET_MUTATION = `mutation Asset($name: String!, $description: String, $companyId: ID!, $id: ID){
  asset(input: {assetDetails:{name: $name, description: $description, companyId: $companyId, id: $id}}){
    asset {
      id
      name
      description
      files {
        totalSize
      }
      algorithm
    }
  }
}
`;

export const DELETE_COMPANY_MUTATION = `mutation Company($id: ID!){
  deleteCompany(input: {id: $id})
  {
    company {
      id
      name
      description
    }
  }
}
`;

export const DELETE_ASSET_MUTATION = `mutation Asset($id: ID!) {
  deleteAsset(input: {id: $id}){
    asset {
      id
      name
      description
    }
  }
}
`;

export const UPLOAD_ASSET_FILE_MUTATION = `mutation File($assetId: ID!, $files: [Upload!]!, $headers: [String!]!, $remove: [Int!]!, $labels: [Int!]!, $features: [Int!]!, $separator: String!){
  uploadAssetData(input: {assetId: $assetId, files: $files, headers: $headers, columnTypes: {remove: $remove, labels: $labels, features: $features}, separator: $separator}){
    success
  }
}
`;

export const IS_AUTHENTICATED_QUERY = `query {isAuthenticated}`;

export const ASSET_QUERY = `query Asset($assetId: Int!){
  asset(assetId: $assetId) {
    files{
      numberOfFiles
    }
  }
}
`;

export const DELETE_API_KEY_MUTATION = `
mutation ApiKey($id: ID!){
  deleteApiKey(input: {id: $id}){
    apiKey {
      id
    }
  }
}
`;

export const COMPANY_ROLES_QUERY = `
query Company($company_id: ID!){
 \tcompany(companyId: $company_id) {
    id
    name
    roles{
      id
      name
      colour
      numberOfUsers
    }
  }
}
`;

export const CREATE_COMPANY_ROLE_MUTATION = `
mutation Role($name: String, $colour: String, $id: ID, $company_id: ID!){
  role(input: {roleDetails: {name: $name, colour: $colour companyId: $company_id, id: $id}}) {
    role {
      numberOfUsers
      id
      name
      colour
    }
  }
}
`;

export const DELETE_COMPANY_ROLE_MUTATION = `
mutation Role($id: ID!){
  deleteRole(input: {id: $id}) {
\trole {
    id
    name
    numberOfUsers
  }
  }
}
`;

export const ADD_ROLE_TO_USER_MUTATION = `
mutation Role($company_id: ID!, $user_id: ID!, $role_ids: [ID!]!){
  addRole(input: {companyId: $company_id, userId: $user_id, roleIds: $role_ids}) {
    success
    user {
      firstName
      lastName
      id
      roles {
        id
        name
        colour
      }
    }
  }
}
`;

export const REMOVE_ROLE_FROM_USER_MUTATION = `
mutation Role($company_id: ID!, $user_id: ID!, $role_ids: [ID!], $purge: Boolean){
  removeRole (input: {companyId: $company_id, userId: $user_id, roleIds: $role_ids, purge: $purge}) {
    success
    user {
      roles {
        id
        name
        colour
      }
    }
  }
}
`;

export const GET_USERS_QUERY = `
query User($contains: String, $ignore: [Int!]){
  users(filter: {nameContains: $contains}, ignoreUsers: $ignore) {
    id
    lastName
    firstName
  }
}
`;

export const UPDATE_USER_MUTATION = `
mutation User($first_name: String, $last_name: String, $password: String!, $new_password: String, $phone_number: String, $enabled: Boolean, $email: String){
  user (input: {userDetails: {firstName: $first_name, lastName: $last_name, password: $password, newPassword: $new_password, phoneNumber: $phone_number, enabled: $enabled, email: $email}}){
    user {
      id
      firstName
      lastName
      phoneNumber
      email
    }
  }
}
`;

export const GET_USER_QUERY = `
query User($id: ID){
  user(id: $id) {
    id
    firstName
    lastName
    phoneNumber
    email
  }
}
`;

export const UPDATE_API_KEY_MUTATION = `
mutation ApiKey($name: String!, $company_id: ID, $id: ID){
  apiKey(input: {apiKeyDetails: {name: $name, companyId: $company_id, id: $id}}){
    apiKey {
      id
      name
      companyName
      apiKey
      lastUsed
    }
  }
}
`;

export const API_KEY_QUERY = `
query Key($id: ID!){
  apiKey(id: $id) {
    id
    name
    history {
      id
      query
      createdAt
    }
  }
}
`;

