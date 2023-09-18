import React, { useState, useEffect, useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { API_LINK } from "../constants/api";

import '../css/index.scss'


const key_field_map = {
  'drug.openfda.brand_name.exact': 'Brand Name',
  'reaction.veddra_term_name.exact': 'Veddra Term Name'
}

const row_map = {
  'animal_drug_labeling': {
    'Species': 'animal.species',
    'Primary Reporter': 'primary_reporter',
    'Onset Date': 'onset_date',
    'Report ID': 'report_id'
  },
  'animal_adverse_event' : {
    'brand_name': 'brand_name',
    'generic_name': 'generic_name',
    'manufacturer_name': 'manufacturer_name',
    'product_type': 'product_type'
  }
}

const column_map = {
  'animal_drug_labeling': [
    { field: 'Species' },
    { field: 'Primary Reporter' },
    { field: 'Onset Date' },
    { field: 'Report ID' }
  ],
  'animal_adverse_event': [
    { field: 'brand_name' },
    { field: 'generic_name' },
    { field: 'manufacturer_name' },
    { field: 'product_type' }
  ]
}

function fetchByDotOperator(object, value) {
  if (!value)
    return object;

  var prop, props = value.split('.');

  for (var i = 0, iLen = props.length - 1; i < iLen; i++) {
    prop = props[i];

    var candidate = object[prop];
    if (candidate !== undefined) {
      object = candidate;
    } else {
      break;
    }
  }
  return object[props[i]];
}

export default function FieldDisplay({endpoint, drugField, drugName, symptomField, symptomName}) {
  const [alphaData, setData] = useState<any | null>([]);
  const columnDefs = useMemo(() => column_map[endpoint], []);
  const defaultColDef = useMemo(() => ({resizable: true, sortable: true}), []);

  useEffect(() => {
    fetch(API_LINK + '/animalandveterinary/event.json?search='  + drugField + ':"' + drugName + '"+AND+' +
                symptomField + ':"' + symptomName + '"&limit=1000')
      .then(response => response.json())
      .then(json => {
        let data = []
        for (let result of json['results']) {
          let rowData = {}
          for (const [key, value] of Object.entries(row_map[endpoint])) {
            if (endpoint === 'animal_adverse_event'){
              for (let drug of result['drug']) {
                if ('openfda' in drug && drug['openfda']['brand_name'][0] === symptomName) {
                  rowData[key] = drug['openfda'][value][0]
                }
              }
            } else {
              rowData[key] = fetchByDotOperator(result, value)
            }
          }
          data.push(rowData)
        }
        return setData(data)
      })
      .catch(error => console.error(error));
  }, []);

  function onFirstDataRendered(params) {
    params.api.sizeColumnsToFit()
  }

  return (
    <div>
      <h3>{key_field_map[drugField]}: {drugName} > {key_field_map[symptomField]}: {symptomName}</h3>
        <div>
          {alphaData ? (
            <div className="ag-theme-alpine" style={{height: 400, width: '100%'}}>
              <AgGridReact
                rowData={alphaData}
                columnDefs={columnDefs}
                defaultColDef={defaultColDef}
                onFirstDataRendered={onFirstDataRendered}
              />
            </div>
          ): (
            'Loading'
          )}
        </div>
    </div>
  )
}