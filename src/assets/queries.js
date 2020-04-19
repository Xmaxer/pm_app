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
      files {
        totalSize
      }
      algorithm
    }
    dashboardUrl
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
