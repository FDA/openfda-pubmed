import React, {useState} from "react"
import type {HeadFC, PageProps} from "gatsby"
import {Link} from "gatsby"
import '@trussworks/react-uswds/lib/uswds.css'
import '@trussworks/react-uswds/lib/index.css'
import '../css/index.scss'
import '../css/components/Layout.scss'
import '../css/pages/HomePage.scss'
import Layout from "../components/Layout";
import {Search, Table, Alert} from '@trussworks/react-uswds'
import axios from 'axios';
import {API_LINK} from "../constants/api";

const IndexPage: React.FC<PageProps> = () => {

    const [drugs, setDrugs] = useState([]);
    const [msg, setMsg] = useState('');

    const fetchDrugs = async (name) => {
        try {
            setMsg('');
            if (name.length < 3) {
                setDrugs([]);
                setMsg('At least three characters are required.');
            } else {
                const response = await axios.get(`${API_LINK}/drug/pmi.json?search=product_name:*${name}*`);
                setDrugs(response.data.results);
            }
        } catch (e) {
            setDrugs([]);
            setMsg('No results found.');
        }
    };

    const searchHandler = async event => {
        await fetchDrugs(event.target[0].value.trim());
    };

    return (
        <Layout>
            <section className='main-content'>
                <div className='flex'>
                    <div className='bg-white padding-3'>
                        <h2>FDA Patient Medication Information Repository</h2>
                        <div className='flex flex-column flex-fill'>
                            <p>Patient Medication Information provide patients with clear, concise, accessible, and
                                useful written information for prescription drugs and certain biological products and
                                would be delivered in a consistent and easy-to-understand format to help patients use
                                their prescription drug and certain biological products safely and effectively.</p>
                        </div>
                    </div>
                </div>
                <div className='bg-white padding-left-2 padding-right-3 padding-bottom-3'>
                    <div className='grid-row flex-row'>
                        <div className='grid-col flex-auto padding-1'>
                            <b>Search By Product Name:</b>
                        </div>
                        <div className='grid-col'>
                            <Search className='minw-205' onSubmit={async e => {
                                e.preventDefault();
                                await searchHandler(e);
                            }} placeholder="Enter at least 3 characters"></Search>
                        </div>
                    </div>
                    {msg.length > 0 ? (<div className='grid-row padding-1'>
                        <div className='grid-col flex-auto'>
                            <Alert type={"info"} headingLevel={'h1'}>{msg}</Alert>
                        </div>
                    </div>) : ('')}
                    <div className='grid-row flex-column'>
                        <div className='grid-col padding-left-1'>
                            {drugs.length > 0 ? (
                                <Table fullWidth={true} bordered={true}>
                                    <thead>
                                    <tr>
                                        <th scope="col">Product Name</th>
                                        <th scope="col">Company Name</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {
                                        drugs.map((drug) => (
                                            <tr>
                                                <td>{drug.product_name} (<Link to={'#'}>PDF</Link>) (<Link
                                                    to={'#'}>XML</Link>)
                                                </td>
                                                <td>{drug.manufacturer_name}</td>
                                            </tr>
                                        ))
                                    }
                                    </tbody>
                                </Table>

                            ) : (
                                ''
                            )}
                        </div>
                    </div>
                </div>

            </section>
        </Layout>
    )
}

export default IndexPage

export const Head: HeadFC = () => {
    return (
        <>
            <title>FDA Patient Medication Information Repository</title>
        </>
    )
}
