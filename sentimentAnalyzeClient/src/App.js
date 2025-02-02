import './bootstrap.min.css';
import './App.css';
import EmotionTable from './EmotionTable.js';
import React from 'react';

class App extends React.Component {
  /*
  We are setting the component as a state named innercomp.
  When this state is accessed, the HTML that is set as the 
  value of the state, will be returned. The initial input mode
  is set to text
  */
  state = {
    innercomp:<textarea rows="4" cols="50" id="textinput"/>,
    mode: "text",
    sentimentOutput:[],
    sentiment:true
  }
  
  /*
  This method returns the component based on what the input mode is.
  If the requested input mode is "text" it returns a textbox with 4 rows.
  If the requested input mode is "url" it returns a textbox with 1 row.
  */
 
  renderOutput = (input_mode)=>{
    let rows = 1
    let mode = "url"
    //If the input mode is text make it 4 lines
    if(input_mode === "text"){
      mode = "text"
      rows = 4
    }
      this.setState({
        innercomp:<textarea rows={rows} cols="50" id="textinput"/>,
        mode: mode,
        sentimentOutput:[],
        sentiment:true
      });
  } 
  
  sendForSentimentAnalysis = () => {
    this.setState({sentiment:true});
    let url = ".";
    let mode = this.state.mode
    url = url+"/" + mode + "/sentiment?"+ mode + "="+document.getElementById("textinput").value;

    fetch(url).then(async (response) => {
      const isJson = response.headers.get('content-type')?.includes('application/json');
      const data = isJson ? await response.json() : null;

      // check for error response
      if (!response.ok) {
        // get error message from body or default to response status
        const error = response;
        return Promise.reject(error);
      }

      let output = data.label || 'No sentiment detected';
      let color = "white"
      switch(output) {
        case "positive": color = "green";break;
        case "negative": color = "red";break;
        default: color = "orange";
      }
      output = <div style={{color:color,fontSize:20}}>{output}</div>
      this.setState({sentimentOutput:output});
    })
    .catch((error) => {        
      this.setState({sentimentOutput:<p>{error.statusText}</p>});
    });
  }

  sendForEmotionAnalysis = () => {

    this.setState({sentiment:false});
    let url = ".";
    let mode = this.state.mode
    url = url+"/" + mode + "/emotion?"+ mode + "="+document.getElementById("textinput").value;

    fetch(url).then(async (response) => {
        const isJson = response.headers.get('content-type')?.includes('application/json');
        const data = isJson ? await response.json() : null;

        // check for error response
        if (!response.ok) {
          // get error message from body or default to response status
          const error = response;
          return Promise.reject(error);
        }
        this.setState({sentimentOutput:<EmotionTable emotions={data}/>});
      }).catch((error) => {        
        this.setState({sentimentOutput:<p>{error.statusText}</p>});
    });
  }
  

  render() {
    return (  
      <div className="App">
        <img src="/RobotThink.png" alt="Robot is thinking" width="300px" />
        <br/><br/>
        <button className={this.state.mode === "text" ? "btn btn-info" : "btn btn-dark"} onClick={()=>{this.renderOutput('text')}}>Text</button>
        <button className={this.state.mode === "url" ? "btn btn-info" : "btn btn-dark"}  onClick={()=>{this.renderOutput('url')}}>URL</button>
        <br/><br/>
        {this.state.innercomp}
        <br/>
        <button className="btn-primary" onClick={this.sendForSentimentAnalysis}>Analyze Sentiment</button>
        <button className="btn-primary" onClick={this.sendForEmotionAnalysis}>Analyze Emotion</button>
        <br/>
            {this.state.sentimentOutput}
      </div>
    );
    }
}

export default App;
