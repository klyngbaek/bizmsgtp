"use client"

import { feGraphApiPostWrapper } from '@/app/fe_utils';
import { useState } from 'react';

export default function PhoneNumbers({ phone, color }) {

    const [status, setStatus] = useState(phone.status);
    const [isLoading, setIsLoading] = useState(false);
    const [codeVerificationStatus, setCodeVerificationStatus] = useState(phone.code_verification_status);
    const [otpCode, setOtpCode] = useState('');

    let msg = null;
    let onClickHandler = () => new Promise(() => { })


    if (status === 'DISCONNECTED' && codeVerificationStatus === "NOT_VERIFIED") {
        msg = "Click to request code";
        onClickHandler = () => feGraphApiPostWrapper(`/api/request_code`, {
            waba_id: phone.wabaId,
            phone_number_id: phone.id,
        })
            .then(() => {
                setStatus('SENT');
            });
    }
    else if (status === 'SENT') {
        msg = "Hit enter to verify code";
        onClickHandler = () => feGraphApiPostWrapper(`/api/verify_code`, {
            wabaId: phone.wabaId,
            phoneId: phone.id,
            otpCode: otpCode,
        })
            .then(() => {
                setCodeVerificationStatus('VERIFIED');
            });
    }
    else if (status === 'DISCONNECTED' && codeVerificationStatus === "VERIFIED") {
        msg = "Click to register";
        onClickHandler = () => feGraphApiPostWrapper(`/api/register`, {
            wabaId: phone.wabaId,
            phoneId: phone.id,
        }).then(() => {
            setStatus('CONNECTED');
        });
    }
    else if (status === 'CONNECTED') {
        msg = "Click to disconnect";
        onClickHandler = () => feGraphApiPostWrapper(`/api/deregister`, {
            wabaId: phone.wabaId,
            phoneId: phone.id,
        }).then(() => {
            setStatus('DISCONNECTED');
        });
    }

    const onClickHandlerWrapper = () => {
        setIsLoading(true);
        onClickHandler().then(() => {
            setIsLoading(false);
        });
    }

    const onChangeWrapper = (e) => {
        setOtpCode(e.target.value);
    };

    const onKeyDownHandler = (e) => {
        console.log('onKeyDownHandler', e.key);
        if (e.key === 'Enter') {
            onClickHandlerWrapper();
        }
    };


    const otpInput = (
        <input type="text" className='w-16 pl-1' value={otpCode} onChange={onChangeWrapper} />
    )

    let content = <>...</>;
    if (!isLoading) {
        content = (<>
            {status} {codeVerificationStatus} {status === 'SENT' && otpInput}

        </>);
    }

    const statusColor = status === 'CONNECTED' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';

    return (
        <div
            className={`w-24 text-center rounded-md px-2 py-1 mr-1 text-xs 
                cursor-pointer transition-all duration-200 ease-in-out
                hover:shadow-md hover:scale-105 active:scale-95
                border border-gray-200 hover:border-gray-300
                flex items-center justify-center
                ${isLoading ? 'opacity-70' : 'opacity-100'}
                ${statusColor}
                h-8`}
            onClick={onClickHandlerWrapper}
            onKeyDown={onKeyDownHandler}
            role="button"
            tabIndex={0}
        >
            {content}
        </div>
    );

};
