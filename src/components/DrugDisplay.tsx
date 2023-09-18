import React, { useCallback, useState, useMemo, useEffect } from 'react';
import CustomLoadingOverlay from "./CustomLoadingOverlay";
import { AgGridReact } from "ag-grid-react";
import { API_LINK } from "../constants/api";

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import '../css/index.scss'

const key_field_map = {
  'drug.openfda.brand_name.exact': 'Brand Name',
  'reaction.veddra_term_name.exact': 'Veddra Term Name'
}

const count_map = {
  'animal_drug_labeling': 'reaction.veddra_term_name.exact',
  'animal_adverse_event': 'drug.openfda.brand_name.exact'
}

const column_map = {
  'animal_drug_labeling': [
    { field: 'brand_name' },
    { field: 'generic_name' },
    { field: 'manufacturer_name' },
    { field: 'product_type' }
  ],
  'animal_adverse_event': [
    { field: 'brand_name' },
    { field: 'generic_name' },
    { field: 'manufacturer_name' },
    { field: 'product_type' }
  ]
}

export default function DrugDisplay({endpoint, keyField, field}) {
  const [alphaData, setData] = useState<any | null>([]);
  const columnDefs = useMemo(() => column_map[endpoint], []);
  const defaultColDef = useMemo(() => ({resizable: true, sortable: true}), []);

  useEffect(() => {
    const fetchData = async () => {
      const drugs = await fetch(API_LINK + '/animalandveterinary/event.json?search=' + keyField + ':"' + field +
                                      '"&count=' + count_map[endpoint] + '&limit=1000')
                    .then(response => response.json()).then(json => (json['results']));
      let data = []
      for (let drug of drugs) {
        const results = await fetch(API_LINK + '/animalandveterinary/event.json?search=drug.openfda.brand_name.' +
                                          'exact:"' + drug['term'] + '"&limit=1000')
                        .then(response => response.json()).then(json => (json['results']));
        for (let item of results[0]['drug']) {
          if ('openfda' in item && item['openfda']['brand_name'][0] === drug['term']) {
            data.push({
              'brand_name': item['openfda']['brand_name'][0],
              'generic_name': item['openfda']['generic_name'][0],
              'manufacturer_name': item['openfda']['manufacturer_name'][0],
              'product_type': item['openfda']['brand_name'][0]
            })
            break
          }
        }
      }
      setData(data)
    }

    // call the function
    fetchData()
      // make sure to catch any error
      .catch(console.error);
  }, []);

  const onFirstDataRendered = useCallback((params) => {
    params.api.sizeColumnsToFit();
  }, []);

  const loadingOverlayComponent = useMemo(() => {
    return CustomLoadingOverlay;
  }, []);

  const loadingOverlayComponentParams = useMemo(() => {
    return {
      loadingMessage: 'One moment please...',
    };
  }, []);

  return (
    <div>
      <h3>{key_field_map[keyField]}: {field}</h3>
      <div>
        {alphaData ? (
          <div className="ag-theme-alpine" style={{height: 400, width: '100%'}}>
            <AgGridReact
              rowData={alphaData}
              columnDefs={columnDefs}
              defaultColDef={defaultColDef}
              onFirstDataRendered={onFirstDataRendered}
              noRowsOverlayComponent={loadingOverlayComponent}
              noRowsOverlayComponentParams={loadingOverlayComponentParams}
            />
          </div>
        ): (
          'Loading'
        )}
      </div>
    </div>
  )
}