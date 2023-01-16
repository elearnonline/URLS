import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [url, setUrl] = useState('');
  const [urlList, setUrlList] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get('http://yourserverip:5000/scrape', {
        params: {
          url: url
        }
      });
      setUrlList(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
       
      <input
          type="text"
          placeholder="Enter URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button type="submit">Submit</button>
      </form>
      <div>
        {urlList.map((link) => (
          <a href={link} key={link}>
            {link}
          </a>
        ))}
      </div>
    </div>
  );
}

export default App;
