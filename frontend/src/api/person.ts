import { request } from './request';
import { Person } from './types';

export const getPeople = async (): Promise<Array<Person>> => {
  const response = await request<Array<Person>>({ route: '/person' });
  return response.data;
};

export const createPerson = async (
  person: Omit<Person, 'companies' | 'uuid'>
): Promise<Person> => {
  const response = await request<Person>({
    method: 'POST',
    route: '/person',
    body: person,
  });
  return response.data;
};

export const updatePerson = async (
  person: Omit<Person, 'companies'>
): Promise<Person> => {
  const response = await request<Person>({
    method: 'PUT',
    route: '/person',
    body: {
      id: person.uuid,
      ...person,
    },
  });
  return response.data;
};

export const getPerson = async (id: string): Promise<Person> => {
  const response = await request<Person>({ route: `/person/id/${id}` });
  return response.data;
};

export const deletePerson = async (id: string): Promise<void> => {
  await request<Person>({ method: 'DELETE', route: `/person/id/${id}` });
};
