import React from "react"
import type {HeadFC, PageProps} from "gatsby"
import '@trussworks/react-uswds/lib/uswds.css'
import '@trussworks/react-uswds/lib/index.css'
import '../css/index.scss'
import '../css/components/Layout.scss'
import '../css/pages/HomePage.scss'
import Layout from "../components/Layout";

const IndexPage: React.FC<PageProps> = () => {
    return (
        <Layout>
            <section className='main-content'>
                <div className='flex'>
                    <div className='bg-white padding-3'>
                        <h2>FDA Patient Medication Information Repository</h2>
                        <div className='flex flex-column flex-fill'>
                            <p>Patient Medication Information provide patients with clear, concise, accessible, and
                                useful written information for prescriptio ndrugs and certain biological products and
                                would be delivered in a consistent and easy-to-understand format to help patients use
                                their prescription drug and certain biological products safely and effectively.</p>
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
            <title>Home Page</title>
        </>
    )
}
