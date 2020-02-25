import React from "react";
import axios from "axios";
import { Table, Tabs, Progress, Row, Col, Button } from "antd";

const { TabPane } = Tabs;

function callback(key) {
  console.log(key);
}

class MilestonesTable extends React.Component {
  state = {
    data: [],
    companyName: [],
    loading: true,
    pagination: {}
  };
  constructor(props) {
    super(props);
    this.columns = [
      { title: "Name", dataIndex: "name", key: "name" },
      { title: "Company", dataIndex: "company", key: "company" },
      {
        title: "Progress",
        dataIndex: "",
        key: "y",
        render: () => <Progress percent={50} />
      },
      {
        title: "Actions",
        dataIndex: "",
        key: "x",
        render: () => <Button type="link">Delete</Button>
      }
    ];
  }

  componentDidMount() {
    this.fetch();
    this.getCompanyName();
  }

  getCompanyName(id) {
    axios
      .get(window.__env__.API_URL + "/blink/api/company/id/" + id, {
        headers: {
          Authorization: localStorage.getItem("token")
        }
      })
      .then(response => {
        //console.log(response.data);
        return response.data.companyName;
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  fetch = (params = {}) => {
    axios({
      method: "get",
      url: window.__env__.API_URL + "/blink/api/milestone",
      headers: { Authorization: localStorage.getItem("token") },
      response: {
        results: 4,
        params
      },
      type: "json"
    })
      .then(response => {
        let conf = [];
        for (let entry of response.data) {
          conf.push({
            id: entry.milestoneID,
            name: entry.name,
            company: entry.companyID,
            startDate: entry.startDate,
            endDate: entry.compleatedDate
          });
        }
        const pagination = { ...this.state.pagination };
        pagination.pageSize = 4;
        this.setState({
          loading: false,
          data: conf,
          pagination
        });
      })
      .catch(function(error) {
        console.log(error);
      });
  };

  render() {
    return (
      <Tabs defaultActiveKey="1" onChange={callback}>
        <TabPane tab="Active" key="1">
          <Table
            columns={this.columns}
            rowKey={record => record.id}
            expandedRowRender={record => (
              <React.Fragment>
                <Row>
                  <Col span={12}>
                    <p>
                      <b>Start Date: {record.startDate}</b>
                    </p>
                    <p>
                      <b>End Date: {record.endDate}</b>
                    </p>
                  </Col>
                  <Col span={12}>
                    <div style={{ width: 200 }}>
                      <p>
                        <b>
                          Workflow 1 <Progress percent={50} size="small" />
                        </b>
                      </p>
                      <p>
                        <b>
                          Workflow 2 <Progress percent={50} size="small" />
                        </b>
                      </p>
                      <Button type="link">+ Add Workflow</Button>
                    </div>
                  </Col>
                </Row>
              </React.Fragment>
            )}
            dataSource={this.state.data}
          />
          <Button type="primary">+ Create</Button>
        </TabPane>
        <TabPane tab="Archived" key="2">
          <p>Archived Tab</p>
        </TabPane>
      </Tabs>
    );
  }
}

export default MilestonesTable;
