import React, { useState } from 'react';
import { Form, Button, Alert, InputGroup } from 'react-bootstrap';
import './RegistrationForm.css';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logo from './logo.png';
import validator from 'validator';

function Header() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <a className="navbar-brand" href="#">
          <img src={logo} alt="Logo" width="200" height="100" className="d-inline-block align-text-top me-2" />
        </a>
      </div>
    </nav>
  );
}



const RegistrationForm = () => {
  // State variables for form fields
  const [fullName, setFullName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [email, setEmail] = useState('');
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // State variables for form validation and API response
  const [validated, setValidated] = useState(false);
  const [alertVariant, setAlertVariant] = useState('');
  const [alertMessage, setAlertMessage] = useState('');

  // Event handlers for form fields
  const handleFullNameChange = (event) => {
    const value = event.target.value;
    setFullName(value);
    setIsInvalid((prevState) => ({ ...prevState, fullName: !validateFullName(value) }));
  };
  const handleContactNumberChange = (event) => {
    const value = event.target.value.replace(/[^\d]/g, '');
    let formattedValue = '';
  
    if (value.length > 0) {
      formattedValue = value.slice(0, 3);
  
      if (value.length >= 4) {
        formattedValue += '-' + value.slice(3, 6);
      }
  
      if (value.length >= 7) {
        formattedValue += '-' + value.slice(6, 10);
      }
    }
  
    setContactNumber(formattedValue);
    setIsInvalid((prevState) => ({ ...prevState, contactNumber: !validateContactNumber(formattedValue) }));
  };
  const handleEmailChange = (event) => {
    const value = event.target.value;
    setEmail(value);
    setIsInvalid((prevState) => ({ ...prevState, email: !validateEmail(value) }));
  };
  const handleDayChange = (event) => setDay(event.target.value);
  const handleMonthChange = (event) => setMonth(event.target.value);
  const handleYearChange = (event) => setYear(event.target.value);
  const handlePasswordChange = (event) => {
    const passwordValue = event.target.value;
    const passwordIsValid = validatePassword(passwordValue); // validatePassword is a function that returns true or false
    setIsInvalid({ ...isInvalid, password: !passwordIsValid });
    setPassword(passwordValue);
  };
  const handleConfirmPasswordChange = (event) => {
    const value = event.target.value;
    setConfirmPassword(value);
  
    if (value === password) {
      setIsInvalid({ ...isInvalid, confirmPassword: false });
    } else {
      setIsInvalid({ ...isInvalid, confirmPassword: true });
    }
  };


    const [isInvalid, setIsInvalid] = useState({ 
      email: false,
      fullName: false,
      contactNumber: false,
      day: false,
      month: false,
      year: false,
      password: false,
      confirmPassword: false
    });

    function validateFullName(fullName) {
      const regex = /^[a-zA-Z ]+$/;
      return regex.test(fullName);
    }

    function validateEmail(email) {
      const re = /\S+@\S+\.\S+/;
      return re.test(email);
    }

    function validateContactNumber(contactNumber) {
      
      // Check if the cleaned value matches the Canadian phone number pattern
      const isValid = /\d{3}-\d{3}-\d{4}/.test(contactNumber);
      
      return isValid;
    }

    function validatePassword(password) {
      const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
      return regex.test(password);
    }

    function validateConfirmPassword(password, confirmPassword) {
      return password === confirmPassword;
    }

  function validateForm(fullName, contactNumber, email, day, month, year, password, confirmPassword) {
    let isValid = true;
  
    if (!fullName || !validateFullName(fullName)) {
      isValid = false;
    }
  
    if (!contactNumber || !validateContactNumber(contactNumber)) {
      isValid = false;
    }
  
    if (!email || !validateEmail(email)) {
      isValid = false;
    }
  
    if (!day || !month || !year) {
      isValid = false;
    }
  
    if (!password || !validatePassword(password)) {
      isValid = false;
    }
  
    if (!validateConfirmPassword(password, confirmPassword)) {
      isValid = false;
    }
  
    return isValid;
  }

  // handle click event on form fields
const handleClick = (event) => {
  const input = event.target;
    
  // check if input is empty and set isInvalid state accordingly
  if (!input.value.trim()) {
    setIsInvalid({ ...isInvalid, [input.name]: true });
  } else {
    setIsInvalid({ ...isInvalid, [input.name]: false });
  }
};

  // Form submission handler
  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const isValid = validateForm(fullName, contactNumber, email, day, month, year, password, confirmPassword);
  
    if (!isValid) {
      setValidated(true);
      toast.error("There was an error creating the account.", {
             position: "top-right",
             className: 'toast-message',
             hideProgressBar: true
          });
      return;
    }
  
    // Send API request to create new user account and display toast message
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        full_name: fullName,
        contact_number: contactNumber,
        email: email,
        date_of_birth: `${day} ${month} ${year}`,
        password: password,
        confirm_password: confirmPassword
      }),
    };
  
    fetch('https://fullstack-test-navy.vercel.app/api/users/create', requestOptions)
      .then((response) => response.json())
      .then((data) => {
        // Display alert message based on API response
        console.log(data.title);
        if (data.title === 'Success') {
          toast.success("User account successfully created.", {
            position: "top-right",
          className: 'success',
          hideProgressBar: true
          });
          setAlertVariant('success');
          setAlertMessage(data.message);
      }
        else {
          if(data.title === 'Registration Error') {
          setAlertVariant('danger');
          setAlertMessage(data.message);
          toast.error("There was an error creating the account.", {
             position: "top-right",
             className: 'toast-message',
             hideProgressBar: true
          });
        }
      }
      })
      .catch((error) => {
        setAlertVariant('danger');
        setAlertMessage('An error occurred while processing your request.');
        toast.error("There was an error creating the account.", {
          position: "top-right",
          className: 'toast-message',
          hideProgressBar: true
       });
      });
  
    setValidated(true);
  };
  

  // Cancel form submission handler
  const handleCancel = () => {
    setFullName('');
    setContactNumber('');
    setEmail('');
    setDay('');
    setMonth('');
    setYear('');
    setPassword('');
    setConfirmPassword('');
    setValidated(false);
    setAlertVariant('');
    setAlertMessage('');
    setIsInvalid({ email: false, fullName: false, contactNumber: false, day: false, month: false, year: false, password: false, confirmPassword: false });
  };

const days = [];
for (let i = 1; i <= 31; i++) {
  days.push(i);
}

const months = [  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',];

const currentYear = new Date().getFullYear();
const years = [];
for (let i = currentYear; i >= currentYear - 100; i--) {
  years.push(i);
}

  return (
    <div>
      <Header />
      <ToastContainer />
      <div className="form-header">
          <h3>Create User Account</h3>
        </div>
    <div className='RegistrationForm'>
      
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Form.Group controlId='fullName'>
          <Form.Label>Full Name <span className="star">*</span></Form.Label>
          <Form.Control
            required
            type='text'
            placeholder='Enter full name'
            value={fullName}
            onChange={handleFullNameChange}
            onClick={handleClick}
            isInvalid={isInvalid.fullName}
          />
          <Form.Control.Feedback type='invalid'>
            Please enter your full name.
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group controlId='email'>
      <Form.Label>Email <span className="star">*</span></Form.Label>
      <Form.Control
        required
        type='email'
        placeholder='Enter email'
        value={email}
        onChange={handleEmailChange}
        onClick={handleClick}
        pattern='[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$'
        isInvalid={isInvalid.email}
      />
      <Form.Control.Feedback type='invalid'>
        Please enter a valid email address.
      </Form.Control.Feedback>
    </Form.Group>
    <Form.Group controlId='contactNumber'>
  <Form.Label>Contact Number <span className="star">*</span></Form.Label>
  <InputGroup>
    
    <Form.Control
      required
      type='tel'
      placeholder='555-555-5555'
      pattern='[0-9]{3}-[0-9]{3}-[0-9]{4}'
      value={contactNumber}
      onChange={handleContactNumberChange}
      onClick={handleClick}
      isInvalid={isInvalid.contactNumber}
    />
    <Form.Control.Feedback type='invalid'>
      Please enter a valid Canadian phone number.
    </Form.Control.Feedback>
  </InputGroup>
</Form.Group>
<Form.Group controlId='dateOfBirth'>
  <Form.Label>Date of Birth <span className="star">*</span></Form.Label>
  <div className='row'>
    <div className='col'>
      <Form.Control
        required
        as='select'
        value={day}
        onChange={handleDayChange}
        onClick={handleClick}
      >
        <option value=''>Day</option>
        {days.map((day) => (
          <option key={day} value={day}>
            {day}
          </option>
        ))}
      </Form.Control>
      <Form.Control.Feedback type='invalid'>
        Please select a valid day.
      </Form.Control.Feedback>
    </div>
    <div className='col'>
      <Form.Control
        required
        as='select'
        value={month}
        onChange={handleMonthChange}
        onClick={handleClick}
      >
        <option value=''>Month</option>
        {months.map((month, index) => (
          <option key={index} value={month}>
            {month}
          </option>
        ))}
      </Form.Control>
      <Form.Control.Feedback type='invalid'>
        Please select a valid month.
      </Form.Control.Feedback>
    </div>
    <div className='col'>
      <Form.Control
        required
        as='select'
        value={year}
        onChange={handleYearChange}
        onClick={handleClick}
      >
        <option value=''>Year</option>
        {years.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </Form.Control>
      <Form.Control.Feedback type='invalid'>
        Please select a valid year.
      </Form.Control.Feedback>
    </div>
  </div>
</Form.Group>

    <Form.Group controlId='password'>
      <Form.Label>Password <span className="star">*</span></Form.Label>
      <Form.Control
        required
        type='password'
        placeholder='Enter password'
        value={password}
        onChange={handlePasswordChange}
        onClick={handleClick}
        pattern='^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$'
        isInvalid={isInvalid.password}
      />
      <Form.Control.Feedback type='invalid'>
        Password must be at least 8 characters and contain at least one uppercase letter, one lowercase letter, and one number.
      </Form.Control.Feedback>
    </Form.Group>
    <Form.Group controlId='confirmPassword'>
      <Form.Label>Confirm Password <span className="star">*</span></Form.Label>
      <Form.Control
        required
        type='password'
        placeholder='Confirm password'
        value={confirmPassword}
        onChange={handleConfirmPasswordChange}
        onClick={handleClick}
        pattern={password}
        isInvalid={isInvalid.confirmPassword}
      />
      <Form.Control.Feedback type='invalid'>
        Passwords do not match.
      </Form.Control.Feedback>
    </Form.Group>
    
  </Form>
  {alertMessage && (
    <Alert className='mt-3' variant={alertVariant}>
      {alertMessage}
    </Alert>
  )}
  
</div>
<div className="button">
    <Button className="btn-cancel" variant='secondary' type='button' onClick={handleCancel}>
          Cancel
        </Button>
        <Button className="btn-submit" variant='primary' type='submit'onClick={handleSubmit}>
      Submit
    </Button>
        </div>
</div>
);
};

export default RegistrationForm;