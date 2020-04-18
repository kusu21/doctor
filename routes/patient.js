const express = require('express');
const error = require('../model/error');
const pool = require('../database/db');
const rG = require('../model/response-generator');
const constant = require('../model/constant');
const router = express.Router();
const vs = require('../model/validator-sanitizer');
const auth = require("../model/auth");

router.get('/list', auth.protectDoctorMgmtRoute,
  [vs.isNumeric(
    'query',
    'page_no',
    'Please enter a valid page number'
  ),
  vs.isNumeric(
    'query',
    'limit',
    'Please give a valid page limit'
  ),
  ],
  async (req, res) => {
    const errors = vs.getValidationResult(req);
    if (!errors.isEmpty()) {
      const fieldsToValidate = ['page_no', 'limit'];
      return res
        .status(422)
        .send(rG.validationError(errors.mapped(), fieldsToValidate));
    }
    let patientsCount;
    try {
      [patientsCount] = await pool.execute('SELECT COUNT(*) AS noOfPatients FROM patient', []);
    } catch (e) {
      const beUnableToInsertDetailsToDb = error.errList.internalError.ERR_PATIENT_GET_NUMBER_OF_PATIENT;
      return res.status(500).send(responseGenerator.internalError(beUnableToInsertDetailsToDb));
    }
    console.log(patientsCount[0].noOfPatients);
    const startPoint=(req.query.page_no-1)*req.query.limit
    try {
      const [patient] = await pool.execute('select pid,pname,address,email,phonenumber from student ORDER BY email ASC LIMIT ? OFFSET ?', [req.query.limit,startPoint]);
      return res
        .status(200)
        .send(
          rG.success('patient list', 'patient retrienved successfully', patient),
        );
    } catch (e) {
      return res
        .status(500)
        .send(
          rG.internalError(
            error.errList.internalError.PATIENT_LIST_REGISTRATION_UNSUCCESSFUL,
          ),

        );
    }
  });
router.post(
  '/add',auth.protectDoctorMgmtRoute,
  [
    vs.isNumeric(
      'body',
      'pid',
      3,
      50,
      'please enter a number between 3 to 50 characters',
    ),
    vs.isValidStrLenWithTrim(
      'body',
      'pname',
      3,
      50,
      'please enter a name between 3 to 50 characters',
    ),
    vs.isValidStrLenWithTrim(
      'body',
      'address',
      3,
      50,
      'please enter a address between 3 to 50 characters',
    ),
    vs.isNumeric(
      'body',
      'email',
      3,
      50,
      'please enter a email between 3 to 50 characters',
    ),

    vs.isNumeric(
      'body',
      'phonenumber',
      3,
      10,
      'please provide valid phonenumber',
    ),
    vs.isValidStrLenWithTrim(
      'body',
      'password',
      3,
      50,
      'please enter valid password between 3 to 50 characters',
    ),
   
  ],
  async (req, res) => {
    const errors = vs.getValidationResult(req);
    if (!errors.isEmpty()) {
      const fieldsToValidate = ['pid', 'pname', 'address', 'email', 'phonenumber', 'password'];
      return res
        .status(422)
        .send(rG.validationError(errors.mapped(), fieldsToValidate));
    }
    const password = req.body.password;
    let hasedPassword;
    try {
      hashedPassword = await
        auth.hashPassword(password);
      console.log(hashedPassword);
    } catch (e) {
      console.log(e);
    }
    try {
      const [rows] = await pool.execute(
        'INSERT INTO patient(pid,pname,address,email,phonenumber,password) VALUES (?,?,?,?,?,?)',
        [req.body.pid, req.body.pname, req.body.address,req.body.email, req.body.phonenumber, hashedPassword],
      );
      console.log(rows);
      if (rows.affectedRows === 1) {
        return res
          .status(200)
          .send(rG.success('patient add', 'patient added successfully', []));
      }
    } catch (e) {
      console.log(e);
      return res
        .status(500)
        .send(
          rG.internalError(
            error.errList.internalError.PATIENT_REGISTRATION_UNSUCCESSFULL,
          ),
        );
    }
  },
);
router.post(
  '/login',
  [
    vs.isNumeric(
      'body',
      'email',
      3,
      50,
      'please enter a number between 3 to 50 characters',
    ),
    vs.isValidStrLenWithTrim(
      'body',
      'password',
      3,
      10,
      'please provide valid password',
    ),
  ],
  async (req, res) => {
    const errors = vs.getValidationResult(req);
    if (!errors.isEmpty()) {
      const fieldsToValidate = ['email', 'password'];
      return res
        .status(422)
        .send(rG.validationError(errors.mapped(), fieldsToValidate));
    }
    let patient;
    try {
      [patient] = await pool.execute('select email ,password from patient where email=?', [req.body.email]);
      if (patient.length === 0) {
        console.log(areEqual);
        if (!areEqual) {
          const responsePasswordNoMatch = rG.dbError(error.errList.dbError.ERR_LOGIN_PATIENT_PASSWORD_NO_MATCH);
          return res.status(400).send(responsePasswordNoMatch);
        }
      }
    } catch (e) {
      console.log(e);
      return res
        .status(500)
        .send(
          rG.internalError(
            error.errList.internalError.PATIENT_LIST_REGISTRATION_UNSUCCESSFUL,
          ),

        );
    }
    console.log(patient);
    let areEqual;
    try {
      areEqual = await auth.verifyPassword(req.body.password, patient[0].password);
    } catch (e) {
      console.log(e);
    }
    console.log(areEqual);
    if (!areEqual) {
      const responsePasswordNoMatch = rG.dbError(error.errList.dbError.ERR_LOGIN_PATIENT_PASSWORD_NO_MATCH);
      return res.status(400).send(responsePasswordNoMatch);
    }
    let token;
    try {
      token = auth.genAuthToken({
        id: patient[0].email
      });
    } catch (e) {
      console.log(e)
    }
    console.log(token);
    return res.status(200).header("x-auth-token", token).send(rG.success('login', 'Login Successful!!!', []));
  });

router.get('/profile', auth.protectTokenVerify, async (req, res) => {
  console.log(req.user);
  try {
    const [patient] = await pool.execute('select pid,pname,address,email,phonenumber from patient where email=?', [req.user.id]);
    return res
      .status(200)
      .send(
        rG.success('patient list', 'patient  retrienved successfully', patient),
      );
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .send(
        rG.internalError(
          error.errList.internalError.PATIENT_LIST_REGISTRATION_UNSUCCESSFUL,
        ),

      );
  }
});
/*router.put(
  '/update/:rollnum',
  [
    vs.isValidStrLenWithTrim(
      'body',
      'name',
      3,
      50,
      'please enter a number between 3 to 50 characters',
    ),
    vs.isValidStrLenWithTrim(
      'body',
      'email',
      3,
      50,
      'please enter a number between 3 to 50 characters',
    ),
    vs.isNumeric(
      'body',
      'mobilenumber',
      3,
      50,
      'please enter a number between 3 to 50 characters',
    ),

    vs.isValidStrLenWithTrim(
      'body',
      'password',
      3,
      10,
      'please provide valid password',
    ),
    vs.isValidStrLenWithTrim(
      'body',
      'department',
      3,
      50,
      'please enter a number between 3 to 50 characters',
    ),
    vs.isValidStrLenWithTrim(
      'body',
      'year',
      3,
      50,
      'please enter a number between 3 to 50 characters',
    ),
    vs.isNumeric(
      'body',
      'rollnum',
      3,
      50,
      'please enter valid rollnumber',
    ),
    vs.isDOB(
      'body',
      'dob',
      3,
      50,
      'please enter correct dob',
    ),
  ],

  async (req, res) => {
    const errors = vs.getValidationResult(req);
    if (!errors.isEmpty()) {
      const fieldsToValidate = ['name', 'email', 'mobilenumber', 'password', 'department', 'year', 'rollnum', 'dob'];
      return res
        .status(422)
        .send(rG.validationError(errors.mapped(), fieldsToValiedate));
    }
    try {
      const [rows] = await pool.execute(
        'UPDATE student SET name =?,email=?,mobilenumber=?,password=?,department=?,year=? WHERE rollnum=?',
        [req.body.name, req.body.email, req.body.mobilenumber, req.body.password, req.body.department, req.body.year, req.body.rollnum],
      );
      console.log(rows);

      return res
        .status(200)
        .send(rG.success('student update', 'student updated successfully', []));
    } catch (e) {
      console.log(e);
      return res
        .status(500)
        .send(
          rG.internalError(
            error.errList.internalError.STUDENT_UPDATE_REGISTRATION_UNSUCCESSFUL,
          ),
        );
    }
  },
);*/

module.exports = router;


