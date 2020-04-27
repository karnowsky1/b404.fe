import React from 'react';
import { Card, Button, Carousel, Icon, Typography } from 'antd';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { chunk } from '../../utils/chunk';
import { NoContent } from '../../utils/NoContent';
import { noTasksMessageOne, noTasksMessageTwo } from '../../constants/messages';

const { Paragraph } = Typography;

class Pending extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      loading: true,
      visible: false,
      pagination: {},
    };
  }

  componentDidMount() {
    this.setState({
      loading: true,
    });
  }

  componentWillUnmount() {
    clearInterval(this.intervalID);
  }

  navigate(id) {
    let action;
    this.props.pendingTasks.forEach((element) => {
      if (element.stepID === id) {
        localStorage.setItem('stepId', element.stepID);
        if (element.fileID !== 0) {
          localStorage.setItem('fileId', element.fileID);
        } else localStorage.setItem('fileId', 0);
        switch (element.title) {
          case 1:
            action = '/approve';
            break;
          case 2:
            action = '/upload';
            break;
          case 3:
            action = '/complete';
            break;
          case 4:
            action = '/submission';
            break;
          default:
            action = '/';
            break;
        }
      }
    });
    return action;
  }

  render() {
    return (
      <React.Fragment>
        <h3>Pending Tasks</h3>
        <Carousel
          style={{
            maxWidth: '77em',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'flex-start',
          }}
        >
          {this.props.pendingTasks && this.props.pendingTasks.length > 0 ? (
            chunk(this.props.pendingTasks, 6).map((recordList, index) => (
              <div key={index}>
                {recordList.map((record) => (
                  <div
                    style={{
                      padding: '2em',
                      display: 'inline-block',
                    }}
                    key={record.stepID}
                  >
                    <Card
                      style={{
                        width: 300,
                        height: 100,
                        display: 'inline-block',
                      }}
                    >
                      <Icon
                        type="form"
                        style={{
                          position: 'relative',
                          top: '-.2em',
                          marginRight: '.5em',
                        }}
                      />
                      <b>New Task Available: </b>

                      <Button
                        type="primary"
                        shape="round"
                        size="small"
                        style={{ float: 'right' }}
                      >
                        <Link to={this.navigate(record.stepID)}>View</Link>
                      </Button>

                      {record.subtitle && record.subtitle.length > 0 ? (
                        <React.Fragment>
                          <Paragraph ellipsis>{record.subtitle}</Paragraph>{' '}
                        </React.Fragment>
                      ) : (
                        <React.Fragment>
                          <Paragraph ellipsis>
                            No Task Description Present
                          </Paragraph>{' '}
                        </React.Fragment>
                      )}
                    </Card>
                  </div>
                ))}
              </div>
            ))
          ) : (
            <div className="dashboard_no_content">
              <NoContent
                iconType="bell"
                twoTonecolor="#001529"
                firstMessage={noTasksMessageOne}
                secondMessage={noTasksMessageTwo}
              />
            </div>
          )}
        </Carousel>
        <br />
      </React.Fragment>
    );
  }
}

export default connect((state) => ({
  pendingTasks: state.pendingTasks,
}))(Pending);
