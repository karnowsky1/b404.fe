import { Formik } from 'formik';
import { Input, Form, SubmitButton, Select } from 'formik-antd';
import { Form as AntForm, Modal } from 'antd'
import React from 'react';
import { validateEmail, required, validatePassword, validateRequiredPassword } from '../../utils/validators';

const { Option } = Select;

const defaults = {
  username: '',
  password: '',
  fName: '',
  lName: '',
  email: '',
  title: '',
  company: undefined,
  accessLevelID: ''
}

const PeopleModalForm = ({
  initialValues = defaults,
  onSubmit,
  onCancel,
  companies,
  roles,
  title,
  isAddModal,
  form
}) => (
  <Modal title={title} visible footer={[]} onCancel={onCancel}>
    <Formik
      initialValues={initialValues}
      onSubmit={(values, { setSubmitting }) => { // onSubmit from formik-antd
        onSubmit(values) // onSubmit passed from props 
          setSubmitting(false);
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
          <Form.Item name="fName" validate={required}>
            <Input name="fName" placeholder="First Name" />
          </Form.Item>
          <p></p>
          <p>Last Name *</p>
          <Form.Item name="lName" validate={required}>
            <Input name="lName" placeholder="Last Name" />
          </Form.Item>
          <p></p>
          <p>Username *</p>
          <Form.Item name="username" validate={required}>
            <Input name="username" placeholder="Username" />
          </Form.Item>
          <p></p>
          <p>Password *</p>
          <Form.Item name="password" validate={isAddModal ? validateRequiredPassword : validatePassword}>
            <Input.Password name="password" placeholder="Password" />
          </Form.Item>
          <p></p>
          <p>Company</p>
          {/* //////////////////////////////////////////////////// */}
          <Select
            mode="multiple"
            name="company"
            style={{ width: '100%' }}
            placeholder="Select Company"
            defaultValue={initialValues.company}
          >
            {/* { console.log(companies)} */}
            {/* {console.log(initialValues.company)} */}
            {companies.map(({ value, label }) => (
              <Option value={value} key={value}>
                {label}
              </Option>
            ))}
          </Select>
          {/* //////////////////////////////////////////////////// */}
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
          <Form.Item name="email" validate={validateEmail}>
            <Input name="email" placeholder="Email" />
          </Form.Item>
          <p></p>
          <p>Job Title</p>
          <Input name="title" placeholder="Job Title" />
          <p></p>
          <SubmitButton>Submit</SubmitButton>
        </Form>
      )}
    </Formik>
  </Modal>
);

export const PeopleModal = AntForm.create({ name: 'people_modal' })(PeopleModalForm)