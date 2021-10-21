// https://zxing.org/w/decode.jspx
// Decode qr code 
// https://codebeautify.org/zlib-decompress-online
// Decode compressed text from qr code

import React from 'react'
import { Card } from 'react-bootstrap'
import { MdBatteryCharging20 } from 'react-icons/md'
import QRCode from 'react-qr-code'
import { createGzip, Gzip, Deflate, deflateSync } from 'zlib'
import './collect-data-component.css'

// 
// LM9WEZ!zKy7TB1J2iMd1Q7xxWV11b6sv7fkKQFfZV0VV8odsjHYNzOWxXRtvWYqg
const odk_settings = {
    "general": {
        "server_url": "https://central.rhomis.cgiar.org/v1/key/4uUx4Z2MFhnA2me1qtzP4R2OvppJVNfMZdX8Ai9fQQr4utVRuy!YAvI1C6r9$NjO/projects/109",
        "form_update_mode": "match_exactly",
        "autosend": "wifi_and_cellular"
    },
    "project": { "name": "friday_test" },
    "admin": {}
}



// Encode Json Settings
const encoded_settings = deflateSync(JSON.stringify(odk_settings)).toString('base64');

export default function CollectDataComponent() {
    console.log(encoded_settings)
    // console.log(encoded_settings.compress())


    return (
        <div className="sub-page-container">
            <Card className="main-card border-0">
                <Card.Header className="bg-dark text-white">
                    <h3 >Collect Data</h3>

                </Card.Header>
                <Card.Body>
                    <div className="qr-code-container">
                        <QRCode value={encoded_settings} />
                    </div>
                </Card.Body>
            </Card>
        </div>
    )
}
