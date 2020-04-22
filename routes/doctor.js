const express = require('express');
const error = require('../model/error');
const pool = require('../database/db');
const rG = require('../model/response-generator');
const constant = require('../model/constant');
const router = express.Router();
const vs = require('../model/validator-sanitizer');
const auth = require('../model/auth');

router.get('/list', async (req, res) => {
  try {
    const [doctor] = await pool.execute('select * from doctor', []);
    return res.status(200).send(rG.success('doctor list', 'doctor retrienved successfully', doctor));
  } catch (e) {
    return res.status(500).send(rG.internalError(error.errList.internalError.DOCTOR_LIST_REGISTRATION_UNSUCCESSFUL));
  }
});

router.post(
  '/add',
  [
    vs.isNumeric('body', 'drid', 3, 50, 'please enter a valid drid'),
    vs.isValidStrLenWithTrim('body', 'drname', 3, 20, 'please provide valid drame'),
    vs.isValidStrLenWithTrim('body', 'specialization', 3, 30, 'please provide valid specialization'),

    vs.isValidStrLenWithTrim('body', 'email', 3, 30, 'please provide valid email'),

    vs.isNumeric('body', 'phonenumber', 3, 30, 'please provide valid phonenumber'),

    vs.isValidStrLenWithTrim('body', 'password', 3, 30, 'please provide valid password'),
  ],

  async (req, res) => {
    const errors = vs.getValidationResult(req);
    if (!errors.isEmpty()) {
      const fieldsToValidate = ['drid', 'drname', 'specialization', 'email', 'phonenumber', 'password'];
      return res.status(422).send(rG.validationError(errors.mapped(), fieldsToValidate));
    }
    const password = req.body.password;
    let hashedPassword;
    try {
      hashedPassword = await auth.hashPassword(password);
      console.log(hashedPassword);
    } catch (e) {
      console.log(e);
    }
    try {
      const [rows] = await pool.execute('INSERT INTO doctor(drid,drname,specialization,email,phonenumber,password) VALUES (?,?,?,?,?,?)', [
        req.body.drid,
        req.body.drname,
        req.body.specialization,
        req.body.email,
        req.body.phonenumber,
        req.body.password,
      ]);
      console.log(rows);
      if (rows.affectedRows === 1) {
        return res.status(200).send(rG.success('doctor add', 'doctor added successfully', []));
      }
    } catch (e) {
      console.log(e);
      return res.status(500).send(rG.internalError(error.errList.internalError.DOCTOR_REGISTRATION_UNSUCCESSFULL));
    }
  },
);

router.post(
  '/login',
  [
    vs.isValidStrLenWithTrim('body', 'email', 3, 5, 'please enter a number between 3 to 50 characters'),
    vs.isValidStrLenWithTrim('body', 'password', 3, 20, 'please provide valid password'),
  ],
  async (req, res) => {
    const errors = vs.getValidationResult(req);
    if (!errors.isEmpty()) {
      const fieldsToValidate = ['email', 'password'];
      return res.status(422).send(rG.validationError(errors.mapped(), fieldsToValidate));
    }
    let doctor;
    try {
      [doctor] = await pool.execute('select email ,password from doctor where email?', [req.body.email]);
      if (doctor.length === 0) {
          const responsePasswordNoMatch = rG.dbError(error.errList.dbError.ERR_LOGIN_DOCTOR_PASSWORD_NO_MATCH);
          return res.status(400).send(responsePasswordNoMatch);
      }
    } catch (e) {
      console.log(e);
      return res.status(500).send(rG.internalError(error.errList.internalError.DOCTOR_LIST_REGISTRATION_UNSUCCESSFUL));
    }

    let areEqual;
    try {
      areEqual = await auth.verifyPassword(req.body.password, doctor[0].password);
    } catch (e) {
      console.log(e);
    }
    console.log(areEqual);
    if (!areEqual) {
      const responsePasswordNoMatch = rG.dbError(error.errList.dbError.ERR_LOGIN_DOCTOR_PASSWORD_NO_MATCH);
      return res.status(400).send(responsePasswordNoMatch);
    }
    let token;
    try {
      token = auth.genAuthToken({
        id: doctor[0].email,
      });
    } catch (e) {
      console.log(e);
    }
    console.log(token);
    return res.status(200).header('x-auth-token', token).send(rG.success('login', 'Login Successful!!!', []));
  },
);

router.get('/profile', auth.protectTokenVerify, async (req, res) => {
  console.log(req.user);
  try {
    const [doctor] = await pool.execute('select drid,drname,specialization,email,phonenumber,password from doctor where email=?', [req.user.id]);
    return res.status(200).send(rG.success('doctor list', 'doctor  retrienved successfully', doctor));
  } catch (e) {
    console.log(e);
    return res.status(500).send(rG.internalError(error.errList.internalError.DOCTOR_LIST_REGISTRATION_UNSUCCESSFUL));
  }
});

router.put(
  '/update/:drid',
  [
    vs.isNumeric('params', 'drid', 'please enter a valid drid'),
    vs.isValidStrLenWithTrim('body', 'drname', 3, 20, 'please provide valid drname'),
    vs.isValidStrLenWithTrim('body', 'specialization', 3, 30, 'please provide valid specialization'),

    vs.isValidStrLenWithTrim('body', 'email', 3, 30, 'please provide valid email'),

    vs.isNumeric('body', 'phonenumber', 3, 30, 'please provide valid phonenumber'),

    vs.isValidStrLenWithTrim('body', 'password', 3, 30, 'please provide valid password'),
  ],
  async (req, res) => {
    const errors = vs.getValidationResult(req);
    if (!errors.isEmpty()) {
      const fieldsToValidate = ['drid', 'drname', 'specialization', 'email', 'phonenumber', 'password'];
      return res.status(422).send(rG.validationError(errors.mapped(), fieldsToValidate));
    }
    try {
      const [rows] = await pool.execute('UPDATE doctor SET drname=?,specialization=?,email=?,phonenumber=?,password=? WHERE drid=?', [
        req.body.drname,
        req.body.specialization,
        req.body.email,
        req.body.phonenumber,
        req.body.password,
        req.params.drid,
      ]);
      console.log(rows);

      return res.status(200).send(rG.success('doctor update', 'doctor updated successfully', []));
    } catch (e) {
      console.log(e);
      return res.status(500).send(rG.internalError(error.errList.internalError.DOCTOR_UPDATE_REGISTRATION_UNSUCCESSFUL));
    }
  },
);

/* router.delete('/delete/:gid', async (req, res) => {
    try {
      const [rows] = await pool.execute('DELETE  from gross where gid=?', [
        req.params.gid,
      ]);
      console.log(rows);
      if (rows.affectedRows === 1) {
        return res
          .status(200)
          .send(rG.success('gross delete', 'gross deleted successfully', []));
      }
      return res
        .status(400)
        .send(rG.dbError(error.errList.dbError. ERR_DELETE_GROSS_DOESNOT_EXIST));
    } catch (e) {
      console.log(e);
      return res
        .status(500)
        .send(
          rG.internalError(error.errList.internalError.GROSS_DELETE_REGISTRATION_UNSUCCESSFUL),
        );
      res.send(e);
    }
  });*/

module.exports = router;
