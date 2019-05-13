import React from 'react';
class Template extends React.Component{
    render() {
        return(
            <div> this is {this.props.text} page </div>
        )
    }
}
export default Template;