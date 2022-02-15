import { useEffect, useState } from "react";
import { getImages, searchImages } from "./Api";
// import images from "./api-mock.json";
import "./App.css";

function App() {
  // const [imageList, setImageList] = useState(images.resources);
  const [imageList, setImageList] = useState([]);
  const [nextCursor, setNextCursor] = useState(null);
	const [searchValue, setSearchValue] = useState('');

  useEffect(()=>{
    const fetchData = async() =>{
      const responseJson = await getImages();
      setImageList(responseJson.resources);
      setNextCursor(responseJson.next_cursor);
    };
    fetchData();
  },[]);

  const handleLoadMoreButton = async() =>{
    const responseJson = await getImages(nextCursor);
    setImageList((currentImageList)=>[
      ...currentImageList,
      ...responseJson.resources,
    ]);
    setNextCursor(responseJson.next_cursor);
  };

  const handleFormSubmit = async(e) =>{
    e.preventDefault();
    const responseJson = await searchImages(searchValue, nextCursor);
    setImageList(responseJson.resources);
    setNextCursor(responseJson.next_cursor);
  };

  const resetForm = async() =>{
    const responseJson = await getImages();
    setImageList(responseJson.resources);
    setNextCursor(responseJson.next_cursor);

    setSearchValue('');
  };

  return (
    <>
      <form onSubmit={handleFormSubmit} >
        <input
          value={searchValue}
          onChange={(e)=>setSearchValue(e.target.value)}
          required="required" 
          placeholder="Search image..."
        ></input>
        <button type="submit">Search</button>
        <button type="button" onClick={resetForm}>
          Clear
        </button>
      </form>
      <div className='image-grid'>
        {imageList.map((image) => (
          <img src={image.url} alt={image.public_id}></img>
        ))}
      </div>
      <div className="footer">
        {nextCursor && (
          <button onClick={handleLoadMoreButton}>Load More</button>
        )}
      </div>
    </>
  );
}

export default App;
