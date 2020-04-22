/**
 * This module deal with consistent error messages to send to client.
 * Here we define error messages and error code.
 */

// TO IMPORT: const error = require('./error');

const errMsg = {
  INTERNAL_SERVER_ERROR: 'An internal error has occurred. Please try again!',
  DATABASE_ERROR: 'An internal error has occurred. Please try again!',
};

//
// Why I have added name property which is same as name of object?
// Answer: This is to avoid programming errors, because if we don't have
// name property we have to write 'VAL_ERR_...' as this is treated as string
// By JS it will not throw error and there is possibility to make typo there
// but now we have to write errList.VAL_ERR_.. this is JS variable name
// and JS will throw error when we make typo there.

//
// NOTE:
// - Error code must be unique for all error objects.
// - Internal error is used for debugging purpose hence don't send it to client.
//
//

const errList = {
  //
  // INTERNAL SERVER ERRORS
  // These errors occurs when some request fails either authentication or authorization
  // In this case front end should redirect to Login page
  //
  // ERR_PR_ : ERROR_PROTECT_ROUTE_
  authError: {
    ERR_PR_PERMISSION_MISMATCH: {
      code: '20001',
      message: 'You are not authorized to access this resource. Please login again.',
      internalDescription: 'Role provided in token does not matched with route accessed.',
    },
    ERR_PR_INVALID_TOKEN: {
      code: '20002',
      message: 'You are not authorized to access this resource. Please login again.',
      internalDescription: 'Verify function for token provided fails. Token may be tampered with.',
    },
    ERR_PR_NO_TOKEN: {
      code: '20003',
      message: 'You are not authorized to access this resource. Please login again.',
      internalDescription: 'No token provided while accessing protected route.',
    },
    ERR_PR_TOKEN_EXPIRED: {
      code: '20004',
      message: 'You are not authorized to access this resource. Please login again..',
      internalDescription: 'Token provided while accessing the protected route has been expired.',
    },
    ERR_PR_BRANCH_DETAILS_UNAUTHORIZED_REQUEST: {
      code: '20005',
      message: 'You are not authorized to access this resource. Please login again..',
      internalDescription: 'Token provided while accessing the protected route has been expired.',
    },
  },

  //
  // DATABASE ERRORS
  // These error occurred when given values does not match with the value
  // present in DB or they are missing
  // ERR_<Operation>_<Description>
  //
  dbError: {
    ERR_DELETE_ORDER_DOESNOT_EXIST: {
      code : "30001",
      message : "Order is been deleted before or does not exist, please check the list to proceed",
      internalDescription: "When the user tried to delete an order there was no error and delete was unsuccessful this may be because of the data absence in the DB or some other DB error",
    }
    
  },
  dbError: {
    ERR_DELETE_GROSS_DOESNOT_EXIST: {
      code : "80001",
      message : "GROSS is been deleted before or does not exist, please check the list to proceed",
      internalDescription: "When the user tried to delete an gross there was no error and delete was unsuccessful this may be because of the data absence in the DB or some other DB error",
    }
  },
  dbError: {
    ERR_LOGIN_USER_PASSWORD_NO_MATCH: {
      code : "90001",
      message : "wrong password",
      internalDescription: "When the user tried to delete an gross there was no error and delete was unsuccessful this may be because of the data absence in the DB or some other DB error",
    }
  },
  dbError: {
    ERR_LOGIN_STUDENT_PASSWORD_NO_MATCH: {
      code : "40001",
      message : "password doesnt match",
      internalDescription: "When the password doesnt match with the rollnum ",
    }
  },
  dbError: {
    ERR_LOGIN_EMPLOYEE_PASSWORD_NO_MATCH: {
      code : "80001",
      message : "password doesnt match",
      internalDescription: "When the password doesnt match with the empid ",
    }
  },
  dbError: {
    ERR_LOGIN_EMP_PASSWORD_NO_MATCH: {
      code : "80002",
      message : "password doesnt match",
      internalDescription: "When the password doesnt match with the empid ",
    }
  },
  dbError: {
    ERR_LOGIN_STU_PASSWORD_NO_MATCH: {
      code : "80003",
      message : "password doesnt match",
      internalDescription: "When the password doesnt match with the empid ",
    }
  },
  dbError: {
    ERR_LOGIN_PATIENT_PASSWORD_NO_MATCH: {
      code : "80004",
      message : "password doesnt match",
      internalDescription: "When the password doesnt match with the email ",
    }
  },
  dbError: {
    ERR_LOGIN_DOCTOR_PASSWORD_NO_MATCH: {
      code : "80005",
      message : "password doesnt match",
      internalDescription: "When the password doesnt match with the email ",
    }
  },



  //
  // INTERNAL SERVER ERRORS
  // These errors occurs when some server modules throws error
  // For example hashing module or encoding module. The operation
  // done on server which does not involve DB. This also involve some external API
  // call returned error or failed.
  //
  internalError: {
    USER_REGISTRATION_UNSUCCESSFUL:{
      code : "60001",
      message :errMsg.INTERNAL_SERVER_ERROR,
      internalDescription : "there was error in getting the list of users in the users list route"
    
    },

    USER_LIST_REGISTRATION_UNSUCCESSFUL:{
      code : "60002",
      message :errMsg.INTERNAL_SERVER_ERROR,
      internalDescription : "there was error in getting the list of users in the users list route"
    
    },
    GROSS_REGISTRATION_UNSUCCESSFUL:{
      code : "70001",
      message :errMsg.INTERNAL_SERVER_ERROR,
      internalDescription : "there was error in getting the list of grosseries in the grosserey list route"
    
    },

    GROSS_LIST_REGISTRATION_UNSUCCESSFUL:{

      code : "70002",
      message : errMsg.INTERNAL_SERVER_ERROR,
      internalDescription: "there was error in getting the list of grosseries in the grosserey list route"
  },
  GROSS_UPDATE_REGISTRATION_UNSUCCESSFUL:{
    code : "70003",
    message :errMsg.INTERNAL_SERVER_ERROR,
    internalDescription : "there was error in getting the list of grosseries in the grosserey list route"
  
  },

  GROSS_DELETE_REGISTRATION_UNSUCCESSFUL:{
    code : "70004",
    message :errMsg.INTERNAL_SERVER_ERROR,
    internalDescription : "there was error in getting the list of grosseries in the grosserey list route"
  
  },


  STUDENT_REGISTRATION_UNSUCCESSFULL:{

    code : "10001",
    message : errMsg.INTERNAL_SERVER_ERROR,
    internalDescription: "There was error in getting the list of student in the students list route",
},
STUDENT_LIST_REGISTRATION_UNSUCCESSFUL:{

  code : "10002",
  message : errMsg.INTERNAL_SERVER_ERROR,
  internalDescription: "There was error in getting the list of student in the students list route",
},
STUDENT_UPDATE_REGISTRATION_UNSUCCESSFUL:{

  code : "10003",
  message : errMsg.INTERNAL_SERVER_ERROR,
  internalDescription: "There was error in getting the list of student in the students list route",
},
ERR_STUDENT_GET_NUMBER_OF_STUDENTS:{

  code : "10004",
  message : errMsg.INTERNAL_SERVER_ERROR,
  internalDescription: "There was error in getting the list of student in the students list route",
},


EMPLOYEE_REGISTRATION_UNSUCCESSFULL:{

  code : "20001",
  message : errMsg.INTERNAL_SERVER_ERROR,
  internalDescription: "There was error in getting the list of employee in the employee list route",
},
EMPLOYEE_LIST_REGISTRATION_UNSUCCESSFULL:{

  code : "20002",
  message : errMsg.INTERNAL_SERVER_ERROR,
  internalDescription: "There was error in getting the list of employee in the employee list route",
},
EMPLOYEE_DELETE_LIST_REGISTRATION_UNSUCCESSFULL:{

  code : "20003",
  message : errMsg.INTERNAL_SERVER_ERROR,
  internalDescription: "There was error in getting the list of employee in the employee list route",
},
EMP_LIST_REGISTRATION_UNSUCCESSFULL:{

  code : "60004",
  message : errMsg.INTERNAL_SERVER_ERROR,
  internalDescription: "There was error in getting the list of emp in the emp list route",
},
EMP_REGISTRATION_UNSUCCESSFULL:{

  code : "60002",
  message : errMsg.INTERNAL_SERVER_ERROR,
  internalDescription: "There was error in getting the list of emp in the emp list route",
},
EMP_UPDATE_REGISTRATION_UNSUCCESSFUL:{
  code : "60003",
  message :errMsg.INTERNAL_SERVER_ERROR,
  internalDescription : "there was error in getting the list of emp in the emp list route"

},
STU_LIST_REGISTRATION_UNSUCCESSFULL:{

  code : "60005",
  message : errMsg.INTERNAL_SERVER_ERROR,
  internalDescription: "There was error in getting the list of student in the stu list route",
},
STU_REGISTRATION_UNSUCCESSFULL:{

  code : "60006",
  message : errMsg.INTERNAL_SERVER_ERROR,
  internalDescription: "There was error in getting the list of student in the stu list route",
},
DEP_LIST_REGISTRATION_UNSUCCESSFULL:{

  code : "60007",
  message : errMsg.INTERNAL_SERVER_ERROR,
  internalDescription: "There was error in getting the list of student in the stu list route",
},
SUBJECTS_LIST_REGISTRATION_UNSUCCESSFULL:{

  code : "60008",
  message : errMsg.INTERNAL_SERVER_ERROR,
  internalDescription: "There was error in getting the list of subjects in the sub list route",
},
MARKS_LIST_REGISTRATION_UNSUCCESSFULL:{

  code : "60009",
  message : errMsg.INTERNAL_SERVER_ERROR,
  internalDescription: "There was error in getting the list of subjects in the sub list route",
},
SUBJECTS_REGISTRATION_UNSUCCESSFULL:{

  code : "70007",
  message : errMsg.INTERNAL_SERVER_ERROR,
  internalDescription: "There was error in getting the list of subjects in the sub list route",
},

DOCTOR_LIST_REGISTRATION_UNSUCCESSFUL:{

  code : "10001",
  message : errMsg.INTERNAL_SERVER_ERROR,
  internalDescription: "There was error in getting the list of doctors in the dr list route",
},

DOCTOR_REGISTRATION_UNSUCCESSFULL:{

  code : "10002",
  message : errMsg.INTERNAL_SERVER_ERROR,
  internalDescription: "There was error in getting the list of doctor in the dr list route",
},

DOCTOR_UPDATE_REGISTRATION_UNSUCCESSFULL:{

  code : "10005",
  message : errMsg.INTERNAL_SERVER_ERROR,
  internalDescription: "There was error in updatd the list of doctor in the dr list route",
},

PATIENT_LIST_REGISTRATION_UNSUCCESSFUL:{

  code : "10003",
  message : errMsg.INTERNAL_SERVER_ERROR,
  internalDescription: "There was error in getting the list of patient in the pt list route",
},

PATIENT_REGISTRATION_UNSUCCESSFULL:{

  code : "10004",
  message : errMsg.INTERNAL_SERVER_ERROR,
  internalDescription: "There was error in getting the list of patient in the pt list route",
},






    ERR_ORDER_LIST_QUERY_ERROR:{

      code : "50001",
      message : errMsg.INTERNAL_SERVER_ERROR,
      internalDescription: "There was error in getting the list of orders in the orders list route",
  },
  ERR_ORDER_INSERT_FAILURE: {
    code : "50002",
      message : errMsg.INTERNAL_SERVER_ERROR,
      internalDescription: "There was error in getting the list of orders in the orders insert route",
  },
  ERR_ORDER_UPDATE_FAILURE:{
  code : "50003",
      message : errMsg.INTERNAL_SERVER_ERROR,
      internalDescription: "There was error in getting the list of orders in the orders  update route",
},
ERR_ORDER_DELETE_FAILURE:{
  code : "50004",
      message : errMsg.INTERNAL_SERVER_ERROR,
      internalDescription: "There was error in getting the list of orders in the orders delete route",

}


  }

};

module.exports.errMsg = errMsg;
module.exports.errList = errList;
