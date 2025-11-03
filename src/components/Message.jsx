import Alert from '@material-ui/lab/Alert';
import React from 'react';

const Message = ({ severity = 'error', children, mt = 16, mb = 16, ml, mr, m }) => {
  return (
    <Alert
      style={{
        margin: m ? m : 0,
        marginTop: mt,
        marginBottom: mb,
        marginLeft: ml,
        marginRight: mr,
        width: '100%',
      }}
      severity={severity}
    >
      {children}
    </Alert>
  );
};

export default Message;
