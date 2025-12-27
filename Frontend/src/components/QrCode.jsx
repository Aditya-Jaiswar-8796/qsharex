import React, { useEffect, useRef } from 'react'
import QRCodeStyling from 'qr-code-styling';

const QrCode = (props) => {
    const qrRef = useRef(null);

    const del = async () => {
        let response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/delete`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({})
        });
        let data = await response.json();
        console.log("File deleted successfully:", data.message);
        setTimeout(() => {
            props.setFileUrl(null);

            props.setSend(false);
        }, 3000);
    }

    const qrCode = new QRCodeStyling({
        width: 300,
        height: 300,
        type: "png",
        image: "./logo.png",
        dotsOptions: {
            type: "extra-rounded",
            color: "#6a1a4c",
            roundSize: true,
            gradient: {
                type: "linear",
                rotation: 0,
                colorStops: [
                    {
                        offset: 0,
                        color: "#2b00ff"
                    },
                    {
                        offset: 1,
                        color: "#05ff9f"
                    }
                ]
            }
        },
        cornersSquareOptions: {
            type: "extra-rounded",
            color: "#000000",
            gradient: {
                type: "radial",
                rotation: 0,
                colorStops: [
                    {
                        offset: 0,
                        color: "#00ffff"
                    },
                    {
                        offset: 1,
                        color: "#0000ff"
                    }
                ]
            }
        },
        cornersSquareOptionsHelper: {
            colorType: {
                single: true,
                gradient: false
            },
            gradient: {
                linear: true,
                radial: false,
                color1: "#000000",
                color2: "#000000",
                rotation: "0"
            }
        },
        cornersDotOptions: {
            type: "",
            color: "#000000"
        },
        cornersDotOptionsHelper: {
            colorType: {
                single: true,
                gradient: false
            },
            gradient: {
                linear: true,
                radial: false,
                color1: "#000000",
                color2: "#000000",
                rotation: "0"
            }
        },
        backgroundOptionsHelper: {
            colorType: {
                single: true,
                gradient: false
            },
            gradient: {
                linear: true,
                radial: false,
                color1: "#ffffff",
                color2: "#ffffff",
                rotation: "0"
            }
        }
    });

    useEffect(() => {
        console.log("QR Code generation effect triggered", props.zipFileUrl);
        if (props.zipFileUrl) {
            qrCode.update({ data: props.zipFileUrl });
            qrRef.current.innerHTML = "";
            qrCode.append(qrRef.current);
        }
    }, [props.zipFileUrl]);

    return (
        <div className="container mx-auto flex flex-col justify-center items-center mt-6 gap-4">
            <div className="bg-white p-3 rounded-lg w-min flex flex-col justify-center items-center">
                <div ref={qrRef}>
                    <button
                        type="button"
                        className="text-black pointer-events-none inline-block rounded bg-primary px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal shadow-primary-3 transition duration-150 ease-in-out hover:bg-primary-accent-300 hover:shadow-primary-2 focus:bg-primary-accent-300 focus:shadow-primary-2 focus:outline-none focus:ring-0 active:bg-primary-600 active:shadow-primary-2 disabled:opacity-70 dark:shadow-black/30 dark:hover:shadow-dark-strong dark:focus:shadow-dark-strong dark:active:shadow-dark-strong"
                        disabled>
                        <div
                            className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-e-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                            role="status"></div>
                        <span>Loading...</span>
                    </button>
                </div>
            </div>
            <button onClick={() => { del() }} className={`del px-4 py-2 rounded-lg font-semibold ${props.light ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-cyan-500 text-white hover:bg-cyan-600'}`}>Delete File</button>
        </div>
    )
}

export default QrCode
