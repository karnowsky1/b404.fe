import { request } from './request';
import { Company, Person } from './types';

export const getCompanies = async (): Promise<Array<Company>> => {
  const response = await request<Array<Company>>({ route: '/company' });
  return response.data;
};

export const createCompany = async (name: string): Promise<Company> => {
  const response = await request<Company>({
    method: 'POST',
    route: '/company',
    body: { name },
  });
  return response.data;
};

export const updateCompany = async (
  id: number,
  name: string
): Promise<Company> => {
  const response = await request<Company>({
    method: 'PUT',
    route: '/company',
    body: { id, name },
  });
  return response.data;
};

export const getCompany = async (id: number): Promise<Company> => {
  const response = await request<Company>({
    route: `/company/id/${id}`,
  });
  return response.data;
};

export const deleteCompany = async (id: number): Promise<Company> => {
  const response = await request<Company>({
    method: 'DELETE',
    route: `/company/id/${id}`,
  });
  return response.data;
};

export const getPeopleByCompanyId = async (
  companyID: number
): Promise<Array<Person>> => {
  const response = await request<Array<Person>>({
    route: `/company/people/${companyID}`,
  });
  return response.data;
};

export const addPersonToCompany = async (
  companyID: number,
  personID: number
): Promise<void> => {
  await request({
    route: '/company/person/add',
    body: { companyID, personID },
  });
};

export const removePersonFromCompany = async (
  companyID: number,
  personID: number
): Promise<void> => {
  await request({
    route: '/company/person/delete',
    body: { companyID, personID },
  });
};
