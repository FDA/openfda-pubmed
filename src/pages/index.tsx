import React, {useState, useEffect} from "react"
import type {HeadFC, PageProps} from "gatsby"
import '@trussworks/react-uswds/lib/uswds.css'
import '@trussworks/react-uswds/lib/index.css'
import '../css/index.scss'
import '../css/components/Layout.scss'
import '../css/pages/HomePage.scss'
import Layout from "../components/Layout";
import {Search, Table} from '@trussworks/react-uswds'
import axios from 'axios';
import {API_LINK} from "../constants/api";

const IndexPage: React.FC<PageProps> = () => {

    const [drugs, setDrugs] = useState([]);

    const fetchDrugs = async (name) => {
        try {
            const response = await axios.get(`${API_LINK}/drug/pmi.json?search=product_name:${name}`);
            setDrugs(response.data.results);
        } catch (e) {
            setDrugs([]);
        }
    };

    const searchHandler = async event => {
        await fetchDrugs(event.target[0].value);
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
                </div>
                <div className='bg-white padding-left-2 padding-right-3 padding-bottom-3'>
                    <div className='grid-row flex-row'>
                        <div className='grid-col flex-auto padding-left-1'>
                            {drugs.length > 0 ? (
                                <Table bordered={true}>
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
                                                <td>{drug.product_name}</td>
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
