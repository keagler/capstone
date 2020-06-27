import * as React from 'react';
import Auth from '../auth/Auth';
import { Travel } from '../types/Travel';
import { Form } from 'semantic-ui-react';
import { updateReminder, createReminder } from '../api/travels-api';
import { History } from 'history';


interface EditTravelProps {
    location: {
        state:{
          travel:string
        }
      },
    auth: Auth,
    history: History
  }
  
  interface EditTravelState {
   travel: Travel
  }
export class EditTravel extends React.PureComponent<EditTravelProps,EditTravelState> {

    state: EditTravelState = {
        travel: {
            id: "",
            plannedDate: "",
            userId: "",
            location: "",
            description: "",
            duration: 0,
            createdDate: "",
            isCompleted: false
        }    
    }

    async componentDidMount() {
        try {
          if(this.props.location.state.travel){
            const travel: Travel = JSON.parse(this.props.location.state.travel);
            this.setState({
                travel
            });
          }
        } catch (e) {
          alert(`Failed to fetch load travel: ${e.message}`)
        }
    }
    onFieldValueChanged(fieldName: string,value: any){
        this.setState(
            {travel: {...this.state.travel, [fieldName]: value}}
        );
    }

    async updateOrCreateReminder(){
        if(this.state.travel.id == ""){
            await createReminder(this.props.auth.idToken,this.state.travel);
        }else{
            await updateReminder(this.props.auth.idToken,this.state.travel);
        }
        this.props.history.push('/');
    }

    render() {
        return (
          <div style={{justifyContent:'center', alignItems:'center'}}>
            <h1>{this.state.travel.id ? 'Edit' : 'Create'} Reminder</h1>
            
            <Form>
                <Form.Input label='Location' placeholder='Location' type="text" value={this.state.travel.location}
                    onChange={e => this.onFieldValueChanged('location',e.target.value)}>
                </Form.Input>
                <Form.Input  label='Description' placeholder='Description' type="text" value={this.state.travel.description}
                    onChange={e => this.onFieldValueChanged('description',e.target.value)}/>
                <Form.Input  label='Duration(Days)' placeholder='Duration(Days)' type="number" value={this.state.travel.duration}
                    onChange={e => {const num :Number = new Number(e.target.value); this.onFieldValueChanged('duration',num);}}/>
                <Form.Input  label='Planned Date' placeholder='Planned Date' type="text" value={this.state.travel.plannedDate}
                    onChange={e => this.onFieldValueChanged('plannedDate',e.target.value)}/>
                <Form.Checkbox  label='Is Completed?'  type="checkbox" checked={this.state.travel.isCompleted}
                    onChange={e => this.onFieldValueChanged('isCompleted',!this.state.travel.isCompleted)}/>
                <Form.Button onClick={() => this.updateOrCreateReminder()}>{this.state.travel.id ? 'Update': 'Create'}</Form.Button>
            </Form>
            
          </div>
        )
      }

}