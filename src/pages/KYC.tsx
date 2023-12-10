import {
    LogInWithAnonAadhaar,
    useAnonAadhaar,
    AnonAadhaarProof,
} from "anon-aadhaar-react";
import { useEffect, useState } from "react";
import { AnonAadhaarProvider } from "anon-aadhaar-react";
import "./Crypto.css"

export default function KYC() {
    const [anonAadhaar] = useAnonAadhaar();
    const [status, setStatus] = useState<null>(null)
    useEffect(() => {
        const handleStorageChange = () => {
            const updatedAvailableStatus = localStorage.getItem("anonAadhaar");
            if (updatedAvailableStatus) {
                const parsedValue = JSON.parse(updatedAvailableStatus);
                setStatus(parsedValue.status);
            }
        };
        handleStorageChange();

        const intervalId = setInterval(() => {
            handleStorageChange();
        }, 1000);
        return () => {
            clearInterval(intervalId);
        };
    }, []);

    const app_id = BigInt("123").toString()

    return (
        <>
            <div className="main-card kyc_card">
                <p className="para">Annon Adhar (KYC)
                </p>
                <AnonAadhaarProvider _appId={app_id}>
                    <div style={{ marginLeft: '-60px' }}>
                        <LogInWithAnonAadhaar />
                    </div><div>
                        {status === "logged-in" && (<>
                            <p style={{marginLeft: -'50px',color:'white'}}>✅ Congratulations Proof is validated successfully</p>
                        </>)}
                        {anonAadhaar?.status === "logged-in" && (
                            <>
                                <p style={{marginLeft: -'60px'}}>✅ Congratulations Proof is validated successfully..!</p>
                                <AnonAadhaarProof code={JSON.stringify(anonAadhaar.pcd, null, 2)} />
                            </>
                        )}
                    </div>
                </AnonAadhaarProvider>
            </div>
        </>
    );
}