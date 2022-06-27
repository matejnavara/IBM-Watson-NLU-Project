import React from 'react';
import './bootstrap.min.css';

class EmotionTable extends React.Component {
  render() {
      const { emotions } = this.props;

      if (emotions.length === 0) {
        return (
          <div>
            <h3>No emotions detected</h3>
          </div>
        )
      }
      //Returns the emotions as an HTML table
      return (  
        <div>
          <table className="table table-bordered">
            <tbody>
            {Object.entries(emotions)
              .sort((a,b) => b[1] - a[1])
              .map((emotion) => (
                <tr>
                  <td>{emotion[0]}</td>
                  <td>{emotion[1]}</td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
          );
        }
}
export default EmotionTable;