import { Formik } from 'formik';
import { Input, Form, SubmitButton, Select } from 'formik-antd';
import { Form as AntForm, Modal } from 'antd';
import React, { useState } from 'react';
import { required } from '../../utils/validators';
import { DateRange } from '../../utils/DateRange';

const { Option } = Select;

const defaults = {
  name: '',
  description: '',
  companyID: undefined,
  startDate: '',
  deliveryDate: ''
};

const MilestoneModalForm = ({
  initialValues = defaults,
  onSubmit,
  onCancel,
  companies,
  title,
  isAddModal,
  form
}) => {
  const [startDate, setStartDate] = useState(initialValues.startDate);
  const [endDate, setEndDate] = useState(initialValues.deliveryDate);
  const [failedSubmit, setFailedSubmit] = useState({
    startDate: false,
    endDate: false
  });

  return (
    <Modal title={title} visible footer={[]} onCancel={onCancel}>
      <Formik
        initialValues={initialValues}
        onSubmit={(values, { setSubmitting }) => {
          // onSubmit from formik-antd
          if (!!startDate && !!endDate) {
            onSubmit({
              ...values,
              startDate: startDate.format('YYYY-MM-DD HH:mm:ss'),
              deliveryDate: endDate.format('YYYY-MM-DD HH:mm:ss')
            }); // onSubmit passed from props
          }
          setSubmitting(false);
        }}
      >
        {({ handleSubmit }) => (
          <Form
            onSubmit={e => {
              e.preventDefault();
              if (!startDate || !endDate) {
                setFailedSubmit({
                  startDate: !startDate,
                  endDate: !endDate
                });
              }
              handleSubmit();
            }}
          >
            <p>Name *</p>
            <Form.Item name="name" validate={required}>
              <Input name="name" placeholder="Milestone 1" />
            </Form.Item>
            <p></p>
            <p>Description</p>
            <Form.Item name="description">
              <Input name="description" placeholder="Milestone Description" />
            </Form.Item>
            <p></p>
            <p>Company *</p>
            {/* //////////////////////////////////////////////////// */}
            <Form.Item name="companyID" validate={required}>
              <Select
                name="companyID"
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
            </Form.Item>
            {/* //////////////////////////////////////////////////// */}
            <p></p>
            <DateRange
              startDate={startDate}
              endDate={endDate}
              setStartDate={setStartDate}
              setEndDate={setEndDate}
              failedSubmit={failedSubmit}
              setFailedSubmit={setFailedSubmit}
              isMilestone={true}
            />
            <p></p>
            <SubmitButton>Submit</SubmitButton>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export const MilestoneModal = AntForm.create({ name: 'milestone_modal' })(
  MilestoneModalForm
);
