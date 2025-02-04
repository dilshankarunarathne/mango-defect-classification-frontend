import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './header'; 
import Footer from './footer';
import ResultPage from './results';

function Home() {
  const [fileSelected, setFileSelected] = useState(null);
  const [previewSource, setPreviewSource] = useState();
  const [prediction, setPrediction] = useState(null); 

  const handleFileChange = (event) => {
    if (event.target.files.length > 0) {
      setFileSelected(event.target.files[0]);
      previewFile(event.target.files[0]);
    } else {
      setFileSelected(null);
    }
  };

  const previewFile = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setPreviewSource(reader.result);
    };
  };

  const uploadFile = async () => {
    const formData = new FormData();
    formData.append('file', fileSelected);
  
    const response = await fetch('http://127.0.0.1:8000/api/classify', {
      method: 'POST',
      body: formData,
    });
  
    if (response.ok) {
      const data = await response.json();
      setPrediction(data.prediction); 
    } else {
      alert('File upload failed');
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (fileSelected) {
      uploadFile();
    } else {
      alert('Please select a file before submitting.');
    }
  };

  return (
    <div>
      <Header />
      <div style={{
        backgroundImage: `url(${process.env.PUBLIC_URL + '/bg.jpg'})`,
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat'
      }}>
            <div className='flex h-screen ml-4 mr-4 ' style={{ alignItems: 'baseline', height: "79vh" }}>
              <div className='image-select w-1/2'>
                <div 
                className='image-select w-1/2 border border-gray-400 bg-green-200 p-4 text-l font-bold'
                style={{ width: "80%" }}
                >
                  <div>
                    <h3>Select the mango image to check if it's consumable...</h3>
                  </div>
                  <div className="mt-4 text-l font-bold">
                    <input
                      type="file"
                      id="imageUpload"
                      name="imageUpload"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                    {/* <label htmlFor="imageUpload">Upload Image</label> */}
                  </div>
                  <br></br>
                  {previewSource && (
                    <img src={previewSource} alt="chosen" style={{ height: '300px' }} />
                  )}
                  <br></br>
                  <form>
                    <button
                      type="button" 
                      className="bg-blue-500 hover-bg-blue-700 text-white font-bold py-2 px-4 rounded"
                      onClick={handleSubmit}
                    >
                      Submit
                    </button>
                  </form>
                </div>
              </div>

              <div className='result-box w-1/2 border border-gray-400 bg-green-200 p-4 mt-4'>
                <div className='text-xl font-bold items-center justify-center p-4'>
                  {prediction ? (
                    <div>
                      <h3 className={prediction === 'not consumable' ? 'text-red-500' : 'text-green-600'}>
                        This mango is {prediction}
                      </h3>
                    </div>
                  ) : (
                    <div>
                      <h3>
                        The result will appear here...
                      </h3>
                    </div>
                  )}
                </div>
              </div>
      </div>
      {/* <Footer /> */}
    </div>
    </div>
  );
}

export default Home;
