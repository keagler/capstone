import * as React from 'react';
import { Form, Button, Image, Icon } from 'semantic-ui-react';
import Auth from '../auth/Auth';
import { TravelImage } from '../types/TravelImage';
import { getTravelImages } from '../api/travels-api';
import Carousel from 'nuka-carousel';
import { Travel } from '../types/Travel';
import {History } from 'history';



interface TravelImagesProps {
  match: {
    params: {
      travelId: string
    }
  }
  auth: Auth,
  history: History,
  location: {
    state:{
      travel:string
    }
  },
}

interface TravelImagesState {
  images: TravelImage[],
  travel: Travel
}

export class TravelImages extends React.PureComponent<TravelImagesProps,TravelImagesState> {
  
  state: TravelImagesState = {
    images: [],
    travel:{
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
      const travel: Travel = JSON.parse(this.props.location.state.travel);
      this.setState({travel});
      const images = await getTravelImages(this.props.auth.getIdToken(),travel.id);
      this.setState({
        images
      });
    } catch (e) {
      alert(`Failed to fetch travel images: ${e.message}`)
    }
  }

  async onTravelImageAdd(){
    const travelId = this.state.travel.id;
    this.props.history.push(`/travels/${travelId}/uploadImage`);
  }

  render() {
    return (
      <div style={{justifyContent:'center', alignItems:'center'}}>
        <Button icon color="blue" onClick={() => this.onTravelImageAdd()}>
            <Icon name="add"/>
        </Button>
        {this.state.images.length != 0 ?
          <div> 
            <h1>Reminder Images</h1>
            <Carousel> 
                {this.state.images.map((image, pos) => {
                        return (
                              <Image src={`https://serverless-reminder-bucket-keagler-dev.s3.amazonaws.com/${image.travelId}%${image.imageId}`} wrapped  />
                            )
                        })
                }
            </Carousel>
          </div>
         : <h1>NO IMAGES FOUND FOR THAT REMINDER</h1>}
        
      </div>
    )
  }

}
