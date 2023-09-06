import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

function UserPage() {
  const dispatch = useDispatch();
  
  const user = useSelector((store) => store.user); // "user" table
  const info = useSelector((store) => store.info.info); // "info" table
  const [avatar, setAvatar] = useState(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isEditing, setIsEditing] = useState(false); // Track whether the user is in edit mode

  const imageBlob = info && info.image_data ? new Blob([new Uint8Array(info.image_data.data)], { type: 'image/jpeg' }) : null;
  const imageUrl = imageBlob ? URL.createObjectURL(imageBlob) : null;

  useEffect(() => {
    dispatch({ type: 'FETCH_INFO' });
  }, []);

  useEffect(() => {
    // Set initial values of input fields based on info
    if (info) {
      setFirstName(info.first_name || '');
      setLastName(info.last_name || '');
      setAvatar(info.image_data || null);
    }
  }, [info]);

  console.log('info', info);

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

  // Function to dispatch updated information when the "Save Edit" button is clicked
  const handleEditClick = () => {
    if (firstName !== '' && lastName !== '') {
      dispatch({
        type: 'EDIT_INFO',
        payload: {
          id: info.id,
          firstName,
          lastName,
          avatar,
        },
      });
      setIsEditing(false); // Exit edit mode after saving
    }
  };

  // Function to dispatch new information when the "Save" button is clicked
  const handleSaveClick = () => {
    if (avatar && firstName !== '' && lastName !== '') {
      dispatch({
        type: 'ADD_INFO',
        payload: {
          avatar,
          firstName,
          lastName,
        },
      });
      setIsEditing(false); // Exit edit mode after saving
    }
  };


  return (
    <div className="container">
      <h2>Welcome, {user.username}!</h2>
      <p>Your ID is: {user.id}</p>

      {Object.keys(info).length > 0 ? (
        isEditing ? (
          <div>
            <form
              onSubmit={handleEditClick}
            >
              <img
                src={imageUrl}
                alt="Avatar"
                style={{ maxWidth: '100px' }}
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
              />
              <input
                required
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={handleFirstNameChange}
              />
              <input
                required
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={handleLastNameChange}
              />
              <button>Save</button>
              <button onClick={() => setIsEditing(false)}>Cancel</button>
            </form>
          </div>
        ) : (
          <div>
            <img
              src={imageUrl}
              alt="Avatar"
              style={{ maxWidth: '100px' }}
            />
            <p>First Name: {info.first_name}</p>
            <p>Last Name: {info.last_name}</p>
            <button onClick={() => setIsEditing(true)}>Edit</button>
          </div>
        )
      ) : (
        <form
          onSubmit={handleSaveClick}
        >
            <input
              required
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
          />
          <input
            required
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={handleFirstNameChange}
          />
          <input
            required
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={handleLastNameChange}
          />
          <button>Save</button>
        </form>
      )}
    </div>
  );
}

export default UserPage;
