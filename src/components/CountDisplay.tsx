import React, { useState, useEffect } from 'react';
import FieldDisplay from "./FieldDisplay";
import { API_LINK } from "../constants/api";

import '../css/index.scss'
import '../css/components/CountDisplay.scss'


const key_field_map = {
  'drug.openfda.brand_name.exact': 'Brand Name',
  'reaction.veddra_term_name.exact': 'Veddra Term Name'
}

const count_map = {
  'animal_drug_labeling': 'reaction.veddra_term_name.exact',
  'animal_adverse_event': 'drug.openfda.brand_name.exact'
}

export default function CountDisplay({endpoint, keyField, field}) {
  const [alphaData, setData] = useState<any | null>([]);
  const [alphaDisplay, setDisplay] = useState<any | null>('ALL');
  const [detailField, setDetailField] = useState<any | null>('none');

  useEffect(() => {
    fetch(API_LINK + '/animalandveterinary/event.json?search=' + keyField + ':"' + field + '"&count=' +
                count_map[endpoint] + '&limit=1000')
      .then(response => response.json())
      .then(json => {
        let drugList = {
          'A': [], 'B': [], 'C': [], 'D': [], 'E': [], 'F': [], 'G': [], 'H': [], 'I': [], 'J': [], 'K': [], 'L': [],
          'M': [], 'N': [], 'O': [], 'P': [], 'Q': [], 'R': [], 'S': [], 'T': [], 'U': [], 'V': [], 'W': [], 'X': [],
          'Y': [], 'Z': []
        }
        for (let result of json['results']) {
          drugList[result['term'].charAt(0).toUpperCase()].push({'term': result['term'], 'count': result['count']})
        }
        return setData(drugList)
      })
      .catch(error => console.error(error));
  }, []);

  const alphaItemsDisplay = (alpha) => {
    return (
      <div key={alpha}>
        <h2 className='clr-primary'>{alpha}</h2>
        <ul className='alphaList'>
          {
            alphaData[alpha].map((item) => (
              <li key={item['term']}>
                <button className='list-buttons' onClick={()=>setDetailField(item['term'])}>{item['term']}: {item['count']}</button>
              </li>
            ))
          }
        </ul>
      </div>
    )
  }

  return (
    <section>
      {detailField == 'none' ? (
        <div>
          <div className='display-flex flex-row'>
            <div>
              <button
                className={'alpha-letters alpha-letters-active ' + (alphaDisplay === 'ALL' ? 'alpha-letters-clicked' : '')}
                onClick={()=>{setDisplay('ALL');setDetailField('none')}}>ALL</button>
            </div>
            {alphaData ? (
              Object.keys(alphaData).map((alpha) => (
                <div key={alpha}>
                  <button
                    className={
                      'alpha-letters ' + (alphaData[alpha].length > 0 ? 'alpha-letters-active' : 'alpha-letters-inactive')
                      + (alphaDisplay == alpha ? ' alpha-letters-clicked' : '')
                    }
                    onClick={()=>{setDisplay(alpha);setDetailField('none')}}
                  >
                    {alpha}</button>
                </div>
              ))
            ) : (
              'Loading...'
            )}
          </div>
          <h3>{key_field_map[keyField]}: {field}</h3>
          <div>
            <div className='alphaColumns'>
            {
              alphaData ? (
                alphaDisplay === 'ALL' ? (
                  Object.keys(alphaData).map((alpha) => (
                    alphaItemsDisplay(alpha)
                  ))
                ) : (alphaItemsDisplay(alphaDisplay))
              ) : 'Loading'
            }
            </div>
          </div>
        </div>
      ) : (
        <FieldDisplay endpoint={endpoint} drugField={keyField} drugName={field} symptomField={count_map[endpoint]}
                      symptomName={detailField}/>
      )}
    </section>
  )
}