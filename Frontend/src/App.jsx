import { useState, useEffect } from 'react'
import Navbar from './components/Navbar.jsx'
import Table from './components/Table.jsx'
import './App.css'
import QrCode from './components/QrCode.jsx'

function App() {
  const [light, setLight] = useState(false);
  const [file, setFile] = useState(null);
  const [fileUrl, setFileUrl] = useState(null);
  const [zipFileUrl, setZipFileUrl] = useState(null)
  const [send, setSend] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    setTimeout(async () => {

      let response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/delete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
      });
      let data = await response.json();
      console.log("File deleted successfully:", data.message);
    }, 1000);
  }, [])

  const input = async (files) => {


    console.log("Upload file:", files);

    let formData = new FormData();
    console.log("Appending file:", files);
    for (let i = 0; i < files.length; i++) {
      formData.append('file', files[i]);
    }

    const API_BASE = import.meta.env.VITE_API_URL;

    let response = fetch(`${API_BASE}/upload`, {
      method: "POST",
      body: formData
    })
      .then(res => res.json())
      .then(data => console.log(data))
      .catch(err => console.error(err));

    // let response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/upload`, {
    //   method: 'POST',
    //   body: formData
    // });
    let data = await response.json();
    await setFileUrl(data.fileUrls);
    console.log("File uploaded successfully:", data.fileUrls);

  }

  return (
    <div className={`min-h-screen font-sans inset-0 ${light ? ' bg-[radial-gradient(circle_at_center,#6db5fd,#0066ff)]' : '  bg-[radial-gradient(circle_at_center,#3740f0,#000447)]'}
    `}>
      <Navbar setZipFileUrl={setZipFileUrl} send={send} setSend={setSend} light={light} setLight={setLight} file={file} setFile={setFile} fileUrl={fileUrl} setFileUrl={setFileUrl} />
      <div onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          const files = e.dataTransfer.files;
          if (!files) return;
          setFile([...files]);
          input(files);
        }}
        className={!fileUrl ? "mx-[15%]" : "mx-[12%]"}>
        {!fileUrl ?
          <div className="heading">

            <h1 className={`text-4xl font-bold text-center pt-24 ${light ? 'text-blue-950' : 'text-white'}`}>Welcome to QShareX</h1>
            <p className={`text-center  font-semibold pt-4 ${light ? 'text-blue-900' : 'text-gray-300'}`}>Share your files with ease and security.</p>
          </div>
          :
          <div className="pt-24 text-center"><h2 className={`text-2xl font-semibold ${light ? 'text-blue-950' : 'text-white'}`}>Your file is ready to share!</h2></div>}

        {!send ? <>
          {!fileUrl ?

            <label htmlFor="upload">
              <div className={` mt-16 flex flex-col justify-center items-center border-dashed border-4 mx-8 h-64 rounded-lg ${light ? 'border-blue-900 bg-blue-100/50 shadow-[inset_0_0_10px_#005a70]' : ' bg-white/5 border-white/20 backdrop-blur-lg shadow-[inset_0_0_10px_#000fe8]'}
        `}><input type="file" multiple onChange={(e) => { const files = e.target.files; setFile([...files]); input(files); }} name="file" className='hidden' id="upload" />
                <img className='w-[10rem]' src={light ? "./up1.png" : "./up.png"} alt="" />
                <p className={`text-center font-semibold ${light ? 'text-blue-900' : 'text-gray-300'}`}>Drag and drop your files here to start sharing!</p>
              </div></label>
            :
            <Table file={file} setFile={setFile} fileUrl={fileUrl} setFileUrl={setFileUrl} light={light} />
          }</>
          : <QrCode send={send} setSend={setSend} zipFileUrl={zipFileUrl} setFileUrl={setFileUrl} setZipFileUrl={setZipFileUrl} light={light} />
        }


      </div>
    </div>
  )
}

export default App
