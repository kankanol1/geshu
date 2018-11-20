import React from 'react';
import { connect } from 'dva';
import { Card, Avatar, Button, Form, Row, Col, Input, DatePicker, Icon, Spin } from 'antd';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import Ellipsis from '@/components/Ellipsis';
import CardTable from '@/components/CardTable';

import { generateColorFor } from '../../utils/utils';
import styles from './TeamsList.less';

@connect(({ teams, loading }) => ({
  teams,
  loading: loading.models.teams,
}))
class TeamsList extends React.PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'teams/fetchTeams',
    });
  }

  render() {
    const { teams } = this.props.teams;
    const { loading } = this.props;
    return (
      <PageHeaderWrapper title="团队">
        <CardTable
          className={styles.cardsWrapper}
          loading={loading}
          list={teams || []}
          // pagination={data.pagination}
          renderItem={item => (
            <div className={styles.cardWrapper} key={item.id}>
              <Card
                onClick={() => {
                  // router.push(`/projects/p/show/${item.id}`);
                }}
                hoverable
                className={styles.card}
                // actions={[<a>编辑</a>, <Link to={`/projects/p/show/${item.id}`}>打开</Link>]}
              >
                <Card.Meta
                  avatar={
                    <Avatar
                      className={styles.cardAvatar}
                      style={{
                        backgroundColor: generateColorFor(item.name),
                        verticalAlign: 'middle',
                      }}
                      size="large"
                    >
                      {item.name.toUpperCase().charAt(0)}
                    </Avatar>
                  }
                  title={<a>{item.name}</a>}
                  description={
                    <Ellipsis className={styles.item} lines={3}>
                      {item.description}
                    </Ellipsis>
                  }
                />
              </Card>
            </div>
          )}
        />
      </PageHeaderWrapper>
    );
  }
}

export default TeamsList;
