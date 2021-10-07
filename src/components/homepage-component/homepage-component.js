import React, { Component, useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown';
import axios from 'axios';
import markdownFile from "./homepage-component.md";

import './homepage-component.css'

export default function HomePageComponent() {
    const [markDown, setMarkDown] = useState('#Loading')


    useEffect(async () => {
        const new_file = await axios.get(markdownFile)
        console.log()
        setMarkDown(new_file.data)
    }, [])

    return (
        <div className="sub-page-container">
            <ReactMarkdown children={markDown} />
        </div>
    )

}
