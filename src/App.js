import React, { useState } from 'react';
import axios from 'axios';

function App() {
const [url, setUrl] = useState('');
const [urlList, setUrlList] = useState([]);

const getUrls = async (url) => {
try {
const response = await axios.get('http://localhost:4000/scrape', {
params: {
url: url,
},
});
return response;
} catch (error) {
console.error(error);
}
};

const onSubmit = async (e) => {
e.preventDefault();
const response = await getUrls(url);
if (response.status === 200) {
setUrlList(response.data);
} else {
console.error(response);
}
};

return (
<div>
<form onSubmit={onSubmit}>
<input
type="text"
placeholder="Enter URL"
value={url}
onChange={(e) => setUrl(e.target.value)}
/>
<button type="submit">Submit</button>
<span style={{ color: 'red' }}>{urlList.length} URLs found</span>
</form>
<ul>
{urlList.map((link, index) => (
<li key={link}>{link}</li>
))}
</ul>
</div>
);
}

export default App;