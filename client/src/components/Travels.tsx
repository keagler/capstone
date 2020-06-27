import dateFormat from 'dateformat'
import { History } from 'history';
import * as React from 'react';
import {
  Button,
  Checkbox,
  Grid,
  Header,
  Loader,
  Table,
  Icon
} from 'semantic-ui-react';

import Auth from '../auth/Auth'
import { Travel } from '../types/Travel'
import { getReminders, deleteReminder } from '../api/travels-api'

interface TravelsProps {
  auth: Auth
  history: History
}

interface TravelsState {
  travels: Travel[]
  loadingTravels: boolean
}

export class Travels extends React.PureComponent<TravelsProps, TravelsState> {
  state: TravelsState = {
    travels: [],
    loadingTravels: true
  }


  async componentDidMount() {
    try {
      const travels = await getReminders(this.props.auth.getIdToken());
      this.setState({
        travels,
        loadingTravels: false
      })
    } catch (e) {
      alert(`Failed to fetch travels: ${e.message}`)
    }
  }

  onTravelSelected = async (travel: Travel) => {
    
    this.props.history.push(`/travels/${travel.id}/images`,{travel: JSON.stringify(travel)});
  }

  onTravelEdit = async(travel: Travel) => {
    this.props.history.push('/travels/editTravel',{travel: JSON.stringify(travel)});
  }

  onDeleteReminder = async(travelId: string) => {
    try {
      await deleteReminder(this.props.auth.getIdToken(),travelId);
      const travels = await getReminders(this.props.auth.getIdToken());
      this.setState({
        travels,
        loadingTravels: false
      })
    } catch (e) {
      alert(`Failed to delete travel: ${e.message}`);
    }
  }

  onTravelAdd(){
    const travel = {
      id: "",
      plannedDate: "",
      userId: "",
      location: "",
      description: "",
      duration: null,
      createdDate: "",
      isCompleted: false
    }
    this.props.history.push('/travels/editTravel',{travel: JSON.stringify(travel)});
  }

  render() {
    return (
      <div>
        <Header as="h1">REMINDER LIST</Header>

        {this.renderTravels()}
      </div>
    )
  }


  renderTravels() {
    if (this.state.loadingTravels) {
      return this.renderLoading();
    }

    return this.renderTravelsList();
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading Reminders
        </Loader>
      </Grid.Row>
    )
  }

  renderTravelsList() {
    return (
      <div>
        <Button icon color="blue" onClick={() => this.onTravelAdd()}>
            <Icon name="add"/>
        </Button>
        <Table celled>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Location</Table.HeaderCell>
              <Table.HeaderCell>Description</Table.HeaderCell>
              <Table.HeaderCell>Duration(Days)</Table.HeaderCell>
              <Table.HeaderCell>Created Date</Table.HeaderCell>
              <Table.HeaderCell>Planned Date</Table.HeaderCell>
              <Table.HeaderCell>Completed</Table.HeaderCell>
              <Table.HeaderCell>Images</Table.HeaderCell>
              <Table.HeaderCell>Edit</Table.HeaderCell>
              <Table.HeaderCell>Delete</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
          {this.state.travels.map((travel, pos) => {
            return (
              <Table.Row key={travel.id}>
                <Table.Cell width={2} verticalAlign="middle">
                  {travel.location}
                </Table.Cell>
                <Table.Cell width={2} floated="right">
                  {travel.description}
                </Table.Cell>
                <Table.Cell width={2} floated="right">
                  {travel.duration}
                </Table.Cell>
                <Table.Cell width={2} floated="right">
                  {travel.createdDate}
                </Table.Cell>
                <Table.Cell width={2} floated="right">
                  {travel.plannedDate}
                </Table.Cell>
                <Table.Cell width={2} floated="right">
                  <Checkbox checked={travel.isCompleted} readOnly>
                  </Checkbox>
                </Table.Cell>
                <Table.Cell width={2}>
                  <Button onClick={() => this.onTravelSelected(travel)} icon color="blue">
                      <Icon name="folder"/>
                  </Button>
                </Table.Cell>
                <Table.Cell width={2}>
                  <Button onClick={() => this.onTravelEdit(travel)}  icon color="blue">
                   <Icon name="pencil" />
                  </Button>
                </Table.Cell>
                <Table.Cell width={2}>
                  <Button onClick={() => {this.setState({loadingTravels: true}); this.onDeleteReminder(travel.id);}} icon color="blue">
                      <Icon name="delete"/>
                  </Button>
                </Table.Cell>
              </Table.Row>
            )
          })}
          </Table.Body>
        </Table>
      </div>
    )
  }

  calculateDueDate(): string {
    const date = new Date()
    date.setDate(date.getDate() + 7)

    return dateFormat(date, 'yyyy-mm-dd') as string
  }
}
