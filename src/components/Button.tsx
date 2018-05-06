import * as React from 'react';

interface ButtonPorps extends React.Props<{}> {
  handlerClick: () => void;
}

export default (props: ButtonPorps) => {
  return (
    <button onClick={props.handlerClick}>{props.children}</button>
  );
}

