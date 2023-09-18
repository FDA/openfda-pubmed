import React, { useState, useEffect } from 'react';
import Layout from "./Layout";
import CountDisplay from "./CountDisplay";
import DrugDisplay from "./DrugDisplay";
import { API_LINK } from "../constants/api";

import '../css/index.scss'
import '../css/components/AlphaLinks.scss'

export default function AlphaLinks({endpoint, keyField}) {
  const [alphaData, setData] = useState<any | null>(null);
  const [alphaDisplay, setDisplay] = useState<any | null>('ALL');
  const [field, setField] = useState<any | null>('none');

  useEffect(() => {
    fetch(API_LINK + '/animalandveterinary/event.json?search=_exists_:drug.openfda&count=' +
                keyField)
      .then(response => response.json())
      .then(json => {
        let resultList = {
          'A': [], 'B': [], 'C': [], 'D': [], 'E': [], 'F': [], 'G': [], 'H': [], 'I': [], 'J': [], 'K': [], 'L': [],
          'M': [], 'N': [], 'O': [], 'P': [], 'Q': [], 'R': [], 'S': [], 'T': [], 'U': [], 'V': [], 'W': [], 'X': [],
          'Y': [], 'Z': []
        }
        for (let result of json['results']) {
          resultList[result['term'].charAt(0).toUpperCase()].push(result['term'])
        }
        return setData(resultList)
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
              <li key={item}>
              <button className='list-buttons' onClick={()=>setField(item)}>{item}</button>
              </li>
            ))
          }
        </ul>
      </div>
    )
  }

  return (
    <Layout>
      <div className='alphaMain'>
        {field == 'none' ? (
          <div>
            <div className='display-flex flex-row'>
              <div>
                <button
                  className={'alpha-letters alpha-letters-active ' + (alphaDisplay === 'ALL' ? 'alpha-letters-clicked' : '')}
                  onClick={()=>{setDisplay('ALL');setField('none')}}>ALL</button>
              </div>
              {alphaData ? (
                Object.keys(alphaData).map((alpha) => (
                  <div key={alpha}>
                    <button
                      className={
                      'alpha-letters ' + (alphaData[alpha].length > 0 ? 'alpha-letters-active' : 'alpha-letters-inactive')
                        + (alphaDisplay == alpha ? ' alpha-letters-clicked' : '')
                    }
                      onClick={()=>{setDisplay(alpha);setField('none')}}
                    >
                      {alpha}</button>
                  </div>
                ))
              ) : (
                'Loading...'
              )}
            </div>
            <div className='alphaColumns'>
              {
                alphaData ? (
                  alphaDisplay === 'ALL' ? (
                    Object.keys(alphaData).map((alpha) => (
                      alphaItemsDisplay(alpha)
                    ))
                  ) : (alphaItemsDisplay(alphaDisplay))
                ) : ('Loading...')
              }
            </div>
          </div>
        ) : (
          endpoint === 'animal_adverse_event' ? (
          <DrugDisplay endpoint={endpoint} keyField={keyField} field={field}/>
          ) : (
            <CountDisplay endpoint={endpoint} keyField={keyField} field={field}/>
          ))}
      </div>
    </Layout>
  )
}