import { Formik } from 'formik';
import { Input, Form, SubmitButton, Select } from 'formik-antd';
import { Modal } from 'antd';
import React from 'react';

const { Option } = Select;

const defaults = {
  username: '',
  password: '',
  fName: '',
  lName: '',
  email: '',
  title: ''
};

export const PeopleModal = ({
  initialValues = defaults,
  onSubmit,
  onCancel,
  companies,
  roles,
  title
}) => (
  <Modal title={title} visible footer={[]} onCancel={onCancel}>
    <Formik
      initialValues={initialValues}
      onSubmit={(values, { setSubmitting }) => {
        onSubmit(values).then(() => {
          setSubmitting(false);
        });
      }}
    >
      {({ handleSubmit }) => (
        <Form
          onSubmit={e => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <p>First Name *</p>
          <Input name="fName" placeholder="First Name" />
          <p></p>
          <p>Last Name *</p>
          <Input name="lName" placeholder="Last Name" />
          <p></p>
          <p>Username *</p>
          <Input name="username" placeholder="Username" />
          <p></p>
          <p>Password *</p>
          <Input.Password name="password" placeholder="Password" />
          <p></p>
          <p>Company</p>
          <Select
            name="company"
            style={{ width: '100%' }}
            placeholder="Select Company"
          >
            {companies.map(({ value, label }) => (
              <Option value={value} key={value}>
                {label}
              </Option>
            ))}
          </Select>
          <p></p>
          <p>Role *</p>
          <Select
            style={{ width: '100%' }}
            placeholder="Select Role"
            name="accessLevelID"
          >
            {roles.map(({ value, label }) => (
              <Option value={value} key={value}>
                {label}
              </Option>
            ))}
          </Select>
          <p></p>
          <p>Email</p>
          <Input name="email" placeholder="Email" />
          <p></p>
          <p>Job Title</p>
          <Input name="title" placeholder="Job Title" />
          <SubmitButton>Submit</SubmitButton>
        </Form>
      )}
    </Formik>
  </Modal>
);
