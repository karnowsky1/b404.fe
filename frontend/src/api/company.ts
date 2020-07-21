import axios from 'axios';
import { stringify } from 'querystring';

import { BASE_URL } from '../utils';
import { authedRequest } from './login';

export interface Company {
  companyID: number;
  companyName: string;
}

export interface Person {
  uuid: string;
  username: string;
  fName: string;
  lName: string;
  email: string;
  title: string;
  companies: Array<Company>;
  accessLevelID: number;
  signature: string | null;
}

export const getCompanies = authedRequest((authToken) => async (): Promise<
  Array<Company>
> => {
  const response = await axios.get<Array<Company>>(`${BASE_URL}/company`, {
    headers: {
      Authorization: authToken,
    },
  });
  return response.data;
});

export const createCompany = authedRequest(
  (authToken) => async (name: string): Promise<Company> => {
    const response = await axios.post<Company>(
      `${BASE_URL}/company`,
      stringify({ name }),
      {
        headers: {
          Authorization: authToken,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );
    return response.data;
  }
);

export const updateCompany = authedRequest(
  (authToken) => async (id: number, name: string): Promise<Company> => {
    const response = await axios.put<Company>(
      `${BASE_URL}/company`,
      stringify({ id, name }),
      {
        headers: {
          Authorization: authToken,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );
    return response.data;
  }
);

export const getCompany = authedRequest(
  (authToken) => async (id: number): Promise<Company> => {
    const response = await axios.get<Company>(`${BASE_URL}/company/id/${id}`, {
      headers: {
        Authorization: authToken,
      },
    });
    return response.data;
  }
);

export const deleteCompany = authedRequest(
  (authToken) => async (id: number): Promise<void> => {
    await axios.delete(`${BASE_URL}/company/id/${id}`, {
      headers: {
        Authorization: authToken,
      },
    });
  }
);

export const getPeopleByCompanyId = authedRequest(
  (authToken) => async (companyID: number): Promise<Array<Person>> => {
    const response = await axios.get<Array<Person>>(
      `${BASE_URL}/company/people/${companyID}`,
      {
        headers: {
          Authorization: authToken,
        },
      }
    );
    return response.data;
  }
);

export const addPersonToCompany = authedRequest(
  (authToken) => async (companyID: number, personID: number): Promise<void> => {
    await axios.post(
      `${BASE_URL}/company/person/add`,
      stringify({ companyID, personID }),
      {
        headers: {
          Authorization: authToken,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );
  }
);

export const removePersonFromCompany = authedRequest(
  (authToken) => async (companyID: number, personID: number): Promise<void> => {
    await axios.post(
      `${BASE_URL}/company/person/delete`,
      stringify({ companyID, personID }),
      {
        headers: {
          Authorization: authToken,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );
  }
);
