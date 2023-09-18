import React from "react"
import type { HeadFC, PageProps } from "gatsby"
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
        <div className='paragraph-hero flex'>
          <div className='banner-paragraph bg-primary clr-white padding-3'>
            <h2>Animal Drug Labeling and Adverse Events!</h2>
            <div className='flex flex-column flex-fill'>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                Orci a scelerisque purus semper eget duis. Sollicitudin nibh sit amet commodo.
                Orci dapibus ultrices in iaculis nunc sed augue lacus. Aliquam sem et tortor consequat id porta.
                A cras semper auctor neque vitae. Facilisis magna etiam tempor orci eu. Id diam maecenas ultricies mi.</p>
              <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
}

export default IndexPage

export const Head: HeadFC = () => {
  return(
    <>
      <title>Home Page</title>
    </>
  )
}
