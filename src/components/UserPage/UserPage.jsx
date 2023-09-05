import React, { useState, useEffect } from 'react';
import LogOutButton from '../LogOutButton/LogOutButton';
import { useDispatch, useSelector } from 'react-redux';

function UserPage() {
  const dispatch = useDispatch();
  const user = useSelector((store) => store.user); // user table
  const info = useSelector((store) => store.info.info); // info table
  const [avatar, setAvatar] = useState(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  
  const imageBlob = info && info.image_data ? new Blob([new Uint8Array(info.image_data.data)], { type: 'image/jpeg' }) : null;
  const imageUrl = imageBlob ? URL.createObjectURL(imageBlob) : null;

  useEffect(() => {
    dispatch({ type: 'FETCH_INFO' });
  }, []);

  // Function to handle file upload and create a blob
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const blob = new Blob([e.target.result], { type: file.type });
        setAvatar(blob);
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const handleFirstNameChange = (event) => {
    setFirstName(event.target.value);
  };

  const handleLastNameChange = (event) => {
    setLastName(event.target.value);
  };

  // Function to dispatch the blob when the "Save" button is clicked
  const handleSaveClick = () => {
    if (avatar && firstName != '' && lastName != '') {
      dispatch({
        type: 'ADD_INFO',
        payload: {
          avatar,
          firstName,
          lastName,
        },
      });
    }
  };

  return (
    <div className="container">
      <h2>Welcome, {user.username}!</h2>
      <p>Your ID is: {user.id}</p>

      {imageUrl && (
        <img
          src={imageUrl}
          alt="Avatar"
          style={{ maxWidth: '100px' }}
        />
      )}

      {/* Input element for uploading an avatar */}
      <input
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
      />

      <input
        type="text"
        placeholder="First Name"
        value={firstName}
        onChange={handleFirstNameChange}
      />

      <input
        type="text"
        placeholder="Last Name"
        value={lastName}
        onChange={handleLastNameChange}
      />

      {/* Save button */}
      <button onClick={handleSaveClick}>Save</button>

      {/* <LogOutButton className="btn" /> */}
    </div>
  );
}

export default UserPage;
