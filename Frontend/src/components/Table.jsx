import React, { useState,useEffect } from 'react'

const Table = (props) => {

    const [file, setFile] = useState(props.file);
    console.log("Table component received file prop:", file);

    useEffect(() => {
        console.log("Table component file prop changed:", props.file);
        setFile(props.file);
        if(props.file.length === 0){
            props.setFileUrl(null);
        }
    }, [props.file]);

    const input = async (files) => {


        console.log("new files Uploading:", files);

        let formData = new FormData();
    formData.append('sessionId', props.sessionId);
        console.log("Appending file:", files);
        for (let i = 0; i < files.length; i++) {
            formData.append('file', files[i]);
        }

        let response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/upload`, {
            method: 'POST',
            body: formData
        });
        let data = await response.json();
        let updatedFileUrls = [...props.fileUrl, ...data.fileUrls];
        await props.setFileUrl(updatedFileUrls);
        console.log("File uploaded successfully:", data.fileUrls);

    }

    const del = async (url) => {

        let newFiles = file.filter((fil, i) => props.fileUrl[i] !== url);
        props.setFile([...newFiles]);
        let newFileUrls = props.fileUrl.filter((fileUrl) => fileUrl !== url);
        props.setFileUrl(newFileUrls);
        setFile(newFiles);
        let formData = new FormData();
    formData.append('sessionId', props.sessionId);
    formData.append('fileUrl', url);

        let response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/delete-uploads`, {
            method: 'POST', 
            body: formData
        });
        let data = await response.json();
        console.log("File deleted successfully:", data.message);    
        
        
    }


    return (<div className=''>
        <div className=' min-w-0  justify-center text-blue-200 flex flex-wrap gap-4 p-5 bg-blue-300/20 rounded-lg shadow-[inset_0_0_10px_#005a70] mt-16'>

            {file.map((fil, i) => (
                <div key={i} className="p-3 relative border rounded-lg shadow-lg flex flex-col items-center gap-2 w-56 bg-blue-400/30">
                    {fil.type.startsWith('image/') ? <img className='border-2 w-52 h-40 border-blue-800 rounded-xl ' src={props.fileUrl[i]} alt="" />:<img className='border-2 w-52 h-40 border-blue-800 rounded-xl ' src="/zip.png" alt="" />}
                    

                    <div className="flex justify-between w-full gap-4 mt-2">
                        <span className='max-w-[7.5rem] break-words text-sm'>{fil.name}</span>
                        <div className='flex absolute right-0 gap-2 justify-end text-sm'>
                            <span>{(fil.size / 1024) > 1024 ? (fil.size / (1024 * 1024)).toFixed(2) : (fil.size / 1024).toFixed(2)}{(fil.size / 1024) > 1024 ? "MB" : "KB"}</span>
                            <span onClick={() => {del(props.fileUrl[i]);
                             }}>
                                <img className='w-6 h-6 hover:scale-110 rounded-full active:scale-90 transition-all duration-150  cursor-pointer shadow-md bg-gray-600/10 shadow-blue-800/50' src="/bin.gif" alt="" />
                            </span>
                            <div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}

        </div>
        <label htmlFor="upload">
            <div  className={`hover:scale-105 mx-[40%] w-fit mt-10 mb-20 rounded-lg ${props.light ? "text-white from-teal-500 via-teal-600 to-teal-700 focus:ring-teal-800  shadow-teal-800/80 font-medium" : "font-bold text-blue-800 from-teal-400 via-teal-500 to-teal-600 focus:ring-teal-300 shadow-teal-500/50"}  bg-gradient-to-r  hover:bg-gradient-to-br focus:ring-4 focus:outline-none shadow-lg  rounded-base text-sm px-4 py-2.5 text-center leading-5`}><p>Add  More Files</p>
            <input type="file" multiple onChange={(e) => {
                const files = e.target.files;
                let newFiles = [...file];
                for (let i = 0; i < files.length; i++) {
                    newFiles.push(files[i]);
                }
                props.setFile([...newFiles]);
                input(files);
            }} name="file" className='hidden' id="upload" />
            </div></label>
    </div>)
}

export default Table
