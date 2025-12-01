import React from "react"
import type { HeadFC, PageProps } from "gatsby"
import '@trussworks/react-uswds/lib/uswds.css'
import '@trussworks/react-uswds/lib/index.css'
import '../css/index.scss'
import '../css/components/Layout.scss'
import '../css/pages/HomePage.scss'
import Layout from "../components/Layout";
import BasicSearch from "../components/BasicSearch";

const IndexPage: React.FC<PageProps> = () => {

  return (
    <Layout>
      <section className='main-content'>
        <div className='flex flex-column bg-white padding-3' style={{maxWidth:'1600px'}}>
          <h2 className='margin-bottom-0'>FDA Journals</h2>
          <BasicSearch
            searchHeader='Title'
            errorText='At least three characters are required.'
            placeholder="Type in all or part of the Title, or type *** to search all"
            searchField='title.exact'
            searchLength={3}
            tableType='standard'
          />
        </div>
      </section>
    </Layout>
  )
}

export default IndexPage

export const Head: HeadFC = () => {
  return (
    <>
      <title>FDA Journals</title>
    </>
  )
}
