import AlphaLinks from "../../components/AlphaLinks";
import React from "react";
import {PageProps} from "gatsby";

const IndexPage: React.FC<PageProps> = () => {
  return (
    <AlphaLinks
      endpoint='animal_drug_labeling'
      keyField='drug.openfda.brand_name.exact'
      key={Math.random()}
    />
  )
}

export default IndexPage