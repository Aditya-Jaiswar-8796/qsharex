import React from 'react'

const Navbar = (props) => {

  const upload = async () => {
    if (!props.file) {
      alert("Please select a file first");
      return;
    }

    console.log("zip clicked")

    let response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/zip`);
    let data = await response.json();
    await props.setZipFileUrl(data.zipFileUrl);
    setTimeout(() => {
      props.setSend(true);
    }, 1000);
    console.log("File zipped successfully:", data.zipFileUrl);
  }

  return (
    <div className={`${props.light ? "text-blue-950 bg-[#6db5fd]" : "text-white bg-[#080a2e]"} shadow-lg shadow-blue-800 absolute w-full h-16 flex items-center px-8 justify-between`}>
      <div className="font-lobo text-center flex gap-2">{props.light ? <img width={44} height={44} src="/file2.gif" alt="logo" /> : <img width={44} height={44} src="/file.gif" alt="logo" />} <span className='font-bold text-xl mt-2
      '>QShareX</span></div>
      <div className="icons flex max-[406px]:flex-col max-[406px]:pt-10  max-[406px]:gap-1  max-[406px]:items-end">
        <button onClick={upload} type="button" className={props.light ? `hover:scale-105 transition-all duration-150 text-white font-semibold bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80  rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 ` : "hover:scale-105 transition-all duration-150 text-blue-900 font-semibold  bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 shadow-lg shadow-cyan-500/50 dark:shadow-lg dark:shadow-cyan-800/80  rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"}>
          Start Sharing
        </button>

        <div className={` mt-2 ${props.light ? 'bg-[#080a2e] shadow-[inset_-3px_-2px_5px_1px_#005a70]' : "bg-[#6db5fd] shadow-[inset_3px_2px_5px_1px_#000fe8]"} h-6 w-12 rounded-full  mx-4`}>
          <div onClick={() => props.setLight(!props.light)} className={`mt-0.5 mx-[0.2rem] shadow-[0px_1px_1px_1px_#003e9c] transition-transform duration-300 ease-in-out ${props.light ? "translate-x-0" : "translate-x-[1.4rem]"}  rounded-full h-[1.25rem] w-[1.25rem] bg-white`}>
            {props.light ? <img className="p-[2px] -rotate-45" src="/night.png" alt="sun" /> : <img className="p-[2px] rotate-45" src="/day.png" alt="moon" />}
          </div>
        </div>

      </div>
    </div>
  )
}

export default Navbar
