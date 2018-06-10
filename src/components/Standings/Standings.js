import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
// import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

//Components
import Group from "../Group/Group";
import Match from "../Match/Match";
import TeamRow from "../TeamRow/TeamRow";

//styles
import "./Standings.css";








class Standings extends Component {

  constructor() {
    super()
    this.state = {
      isHidden: true
    }
  }

  toggleHidden() {
    this.setState({
      isHidden: !this.state.isHidden
    })
  }

  mapTeamsInGroup(group) {
    // get teams id and create teams in group array
    const teamsInGroup = this.props.groups[group].matches.map(
      match => match.home_team
    );
    // Sort and filter duplicates
    return teamsInGroup
      .sort((a, b) => a - b)
      .filter((item, index, array) => array.indexOf(item) === index);
  }
  // get group and create arr of this group matches
  mapMatchesInGroup(group) {
    const matchesInGroup = this.props.groups[group].matches.map(
      match => match);
    return matchesInGroup;
  }

  render() {
    const { groups, teams, stadiums, isLoading } = this.props;

    if (isLoading) {
      return <span className="Loading">Loading . . .</span>;
    }

    return (
      <div className="Standings">
        <div className="Groups">
          {Object.keys(groups).map((group, index) => {
            const groupTeams = this.mapTeamsInGroup(group);
            const groupMatches = this.mapMatchesInGroup(group);

            return (
              <Group key={index} name={groups[group].name}>
              
                <table className="Group__table">
                  <thead className="Group__table-head">
                    <tr>
                      <th>
                        <span className="ThisGroup__StageMatches" onClick={this.toggleHidden.bind(this)}>// Teames Matches //</span>
                      </th>
                      <th>
                        <abbr title="Matches Played">MP</abbr>
                      </th>
                      <th>
                        <abbr title="Wins">W</abbr>
                      </th>
                      <th>
                        <abbr title="Draws">D</abbr>
                      </th>
                      <th>
                        <abbr title="Lost">L</abbr>
                      </th>
                      <th>
                        <abbr title="Goals">GF</abbr>
                      </th>
                      <th>
                        <abbr title="Goals">GA</abbr>
                      </th>
                      <th>
                        <abbr title="Goal difference">GD</abbr>
                      </th>
                      <th>
                        <abbr title="Points">Pts</abbr>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="Group__table-body">
                    {groupTeams.map((teamId) => (
                      <TeamRow key={teamId} 
                        team={teams[teamId - 1]}
                        groupMatches={groupMatches}
                      />
                    ))}
                  </tbody>
                </table>
                {/* Group stage matches div  */}
                <div className="Matches">
                  {!this.state.isHidden && <div className="Groups">
                    {groups[group].matches.map(match => (
                      <Match
                        key={match.name}
                        hometeam={teams[match.home_team - 1]}
                        awayteam={teams[match.away_team - 1]}
                        day={match.day}
                        date = {
                          new Date(match.date).getDate() + '/' +
                          (new Date(match.date).getMonth() + 1)
                        }
                        hours = {
                          new Date(match.date).getHours() + ':00'
                        }
                        stadium= {stadiums[match.stadium - 1]}
                      />
                    ))}
                  </div>}
                </div>
              </Group>
            );
          })}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    stadiums: state.stadiums,
    teams: state.teams,
    groups: state.groups,
    knockout: state.knockout
  };
}

export default connect(mapStateToProps)(Standings);