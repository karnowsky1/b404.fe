import React from 'react';
import { Form, DatePicker } from 'antd';
import { SEND_DATE_FORMAT } from '../constants';

export class DateRange extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      endOpen: false,
    };
  }

  disabledStartDate = (startValue) => {
    const { endDate } = this.props;
    if (!startValue || !endDate) {
      return false;
    }
    return startValue.valueOf() > endDate.valueOf();
  };

  disabledEndDate = (endValue) => {
    const { startDate } = this.props;
    if (!endValue || !startDate) {
      return false;
    }
    return endValue.valueOf() <= startDate.valueOf();
  };

  handleStartOpenChange = (open) => {
    if (!open) {
      this.setState({ endOpen: true });
    }
  };

  handleEndOpenChange = (open) => {
    this.setState({ endOpen: open });
  };

  render() {
    const { endOpen } = this.state;
    const {
      startDate,
      endDate,
      setStartDate,
      setEndDate,
      failedSubmit,
      setFailedSubmit,
    } = this.props;

    return (
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>
          {this.props.isMilestone ? (
            <p className="datePicker-p-tag">Start Date *</p>
          ) : (
            <h5 style={{ margin: '0' }}>Start Date *</h5>
          )}
          <Form.Item
            name="startDate"
            validateStatus={failedSubmit.startDate ? 'error' : undefined}
            help={failedSubmit.startDate ? 'Required' : undefined}
          >
            <DatePicker
              name="startDate"
              disabledDate={this.disabledStartDate}
              showTime
              format={SEND_DATE_FORMAT}
              value={startDate}
              placeholder="Start"
              onChange={(date) => {
                setFailedSubmit({
                  ...failedSubmit,
                  startDate: false,
                });
                setStartDate(date);
              }}
              onOpenChange={this.handleStartOpenChange}
            />
          </Form.Item>
        </div>
        <div>
          {this.props.isMilestone ? (
            <p className="datePicker-p-tag">End Date *</p>
          ) : (
            <h5 style={{ margin: '0' }}>End Date *</h5>
          )}
          <Form.Item
            name="endDate"
            validateStatus={failedSubmit.endDate ? 'error' : undefined}
            help={failedSubmit.endDate ? 'Required' : undefined}
          >
            <DatePicker
              name="endDate"
              disabledDate={this.disabledEndDate}
              showTime
              format={SEND_DATE_FORMAT}
              value={endDate}
              placeholder="End"
              onChange={(date) => {
                setFailedSubmit({
                  ...failedSubmit,
                  endDate: false,
                });
                setEndDate(date);
              }}
              open={endOpen}
              onOpenChange={this.handleEndOpenChange}
            />
          </Form.Item>
        </div>
      </div>
    );
  }
}
